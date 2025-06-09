// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily =
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#292b2c";

// Pie Chart Example
var ctxRec = document.getElementById("myPieChartRec");

fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => {
      
      return fetch(`${BASE_URL}/catReceita/${dados.usucod}`)
    })
  .then((response) => response.json())
  .then((data) => {
    // como a resposta é um array de objetos, eu precisei mapear os dados para ter o array de labels e valores
    const labels = data.map((item) => item.catdes);
    const valores = data.map((item) => item.docv);

    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const myPieChart = new Chart(ctxRec, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: valores,
            backgroundColor: ["#007bff", "#dc3545", "#ffc107", "#28a745", "#6f42c1", "#17a2b8", "#fd7e14", "#6610f2", "#e83e8c", "#20c997", "#343a40", "#f8f9fa"],
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
    });
  })
  .catch((error) => {
    console.error("Erro ao buscar categorias:", error);
  });
