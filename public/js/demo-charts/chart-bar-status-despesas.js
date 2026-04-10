fetch(`${BASE_URL}/docPvsRatual`)
  .then(res => res.json())
  .then(data => {
    const totals = {};
    data.forEach(d => {
      totals[d.docsta] = (totals[d.docsta] || 0) + Number(d.total);
    });
    const labels = Object.keys(totals);
    const valores = labels.map(l => totals[l]);
    const ctx = document.getElementById('barChartPvsR');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Despesas',
          data: valores,
          backgroundColor: labels.map((label, index) => window.getStatusColor(label, index)),
          borderWidth: 0,
          maxBarThickness: 42,
        }]
      },
      options: Object.assign({}, window.buildCartesianOptions(), {
        legend: { display: false },
      })
    });
  })
  .catch(err => console.error('Erro ao carregar grafico barra:', err));




  fetch(`${BASE_URL}/doc/receitasPorSta`)
  .then(res => res.json())
  .then(data => {
    const totals = {};
    data.forEach(d => {
      totals[d.docsta] = (totals[d.docsta] || 0) + Number(d.total);
    });
    const labels = Object.keys(totals);
    const valores = labels.map(l => totals[l]);
    const ctx = document.getElementById('ReceitasLABA');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Receitas',
          data: valores,
          backgroundColor: labels.map((label, index) => window.getStatusColor(label, index)),
          borderWidth: 0,
          maxBarThickness: 42,
        }]
      },
      options: Object.assign({}, window.buildCartesianOptions(), {
        legend: { display: false },
      })
    });
  })
  .catch(err => console.error('Erro ao carregar grafico barra:', err));
