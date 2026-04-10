function renderCategoriaSummary(categorias) {
  const total = document.getElementById("categoriaQuantidade");
  const receitas = document.getElementById("categoriaReceitaQuantidade");
  const despesas = document.getElementById("categoriaDespesaQuantidade");

  if (total) total.textContent = categorias.length;
  if (receitas) receitas.textContent = categorias.filter((item) => item.cattipo === "R").length;
  if (despesas) despesas.textContent = categorias.filter((item) => item.cattipo === "D").length;
}

document.addEventListener("DOMContentLoaded", function () {
fetch(`${BASE_URL}/catTodos`)
    .then((res) => res.json())
    .then((dados) => {
      const corpoTabela = document.getElementById("corpoTabela");
      corpoTabela.innerHTML = ""; // Limpa o conteúdo atual da tabela
      renderCategoriaSummary(dados);

      if (!dados.length) {
        corpoTabela.innerHTML = `
          <tr>
            <td colspan="4">
              <div class="empty-state-table">
                <i class="fas fa-tags"></i>
                <div>Nenhuma categoria cadastrada até o momento.</div>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      dados.forEach((dado) => {
        const tr = document.createElement("tr");
        const tipo = dado.cattipo === "R" ? "Receita" : "Despesa";
        tr.innerHTML = `
                        <td>${dado.catcod}</td>
                        <td><span class="account-name">${dado.catdes}</span></td>
                        <td><span class="finance-badge ${dado.cattipo === "R" ? "finance-badge-income" : "finance-badge-expense"}">${tipo}</span></td>
                        <td>
                            <div class="account-actions">
                              <button class="btn-finance-icon btn-finance-edit" onclick="editar(${dado.catcod})" title="Editar"><i class="fa fa-edit"></i></button>
                              <button class="btn-finance-icon btn-finance-delete" onclick="deletar(${dado.catcod})" title="Deletar"><i class="fa fa-trash"></i></button>
                            </div>
                        </td>

                    `;
        corpoTabela.appendChild(tr);
      });
    })
    .catch((erro) => console.error(erro));
});

// delete
window.deletar = function (id) {
  fetch(`${BASE_URL}/cat/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((resposta) => {
      alert("Registro deletado com sucesso!");
      // Atualiza a tabela após a exclusão
      document.getElementById("corpoTabela").innerHTML = "";
      location.reload();
    })
    .catch((erro) => {
      alert("Erro ao deletar o registro.");
      console.error(erro);
    });
};

//editar
window.editar = function (id) {
  // Exemplo: obtenha os novos valores do usuário (pode ser via prompt ou modal)
  const novoCatDes = prompt("Digite a nova descrição da categoria:");
  const novoCatTipo = prompt("Digite o novo tipo da categoria (R para Receita, D para Despesa):");

  if (!novoCatDes || !novoCatTipo) {
    alert("Descrição e tipo são obrigatórios para editar.");
    return;
  }

  fetch(`${BASE_URL}/cat/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      catdes: novoCatDes,
      cattipo: novoCatTipo
    }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Registro editado com sucesso!");
      // Atualiza a tabela após a edição
      document.getElementById("corpoTabela").innerHTML = "";
      location.reload();
    })
    .catch((erro) => {
      alert("Erro ao editar o registro.");
      console.error(erro);
    });
};

// post
document
  .getElementById("meuFormulario")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries());
 
    fetch(`${BASE_URL}/catInsert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((resposta) => {
        alert("Dados salvos com sucesso!");
        console.log(resposta);
        location.reload();
      })
      .catch((erro) => {
        alert("Erro ao salvar os dados.");
        console.error(erro);
      });
    });
