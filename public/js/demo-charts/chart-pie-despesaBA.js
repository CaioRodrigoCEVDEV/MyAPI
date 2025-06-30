// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily =
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#292b2c";

// Pie Chart Example
var ctxDepBA = document.getElementById("myPieChartDepBA");

fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => {
      
      return fetch(`${BASE_URL}/catDespesaBA/${dados.usucod}`)
    })
  .then((response) => response.json())
  .then((data) => {
    // Garante que os valores são números para correta formatação
    const labels = data.map((item) => item.catdes);
    const valores = data.map((item) => Number(item.docv));

    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    // Plugin para exibir o totalizador no centro do doughnut
    const totalPlugin = {
      id: "totalizadorDepBA",
      beforeDraw: (chart) => {
        if (chart.config.type !== "doughnut" || chart.canvas.id !== "myPieChartDepBA") return;
        const width = chart.chart.width;
        const height = chart.chart.height;
        const ctx = chart.chart.ctx;

        // Calcula o total apenas das categorias visíveis
        const data = chart.data.datasets[0].data;
        const meta = chart.getDatasetMeta(0);
        const total = data.reduce((acc, val, idx) => {
          return meta.data[idx].hidden ? acc : acc + Number(val);
        }, 0);

        ctx.save();
        ctx.font = "bold 1rem sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000";
        ctx.fillText(formatter.format(total), width / 2, height / 2);
        ctx.restore();
      },
    };

    const myPieChart = new Chart(ctxDepBA, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: valores,
            backgroundColor: [
              "#4FC0D0",
              "#FF6F91",
              "#FFC75F",
              "#00C9A7",
              "#845EC2",
              "#F9F871",
              "#D65DB1",
              "#FFC857",
              "#2C73D2",
              "#0081CF",
              "#FF9671",
              "#A2FF86",
            ],
          },
        ],
      },
      options: {
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const label = data.labels[tooltipItem.index] || "";
              const value = Number(data.datasets[0].data[tooltipItem.index]);
              return `${label}: ${formatter.format(value)}`;
            },
          },
        },
        legend: {
          display: true,
          position: "top",
        },
        cutoutPercentage: 60,
      },
      plugins: [totalPlugin],
    });
  })
  .catch((error) => {
    console.error("Erro ao buscar categorias:", error);
  });
