const chaveApi = "0e8583297321fdffa0fa366ab485f322";  
const inputCidade = document.getElementById("nomeCidade");
const botaoPesquisar = document.querySelector("button"); 
const cidadeElemento = document.getElementById("cidade");
const dadosClimaElemento = document.getElementById("temperatura"); 
const cardPrincipal = document.getElementById("cardTemperatura");
const card = document.getElementById("card");
 const cards = document.querySelectorAll(".card-previsao");

function traduzirEmoji(clima) {
    const dicionarioEmojis = {
        "Clear": "☀️",
        "Clouds": "☁️",
        "Rain": "🌧️",
        "Drizzle": "🌦️",
        "Thunderstorm": "⛈️",
        "Snow": "❄️",
        "Mist": "🌫️",
        "Smoke": "💨"
    };
    return dicionarioEmojis[clima] || "🌡️";
}

function alterarDiaNoite(isNoite) {
    if (isNoite) {
        document.body.classList.add('noite');
        document.body.classList.remove('dia');
    } else {
        document.body.classList.add('dia');
        document.body.classList.remove('noite');
    }
}

function buscarClima(cidade) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chaveApi}&lang=pt_br&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Cidade não encontrada");
            return response.json();
        })
        .then(data => {
            const condicao = data.weather[0].main; 
            const emoji = traduzirEmoji(condicao);
            const temp = Math.round(data.main.temp);

            const mensagem = gerarSugestao(condicao, temp);

            document.getElementById("sugestao").textContent = mensagem;

            
            const noite = data.weather[0].icon.includes('n');
            const periodo = noite ? 'noite' : 'dia';

            cardPrincipal.classList.remove("Clear", "Clouds", "Rain", "Drizzle", "Thunderstorm", "Snow", "Mist", "Smoke", "dia", "noite");
            cardPrincipal.classList.add(condicao, periodo);
            
            alterarDiaNoite(noite);

            cidadeElemento.textContent = `${data.name} ${emoji}`;
            dadosClimaElemento.innerHTML = 
                `${Math.round(data.main.temp)}°C <br><span class="text-xl capitalize">${data.weather[0].description}</span>`; 
        })
        .catch(error => {
            cidadeElemento.textContent = "Erro na Busca";
            dadosClimaElemento.textContent = error.message;
        });
}

function gerarSugestao(condicao, temp) {
    if (condicao === "Rain" || condicao === "Drizzle" || condicao === "Thunderstorm") {
        return "🌧️ Leve um guarda-chuva!";
    }
    
    if (condicao === "Clear") {
        if (temp > 25) return "☀️ Ideal para uma caminhada ou praia!";
        if (temp < 15) return "❄️ Tempo fresquinho, bom para um café.";
        return "😎 O dia está lindo, aproveite lá fora!";
    }

    if (condicao === "Clouds") {
        if (temp < 18) return "🎬 Tempo ótimo para assistir um filme em casa.";
        return "☁️ O dia está nublado, mas agradável.";
    }

    return "🌡️ Aproveite o seu dia!";
}

async function buscarClimaProximosDias(cidade) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${chaveApi}&lang=pt_br&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const lista3Dias = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);
        const cards = document.querySelectorAll(".card-previsao");

        lista3Dias.forEach((dia, index) => {
            if (cards[index]) {
                const elementoCard = cards[index];
                const iconCode = dia.weather[0].icon; 

                if (iconCode.includes('n')) {
                    elementoCard.classList.add('noite');
                    elementoCard.classList.add('text-white'); 
                } else {
                    elementoCard.classList.remove('noite');
                    elementoCard.classList.remove('text-white');
                }
                const dataObj = new Date(dia.dt * 1000);
                const nomeDia = dataObj.toLocaleDateString('pt-BR', { weekday: 'long' });
                const condicao = dia.weather[0].main;
                const emoji = traduzirEmoji(condicao);
                
                cards[index].querySelector(".dia-semana").textContent = nomeDia.split('-')[0].toUpperCase();
                cards[index].querySelector(".temp-previsao").textContent = `${Math.round(dia.main.temp)}°C`;
                
                cards[index].querySelector(".descricao-previsao").textContent = `${emoji} ${dia.weather[0].description}`;
            }
        });
    } catch (error) {
        console.error("Erro ao buscar previsão:", error);
    }
}    

function acaoPesquisar() {
    const cidadeDigitada = inputCidade.value.trim(); 
    if (cidadeDigitada) {
        buscarClima(cidadeDigitada);
        buscarClimaProximosDias(cidadeDigitada);
    }
}

botaoPesquisar.addEventListener("click", acaoPesquisar);
inputCidade.addEventListener("keypress", (e) => { if (e.key === 'Enter') acaoPesquisar(); });

document.addEventListener("DOMContentLoaded", () => {
    buscarClima("São Paulo");
    buscarClimaProximosDias("São Paulo");
});