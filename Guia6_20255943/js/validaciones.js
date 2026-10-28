
const inputCarnet = document.getElementById("idCarnet");
const inputNombreCompleto = document.getElementById("idNombreCompleto");
const inputDUI = document.getElementById("idDUI");
const inputNIT = document.getElementById("idNIT");
const inputFechaNacimiento = document.getElementById("idFechaNacimiento");
const inputCorreo = document.getElementById("idCorreo");
const inputEdad = document.getElementById("idEdad");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");

const notificacion = document.getElementById("idNotificacion");
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

let indiceEditar = null;

const validarNumero = function (e) {
  let validar = /^[0-9]$/;
  let tecla = e.key;

  if (!validar.test(tecla)) {
    e.preventDefault();
  }
};

const validarLetra = function (e) {
  let validar = /^[\p{L}\s]$/u;
  let tecla = e.key;

  if (!validar.test(tecla)) {
    e.preventDefault();
  }
};

const validarEmail = () => {
  let validarCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let correo = inputCorreo.value;

  return validarCorreo.test(correo);
};

inputDUI.addEventListener("input", () => {
  let dui = inputDUI.value.replace(/\D/g, "").slice(0, 9);

  inputDUI.value =
    dui.length > 8
      ? dui.slice(0, 8) + "-" + dui.slice(8)
      : dui;
});

inputNIT.addEventListener("input", () => {
  let nit = inputNIT.value.replace(/\D/g, "").slice(0, 14);

  inputNIT.value =
    nit.length > 13
      ? nit.slice(0, 4) + "-" +
        nit.slice(4, 10) + "-" +
        nit.slice(10, 13) + "-" +
        nit.slice(13)
      : nit.length > 10
        ? nit.slice(0, 4) + "-" +
          nit.slice(4, 10) + "-" +
          nit.slice(10)
        : nit.length > 4
          ? nit.slice(0, 4) + "-" + nit.slice(4)
          : nit;
});

inputCarnet.addEventListener("input", () => {
  let letras = inputCarnet.value
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 2);

  let numeros = inputCarnet.value
    .replace(/\D/g, "")
    .slice(0, 3);

  inputCarnet.value =
    inputCarnet.value.length < 2
      ? letras
      : letras + numeros;
});

inputNombreCompleto.addEventListener("keypress", validarLetra);
inputEdad.addEventListener("keypress", validarNumero);

const mostrarMensaje = (texto) => {
  mensaje.textContent = texto;
  toast.show();
};

const limpiarForm = () => {
  inputCarnet.value = "";
  inputNombreCompleto.value = "";
  inputDUI.value = "";
  inputNIT.value = "";
  inputFechaNacimiento.value = "";
  inputCorreo.value = "";
  inputEdad.value = "";

  indiceEditar = null;
  buttonAgregarPaciente.textContent = "Agregar estudiante";

  inputCarnet.focus();
};

const obtenerEstudiante = () => {
  return {
    carnet: inputCarnet.value.trim(),
    nombre: inputNombreCompleto.value.trim(),
    dui: inputDUI.value.trim(),
    nit: inputNIT.value.trim(),
    edad: inputEdad.value.trim(),
    correo: inputCorreo.value.trim(),
    fechaNacimiento: inputFechaNacimiento.value
  };
};

const validarEstudiante = (estudiante) => {
  if (
    estudiante.carnet === "" ||
    estudiante.nombre === "" ||
    estudiante.dui === "" ||
    estudiante.nit === "" ||
    estudiante.edad === "" ||
    estudiante.correo === "" ||
    estudiante.fechaNacimiento === ""
  ) {
    mostrarMensaje("Faltan campos por completar");
    return false;
  }

  if (!validarEmail()) {
    mostrarMensaje("Ingresar adecuadamente el correo");
    return false;
  }

  return true;
};

const addEstudiante = () => {
  let estudiante = obtenerEstudiante();

  if (!validarEstudiante(estudiante)) {
    return;
  }

  let estudiantes =
    JSON.parse(localStorage.getItem("estudiantes")) || [];

  estudiantes.push(estudiante);

  localStorage.setItem(
    "estudiantes",
    JSON.stringify(estudiantes)
  );

  mostrarMensaje("Se ha registrado un nuevo estudiante");

  limpiarForm();
  imprimirEstudiantes();
};

const editarEstudiante = (indice) => {
  let estudiantes =
    JSON.parse(localStorage.getItem("estudiantes")) || [];

  let estudiante = estudiantes[indice];

  if (!estudiante) {
    mostrarMensaje("No se encontró el estudiante");
    return;
  }

  inputCarnet.value = estudiante.carnet;
  inputNombreCompleto.value = estudiante.nombre;
  inputDUI.value = estudiante.dui;
  inputNIT.value = estudiante.nit;
  inputFechaNacimiento.value = estudiante.fechaNacimiento;
  inputCorreo.value = estudiante.correo;
  inputEdad.value = estudiante.edad;

  indiceEditar = indice;

  buttonAgregarPaciente.textContent = "Guardar cambios";

  inputCarnet.focus();
};

const guardarEdicion = () => {
  let estudiante = obtenerEstudiante();

  if (!validarEstudiante(estudiante)) {
    return;
  }

  let estudiantes =
    JSON.parse(localStorage.getItem("estudiantes")) || [];

  if (
    indiceEditar === null ||
    !estudiantes[indiceEditar]
  ) {
    mostrarMensaje("No se encontró el estudiante");
    limpiarForm();
    return;
  }

  estudiantes[indiceEditar] = estudiante;

  localStorage.setItem(
    "estudiantes",
    JSON.stringify(estudiantes)
  );

  mostrarMensaje("Estudiante actualizado correctamente");

  limpiarForm();
  imprimirEstudiantes();
};

const eliminarEstudiante = (indice) => {
  let estudiantes =
    JSON.parse(localStorage.getItem("estudiantes")) || [];

  if (!estudiantes[indice]) {
    mostrarMensaje("No se encontró el estudiante");
    return;
  }

  if (confirm("¿Estás seguro de eliminar este estudiante?")) {
    estudiantes.splice(indice, 1);

    localStorage.setItem(
      "estudiantes",
      JSON.stringify(estudiantes)
    );

    if (indiceEditar === indice) {
      limpiarForm();
    } else if (indiceEditar !== null && indice < indiceEditar) {
      indiceEditar--;
    }

    mostrarMensaje("Estudiante eliminado correctamente");
    imprimirEstudiantes();
  }
};

function imprimirFilas() {
  let $fila = "";
  let estudiantes =
    JSON.parse(localStorage.getItem("estudiantes")) || [];

  estudiantes.forEach((element, indice) => {
    $fila += `
      <tr>
        <td class="text-center fw-bold">${indice + 1}</td>
        <td>${element.carnet}</td>
        <td>${element.nombre}</td>
        <td>${element.dui}</td>
        <td>${element.nit}</td>
        <td>${element.fechaNacimiento}</td>
        <td>${element.correo}</td>
        <td>
          <button
            id="idBtnEditar${indice + 1}"
            type="button"
            class="btn btn-primary"
            title="Editar estudiante"
          >
            <i class="bi bi-pencil-square"></i>
          </button>

          <button
            id="idBtnEliminar${indice + 1}"
            type="button"
            class="btn btn-danger"
            title="Eliminar estudiante"
          >
            <i class="bi bi-trash3-fill"></i>
          </button>
        </td>
      </tr>
    `;
  });

  return $fila;
}

const configurarBotones = () => {
  let estudiantes =
    JSON.parse(localStorage.getItem("estudiantes")) || [];

  estudiantes.forEach((estudiante, indice) => {
    let botonEditar = document.getElementById(
      `idBtnEditar${indice + 1}`
    );

    let botonEliminar = document.getElementById(
      `idBtnEliminar${indice + 1}`
    );

    if (botonEditar) {
      botonEditar.onclick = () => editarEstudiante(indice);
    }

    if (botonEliminar) {
      botonEliminar.onclick = () => eliminarEstudiante(indice);
    }
  });
};

const imprimirEstudiantes = () => {
  let $table = `
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Carnet</th>
            <th>Nombre completo</th>
            <th>DUI</th>
            <th>NIT</th>
            <th>Fecha nacimiento</th>
            <th>Correo</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          ${imprimirFilas()}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("idTablaPacientes").innerHTML = $table;

  configurarBotones();
};

buttonLimpiarPaciente.onclick = () => {
  limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
  if (indiceEditar !== null) {
    guardarEdicion();
  } else {
    addEstudiante();
  }
};

buttonMostrarPaciente.onclick = () => {
  imprimirEstudiantes();
};

limpiarForm();
imprimirEstudiantes();
