// Constantes
const API = "https://randomuser.me/api/";
const NACIONALITY_PARAM = "?nat=es,fr,us,no,nl";
const RESULTS_PARAM = "&results=";
const LARGE = "large";
const MEDIUM = "medium";
const SMALL = "small";
const NONE = "none";
const LESS_THAN_25 = "lt25";
const BETWEEN_25_AND_35 = "25to35";
const BETWEEN_35_AND_45 = "35to45";
const MORE_THAN_45 = "mt45";

// Variables
var number;
var size;
var people = [];
var gender;
var age;
var nationality;

$(document).ready(() => {
    // Inicializamos los valores
    number = $('input[name=num-img]:checked').val();
    size = $('input[name=size-img]:checked').val();
    gender = $("#gender").val();
    age = $("#age").val();
    nationality = $("#nationality").val();

    // Inicializamos el acordeón
    $("#accordion").accordion();

    // Inicializamos los botones
    $("#search-btn, #config-btn").click(e => optionsToggle());
    $("#filter").click(e => {
        if(checkFilters()) {
            drawPictures();
        } else {
            $("#modal-error").modal();
        }        
    });

    // Inicializamos los radiobutton
    $(".img-number").click(e => {
        number = $(e.target).val();
        loadPeople();
    });
    $(".img-size").click(e => {
        size = $(e.target).val();
        loadPeople();
    });

    // Inicializamos los select
    $("#gender").change(e => gender = $(e.target).val());
    $("#age").change(e => age = $(e.target).val());
    $("#nationality").change(e => nationality = $(e.target).val());

    // Y realizamos la carga inicial
    loadPeople();
});

/**
 * Comprueba que tenemos algún filtro seleccionado
 */
function checkFilters() {
    return $("#gender").val() != NONE || $("#age").val() != NONE || $("#nationality").val() != NONE;
}

/**
 * Esta función se encarga de llamar al api y obtener los resultados.
 */
function loadPeople() {
    // En cada búsqueda, reiniciamos los filtros.
    $("#gender").val(NONE);
    $("#age").val(NONE);
    $("#nationality").val(NONE);
    // Y los valores
    gender = NONE;
    age = NONE;
    nationality = NONE;

    $.ajax({
        url: API + NACIONALITY_PARAM + RESULTS_PARAM + number,
        dataType: 'json',
        success: data => {
            console.log(data.results);
            people = data.results;
            drawPictures();
        },
        error: err => {
            console.log("ERROR: " + err);
        }
      });
}

/**
 * Esta función filtra las imágenes obtenidas según los valores de los select
 */
function filterPeople() {
    let filtered = [];  // Aquí guardaremos los que cumplen los criterios
    let invalid = [];   // Aquí iremos almacenando los índices que no cumplen las condiciones
    // Y analizamos
    for(let i=0; i<people.length; i++) {
        // Por sexo
        if(gender != NONE) {
            if(people[i].gender != gender && invalid.indexOf(i) == -1) invalid.push(i);
        }
        // Por país
        if(nationality != NONE) {
            if(people[i].nat != nationality && invalid.indexOf(i) == -1 ) invalid.push(i);
        }
        // Por rango de edad
        if(age != NONE) {
            switch(age) {
                case LESS_THAN_25:
                    if(people[i].dob.age >= 25 && invalid.indexOf(i) == -1) invalid.push(i);
                    break;
                case BETWEEN_25_AND_35:
                    if((people[i].dob.age < 25 || people[i].dob.age > 35) && invalid.indexOf(i) == -1) invalid.push(i);
                    break;
                case BETWEEN_35_AND_45:
                    if((people[i].dob.age <=35 || people[i].dob.age > 45) && invalid.indexOf(i) == -1) invalid.push(i);
                    break;
                case MORE_THAN_45:
                    if(people[i].dob.age <= 45 && invalid.indexOf(i) == -1) invalid.push(i);
            }
        }
    }

    // Llegados a este punto, tengo un array con los índices de las personas que no cumplen los criterios
    for(let i=0; i<people.length; i++) {
        // Asi que copio todos los que no estén en dicho array
        if(invalid.indexOf(i) == -1) filtered.push(people[i]);
    }

    // Y devuelvo el resultado.
    console.log(filtered);
    return filtered;
}

/**
 * Esta función se encarga de dibujar las imágenes en el holder
 */
function drawPictures() {
    // Filtramos según los select que tengamos
    let filtered = filterPeople();    

    // Vaciamos el holder
    $("#img-holder").html("");

    // Y los dibujamos
    for(let person of filtered) {
        let img = $("<img />");
        switch(size) {
            case LARGE:
                img.attr("src", person.picture.large);
                break;
            case MEDIUM:
                img.attr("src", person.picture.medium);
                break;
            case SMALL:
                img.attr("src", person.picture.thumbnail);
                break;
        }
        $("#img-holder").append(img);
    }
}

function optionsToggle() {
    $("#search").toggle();
    $("#config").toggle();
}