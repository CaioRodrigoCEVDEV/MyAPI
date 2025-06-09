document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/dadosUserLogado')
        .then(res => res.json())
        .then(dados => {

            return fetch(`${BASE_URL}/contaSaldo/${dados.usucod}`)
        })
        .then(res => res.json())
        .then(dados => {
            const saldo = document.getElementById("saldo");

            if (dados.length > 0 && dados[0].contas_saldo) {
                const valor = parseFloat(dados[0].contas_saldo);
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
            document.getElementById("saldo").innerText = "Erro";
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
            document.getElementById("saldo").innerText = "Erro";
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
            document.getElementById("saldo").innerText = "Erro";
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
            document.getElementById("saldo").innerText = "Erro";
        });
});
