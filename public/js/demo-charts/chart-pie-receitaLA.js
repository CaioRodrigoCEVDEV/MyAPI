// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily =
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#292b2c";

// Pie Chart Example
var ctxRecLA = document.getElementById("myPieChartRecLA");

fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => {
      
      return fetch(`${BASE_URL}/catReceitaLA/${dados.usucod}`)
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

    const myPieChart = new Chart(ctxRecLA, {
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
    });
  })
  .catch((error) => {
    console.error("Erro ao buscar categorias:", error);
  });
