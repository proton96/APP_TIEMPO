// --- 1. Selección de Elementos del DOM ---
// Aquí guardamos en constantes las referencias a los elementos HTML con los que vamos a interactuar.
// Es como darle un nombre a cada pieza de la página para poder manipularla con JavaScript.
const inputCiudad = document.getElementById("ciudad"); // El campo de texto donde el usuario escribe la ciudad.
const botonBuscar = document.getElementById("buscarBtn"); // El botón para iniciar la búsqueda.
const resultado = document.getElementById("resultado"); // El contenedor donde se mostrará el clima o los errores.

// --- 2. Cargar los datos de las ciudades ---
// Esta es una función asíncrona, lo que significa que puede realizar tareas en segundo plano (como cargar un archivo)
// sin bloquear el resto de la página.
async function cargarCiudades() {
  // 'fetch' es la forma moderna de solicitar recursos, en este caso, tu archivo local 'ciudades.json'.
  // 'await' pausa la ejecución de esta función hasta que el archivo se haya cargado.
  const respuesta = await fetch("./ciudades.json");
  // Una vez cargado, convertimos la respuesta (que es texto en formato JSON) a un objeto de JavaScript que podamos usar.
  const data = await respuesta.json();
  // El archivo JSON tiene una estructura como { "ciudades": [...] }. Devolvemos solo el array de ciudades.
  return data.ciudades;
}

// --- 3. Buscar una ciudad específica ---
// Esta función busca un objeto 'ciudad' dentro de un array de ciudades basándose en el nombre.
function buscarCiudad(nombreCiudad, ciudades) {
  // El método 'find' recorre el array 'ciudades' y devuelve el primer elemento que cumpla la condición.
  return ciudades.find(
    // La condición compara el nombre de la ciudad en el array con el nombre buscado.
    // Usamos 'toLowerCase()' en ambos para que la búsqueda no distinga entre mayúsculas y minúsculas (ej: "Madrid" y "madrid" serán iguales).
    (ciudad) => ciudad.nombre.toLowerCase() === nombreCiudad.toLowerCase()
  );
}

// --- 4. Mostrar los datos de la ciudad encontrada ---
// Cuando encontramos una ciudad, esta función se encarga de construir el HTML para mostrar sus datos.
function mostrarCiudad(ciudad) {
  // Usamos 'innerHTML' para reemplazar el contenido del div 'resultado' con nuestro nuevo HTML.
  // --- HTML para el pronóstico de la semana ---
  // Primero, creamos una variable para guardar el HTML del pronóstico.
  let pronosticoHtml = "";
  // Verificamos si la ciudad tiene datos de pronóstico y si es un array con elementos.
  if (ciudad.pronostico && ciudad.pronostico.length > 0) {
    // Si hay datos, construimos el contenedor del pronóstico.
    pronosticoHtml = `
      <div class="pronostico-semana">
        ${ciudad.pronostico.map(dia => `
          <div class="dia-pronostico">
            <p>${dia.dia}</p>
            <div class="icono-pronostico">${dia.icono}</div>
            <p>${dia.temp_max}° / ${dia.temp_min}°</p>
          </div>`).join("")}
      </div>`;
  }
  resultado.innerHTML = `
    <h2>${ciudad.nombre}</h2>
    <div class="icono">${ciudad.icono}</div>
    <div class="temperatura">${Math.round(ciudad.temperatura)}<sup>°C</sup></div>
    <div class="estado">${ciudad.estado}</div>
    <div class="detalles">
      <div class="detalle-item">
        <p><strong>Humedad</strong></p>
        <p>${ciudad.humedad}%</p>
      </div>
      <div class="detalle-item">
        <p><strong>Viento</strong></p>
        <p>${ciudad.viento} km/h</p>
      </div>
    </div>
    ${pronosticoHtml}
  `;
  // Añadimos la clase 'visible' para activar la animación de aparición.
  // Usamos un pequeño retraso para asegurar que el DOM se ha actualizado.
  setTimeout(() => resultado.classList.add("visible"), 10);
}

// --- 5. Mostrar un mensaje de error ---
// Si la ciudad no se encuentra en nuestro archivo JSON, llamamos a esta función.
function mostrarError() {
  resultado.innerHTML = `<p>No se encontraron datos para esa ciudad.</p>`;
  resultado.classList.add("visible");
}

// --- 6. Evento Principal: Click en el botón de búsqueda ---
// 'addEventListener' es como un "oyente". Le decimos al botón que esté atento a un evento 'click'
// y que ejecute esta función asíncrona cuando ocurra.
botonBuscar.addEventListener("click", async () => {
  // Obtenemos el valor del campo de texto y usamos 'trim()' para eliminar espacios en blanco al inicio y al final.
  const nombreCiudad = inputCiudad.value.trim();

  // Validamos que el usuario haya escrito algo.
  if (nombreCiudad === "") {
    resultado.innerHTML = `<p>Por favor, escribe una ciudad.</p>`;
    return; // 'return' detiene la ejecución de la función aquí.
  }

  // Ocultamos los resultados anteriores antes de una nueva búsqueda
  resultado.classList.remove("visible");

  // Usamos un bloque 'try...catch' para manejar posibles errores, como que el archivo 'ciudades.json' no se encuentre.
  try {
    // Esperamos a que se carguen todas las ciudades del archivo.
    const ciudades = await cargarCiudades();
    // Buscamos la ciudad que el usuario escribió en la lista que acabamos de cargar.
    const ciudadEncontrada = buscarCiudad(nombreCiudad, ciudades);

    // Si 'ciudadEncontrada' tiene un valor (no es undefined), significa que la encontramos.
    if (ciudadEncontrada) {
      mostrarCiudad(ciudadEncontrada); // Mostramos sus datos.
    } else {
      mostrarError(); // Si no, mostramos un error.
    }
  } catch (error) {
    // Si algo falla dentro del 'try' (ej: el fetch falla), el código salta a este bloque 'catch'.
    resultado.innerHTML = `<p>Error al cargar el archivo JSON.</p>`;
    resultado.classList.add("visible");
    console.error(error); // Mostramos el error detallado en la consola del navegador para depuración.
  }
});

// --- 7. Evento Adicional: Búsqueda con la tecla "Enter" ---
// Añadimos otro "oyente" al campo de texto, esta vez para el evento 'keyup' (cuando se suelta una tecla).
inputCiudad.addEventListener("keyup", (e) => {
  // Verificamos si la tecla que se soltó fue "Enter".
  if (e.key === "Enter") {
    // Si fue "Enter", simulamos un clic en el botón de búsqueda para ejecutar la misma lógica.
    // Esto mejora la experiencia del usuario.
    botonBuscar.click();
  }
});
