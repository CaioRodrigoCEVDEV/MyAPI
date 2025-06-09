document.addEventListener('DOMContentLoaded', () => {
  carregarTabelas();
});

function carregarTabelas() {
  fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(user => Promise.all([
      fetch(`${BASE_URL}/cartao/gasto/${user.usucod}`).then(r => r.json()),
      fetch(`${BASE_URL}/catTodosDespesa/${user.usucod}`).then(r => r.json()),
      fetch(`${BASE_URL}/cartao/${user.usucod}`).then(r => r.json())
    ]))
    .then(([gastos, categorias, cartoes]) => {
      preencherTabela(gastos);
      popularSelect('categoria', categorias, 'catcod', 'catdes');
      popularSelect('cartao', cartoes, 'cccod', 'ccdes');
    })
    .catch(err => console.error(err));
}

function popularSelect(id, dados, valueField, textField) {
  const select = document.getElementById(id);
  if (!select) return;
  select.innerHTML = '';
  dados.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d[valueField];
    opt.textContent = d[textField];
    select.appendChild(opt);
  });
}

function preencherTabela(gastos) {
  const corpo = document.getElementById('corpoTabela');
  if (!corpo) return;
  corpo.innerHTML = '';
  gastos.forEach(g => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${g.data.split('T')[0]}</td><td>${g.descricao}</td><td>${g.valor}</td><td>${g.ccdes}</td><td>${g.catdes}</td><td>${g.mesfat}</td>`;
    corpo.appendChild(tr);
  });
}

const btnNovo = document.getElementById('novoGasto');
const modalEl = document.getElementById('modalNovoGasto');
const modalGasto = modalEl ? new bootstrap.Modal(modalEl) : null;
btnNovo?.addEventListener('click', () => modalGasto?.show());

const form = document.getElementById('formGasto');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  fetch(`${BASE_URL}/cartao/gasto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => {
      modalGasto?.hide();
      form.reset();
      document.getElementById('alerta-sucess').style.display = 'block';
      setTimeout(() => {
        document.getElementById('alerta-sucess').style.display = 'none';
      }, 1500);
      carregarTabelas();
    })
    .catch(err => console.error(err));
});
