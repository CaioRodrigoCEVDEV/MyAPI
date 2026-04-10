// pollar filtros conta origem e destino
document.addEventListener("DOMContentLoaded", function () {
  fetch(`${BASE_URL}/contas`)
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

function atualizarPreviewTransferencia() {
  const origem = document.getElementById("contacod");
  const destino = document.getElementById("contacoddest");
  const previewOrigem = document.getElementById("previewOrigem");
  const previewDestino = document.getElementById("previewDestino");

  if (previewOrigem) {
    previewOrigem.textContent = origem?.selectedOptions?.[0]?.textContent || "Selecione a conta de origem";
  }

  if (previewDestino) {
    previewDestino.textContent = destino?.selectedOptions?.[0]?.textContent || "Selecione a conta de destino";
  }
}

document
  .getElementById("meuFormulario").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const alerta = document.getElementById("alerta-sucess");

    if (data.doccontacod === data.contacoddest) {
      alerta.className = "alert alert-danger mt-3";
      alerta.style.display = "block";
      alerta.innerHTML = "Selecione contas diferentes para origem e destino.";
      setTimeout(() => {
        alerta.style.display = "none";
      }, 2500);
      return;
    }

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
      atualizarPreviewTransferencia();
      alerta.className = "alert alert-success mt-3";
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

document.addEventListener("DOMContentLoaded", function () {
  const origem = document.getElementById("contacod");
  const destino = document.getElementById("contacoddest");

  origem?.addEventListener("change", atualizarPreviewTransferencia);
  destino?.addEventListener("change", atualizarPreviewTransferencia);
  atualizarPreviewTransferencia();
});
