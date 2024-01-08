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
let http_request = new XMLHttpRequest();


botonEnvio.addEventListener("click", enviarForm);

//Llamo a la función enviar form para comprobar la cookie y el localStorage nada más abrir la página
enviarForm();
    

function request(city, country) {
    try {
        http_request.open('GET', "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + country + "&units=metric&lang=es&appid=" + apiKey, true);
        http_request.onreadystatechange = () => {
            if (http_request.status === 404) {
                // Manejar el error 404 específicamente
                alerta.classList.remove("oculto");
                //Si la api devuelve error por se una ciudad/pais inexistente elimino la cookie y borro el localStorage
                deleteCookie("ciudadPais");
                localStorage.clear();
                //Se muestra durante 5s que el mensaje de error y luego se oculta
                setTimeout(function () {
                    alerta.classList.add("oculto");
                }, 5000);
            } else {
                if (http_request.readyState == 4) {
                    if (http_request.status == 200) {
                        //Si la respuesta a la petición de la API es correcta parseo la respuesta y la almaceno en una variable
                        respuesta = JSON.parse(http_request.responseText);
                        dibujarCard();
                    }
                }
            }
        };
        http_request.send();
    } catch (error) {
        console.log("Error con la api: " + error);
    }
}

// Función para obtener el valor de una cookie por su nombre
function getCookie(cookieName) {
    // Divide la cadena de cookies en pares clave-valor
    let cookies = document.cookie.split('; ');

    // Itera a través de los pares y busca el valor de la cookie deseada
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].split('=');
        if (cookie[0] === cookieName) {
            return cookie[1];
        }
    }

    // Devuelve null si la cookie no se encuentra
    return null;
}

// Función para eliminar una cookie por su nombre
function deleteCookie(cookieName) {
    // Configura la fecha de expiración en el pasado
    let pastDate = new Date(0);
    
    // Convierte la fecha de expiración a un formato UTC string
    let pastDateUTCString = pastDate.toUTCString();

    // Establece la cookie con una fecha de expiración en el pasado, lo que la eliminará
    document.cookie = cookieName + "=; expires=" + pastDateUTCString + "; path=/";
}

function crearCookie(city, country){
    //Creo la cookie con poner 3600 en el max-age hago que dure una hora
    document.cookie = `ciudadPais=${city},${country}; max-age=3600; path=/`;
    localStorage.setItem("Ciudad", city);
    localStorage.setItem("Pais", country);
}
function enviarForm() {
    //Defino el valor de los input
    let pais = document.querySelector("input[name='pais']").value;
    let ciudad = document.querySelector("input[name='ciudad']").value;
    if (ciudad != "" && pais != "") {
        //Si los inputs no estan vacios limpio el localSotorage y creo la cookie con los valores de los inputs
        localStorage.clear();
        crearCookie(ciudad,pais);
    } else {
        //Si estan vacios creo la cookie por defecto.
        if (getCookie("ciudadPais")== null) {
            localStorage.clear();
            crearCookie("Salamanca","ES");
        }
    }
    let cookieValue = getCookie("ciudadPais");

    if (cookieValue !== null) {
        //Divido la ciudad del pais
        let valorCookie=cookieValue.split(',');
        //Los guardo en el localStorage
        localStorage.setItem("Ciudad", valorCookie[0]);
        localStorage.setItem("Pais", valorCookie[1]);
        //Y llamo a request con los valores de la cookie
        request(valorCookie[0], valorCookie[1]);
    } else {
        console.log("La cookie no se encontró o ha expirado.");
    }
}
function dibujarCard() {
    //Muestro la imagen de la api
    img.setAttribute("src", "http://openweathermap.org/img/w/" + respuesta.weather[0].icon + ".png");
    //Relleno la información de la tarjeta según los datos de la api.
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
