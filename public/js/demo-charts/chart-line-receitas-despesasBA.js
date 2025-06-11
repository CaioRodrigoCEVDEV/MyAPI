fetch('/api/dadosUserLogado')
  .then(res => res.json())
  .then(user => fetch(`${BASE_URL}/docAnualRealizado/${user.usucod}`))
  .then(res => res.json())
  .then(data => {
    const mesesSet = new Set(data.map(d => d.mes));
    const meses = Array.from(mesesSet).sort();
    const receitas = meses.map(m => {
      const item = data.find(d => d.mes === m && d.docnatcod === 2);
      return item ? Number(item.total) : 0;
    });
    const despesas = meses.map(m => {
      const item = data.find(d => d.mes === m && d.docnatcod === 1);
      return item ? Number(item.total) : 0;
    });
    const ctx = document.getElementById('lineChartReceitasDespesasRealizado');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: meses,
        datasets: [
          {
            label: 'Receitas',
            data: receitas,
            borderColor: '#28a745',
            fill: false
          },
          {
            label: 'Despesas',
            data: despesas,
            borderColor: '#dc3545',
            fill: false
          }
        ]
      },
      options: {
        legend: { display: true }
      }
    });
  })
  .catch(err => console.error('Erro ao carregar grafico linha:', err));
