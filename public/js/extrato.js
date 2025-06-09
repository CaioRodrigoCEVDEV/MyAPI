document.addEventListener("DOMContentLoaded", function () {
  fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => {
      return fetch(`${BASE_URL}/doc/${dados.usucod}`)
    })
    .then((res) => res.json())
    .then((dados) => {
      const corpoTabela = document.getElementById("corpoTabela");
      corpoTabela.innerHTML = ""; // Limpa o conteúdo atual da tabela

      dados.forEach((dado) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                        <td>${dado.doccod}</td>
                        <td>${dado.docsta}</td>
                        <td>${dado.tcdes}</td>
                        <td>${dado.natdes}</td>
                        <td>${dado.docv}</td>
                        <td>${dado.docobs}</td>

                    `;
        corpoTabela.appendChild(tr);
      });
    })
    .catch((erro) => console.error(erro));

  const busca = document.getElementById('buscaRegistro');
  busca?.addEventListener('input', () => {
    const termo = busca.value.toLowerCase();
    document.querySelectorAll('#corpoTabela tr').forEach(tr => {
      tr.style.display = tr.textContent.toLowerCase().includes(termo) ? '' : 'none';
    });
  });
});
