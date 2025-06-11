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
    const ctx = document.getElementById('barChartReceitasDespesasRealizado');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [
          {
            label: 'Receitas',
            data: receitas,
            backgroundColor: '#28a745',
            borderColor: '#28a745'
          },
          {
            label: 'Despesas',
            data: despesas,
            backgroundColor: '#dc3545',
            borderColor: '#dc3545'
          }
        ]
      },
      options: {
        legend: { display: true }
      }
    });
  })
  .catch(err => console.error('Erro ao carregar grafico barra:', err));
