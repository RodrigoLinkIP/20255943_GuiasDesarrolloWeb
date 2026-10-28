// Otra forma de acceder a un elemento HTML es utilizando el getElementById del DOM
// Notesé que para este caso no se antepone el carácteer #
const campo = document.getElementById("idTxtNumero");

// Definamos una funcion anonima que permita validar en tiempo real el ingreso de un numero
const validarNumero = function (e) {
    // Creamos una expresión regular que valida que sean números
    let validar = /^[0-9]{1}$/;
    let tecla = e.key;

    /*
    .test válida que la expresión regular coincida con el valor ingresado
    podr+a observar que al intentar teclar una letra uy otro caracter diferente
    a un número este no se escribe en el campo
    */
   if (!validar.test(tecla)) e.preventDefault();
};

// Definiendo el evento keypress para el campo
campo.addEventListener("keypress", validarNumero);

// Trabajando con el boton Calcular
const boton = document.getElementById("idBtnCalcular");

// Definiendo una funcoón anonima para calcular el factorial de un número
function calcularFactorial(numero) {
    return numero < 2 ? 1 : numero * calcularFactorial(numero - 1);
}

// Definamos una funcoón de tipo flecha para imprimir el resultado del factorial
const imprimir = (numero, resultado) => {
    const contenedor = document.getElementById("idDivResultado");
    contenedor.innerHTML = `El factorial de ${numero}! es ${resultado}`;
};

function calcular() {
    let numero = document.getElementById("idTxtNumero").value;
    if (numero != "") {
        //  Llamamos a la funcion anonima para que calcule el factorial
        let resultado = calcularFactorial(numero);
        // Enviando el resultado a una funcion de tipo flecha
        imprimir(numero, resultado);
    } else {
        alert("Debe de ingresar un numero válido");
    }
}

// Definiendo el evento click para el boton
boton.addEventListener("click", calcular);