
/* Accediendo a los elementos html */
const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
/* Componente de Bootstrap */
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

/* Componente modal */
const idModal = document.getElementById("idModal");

/* Arreglo global de pacientes */
let arrayPaciente = JSON.parse(localStorage.getItem("pacientes")) || [];
let indiceEditar = null;

/**
Creando una funcion para que limpie el formulario
siempre que se cargue la página o cuando se presiona
el boton limpiar del formulario
**/

const limpiarForm = () => {
    inputNombre.value = "";
    inputApellido.value = "";
    inputFechaNacimiento.value = "";
    inputRdMasculino.checked = false;
    inputRdFemenino.checked = false;
    cmbPais.value = 0;
    inputDireccion.value = "";
    inputNombrePais.value = "";

    indiceEditar = null;
    buttonAgregarPaciente.textContent = "Agregar paciente";

    inputNombre.focus();
};

/**
Función para validar el ingreso del paciente
**/

const addPaciente = () => {
    let nombre = inputNombre.value.trim();
    let apellido = inputApellido.value.trim();
    let fechaNacimiento = inputFechaNacimiento.value;
    let sexo =
        inputRdMasculino.checked == true
            ? "Hombre"
            : inputRdFemenino.checked == true
                ? "Mujer"
                : "";
    let pais = cmbPais.value;
    let labelPais = cmbPais.options[cmbPais.selectedIndex]?.text || "";
    let direccion = inputDireccion.value.trim();

    if (
        nombre != "" &&
        apellido != "" &&
        fechaNacimiento != "" &&
        sexo != "" &&
        pais != "" &&
        pais != "0" &&
        direccion != ""
    ) {
        let paciente = [
            nombre,
            apellido,
            fechaNacimiento,
            sexo,
            labelPais,
            direccion
        ];

        arrayPaciente.push(paciente);

        localStorage.setItem("pacientes", JSON.stringify(arrayPaciente));

        /* Asignando un mensaje a nuestra notificación */
        mensaje.innerHTML = "Se ha registrado un nuevo paciente";
        /* Llamando al componente de Bootstrap */
        toast.show();

        /* Limpiando formlario */
        limpiarForm();
        imrpimirPacientes();
    } else {
        /* Asignando un mensaje a nuestra notificación */
        mensaje.innerHTML = "Faltan campos por completar";
        /* Llamando el componente de Bootstrap */
        toast.show();
    }
};

/* Funcion que imprime la ficha de los pacientes registrados */
function imprimirFilas() {
    let $fila = "";
    let contador = 1;

    arrayPaciente.forEach((element) => {
        $fila += `
            <tr>
                <td scope="row" class="text-center fw-bold">${contador}</td>
                <td>${element[0]}</td>
                <td>${element[1]}</td>
                <td>${element[2]}</td>
                <td>${element[3]}</td>
                <td>${element[4]}</td>
                <td>${element[5]}</td>
                <td>
                    <button id="idBtnEditar${contador}" type="button" class="btn btn-primary" title="Editar">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button id="idBtnEliminar${contador}" type="button" class="btn btn-danger" title="Eliminar">
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                </td>
            </tr>
        `;

        contador++;
    });

    return $fila;
}

const imrpimirPacientes = () => {
    let $table = `
        <div class="table-responsive">
            <table class="table table-striped table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col" class="text-center" style="width:5%">#</th>
                        <th scope="col" class="text-center" style="width:15%">Nombre</th>
                        <th scope="col" class="text-center" style="width:15%">Apellido</th>
                        <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
                        <th scope="col" class="text-center" style="width:10%">Sexo</th>
                        <th scope="col" class="text-center" style="width:10%">Pais</th>
                        <th scope="col" class="text-center" style="width:25%">Dirección</th>
                        <th scope="col" class="text-center" style="width:10%">Opciones</th>
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

const editarPaciente = (indice) => {
    let paciente = arrayPaciente[indice];

    if (!paciente) return;

    inputNombre.value = paciente[0];
    inputApellido.value = paciente[1];
    inputFechaNacimiento.value = paciente[2];
    inputRdMasculino.checked = paciente[3] === "Hombre";
    inputRdFemenino.checked = paciente[3] === "Mujer";

    let opcionPais = Array.from(cmbPais.options).find(
        opcion => opcion.text === paciente[4]
    );

    cmbPais.value = opcionPais ? opcionPais.value : "0";
    inputDireccion.value = paciente[5];

    indiceEditar = indice;
    buttonAgregarPaciente.textContent = "Guardar cambios";

    inputNombre.focus();
};

const guardarEdicion = () => {
    let nombre = inputNombre.value.trim();
    let apellido = inputApellido.value.trim();
    let fechaNacimiento = inputFechaNacimiento.value;
    let sexo = inputRdMasculino.checked
        ? "Hombre"
        : inputRdFemenino.checked
            ? "Mujer"
            : "";
    let pais = cmbPais.value;
    let labelPais = cmbPais.options[cmbPais.selectedIndex]?.text || "";
    let direccion = inputDireccion.value.trim();

    if (
        nombre === "" ||
        apellido === "" ||
        fechaNacimiento === "" ||
        sexo === "" ||
        pais === "" ||
        pais === "0" ||
        direccion === ""
    ) {
        mensaje.innerHTML = "Faltan campos por completar";
        toast.show();
        return;
    }

    if (indiceEditar === null || !arrayPaciente[indiceEditar]) {
        mensaje.innerHTML = "No se encontró el paciente";
        toast.show();
        limpiarForm();
        return;
    }

    arrayPaciente[indiceEditar] = [
        nombre,
        apellido,
        fechaNacimiento,
        sexo,
        labelPais,
        direccion
    ];

    localStorage.setItem("pacientes", JSON.stringify(arrayPaciente));

    mensaje.innerHTML = "Paciente actualizado correctamente";
    toast.show();

    limpiarForm();
    imrpimirPacientes();
};

const eliminarPaciente = (indice) => {
    if (!arrayPaciente[indice]) return;

    if (confirm("¿Estás seguro de eliminar este paciente?")) {
        arrayPaciente.splice(indice, 1);

        localStorage.setItem("pacientes", JSON.stringify(arrayPaciente));

        if (indiceEditar === indice) {
            limpiarForm();
        } else if (indiceEditar !== null && indice < indiceEditar) {
            indiceEditar--;
        }

        mensaje.innerHTML = "Paciente eliminado correctamente";
        toast.show();

        imrpimirPacientes();
    }
};

const configurarBotones = () => {
    arrayPaciente.forEach((paciente, indice) => {
        let botonEditar = document.getElementById(`idBtnEditar${indice + 1}`);
        let botonEliminar = document.getElementById(`idBtnEliminar${indice + 1}`);

        if (botonEditar) {
            botonEditar.onclick = () => editarPaciente(indice);
        }

        if (botonEliminar) {
            botonEliminar.onclick = () => eliminarPaciente(indice);
        }
    });
};

/* Contador global de los option correspondiente */
/* al select (cmb) pais */
let contadorGlobalOption = cmbPais.children.length;

const addPais = () => {
    let paisNew = inputNombrePais.value.trim();

    if (paisNew != "") {
        /* Creando nuevo option con la API DOM */
        let option = document.createElement("option");
        option.textContent = paisNew;
        option.value = contadorGlobalOption + 1;

        /* Agregando el nuevo option en el select */
        cmbPais.appendChild(option);
        contadorGlobalOption++;

        /* Asignando un mensaje a nuestra notificación */
        mensaje.innerHTML = "Pais agregado correctamente";
        /* Llamando al componente de Bootstrap */
        toast.show();
    } else {
        /* Asignando un mensaje a nuestra notificación */
        mensaje.innerHTML = "Faltan campos por completar";
        /* Llamando al componente de Bootstrap */
        toast.show();
    }

    inputNombrePais.value = "";
};

/* Agregando eventos a los botones y utilizando funciones tipo flecha */
buttonLimpiarPaciente.onclick = () => {
    limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
    if (indiceEditar !== null) {
        guardarEdicion();
    } else {
        addPaciente();
    }
};

buttonMostrarPaciente.onclick = () => {
    imrpimirPacientes();
};

buttonAgregarPais.onclick = () => {
    addPais();
};

/* Se agrega el focus en el campo nombre pais del modal */
idModal.addEventListener("shown.bs.modal", () => {
    inputNombrePais.value = "";
    inputNombrePais.focus();
});

/* Ejecutar funcion al momento de cargar la página HTML */
limpiarForm();
imrpimirPacientes();
