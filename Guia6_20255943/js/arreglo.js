// Accedemos al contenedor donde se mostrará los estudiantes
const containerArreglo = document.querySelector("#idContainerArreglo");
const containerArregloOrdenado = document.querySelector(
    "#idContainerArregloOrdenado"
);

// Accedemos a cada boton por medio de la API DOM
const btnAgregar = document.querySelector("#idBtnAgregar");
const btnOrdenar = document.querySelector("#idBtnOrdenar");

// Agregamos el evento click a los botones, adicionalmente
// se le asigna la funcion que realizará la operación
btnAgregar.addEventListener("click", agregarElemento);
btnOrdenar.addEventListener("click", ordenarElementos);

let arreglo = new Array();

function agregarElemento() {
    const numero = parseInt(document.querySelector("#inputNumero").value);
    // Verificando que sea un número
    if (isNaN(numero)) {
        alert("Debe ingresar un número válido")
    } else {
        // Agregaremos un nuevo elemento al arreglo
        arreglo.push(numero);

        // Utilizaremos la API DOM para crear un elemento html
        let caja = document.createElement("div"); // Creamos un elemento <div></div>
        caja.className = "col-md-1 colum"; // Agregamos una clase al elemento <div></div>
        let valor = document.createElement("h3"); // Creamos un elemento <h3></h3>
        valor.textContent = numero; // Agregamos texto al elemento <h3></h3>
        caja.appendChild(valor); // Le pasamos como hijo la etiqueta <h3></h3> a nuestro <div></div>

        // Insertamos los nuevos elementos en el contenedor
        // se utiliza beforteend par insertar el nuevo
        // elemento dentro del idContainerArreglo y después de su tulimo hijo
        containerArreglo.insertAdjacentElement("beforeend", caja);
    }
}

function ordenarElementos() {
    // Utilizaremos un for...of para recorrer el arreglo
    // a su vez se utilizara .sort() para ordenarlo
    for (let i of arreglo.sort()) {
        let caja = document.createElement("div");
        caja.className = "col-md-1 colum-green";
        let valor = document.createElement("h3");
        valor.textContent = i;
        caja.appendChild(valor);
        containerArregloOrdenado.insertAdjacentElement("beforeend", caja);
    }
}