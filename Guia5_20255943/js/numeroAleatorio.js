// Generamos un número aleatorio que se encuentre en el rango del 1 al 25
const numeroAleatorio = Math.floor(Math.random() * 25) + 1;
// Creamos una constante que permite identificar el maximo de intentos
const numeroIntentos = 3;
// Guardara el número de intentos que realiza el usuario
let intentos = 1;
function generarNumeroAleatorio() {
  console.log(numeroAleatorio);
  // Definamos una variable para impresión de mensajes
  let mensaje;
  // Utilizamos el dompara acceder el parrafo creado
  const parrafo = document.querySelector("#idParrafo");

  // Verificamos en que intento esta el usuario
  if (intentos <= numeroIntentos) {
    let numero = prompt(`¿Que número se ha generado (Intentos ${intentos})?`);

    // Verificamos el número aleatorio con el ingresado por el usuario
    if (numero == numeroAleatorio) {
      mensaje = `¡Es sorprendente, pudiste adivinar el número oculto (${numeroAleatorio}).
            Refresque la página para volver a jugar.`;
    } else if (intentos == numeroIntentos) {
      mensaje = `Su número de intentos ha terminado.
            El número oculto era: ${numeroAleatorio}. Refresque la página para volver a jugar.`;
    } else {
      mensaje = numero > numeroAleatorio ? "El número oculto es menor al escrito." : "El número oculto es mayor al escrito.";

      mensaje += ` Vuelve a intentar. Quedan ${
        numeroIntentos - intentos
      } intentos`;
    }

    // aumentamos el valor de los intentos
    intentos++;
  } else {
    mensaje = `Su número de intentos ha terminado.
        El numero oculto era: ${numeroAleatorio}. Refresque la página para volver a jugar.`;
  }

  parrafo.innerHTML = mensaje;
}