var ctxDep = document.getElementById("myPieChartDep");

fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => {
      
      return fetch(`${BASE_URL}/catDespesa/${dados.usucod}`)
    })
  .then((response) => response.json())
  .then((data) => {
    const labels = data.map((item) => item.catdes);
    const valores = data.map((item) => Number(item.docv));

  new Chart(ctxDep, {
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
