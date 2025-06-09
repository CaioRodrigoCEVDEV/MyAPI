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
                saldo.innerText = "Indisponível";
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar saldo:", erro);
            document.getElementById("saldo").innerText = "Erro";
        });
});
