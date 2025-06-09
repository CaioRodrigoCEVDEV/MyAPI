document.addEventListener("DOMContentLoaded", function () {
    const saldoSpan = document.getElementById("saldo");
    const toggle = document.getElementById("toggleSaldo");
    let saldoValor = null;
    // Mantém a escolha do usuário entre carregamentos
    let visivel = localStorage.getItem("saldoVisivel") === "true";

    function atualizarExibicao() {
        if (!visivel) {
            saldoSpan.innerText = "****";
            if (toggle) {
                toggle.classList.remove("fa-eye-slash");
                toggle.classList.add("fa-eye");
            }
        } else {
            saldoSpan.innerText = saldoValor !== null ? saldoValor : "Indisponível";
            if (toggle) {
                toggle.classList.remove("fa-eye");
                toggle.classList.add("fa-eye-slash");
            }
        }
    }

    // Ajusta a exibição logo após definir a variável
    atualizarExibicao();

    if (toggle) {
        toggle.addEventListener("click", function () {
            visivel = !visivel;
            localStorage.setItem("saldoVisivel", visivel);
            atualizarExibicao();
        });
    }

    fetch('/api/dadosUserLogado')
        .then(res => res.json())
        .then(dados => {
            return fetch(`${BASE_URL}/contaSaldo/${dados.usucod}`);
        })
        .then(res => res.json())
        .then(dados => {
            if (dados.length > 0 && dados[0].contas_saldo) {
                saldoValor = parseFloat(dados[0].contas_saldo).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
            atualizarExibicao();
        })
        .catch(erro => {
            console.error("Erro ao buscar saldo:", erro);
            saldoValor = "Erro";
            atualizarExibicao();
        });
});
