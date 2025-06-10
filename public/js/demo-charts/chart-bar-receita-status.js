fetch('/api/dadosUserLogado')
  .then(res => res.json())
  .then(user => fetch(`${BASE_URL}/docReceitaStatusAtual/${user.usucod}`))
  .then(res => res.json())
  .then(data => {
    const totals = {};
    data.forEach(d => {
      totals[d.docsta] = Number(d.total);
    });
    const labels = Object.keys(totals);
    const valores = labels.map(l => totals[l]);
    const ctx = document.getElementById('barChartReceitaStatus');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Receitas',
          data: valores,
          backgroundColor: '#E57C23'
        }]
      },
      options: {
        legend: { display: false }
      }
    });
  })
  .catch(err => console.error('Erro ao carregar grafico receitas status:', err));
