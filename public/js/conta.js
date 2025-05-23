
        document.addEventListener("DOMContentLoaded", function () {
            fetch("http://localhost:3000/conta")
                .then(res => res.json())
                .then(dados => {
                    const corpoTabela = document.getElementById("corpoTabela");
                    corpoTabela.innerHTML = ""; // Limpa o conteúdo atual da tabela

                    dados.forEach(dado => {
                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                        <td>${dado.contades}</td>
                        <td>${dado.contatipodes}</td>
                        <td>${dado.contavltotal}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="deletar(${dado.contacod})">Deletar</button>
                        </td>

                    `;
                        corpoTabela.appendChild(tr);
                    });
                })
                .catch(erro => console.error(erro));
        });

    // delete
                window.deletar = function (id) {
                    fetch(`http://localhost:3000/conta/${id}`, {
                        method: "DELETE"
                    })
                        .then(res => res.json())
                        .then(resposta => {
                            alert("Registro deletado com sucesso!");
                            // Atualiza a tabela após a exclusão
                            document.getElementById("corpoTabela").innerHTML = "";
                            location.reload();
                        })
                        .catch(erro => {
                            alert("Erro ao deletar o registro.");
                            console.error(erro);
                        });
                };


        document.addEventListener("DOMContentLoaded", function () {
            fetch('http://localhost:3000/conta')
                .then(response => response.json())
                .then(data => {
                    const select = document.getElementById("tipoConta");

                    data.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.tccod;
                        option.textContent = item.tcdes;
                        select.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error("Erro ao carregar tipos de cobrança:", error);
                });
        });
        // post
        document.getElementById("meuFormulario").addEventListener("submit", function (e) {
            e.preventDefault();

            const form = e.target;
            const formData = new FormData(form);

            const data = Object.fromEntries(formData.entries());

            fetch("http://localhost:3000/conta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(resposta => {
                    alert("Dados salvos com sucesso!");
                    console.log(resposta);
                    location.reload();
                })
                .catch(erro => {
                    alert("Erro ao salvar os dados.");
                    console.error(erro);
                });
        });