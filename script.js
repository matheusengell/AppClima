const cidade = "São Paulo";
const chaveApi = "0e8583297321fdffa0fa366ab485f322";  
const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chaveApi}&lang=pt_br&units=metric`;

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao buscar dados do clima");
        }   
        return response.json();
    })
    .then(data => {
        const nomeCidade = data.name;
        const temperatura = Math.round(data.main.temp);
        const descricaoClima = data.weather[0].description;
        const iconeClima = data.weather[0].icon;
        const umidade = data.main.humidity;
    })
    .catch(error => {
        console.error("Erro:", error);
    });

        