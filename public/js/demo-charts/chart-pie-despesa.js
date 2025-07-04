// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily =
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#292b2c";

// Pie Chart Example
var ctxDep = document.getElementById("myPieChartDep");

fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => {
      
      return fetch(`${BASE_URL}/catDespesa/${dados.usucod}`)
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

  // Plugin para exibir o totalizador apenas no cabeçalho do gráfico
  const totalPlugin = {
    id: "totalizadorDep",
    beforeDraw: (chart) => {
      if (chart.config.type !== "doughnut" || chart.canvas.id !== "myPieChartDep") return;

      // Calcula o total apenas das categorias visíveis
      const data = chart.data.datasets[0].data;
      const meta = chart.getDatasetMeta(0);
      const total = data.reduce((acc, val, idx) => {
        return meta.data[idx].hidden ? acc : acc + Number(val);
      }, 0);

      const totalFormatted = formatter.format(total);
      const headerTotal = chart.canvas.closest('.card').querySelector('.chart-total');
      if (headerTotal) {
        headerTotal.textContent = totalFormatted;
      }
    },
  };

  // Registro global para funcionar no Chart.js 2.x
  Chart.plugins.register(totalPlugin);

  const myPieChart = new Chart(ctxDep, {
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
