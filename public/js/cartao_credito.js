document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(user => fetch(`${BASE_URL}/cartao/${user.usucod}`))
    .then(res => res.json())
    .then(cartoes => preencherTabela(cartoes))
    .catch(err => console.error(err));
});

function preencherTabela(cartoes) {
  const corpo = document.getElementById('corpoTabela');
  if (!corpo) return;
  corpo.innerHTML = '';
  cartoes.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.ccdes}</td><td>${c.cclimite}</td><td>${c.ccfechamento}</td><td>${c.ccvencimento}</td>`;
    corpo.appendChild(tr);
  });
}

const btnNovo = document.getElementById('novoCartao');
const modalEl = document.getElementById('modalNovoCartao');
const modalCartao = modalEl ? new bootstrap.Modal(modalEl) : null;
btnNovo?.addEventListener('click', () => modalCartao?.show());

const form = document.getElementById('formCartao');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  fetch(`${BASE_URL}/cartao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => {
      modalCartao?.hide();
      form.reset();
      document.getElementById('alerta-sucess').style.display = 'block';
      setTimeout(() => {
        document.getElementById('alerta-sucess').style.display = 'none';
      }, 1500);
      return fetch('/api/dadosUserLogado');
    })
    .then(res => res.json())
    .then(user => fetch(`${BASE_URL}/cartao/${user.usucod}`))
    .then(res => res.json())
    .then(cartoes => preencherTabela(cartoes))
    .catch(err => console.error(err));
});
