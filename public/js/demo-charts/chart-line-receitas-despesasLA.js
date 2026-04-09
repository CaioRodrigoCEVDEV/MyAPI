fetch('/api/dadosUserLogado')
  .then(res => res.json())
  .then(user => fetch(`${BASE_URL}/docAnualProvisionado/${user.usucod}`))
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
    const ctx = document.getElementById('lineChartReceitasDespesasProvisionado');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: meses.map(window.normalizeMonthLabel),
        datasets: [
          {
            label: 'Receitas',
            data: receitas,
            borderColor: '#0f766e',
            backgroundColor: 'rgba(15, 118, 110, 0.12)',
            pointBackgroundColor: '#0f766e',
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#0f766e',
            fill: true
          },
          {
            label: 'Despesas',
            data: despesas,
            borderColor: '#e11d48',
            backgroundColor: 'rgba(225, 29, 72, 0.08)',
            pointBackgroundColor: '#e11d48',
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#e11d48',
            fill: true
          }
        ]
      },
      options: window.buildCartesianOptions()
    });
  })
  .catch(err => console.error('Erro ao carregar grafico linha:', err));
