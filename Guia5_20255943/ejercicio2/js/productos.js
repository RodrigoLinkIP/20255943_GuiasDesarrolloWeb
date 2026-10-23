const pedidos = [];
let precioMaximo = null;

const form = document.querySelector("#form-pedido");
const tbody = document.querySelector("#tbody");
const cantidadTotal = document.querySelector("#cantidadT");
const subtotalTotal = document.querySelector("#subtotalT");

const nombre = document.querySelector("#nombre");
const precio = document.querySelector("#precio");
const cantidad = document.querySelector("#cantidad");

const errorNombre = document.querySelector("#error-nombre");
const errorPrecio = document.querySelector("#error-precio");
const errorCantidad = document.querySelector("#error-cantidad");

const precioMaximoInput = document.querySelector("#precio-maximo");
const errorFiltro = document.querySelector("#error-filtro");
const btnFiltrar = document.querySelector("#btn-filtrar");
const btnTodos = document.querySelector("#btn-todos");
const btnLimpiar = document.querySelector("#btn-limpiar");

function validarNombre(valor) {
  return valor.trim() !== "";
}

function validarPrecio(valor) {
  return valor !== "" && Number(valor) > 0;
}

function validarCantidad(valor) {
  const numero = Number(valor);
  return valor !== "" && Number.isInteger(numero) && numero > 0;
}

function calcularSubtotal(pedido) {
  return pedido.precio * pedido.cantidad;
}

function mostrarTabla(lista) {
  tbody.innerHTML = "";

  lista.forEach(function (pedido, i) {
    tbody.innerHTML += `
            <tr>
                <th scope="row">${i + 1}</th>
                <td>${pedido.producto}</td>
                <td>$${pedido.precio.toFixed(2)}</td>
                <td>${pedido.cantidad}</td>
                <td>$${calcularSubtotal(pedido).toFixed(2)}</td>
            </tr>
        `;
  });
}

function mostrarTotales(lista) {
  let unidades = 0;
  let total = 0;

  lista.forEach(function (pedido) {
    unidades += pedido.cantidad;
    total += calcularSubtotal(pedido);
  });

  cantidadTotal.textContent = unidades;
  subtotalTotal.textContent = "$" + total.toFixed(2);
}

function mostrarError(input, error, mensaje) {
  input.classList.toggle("is-invalid", mensaje !== "");
  error.textContent = mensaje;
}

function actualizarVista() {
  let lista = pedidos;

  if (precioMaximo !== null) {
    lista = pedidos.filter(function (pedido) {
      return pedido.precio <= precioMaximo;
    });
  }

  mostrarTabla(lista);
  mostrarTotales(lista);
}

form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nombreValido = validarNombre(nombre.value);
  const precioValido = validarPrecio(precio.value);
  const cantidadValida = validarCantidad(cantidad.value);

  mostrarError(
    nombre,
    errorNombre,
    nombreValido ? "" : "Escriba el nombre del producto.",
  );

  mostrarError(
    precio,
    errorPrecio,
    precioValido ? "" : "El precio debe ser mayor que cero.",
  );

  mostrarError(
    cantidad,
    errorCantidad,
    cantidadValida ? "" : "La cantidad debe ser un entero positivo.",
  );

  if (!nombreValido || !precioValido || !cantidadValida) {
    return;
  }

  pedidos.push({
    producto: nombre.value.trim(),
    precio: Number(precio.value),
    cantidad: Number(cantidad.value),
  });

  form.reset();
  actualizarVista();
});

btnFiltrar.addEventListener("click", function () {
  const valor = precioMaximoInput.value;

  if (valor === "" || Number(valor) < 0) {
    mostrarError(
      precioMaximoInput,
      errorFiltro,
      "Ingrese un precio máximo válido.",
    );
    return;
  }

  mostrarError(precioMaximoInput, errorFiltro, "");
  precioMaximo = Number(valor);

  actualizarVista();
});

btnTodos.addEventListener("click", function() {
    precioMaximo = null;
    precioMaximoInput.value = "";

    mostrarError(precioMaximoInput, errorFiltro, "");
    actualizarVista();
});

btnLimpiar.addEventListener("click", function() {
    pedidos.length = 0;
    precioMaximo = null;
    precioMaximoInput.value = "";

    mostrarError(precioMaximoInput, errorFiltro, "");
    actualizarVista();
});