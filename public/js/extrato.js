function renderExtratoResumo(dados) {
  const total = document.getElementById("extratoQuantidade");
  const receitas = document.getElementById("extratoReceitas");
  const despesas = document.getElementById("extratoDespesas");

  if (total) total.textContent = dados.length;
  if (receitas) receitas.textContent = dados.filter((item) => String(item.natdes || "").toLowerCase().includes("rece")).length;
  if (despesas) despesas.textContent = dados.filter((item) => String(item.natdes || "").toLowerCase().includes("des")).length;
}

document.addEventListener("DOMContentLoaded", function () {
  fetch(`${BASE_URL}/doc`)
    .then((res) => res.json())
    .then((dados) => {
      const corpoTabela = document.getElementById("corpoTabela");
      corpoTabela.innerHTML = ""; // Limpa o conteúdo atual da tabela
      renderExtratoResumo(dados);

      if (!dados.length) {
        corpoTabela.innerHTML = `
          <tr>
            <td colspan="6">
              <div class="empty-state-table">
                <i class="fas fa-file-lines"></i>
                <div>Nenhum registro encontrado no extrato.</div>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      dados.forEach((dado) => {
        const tr = document.createElement("tr");
        const natureza = String(dado.natdes || "").toLowerCase().includes("rece") ? "finance-badge-income" : "finance-badge-expense";
        tr.innerHTML = `
                        <td>${dado.doccod}</td>
                        <td><span class="finance-badge finance-badge-status">${dado.docsta}</span></td>
                        <td>${dado.tcdes}</td>
                        <td><span class="finance-badge ${natureza}">${dado.natdes}</span></td>
                        <td class="finance-cell-value">R$ ${Number(dado.docv || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td class="finance-cell-muted">${dado.docobs || 'Sem observações'}</td>

                    `;
        corpoTabela.appendChild(tr);
      });
    })
    .catch((erro) => console.error(erro));

  const busca = document.getElementById('buscaRegistro');
  busca?.addEventListener('input', () => {
    const termo = busca.value.toLowerCase();
    let visiveis = 0;
    document.querySelectorAll('#corpoTabela tr').forEach(tr => {
      const visivel = tr.textContent.toLowerCase().includes(termo);
      tr.style.display = visivel ? '' : 'none';
      if (visivel) visiveis += 1;
    });
    const total = document.getElementById("extratoQuantidade");
    if (total && termo) total.textContent = visiveis;
  });
});
