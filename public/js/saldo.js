function atualizarCampo(nome, valor) {
    const elementos = [];
    const porId = document.getElementById(nome);

    if (porId) {
        elementos.push(porId);
    }

    document.querySelectorAll(`[data-money="${nome}"]`).forEach((elemento) => {
        elementos.push(elemento);
    });

    elementos.forEach((elemento) => {
        elemento.innerText = valor;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/dadosUserLogado')
        .then(res => res.json())
        .then(dados => {

            return fetch(`${BASE_URL}/contaSaldo/${dados.usucod}`)
        })
        .then(res => res.json())
        .then(dados => {
            if (dados.length > 0 && dados[0].contas_saldo) {
                const valor = parseFloat(dados[0].contas_saldo);
                atualizarCampo("saldo", valor.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }));
            } else {
                atualizarCampo("saldo", "0,00");
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar saldo:", erro);
            atualizarCampo("saldo", "Erro");
        });
});


document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/dadosUserLogado')
        .then(res => res.json())
        .then(dados => {

            return fetch(`${BASE_URL}/doc/contaReceitaPendente/${dados.usucod}`)
        })
        .then(res => res.json())
        .then(dados => {
            const saldo = document.getElementById("receitaP");

            if (dados.length > 0 && dados[0].total) {
                const valor = parseFloat(dados[0].total);
                saldo.innerText = valor.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            } else {
                saldo.innerText = "0,00";
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar saldo:", erro);
            atualizarCampo("receitaP", "Erro");
        });
});

document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/dadosUserLogado')
        .then(res => res.json())
        .then(dados => {

            return fetch(`${BASE_URL}/doc/contaDespesaPendente/${dados.usucod}`)
        })
        .then(res => res.json())
        .then(dados => {
            const saldo = document.getElementById("despesaP");

            if (dados.length > 0 && dados[0].total_pendente_atual) {
                const valor = parseFloat(dados[0].total_pendente_atual);
                saldo.innerText = valor.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            } else {
                saldo.innerText = "0,00";
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar saldo:", erro);
            atualizarCampo("despesaP", "Erro");
        });
});



document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/dadosUserLogado')
        .then(res => res.json())
        .then(dados => {

            return fetch(`${BASE_URL}/doc/GastosHoje/${dados.usucod}`)
        })
        .then(res => res.json())
        .then(dados => {
            const saldo = document.getElementById("gastosNow");

            if (dados.length > 0 && dados[0].gastosnow) {
                const valor = parseFloat(dados[0].gastosnow);
                saldo.innerText = valor.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            } else {
                saldo.innerText = "0,00";
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar saldo:", erro);
            atualizarCampo("gastosNow", "Erro");
        });
});

document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/dadosUserLogado')
        .then(res => res.json())
        .then(dados => {

            return fetch(`${BASE_URL}/doc/totalSeguro/${dados.usucod}`)
        })
        .then(res => res.json())
        .then(dados => {
            const saldo = document.getElementById("totalSeguro");

            if (dados.length > 0 && dados[0].total_seguro) {
                const valor = parseFloat(dados[0].total_seguro);
                saldo.innerText = valor.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            } else {
                saldo.innerText = "0,00";
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar saldo:", erro);
            atualizarCampo("totalSeguro", "Erro");
        });
});
