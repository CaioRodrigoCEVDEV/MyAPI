fetch('/api/dadosUserLogado')
  .then(res => res.json())
  .then(user => fetch(`${BASE_URL}/docAnualRealizado/${user.usucod}`))
  .then(res => res.json())
  .then(data => {
    const mesesSet = new Set(data.map(d => d.mes));
    const meses = window.sortMonthLabels(Array.from(mesesSet));
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
        labels: meses.map(window.normalizeMonthLabel),
        datasets: [
          {
            label: 'Receitas',
            data: receitas,
            backgroundColor: '#0f766e',
            borderColor: '#0f766e',
            borderWidth: 0,
            hoverBackgroundColor: '#0b5f58',
          },
          {
            label: 'Despesas',
            data: despesas,
            backgroundColor: '#e11d48',
            borderColor: '#e11d48',
            borderWidth: 0,
            hoverBackgroundColor: '#be123c',
          }
        ]
      },
      options: window.buildCartesianOptions()
    });
  })
  .catch(err => console.error('Erro ao carregar grafico barra:', err));
