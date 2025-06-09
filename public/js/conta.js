document.addEventListener("DOMContentLoaded", function () {
  fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => {
      
      return fetch(`${BASE_URL}/conta/${dados.usucod}`)
    })
    .then(res => res.json())
    .then(dados => {
        const corpoTabela = document.getElementById("corpoTabela");
        if (!corpoTabela) return; // Se não existir tabela, nada a fazer
        corpoTabela.innerHTML = ""; // Limpa o conteúdo atual da tabela

        dados.forEach(dado => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <td>${dado.contades}</td>
            <td>${dado.contatipodes}</td>
            <td>${dado.contavltotal}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="window.location.href='editar?id=${dado.contacod}'" title="Editar">
                  <i class="fa fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deletar(${dado.contacod})" title="Deletar">
                  <i class="fa fa-trash"></i>
                </button>
            </td>

        `;
            corpoTabela.appendChild(tr);
        });
    })
    .catch(erro => console.error(erro));
});
       
// document.addEventListener("DOMContentLoaded", function () {
//     fetch(`${BASE_URL}/conta`)
//         .then(response => response.json())
//         .then(data => {
//             const select = document.getElementById("tipoConta");

//             data.forEach(item => {
//                 const option = document.createElement("option");
//                 option.value = item.tccod;
//                 option.textContent = item.tcdes;
//                 select.appendChild(option);
//             });
//         })
//         .catch(error => {
//             console.error("Erro ao carregar tipos de cobrança:", error);
//         });
// });
// post

document.getElementById("meuFormulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const alerta = document.getElementById("alerta-sucess");

  // Verifica se existe um campo 'contacod' (id da conta) para saber se é edição
  const contacod = data.contacod || document.getElementById('contacod')?.value;

  let url, method;
  if (contacod) {
    // Edição
    url = `${BASE_URL}/conta/${contacod}`;
    method = "PUT";
  } else {
    // Criação
    url = `${BASE_URL}/conta`;
    method = "POST";
  }

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(resposta => {
      console.log(resposta);
      atualizarTabela();
      form.reset();
      alerta.style.display = "block";
      alerta.innerHTML = contacod ? "Editado com sucesso!" : "Lançado com sucesso!";
      setTimeout(() => {
        alerta.style.display = "none";
      }, 2000);
      // Se for edição, volte para a lista de contas
      if (contacod) {
        setTimeout(() => {
          window.location.href = "conta.html";
        }, 1000);
      }
    })
    .catch(erro => {
      alert("Erro ao salvar os dados.");
      console.error(erro);
    });
});

// Função para atualizar a tabela via AJAX
function atualizarTabela() {
  fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => fetch(`${BASE_URL}/conta/${dados.usucod}`))
    .then(res => res.json())
    .then(dados => {
      const corpoTabela = document.getElementById("corpoTabela");
      if (!corpoTabela) return;
      corpoTabela.innerHTML = "";
      dados.forEach(dado => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${dado.contades}</td>
          <td>${dado.contatipodes}</td>
          <td>${dado.contavltotal}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="window.location.href='editar?id=${dado.contacod}'" title="Editar">
              <i class="fa fa-edit"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="deletar(${dado.contacod})" title="Deletar">
              <i class="fa fa-trash"></i>
            </button>
          </td>
        `;
        corpoTabela.appendChild(tr);
      });
    })
    .catch(erro => console.error(erro));
}
// delete
window.deletar = function (id) {
    fetch(`${BASE_URL}/conta/${id}`, {
        method: "DELETE"
    })
        .then(res => {
            if (res.status === 200) {
                alert("Registro deletado com sucesso!");
                location.reload();
            } else if (res.status === 500) {
                alert("Existem registros vinculados a este item. Não é possível deletar.");
            }else {
                alert("Erro ao deletar o registro.");
            }
        })
        
};

document.addEventListener("DOMContentLoaded", function() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    carregarContaParaEdicao(id);
  }
});

//editar
// Função para buscar os dados da conta e preencher o formulário em editar.html
function carregarContaParaEdicao(id) {
  fetch(`${BASE_URL}/contaid/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Conta não encontrada");
      }
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Conta não encontrada");
      }
      const conta = data[0];
      console.log(conta);
      const contacodElem = document.getElementById('contacod');
      if (contacodElem) contacodElem.value = conta.contacod || "";

      const contavltotalElem = document.querySelector('input[name="contavltotal"]');
      if (contavltotalElem) contavltotalElem.value = conta.contavltotal || "";

      const contadesElem = document.querySelector('input[name="contades"]');
      if (contadesElem) contadesElem.value = conta.contades || "";

      const contatipoElem = document.querySelector('select[name="contatipo"]');
      if (contatipoElem) contatipoElem.value = conta.contatipo || "";

      if (conta.contausucod) {
        const usucodElem = document.getElementById("usucod");
        if (usucodElem) usucodElem.value = conta.contausucod;
      }
    })
    .catch(error => {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao carregar os dados da conta.");
    });
}

