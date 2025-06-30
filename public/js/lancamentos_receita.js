document.addEventListener("DOMContentLoaded", function () {
  fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => {

      return fetch(`${BASE_URL}/doc/receitas/${dados.usucod}`)
    })
    .then((res) => res.json())
    .then((dados) => {
      const corpoAberto = document.getElementById("corpoTabelaAbertos");
      const corpoPago = document.getElementById("corpoTabelaPagos");
      corpoAberto.innerHTML = "";
      corpoPago.innerHTML = "";

      dados.forEach((dado) => {
        const tr = document.createElement("tr");
        if (dado.docsta === "LA") {
          // tr.style.backgroundColor = "#fff3cd"; // amarelo claro (Bootstrap warning)
          tr.style.color = "#856404"; // texto escuro para contraste
        } else {
          // tr.style.backgroundColor = "#d4edda"; // verde claro (Bootstrap success)
          tr.style.color = "#155724"; // texto escuro para contraste
        }
        const docsta = dado.docsta === "LA" ? "Aberto" : "Pago";
        const dataFormatada = dado.docdtpag
          ? dado.docdtpag.split("T")[0]
          : null;
        const partes = dataFormatada.split("-");
        const dataFormatada1 = `${partes[2]}-${partes[1]}-${partes[0]}`;
        tr.innerHTML = `
            <td>${dataFormatada1}</td>
            <td>${dado.docv}</td>
            <td>${dado.tcdes}</td>
            <td>${dado.natdes}</td>
            <td>${dado.catdes}</td>
            <td>${dado.contades}</td>
            <td>${dado.docobs}</td>
            <td>
                ${dado.docsta === "LA" ? '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i>' : '<i class="fa fa-check-square"></i>'}
                ${docsta}
            </td>
            <td>
                ${dado.docsta === "LA" ? `<button class="btn btn-success btn-sm" onclick="marcarRecebido(${dado.doccod})" title="Recebido"><i class="fa fa-check"></i></button>` : ''}
                <button class="btn btn-warning btn-sm" onclick="abrirEditar(${dado.doccod})" title="Editar"><i class="fa fa-edit"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deletar(${dado.doccod})" title="Deletar"><i class="fa fa-trash"></i></button>
            </td>
              `;
        if (dado.docsta === "LA") {
          corpoAberto.appendChild(tr);
        } else {
          corpoPago.appendChild(tr);
        }
      });
    })
    .catch((erro) => console.error(erro));
});

// Deletar
window.deletar = function (id) {
  fetch(`${BASE_URL}/doc/${id}`, {
    method: "PUT",
    credentials: "include", // Inclui cookies na requisição, se necessário
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao deletar o registro.");
      return res.json();
    })
    .then(() => {
      alert("Registro deletado com sucesso!");
      atualizarTabelaReceitas();
    })
    .catch((erro) => {
      alert("Erro ao deletar o registro.");
      console.error(erro);
    });
};

document
  .getElementById("meuFormulario")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const alerta = document.getElementById("alerta-sucess");

    // Se docsta estiver vazio, define como "LA"
    if (!data.docsta || data.docsta.trim() === "") {
      data.docsta = "LA";
    }

    // Buscar o código da natureza específica para 'Despesa'
    try {
      const natRes = await fetch(`${BASE_URL}/natureza/receita`);
      if (!natRes.ok) throw new Error("Erro ao buscar natureza");
      const natData = await natRes.json();
      if (Array.isArray(natData) && natData.length > 0) {
        data.docnatcod = natData[0].natcod;
      } else {
        console.error("Nenhuma natureza encontrada com natdes = 'D'");
        return;
      }
    } catch (err) {
      console.error(err);
      return;
    }

    fetch(`${BASE_URL}/doc`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((resposta) => {
        atualizarTabelaReceitas(); // Atualiza a tabela sem recarregar a página
        form.reset();
      })
      .catch((erro) => {
        alert("Erro ao salvar os dados.");
        console.error(erro);
      });

    alerta.style.display = "block";
    alerta.innerHTML = "Lançado com sucesso!";
    setTimeout(() => {
      alerta.style.display = "none";
    }, 2000);
  });

// Função para atualizar a tabela de despesas via AJAX
async function atualizarTabelaReceitas() {
  try {
    const userRes = await fetch('/api/dadosUserLogado');
    const dadosUser = await userRes.json();
    const despesasRes = await fetch(`${BASE_URL}/doc/receitas/${dadosUser.usucod}`);
    const dados = await despesasRes.json();

    const corpoAberto = document.getElementById("corpoTabelaAbertos");
    const corpoPago = document.getElementById("corpoTabelaPagos");
    corpoAberto.innerHTML = "";
    corpoPago.innerHTML = "";
    dados.forEach((dado) => {
      const tr = document.createElement("tr");
      tr.style.color = dado.docsta === "LA" ? "#856404" : "#155724";
      const docsta = dado.docsta === "LA" ? "Aberto" : "Pago";
      const dataFormatada = dado.docdtpag
          ? dado.docdtpag.split("T")[0] 
          : null;
        const partes = dataFormatada.split("-"); 
        const dataFormatada1 = `${partes[2]}-${partes[1]}-${partes[0]}`;
        tr.innerHTML = `
        <td>${dataFormatada1}</td> 
        <td>${dado.docv}</td>
        <td>${dado.tcdes}</td>
        <td>${dado.natdes}</td>
        <td>${dado.catdes}</td>
        <td>${dado.contades}</td>
        <td>${dado.docobs}</td>
        <td>
          ${dado.docsta === "LA" ? '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i>' : '<i class="fa fa-check-square"></i>'}
          ${docsta}
        </td>
        <td>
          ${dado.docsta === "LA" ? `<button class="btn btn-success btn-sm" onclick="marcarRecebido(${dado.doccod})" title="Recebido"><i class="fa fa-check"></i></button>` : ''}
          <button class="btn btn-warning btn-sm" onclick="abrirEditar(${dado.doccod})" title="Editar"><i class="fa fa-edit"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deletar(${dado.doccod})" title="Deletar"><i class="fa fa-trash"></i></button>
        </td>
      `;
      if (dado.docsta === "LA") {
        corpoAberto.appendChild(tr);
      } else {
        corpoPago.appendChild(tr);
      }
    });
  } catch (erro) {
    console.error("Erro ao atualizar tabela de despesas:", erro);
  }
}

// Quando o DOM estiver carregado listar as cobranças no options
document.addEventListener("DOMContentLoaded", function () {
  fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => {

      return fetch(`${BASE_URL}/tc/${dados.usucod}`)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar os dados");
      }
      return response.json();
    })
    .then((data) => {
      const select = document.getElementById("tipoCobranca");

      data.forEach((cobranca) => {
        const option = document.createElement("option");
        option.value = cobranca.tccod;
        option.textContent = `${cobranca.tcdes}`;
        select.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar contas:", error);
    });
});

// Quando o DOM estiver carregado listar as contas no options contas
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
      const select = document.getElementById("contacod");

      data.forEach((conta) => {
        const option = document.createElement("option");
        option.value = conta.contacod;
        option.textContent = `${conta.contades} (${conta.contatipodes})`;
        select.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar contas:", error);
    });
});
// listagem de categorias
document.addEventListener("DOMContentLoaded", function () {
  fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => {

      return fetch(`${BASE_URL}/catTodosReceita/${dados.usucod}`)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar os dados");
      }
      return response.json();
    })
    .then((data) => {
      const select = document.getElementById("categoria");

      data.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria.catcod;
        option.textContent = `${categoria.catdes}`;
        select.appendChild(option);
      });
    })
    .catch((error) => {
  console.error("Erro ao carregar categorias:", error);
  });
});

// Carregar opções nos selects do modal de edição
document.addEventListener("DOMContentLoaded", function () {
  fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => fetch(`${BASE_URL}/tc/${dados.usucod}`))
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('edit_tccod');
      data.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.tccod;
        opt.textContent = item.tcdes;
        select.appendChild(opt);
      });
    });
  fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => fetch(`${BASE_URL}/contas/${dados.usucod}`))
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('edit_contacod');
      data.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.contacod;
        opt.textContent = `${item.contades} (${item.contatipodes})`;
        select.appendChild(opt);
      });
    });
  fetch('/api/dadosUserLogado')
    .then(res => res.json())
    .then(dados => fetch(`${BASE_URL}/catTodosReceita/${dados.usucod}`))
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('edit_catcod');
      data.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.catcod;
        opt.textContent = item.catdes;
        select.appendChild(opt);
      });
    });
});

// Abrir modal de edição preenchendo dados
window.abrirEditar = async function(id) {
  try {
    const res = await fetch(`${BASE_URL}/docid/${id}`);
    if(!res.ok) throw new Error();
    const doc = await res.json();
    document.getElementById('edit_doccod').value = doc.doccod;
    document.getElementById('edit_docv').value = doc.docv;
    document.getElementById('edit_docobs').value = doc.docobs || '';
    document.getElementById('edit_docdtpag').value = doc.docdtpag ? doc.docdtpag.split('T')[0] : '';
    document.getElementById('edit_docsta').checked = doc.docsta === 'BA';
    document.getElementById('edit_contacod').value = doc.doccontacod;
    document.getElementById('edit_tccod').value = doc.doctccod;
    document.getElementById('edit_catcod').value = doc.doccatcod;
    const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
    modal.show();
  } catch (err) {
    alert('Erro ao carregar dados.');
    console.error(err);
  }
};

// Submissão do formulário de edição
document.getElementById('formEditar').addEventListener('submit', function(e){
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  if(!data.docsta) data.docsta = 'LA';
  fetch(`${BASE_URL}/docedit/${data.doccod}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(() => {
    const modalEl = document.getElementById('modalEditar');
    bootstrap.Modal.getInstance(modalEl).hide();
    atualizarTabelaReceitas();
  })
  .catch(err => { alert('Erro ao editar registro.'); console.error(err); });
});

// Marca lançamento como recebido
window.marcarRecebido = function(id) {
  fetch(`${BASE_URL}/docstatus/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(() => atualizarTabelaReceitas())
  .catch(err => { alert('Erro ao atualizar status.'); console.error(err); });
};

// Toggle do formulário e busca no grid
document.addEventListener('DOMContentLoaded', () => {
  const btnNovo = document.getElementById('novoLancamento');
  const modalEl = document.getElementById('modalNovo');
  const modalNovo = modalEl ? new bootstrap.Modal(modalEl) : null;
  btnNovo?.addEventListener('click', () => {
    modalNovo?.show();
  });

  const tables = [
    document.querySelector('#tabelaAbertos table'),
    document.querySelector('#tabelaPagos table')
  ];
  const filtros = {};

  function coletarValoresUnicos(indice) {
    const valores = new Set();
    tables.forEach(t => {
      if (!t) return;
      t.querySelectorAll('tbody tr').forEach(tr => {
        const td = tr.children[indice];
        if (td) valores.add(td.textContent.trim());
      });
    });
    return Array.from(valores);
  }

  function atualizarSelect(indice, select) {
    select.innerHTML = '<option value="">Todos</option>';
    coletarValoresUnicos(indice).forEach(val => {
      const opt = document.createElement('option');
      opt.value = val.toLowerCase();
      opt.textContent = val;
      select.appendChild(opt);
    });
  }

  function aplicarFiltros() {
    tables.forEach(table => {
      if (!table) return;
      table.querySelectorAll('tbody tr').forEach(tr => {
        let visivel = true;
        for (const chave in filtros) {
          const valor = filtros[chave];
          if (chave === 'global') {
            if (!tr.textContent.toLowerCase().includes(valor)) {
              visivel = false;
              break;
            }
          } else {
            const td = tr.children[chave];
            if (!td || !td.textContent.toLowerCase().includes(valor)) {
              visivel = false;
              break;
            }
          }
        }
        tr.style.display = visivel ? '' : 'none';
      });
    });
  }

  let dropdownAtual = null;

  function fecharDropdown() {
    if (dropdownAtual) {
      document.removeEventListener('click', dropdownAtual.handler);
      dropdownAtual.remove();
      dropdownAtual = null;
    }
  }

  function mostrarDropdown(th, indice) {
    fecharDropdown();
    const rect = th.getBoundingClientRect();
    const dropdown = document.createElement('div');
    dropdown.style.position = 'absolute';
    dropdown.style.left = `${rect.left + window.pageXOffset}px`;
    dropdown.style.top = `${rect.bottom + window.pageYOffset}px`;
    dropdown.style.minWidth = `${rect.width}px`;
    dropdown.style.zIndex = '1000';

    const select = document.createElement('select');
    select.className = 'form-select form-select-sm column-filter';
    atualizarSelect(indice, select);
    if (filtros[indice]) select.value = filtros[indice];
    select.addEventListener('change', () => {
      const val = select.value;
      if (val) filtros[indice] = val; else delete filtros[indice];
      aplicarFiltros();
      fecharDropdown();
    });

    dropdown.appendChild(select);
    document.body.appendChild(dropdown);
    select.focus();

    const fecharSeFora = (e) => {
      if (!dropdown.contains(e.target) && e.target !== th) {
        fecharDropdown();
      }
    };
    dropdown.handler = fecharSeFora;
    document.addEventListener('click', fecharSeFora);
    dropdownAtual = dropdown;
  }

  function adicionarFiltrosColuna(table) {
    if (!table) return;
    const thead = table.querySelector('thead');
    const headerRow = thead.querySelector('tr');
    [...headerRow.children].forEach((th, idx) => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => mostrarDropdown(th, idx));
    });
  }

  tables.forEach(t => adicionarFiltrosColuna(t));

  const busca = document.getElementById('buscaLancamento');
  busca?.addEventListener('input', () => {
    const val = busca.value.trim().toLowerCase();
    if (val) filtros['global'] = val; else delete filtros['global'];
    aplicarFiltros();
  });
});
