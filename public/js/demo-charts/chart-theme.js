Chart.defaults.global.defaultFontFamily = '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
Chart.defaults.global.defaultFontColor = "#4b6378";
Chart.defaults.global.defaultFontStyle = "500";
Chart.defaults.global.elements.line.borderWidth = 3;
Chart.defaults.global.elements.line.tension = 0.35;
Chart.defaults.global.elements.point.radius = 4;
Chart.defaults.global.elements.point.hoverRadius = 6;
Chart.defaults.global.elements.rectangle.borderRadius = 8;
Chart.defaults.global.maintainAspectRatio = false;

window.chartMoneyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

window.chartPalette = [
    "#0f766e",
    "#0f5f7f",
    "#1d4ed8",
    "#f59e0b",
    "#e11d48",
    "#8b5cf6",
    "#10b981",
    "#f97316",
    "#14b8a6",
    "#6366f1",
    "#84cc16",
    "#ef4444",
];

window.chartStatusPalette = {
    pago: "#0f766e",
    recebido: "#0f766e",
    pendente: "#f59e0b",
    aberto: "#f59e0b",
    vencido: "#e11d48",
    atrasado: "#e11d48",
    cancelado: "#64748b",
};

window.chartMonthOrder = [
    "Janeiro",
    "Fevereiro",
    "Marco",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

window.chartMonthShort = {
    Janeiro: "Jan",
    Fevereiro: "Fev",
    Marco: "Mar",
    "Março": "Mar",
    Abril: "Abr",
    Maio: "Mai",
    Junho: "Jun",
    Julho: "Jul",
    Agosto: "Ago",
    Setembro: "Set",
    Outubro: "Out",
    Novembro: "Nov",
    Dezembro: "Dez",
};

window.getCurrencyLabel = function getCurrencyLabel(value) {
    return window.chartMoneyFormatter.format(Number(value) || 0);
};

window.getTooltipCurrencyLabel = function getTooltipCurrencyLabel(tooltipItem, data) {
    const label = data.labels[tooltipItem.index] || "";
    const value = Number(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]) || 0;
    return `${label}: ${window.getCurrencyLabel(value)}`;
};

window.getAxisCurrencyTick = function getAxisCurrencyTick(value) {
    if (Math.abs(value) >= 1000000) {
        return `R$ ${(value / 1000000).toFixed(1)} mi`;
    }

    if (Math.abs(value) >= 1000) {
        return `R$ ${(value / 1000).toFixed(0)} mil`;
    }

    return `R$ ${value}`;
};

window.getChartColors = function getChartColors(length) {
    return Array.from({ length }, (_, index) => window.chartPalette[index % window.chartPalette.length]);
};

window.updateChartTotal = function updateChartTotal(chart) {
    const headerTotal = chart.canvas.closest(".card").querySelector(".chart-total");

    if (!headerTotal) {
        return;
    }

    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);
    const total = dataset.data.reduce((accumulator, value, index) => {
        return meta.data[index] && meta.data[index].hidden ? accumulator : accumulator + Number(value || 0);
    }, 0);

    headerTotal.textContent = window.getCurrencyLabel(total);
};

window.normalizeMonthLabel = function normalizeMonthLabel(label) {
    const normalized = String(label || "").trim();
    return window.chartMonthShort[normalized] || normalized.slice(0, 3);
};

window.sortMonthLabels = function sortMonthLabels(labels) {
    return [...labels].sort((first, second) => {
        return window.chartMonthOrder.indexOf(first) - window.chartMonthOrder.indexOf(second);
    });
};

window.getStatusColor = function getStatusColor(status, fallbackIndex) {
    const key = String(status || "").trim().toLowerCase();
    return window.chartStatusPalette[key] || window.chartPalette[fallbackIndex % window.chartPalette.length];
};

window.buildDoughnutOptions = function buildDoughnutOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 68,
        animation: {
            animateRotate: true,
            animateScale: true,
        },
        legend: {
            display: true,
            position: "bottom",
            labels: {
                boxWidth: 12,
                padding: 16,
                fontColor: "#4b6378",
            },
        },
        tooltips: {
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            titleFontStyle: "600",
            bodyFontStyle: "500",
            displayColors: true,
            callbacks: {
                label: window.getTooltipCurrencyLabel,
            },
        },
    };
};

window.buildCartesianOptions = function buildCartesianOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true,
            position: "bottom",
            labels: {
                boxWidth: 12,
                padding: 18,
                fontColor: "#4b6378",
            },
        },
        tooltips: {
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            titleFontStyle: "600",
            bodyFontStyle: "500",
            callbacks: {
                label: function (tooltipItem, data) {
                    const dataset = data.datasets[tooltipItem.datasetIndex];
                    return `${dataset.label}: ${window.getCurrencyLabel(tooltipItem.yLabel)}`;
                },
            },
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    fontColor: "#60758a",
                },
            }],
            yAxes: [{
                gridLines: {
                    color: "rgba(148, 163, 184, 0.18)",
                    drawBorder: false,
                    zeroLineColor: "rgba(148, 163, 184, 0.24)",
                },
                ticks: {
                    beginAtZero: true,
                    padding: 10,
                    fontColor: "#60758a",
                    callback: window.getAxisCurrencyTick,
                },
            }],
        },
    };
};

window.chartTotalPluginRegistered = window.chartTotalPluginRegistered || false;

if (!window.chartTotalPluginRegistered) {
    Chart.plugins.register({
        id: "cardTotalUpdater",
        afterUpdate: function (chart) {
            if (chart.config.type === "doughnut") {
                window.updateChartTotal(chart);
            }
        },
    });

    window.chartTotalPluginRegistered = true;
}
