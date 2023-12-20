const apiKey = "yourKey";
const botonEnvio = document.querySelector("button[type='submit']");
let card = document.querySelector("#card-tiempo");
let ciudadyPais = document.querySelector("h3");
let descripcion = document.querySelector("#descripcion");
let temperatura = document.querySelector("#temperatura h4");
let maxtemperatura = document.querySelector("#max-temperatura");
let mintemperatura = document.querySelector("#min-temperatura");
let img= document.querySelector("#imagen-tiempo");
let humedad = document.querySelector("#humedad");
let salida = document.querySelector("#salida");
let puesta = document.querySelector("#puesta");
let fecha=document.querySelector("#fecha");
let alerta=document.querySelector("#alerta");
let paisStorage="";
let ciudadStorage="";
let respuesta = "";
let respuesta3 = "";
let errorVar=false;
// let paisStorage="ES";
// let ciudadStorage="Salamanca";

botonEnvio.addEventListener("click", enviarForm);
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

    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
        http_request = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) { // IE
        http_request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // if (respuesta.cod=="401") {
        
        // }
        paisStorage = localStorage.getItem("Pais");
        ciudadStorage = localStorage.getItem("Ciudad");
        document.cookie=`ciudadPais=${ciudadStorage},${paisStorage}`;
        try {
            http_request.open('GET', "https://api.openweathermap.org/data/2.5/weather?q=" + ciudadStorage + "," + paisStorage + "&units=metric&lang=es&appid=" + apiKey, true);
            
        } catch (error) {
            
        }
        http_request.onreadystatechange = () => {
            if (http_request.status === 404) {
                errorVar=true;
                // Manejar el error 404 específicamente
                alerta.classList.remove("oculto");
                setTimeout(function () {
                    alerta.classList.add("oculto");
                }, 5000);
            }else{
                
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

}
function dibujarCard() {
    // card.classList.toggle("oculto");
    
    img.setAttribute("src","http://openweathermap.org/img/w/"+respuesta.weather[0].icon+".png");
    ciudadyPais.textContent=respuesta.name+","+respuesta.sys.country;
    let fechaSinForm=moment.unix(respuesta.dt).format('LLLL');
    let salida1=moment.unix(respuesta.sys.sunrise).format('LTS');
    let puesta1=moment.unix(respuesta.sys.sunset).format('LTS');
    fecha.textContent="Fecha: "+fechaSinForm;
    descripcion.textContent=respuesta.weather[0].description;
    temperatura.textContent=respuesta.main.temp+"ºC";
    maxtemperatura.textContent="Max: "+respuesta.main.temp_max+"ºC";
    mintemperatura.textContent="Min: "+respuesta.main.temp_min+"ºC";
    humedad.textContent="Humedad: "+respuesta.main.humidity+"%";
    salida.textContent="Salida: "+salida1;
    puesta.textContent="Puesta: "+puesta1;
}
function error() {
    alerta.classList.remove("oculto");
    alerta.classList.add("oculto");
}