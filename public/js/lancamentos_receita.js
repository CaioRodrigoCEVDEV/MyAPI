let dadosUserCache = null;

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

async function obterDadosUsuario() {
  if (dadosUserCache) return dadosUserCache;
  const userRes = await fetch('/api/dadosUserLogado');
  dadosUserCache = await userRes.json();
  return dadosUserCache;
}

function parseDataDoc(docdtpag) {
  if (!docdtpag) return null;
  const data = docdtpag.split("T")[0];
  return new Date(`${data}T00:00:00`);
}

function renderizarTabelaReceitas(dados) {
  const corpoTabela = document.getElementById("corpoTabela");
  const countTabela = document.getElementById("corpoTabelaCount");
  corpoTabela.innerHTML = "";

  const abertos = dados.filter((dado) => dado.docsta === "LA");
  const pagos = dados.filter((dado) => dado.docsta !== "LA");

  if (countTabela) countTabela.textContent = dados.length;

  const total = dados.reduce((acc, dado) => acc + Number(String(dado.docv).replace(',', '.')), 0);
  const totalAberto = abertos.reduce((acc, dado) => acc + Number(String(dado.docv).replace(',', '.')), 0);
  const totalPago = pagos.reduce((acc, dado) => acc + Number(String(dado.docv).replace(',', '.')), 0);

  const saldo = document.getElementById("saldo");
  const gastosNow = document.getElementById("gastosNow");
  const despesaP = document.getElementById("despesaP");
  const totalSeguro = document.getElementById("totalSeguro");

  if (saldo) saldo.textContent = dados.length;
  if (gastosNow) gastosNow.textContent = formatCurrency(total);
  if (despesaP) despesaP.textContent = formatCurrency(totalAberto);
  if (totalSeguro) totalSeguro.textContent = formatCurrency(totalPago);

  if (!dados.length) {
    corpoTabela.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="empty-state-table">
            <i class="fas fa-hand-holding-usd"></i>
            <div>Nenhuma receita encontrada para os filtros aplicados.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  dados.forEach((dado) => {
    const tr = document.createElement("tr");
    const docsta = dado.docsta === "LA" ? "Aberto" : "Pago";
    const dataFormatada = dado.docdtpag ? dado.docdtpag.split("T")[0] : "";
    const partes = dataFormatada.split("-");
    const dataFormatada1 = partes.length === 3 ? `${partes[2]}-${partes[1]}-${partes[0]}` : "";
    tr.innerHTML = `
      <td class="finance-cell-date">${dataFormatada1}</td>
      <td class="finance-cell-value">R$ ${formatCurrency(String(dado.docv).replace(',', '.'))}</td>
      <td>${dado.tcdes}</td>
      <td class="finance-cell-muted">${dado.natdes}</td>
      <td>${dado.catdes}</td>
      <td>${dado.contades}</td>
      <td class="finance-cell-muted">${dado.docobs || 'Sem observações'}</td>
      <td>
        <span class="finance-status-badge ${dado.docsta === "LA" ? 'finance-status-open' : 'finance-status-paid'}">
          ${dado.docsta === "LA" ? '<i class="fa fa-clock-o"></i>' : '<i class="fa fa-check-circle"></i>'}
          ${docsta}
        </span>
      </td>
      <td>
        <div class="finance-actions">
          ${dado.docsta === "LA" ? `<button class="btn-finance-icon btn-finance-pay" onclick="marcarRecebido(${dado.doccod})" title="Recebido"><i class="fa fa-check"></i></button>` : ''}
          <button class="btn-finance-icon btn-finance-edit" onclick="abrirEditar(${dado.doccod})" title="Editar"><i class="fa fa-edit"></i></button>
          <button class="btn-finance-icon btn-finance-delete" onclick="deletar(${dado.doccod})" title="Deletar"><i class="fa fa-trash"></i></button>
        </div>
      </td>
    `;
    corpoTabela.appendChild(tr);
  });
}

function aplicarFiltrosNosDados(dados) {
  const termo = (document.getElementById('buscaLancamento')?.value || '').trim().toLowerCase();
  const dataInicio = document.getElementById('dataInicio')?.value;
  const dataFim = document.getElementById('dataFim')?.value;
  const valorMin = parseFloat((document.getElementById('valorMin')?.value || '').replace(',', '.'));
  const valorMax = parseFloat((document.getElementById('valorMax')?.value || '').replace(',', '.'));
  const categoria = (document.getElementById('categoriaFiltro')?.value || '').toLowerCase();
  const status = (document.getElementById('statusFiltro')?.value || '').toLowerCase();

  const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00`) : null;
  const fim = dataFim ? new Date(`${dataFim}T23:59:59`) : null;

  return dados.filter((dado) => {
    const dataDoc = parseDataDoc(dado.docdtpag);
    const valorDoc = parseFloat(String(dado.docv).replace(',', '.'));
    const categoriaDoc = (dado.catdes || '').toLowerCase();
    const statusDoc = dado.docsta === 'LA' ? 'aberto' : 'pago';
    const textoLinha = `${dado.docv} ${dado.tcdes} ${dado.natdes} ${dado.catdes} ${dado.contades} ${dado.docobs || ''}`.toLowerCase();

    if (termo && !textoLinha.includes(termo)) return false;
    if (inicio && dataDoc && dataDoc < inicio) return false;
    if (fim && dataDoc && dataDoc > fim) return false;
    if (!isNaN(valorMin) && valorDoc < valorMin) return false;
    if (!isNaN(valorMax) && valorDoc > valorMax) return false;
    if (categoria && !categoriaDoc.includes(categoria)) return false;
    if (status && statusDoc !== status) return false;
    return true;
  });
}

// Deletar
window.deletar = function (id) {
  if (!confirm('Confirma a exclusão deste lançamento?')) return;
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
      alert("Clique em Buscar para atualizar a listagem.");
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
    const repeat = document.getElementById("repeat");
    const repeatMonthsInput = document.getElementById("repeatMonths");
    const totalMonths = repeat && repeat.checked ? parseInt(repeatMonthsInput.value, 10) || 1 : 1;
    const baseObs = data.docobs || "";

    try {
      for (let i = 0; i < totalMonths; i++) {
        const payload = { ...data };
        const dataBase = new Date(data.docdtpag);
        dataBase.setMonth(dataBase.getMonth() + i);
        payload.docdtpag = dataBase.toISOString().split("T")[0];
        if (i > 0) {
          payload.docsta = "LA";
        }
        if (totalMonths > 1) {
          const parcela = `Parcela ${i + 1}/${totalMonths}`;
          payload.docobs = baseObs ? `${baseObs} - ${parcela}` : parcela;
        }

        await fetch(`${BASE_URL}/doc`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then((res) => res.json());
      }
      atualizarTabelaReceitas();
      form.reset();
      if (repeat) {
        document.getElementById("repeatContainer").style.display = "none";
      }
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

// Atualiza a tabela somente quando o usuário buscar
async function atualizarTabelaReceitas() {
  try {
    const dadosUser = await obterDadosUsuario();
    const params = new URLSearchParams();
    const termo = (document.getElementById('buscaLancamento')?.value || '').trim();
    const dataInicio = document.getElementById('dataInicio')?.value || '';
    const dataFim = document.getElementById('dataFim')?.value || '';
    const valorMin = document.getElementById('valorMin')?.value || '';
    const valorMax = document.getElementById('valorMax')?.value || '';
    const categoria = document.getElementById('categoriaFiltro')?.value || '';
    const status = document.getElementById('statusFiltro')?.value || '';

    if (termo) params.append('busca', termo);
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    if (valorMin) params.append('valorMin', valorMin);
    if (valorMax) params.append('valorMax', valorMax);
    if (categoria) params.append('categoria', categoria);
    if (status) params.append('status', status);

    const query = params.toString();
    const despesasRes = await fetch(`${BASE_URL}/doc/receitas/${dadosUser.usucod}${query ? `?${query}` : ''}`);
    const dados = await despesasRes.json();
    renderizarTabelaReceitas(dados);
  } catch (erro) {
    console.error("Erro ao atualizar tabela de despesas:", erro);
  }
}

// Quando o DOM estiver carregado listar as cobranças no options
document.addEventListener("DOMContentLoaded", function () {
  fetch(`${BASE_URL}/tc`)
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
  fetch(`${BASE_URL}/contas`)
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
  fetch(`${BASE_URL}/catTodosReceita`)
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
  fetch(`${BASE_URL}/tc`)
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
  fetch(`${BASE_URL}/contas`)
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
  fetch(`${BASE_URL}/catTodosReceita`)
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
  .then(() => alert('Status atualizado. Clique em Buscar para recarregar a listagem.'))
  .catch(err => { alert('Erro ao atualizar status.'); console.error(err); });
};

// Comportamento da tela e gatilho de busca
document.addEventListener('DOMContentLoaded', () => {
  const btnNovo = document.getElementById('novoLancamento');
  const modalEl = document.getElementById('modalNovo');
  const modalNovo = modalEl ? new bootstrap.Modal(modalEl) : null;
  const btnBuscar = document.getElementById('buscarFiltros');
  const limpar = document.getElementById('limparFiltros');
  const busca = document.getElementById('buscaLancamento');
  const filtroInicio = document.getElementById('dataInicio');
  const filtroFim = document.getElementById('dataFim');
  const valorMin = document.getElementById('valorMin');
  const valorMax = document.getElementById('valorMax');
  const filtroCategoria = document.getElementById('categoriaFiltro');
  const filtroStatus = document.getElementById('statusFiltro');

  btnNovo?.addEventListener('click', () => modalNovo?.show());
  btnBuscar?.addEventListener('click', (e) => {
    e.preventDefault();
    atualizarTabelaReceitas();
  });

  busca?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      atualizarTabelaReceitas();
    }
  });

  const agora = new Date();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString().split('T')[0];
  const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0).toISOString().split('T')[0];
  if (filtroInicio) filtroInicio.value = inicioMes;
  if (filtroFim) filtroFim.value = fimMes;

  limpar?.addEventListener('click', (e) => {
    e.preventDefault();
    if (filtroInicio) filtroInicio.value = inicioMes;
    if (filtroFim) filtroFim.value = fimMes;
    if (valorMin) valorMin.value = '';
    if (valorMax) valorMax.value = '';
    if (filtroCategoria) filtroCategoria.value = '';
    if (filtroStatus) filtroStatus.value = '';
    if (busca) busca.value = '';
  });

  fetch(`${BASE_URL}/catTodosReceita`)
    .then(res => res.json())
    .then(data => {
      if (filtroCategoria) {
        filtroCategoria.innerHTML = '';
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Todas';
        filtroCategoria.appendChild(opt);
        data.forEach(catItem => {
          const option = document.createElement('option');
          option.value = catItem.catdes.toLowerCase();
          option.textContent = catItem.catdes;
          filtroCategoria.appendChild(option);
        });
      }
    })
    .catch(err => console.error('Erro carregando categorias', err));
});

document.addEventListener('DOMContentLoaded', () => {
  const repeat = document.getElementById('repeat');
  const container = document.getElementById('repeatContainer');
  if (repeat && container) {
    repeat.addEventListener('change', () => {
      container.style.display = repeat.checked ? 'block' : 'none';
    });
  }
});
