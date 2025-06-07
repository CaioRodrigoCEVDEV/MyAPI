


// pollar filtros conta origem e destino
document.addEventListener("DOMContentLoaded", function () {
  fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => {

      return fetch(`${BASE_URL}/contas/${dados.usucod}`)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar os dados");
      }
      return response.json();
    })
    .then((data) => {
      const contaOrigem = document.getElementById("contacod");
      const contaDestino = document.getElementById("contacoddest");

      data.forEach((conta) => {
        const option = document.createElement("option");
        option.value = conta.contacod;
        // conta destino
        const optionOrigem = document.createElement("option");
        optionOrigem.value = conta.contacod;
        optionOrigem.textContent = `${conta.contades} (${conta.contatipodes})`;
        contaOrigem.appendChild(optionOrigem);
        // conta origem
        const optionDestino = document.createElement("option");
        optionDestino.value = conta.contacod;
        optionDestino.textContent = `${conta.contades} (${conta.contatipodes})`;
        contaDestino.appendChild(optionDestino);   });
    })
    .catch((error) => {
      console.error("Erro ao carregar contas:", error);
    });
});


document
  .getElementById("meuFormulario").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const alerta = document.getElementById("alerta-sucess");

    try {
      const userRes = await fetch('/api/dadosUserLogado');
      const dados = await userRes.json();
      const docusucodElem = document.getElementById("docusucod");
      if (docusucodElem) {
        docusucodElem.value = dados.usucod;
      }
      console.log(data);

      await fetch(`${BASE_URL}/transferencia/${dados.usucod}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      form.reset();
      alerta.style.display = "block";
      alerta.innerHTML = "Lançado com sucesso!";
      setTimeout(() => {
        alerta.style.display = "none";
      }, 2000);
    } catch (erro) {
      alert("Erro ao salvar os dados.");
      console.error(erro);
    }
  });
