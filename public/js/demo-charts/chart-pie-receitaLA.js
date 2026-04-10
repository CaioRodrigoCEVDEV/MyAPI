var ctxRecLA = document.getElementById("myPieChartRecLA");

fetch(`${BASE_URL}/catReceitaLA`)
  .then((response) => response.json())
  .then((data) => {
    const labels = data.map((item) => item.catdes);
    const valores = data.map((item) => Number(item.docv));

  new Chart(ctxRecLA, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: valores,
            backgroundColor: window.getChartColors(valores.length),
            borderColor: "#ffffff",
            borderWidth: 3,
            hoverBorderWidth: 3,
          },
        ],
      },
      options: window.buildDoughnutOptions(),
    });
  })
  .catch((error) => {
    console.error("Erro ao buscar categorias:", error);
  });
