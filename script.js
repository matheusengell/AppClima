const chaveApi = "0e8583297321fdffa0fa366ab485f322";  
const inputCidade = document.getElementById("nomeCidade");
const botaoPesquisar = document.querySelector("button"); 
const cidadeElemento = document.getElementById("cidade");

const dadosClimaElemento = document.getElementById("temperatura"); 

function buscarClima(cidade) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chaveApi}&lang=pt_br&units=metric`;

    cidadeElemento.textContent = `Buscando clima em ${cidade}...`;
    dadosClimaElemento.textContent = "";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: Cidade '${cidade}' não encontrada.`);
            }  
            return response.json();
        })
        .then(data => {
            const temperatura = data.main.temp;
            const descricao = data.weather[0].description;
            const nomeCidade = data.name;

            cidadeElemento.textContent = nomeCidade;
            
            dadosClimaElemento.innerHTML = 
                `${Math.round(temperatura)}°C <br><span class="text-xl capitalize">${descricao}</span>`; 

        })
        .catch(error => {
            console.error("Erro:", error);
            cidadeElemento.textContent = "Erro na Busca";
            dadosClimaElemento.textContent = error.message;
        });
}

function acaoPesquisar() {
    const cidadeDigitada = inputCidade.value.trim(); 
    if (cidadeDigitada) {
        buscarClima(cidadeDigitada);
    } else {
        cidadeElemento.textContent = "Atenção!";
        dadosClimaElemento.textContent = "Por favor, digite o nome de uma cidade.";
    }
}

botaoPesquisar.addEventListener("click", acaoPesquisar);

inputCidade.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        acaoPesquisar();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    buscarClima("São Paulo");
});