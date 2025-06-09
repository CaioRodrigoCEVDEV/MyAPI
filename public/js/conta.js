function showToast(message, type = 'success') {
  const toastEl = document.getElementById('toastConta');
  if (!toastEl) return;
  const body = toastEl.querySelector('.toast-body');
  body.textContent = message;
  toastEl.classList.remove('bg-success', 'bg-danger');
  toastEl.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
  toast.show();
}

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
            <td>${dado.contavltotal}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="abrirEditar(${dado.contacod})" title="Editar">
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

const formElem = document.getElementById("meuFormulario");
if (formElem) formElem.addEventListener("submit", function (e) {
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
        window.location.href = "/contas";
      }, 1000);
    })
    .catch(erro => {
      showToast("Erro ao salvar os dados.", "danger");
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
            <button class="btn btn-warning btn-sm" onclick="abrirEditar(${dado.contacod})" title="Editar">
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
    if (!confirm('Deseja excluir esta conta?')) {
        return;
    }

    fetch(`${BASE_URL}/conta/${id}`, {
        method: "DELETE"
    })
        .then(res => {
            if (res.status === 200) {
                showToast("Registro deletado com sucesso!", "success");
                location.reload();
            } else if (res.status === 500) {
                showToast("Existem registros vinculados a este item. Não é possível deletar.", "danger");
            } else {
                showToast("Erro ao deletar o registro.", "danger");
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
      showToast("Erro ao carregar os dados da conta.", "danger");
    });
}

// Toggle do formulário de nova conta
document.addEventListener('DOMContentLoaded', () => {
  const btnNovo = document.getElementById('novoConta');
  const modalEl = document.getElementById('modalNovaConta');
  const modalNovaConta = modalEl ? new bootstrap.Modal(modalEl) : null;
  const modalLabel = document.getElementById('modalNovaContaLabel');
  const form = document.getElementById('meuFormulario');

  btnNovo?.addEventListener('click', () => {
    modalLabel.textContent = 'Nova Conta';
    form?.reset();
    document.getElementById('contacod').value = '';
    modalNovaConta?.show();
  });

  modalEl?.addEventListener('hidden.bs.modal', () => {
    form?.reset();
    document.getElementById('contacod').value = '';
    modalLabel.textContent = 'Nova Conta';
  });

  window.abrirEditar = function(id) {
    carregarContaParaEdicao(id);
    modalLabel.textContent = 'Editar Conta';
    modalNovaConta?.show();
  };
});

