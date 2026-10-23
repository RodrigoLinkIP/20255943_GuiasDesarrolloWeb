// ---------- Datos ----------
const pedidos = [];
let precioMaximo = null; // null = sin filtro (el filtro no modifica "pedidos")

// ---------- Elementos del HTML ----------
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

// ---------- Validaciones (solo datos, sin tocar el HTML) ----------
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

// ---------- Cálculos (solo datos, usando map / filter / reduce) ----------
function subtotal(pedido) {
  return pedido.precio * pedido.cantidad;
}

function filtrarPorPrecio(lista, maximo) {
  return maximo === null ? lista : lista.filter((p) => p.precio <= maximo);
}

function totalUnidades(lista) {
  return lista.reduce((acum, p) => acum + p.cantidad, 0);
}

function montoTotal(lista) {
  return lista.map(subtotal).reduce((acum, s) => acum + s, 0);
}

// ---------- Actualización del HTML ----------
function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function mostrarTabla(lista) {
  tbody.innerHTML = lista
    .map(
      (p, i) => `<tr>
                   <th scope="row">${i + 1}</th>
                   <td>${escaparHTML(p.producto)}</td>
                   <td>$${p.precio.toFixed(2)}</td>
                   <td>${p.cantidad}</td>
                   <td>$${subtotal(p).toFixed(2)}</td>
                 </tr>`
    )
    .join("");
}

function mostrarTotales(lista) {
  cantidadTotal.textContent = totalUnidades(lista);
  subtotalTotal.textContent = "$" + montoTotal(lista).toFixed(2);
}

function marcarError(input, divError, mensaje) {
  input.classList.toggle("is-invalid", mensaje !== "");
  divError.textContent = mensaje;
}

function actualizarVista() {
  const visibles = filtrarPorPrecio(pedidos, precioMaximo);
  mostrarTabla(visibles);
  mostrarTotales(visibles);
}

// ---------- Eventos ----------
form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nombreOk = validarNombre(nombre.value);
  const precioOk = validarPrecio(precio.value);
  const cantidadOk = validarCantidad(cantidad.value);

  marcarError(nombre, errorNombre, nombreOk ? "" : "El nombre del producto es obligatorio.");
  marcarError(precio, errorPrecio, precioOk ? "" : "El precio debe ser mayor que cero.");
  marcarError(cantidad, errorCantidad, cantidadOk ? "" : "La cantidad debe ser un entero positivo.");

  if (!nombreOk || !precioOk || !cantidadOk) return;

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
  const valido = valor !== "" && Number(valor) >= 0;

  marcarError(precioMaximoInput, errorFiltro, valido ? "" : "Ingrese un precio máximo válido.");
  if (!valido) return;

  precioMaximo = Number(valor);
  actualizarVista();
});

btnTodos.addEventListener("click", function () {
  precioMaximo = null;
  precioMaximoInput.value = "";
  marcarError(precioMaximoInput, errorFiltro, "");
  actualizarVista();
});

btnLimpiar.addEventListener("click", function () {
  pedidos.length = 0; // vacía el mismo arreglo
  precioMaximo = null;
  precioMaximoInput.value = "";
  marcarError(precioMaximoInput, errorFiltro, "");
  actualizarVista();
});

actualizarVista();
