// define flash fora do handler, para ficar disponível
function flash(msg, duration = 3000) {
  const el = document.getElementById('flash');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), duration);
}

document.getElementById("meuFormulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(async res => {
      const body = await res.json();

      if (res.status === 409) {
        // email já existe
        flash(body.error);
        return;
      }

      if (!res.ok) {
        // outros erros de validação ou servidor
        flash('Erro ao salvar os dados.');
        console.error('Server error:', body);
        return;
      }

      // sucesso
      flash('Dados salvos com sucesso!');
      console.log(body);
      setTimeout(() => window.location.href = "/login", 1000);
    })
    .catch(err => {
      // falha de rede ou outra exceção
      flash('Erro ao salvar os dados.');
      console.error('Fetch error:', err);
    });
});
