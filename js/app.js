const apiKey = "274553f8f79e7d71d9e8378186ce7d79";
const botonEnvio = document.querySelector("button[type='submit']");
let card = document.querySelector("#card-tiempo");
let ciudadyPais = document.querySelector("h3");
let descripcion = document.querySelector("#descripcion");
let temperatura = document.querySelector("#temperatura h4");
let maxtemperatura = document.querySelector("#max-temperatura");
let mintemperatura = document.querySelector("#min-temperatura");
let img = document.querySelector("#imagen-tiempo");
let humedad = document.querySelector("#humedad");
let salida = document.querySelector("#salida");
let puesta = document.querySelector("#puesta");
let fecha = document.querySelector("#fecha");
let alerta = document.querySelector("#alerta");
let paisStorage = "";
let ciudadStorage = "";
let respuesta = "";
let respuesta3 = "";
let errorVar = false;
let http_request = new XMLHttpRequest();

// let paisStorage="ES";
// let ciudadStorage="Salamanca";

botonEnvio.addEventListener("click", enviarForm);

if (localStorage.getItem("Pais") != null && localStorage.getItem("Ciudad") != null) {
    request(localStorage.getItem("Ciudad"), localStorage.getItem("Pais"));
} else {
    request("Salamanca", "ES");
}

function request(city, country) {
    try {
        http_request.open('GET', "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + country + "&units=metric&lang=es&appid=" + apiKey, true);
        http_request.onreadystatechange = () => {
            if (http_request.status === 404) {
                errorVar = true;
                // Manejar el error 404 específicamente
                alerta.classList.remove("oculto");
                localStorage.clear();
                setTimeout(function () {
                    alerta.classList.add("oculto");
                }, 5000);
            } else {

                if (http_request.readyState == 4) {
                    if (http_request.status == 200) {
                        respuesta = JSON.parse(http_request.responseText);
                        // respuesta3 = JSON.stringify(respuesta);
                        console.log(respuesta);
                        console.log(respuesta.weather[0].description);
                        dibujarCard();
                    }
                }
            }
        };
        http_request.send();
    } catch (error) {
        console.log("Error: " + error);
    }
}


function enviarForm() {
    let pais = document.querySelector("input[name='pais']").value;
    let ciudad = document.querySelector("input[name='ciudad']").value;
    if (ciudad != "" && pais != "") {
        localStorage.clear();
        localStorage.setItem("Ciudad", ciudad);
        localStorage.setItem("Pais", pais);
    } else {
        localStorage.setItem("Ciudad", "Salamanca");
        localStorage.setItem("Pais", "ES");
    }
    paisStorage = localStorage.getItem("Pais");
    ciudadStorage = localStorage.getItem("Ciudad");
    document.cookie = `ciudadPais=${ciudadStorage},${paisStorage}`;
    request(localStorage.getItem("Ciudad"), localStorage.getItem("Pais"));

}
function dibujarCard() {
    img.setAttribute("src", "http://openweathermap.org/img/w/" + respuesta.weather[0].icon + ".png");
    ciudadyPais.textContent = respuesta.name + "," + respuesta.sys.country;
    let fechaSinForm = moment.unix(respuesta.dt).format('LLLL');
    let salida1 = moment.unix(respuesta.sys.sunrise).format('LTS');
    let puesta1 = moment.unix(respuesta.sys.sunset).format('LTS');
    fecha.textContent = "Fecha: " + fechaSinForm;
    descripcion.textContent = respuesta.weather[0].description;
    temperatura.textContent = respuesta.main.temp + "ºC";
    maxtemperatura.textContent = "Max: " + respuesta.main.temp_max + "ºC";
    mintemperatura.textContent = "Min: " + respuesta.main.temp_min + "ºC";
    humedad.textContent = "Humedad: " + respuesta.main.humidity + "%";
    salida.textContent = "Salida: " + salida1;
    puesta.textContent = "Puesta: " + puesta1;
}
function error() {
    alerta.classList.remove("oculto");
    alerta.classList.add("oculto");
}