const inputCiudad = document.getElementById("ciudad");
const botonBuscar = document.getElementById("buscarBtn");
const resultado = document.getElementById("resultado");

async function cargarCiudades() {
  const respuesta = await fetch("./ciudades.json");
  const data = await respuesta.json();
  return data.ciudades;
}

function buscarCiudad(nombreCiudad, ciudades) {
  return ciudades.find(
    (ciudad) => ciudad.nombre.toLowerCase() === nombreCiudad.toLowerCase()
  );
}

function mostrarCiudad(ciudad) {
  resultado.innerHTML = `
    <h2>${ciudad.nombre}, ${ciudad.pais}</h2>
    <div class="icono">${ciudad.icono}</div>
    <p><strong>Estado:</strong> ${ciudad.estado}</p>
    <p><strong>Temperatura:</strong> ${ciudad.temperatura} °C</p>
    <p><strong>Humedad:</strong> ${ciudad.humedad}%</p>
    <p><strong>Viento:</strong> ${ciudad.viento} km/h</p>
  `;
}

function mostrarError() {
  resultado.innerHTML = `<p>No se encontraron datos para esa ciudad.</p>`;
}

botonBuscar.addEventListener("click", async () => {
  const nombreCiudad = inputCiudad.value.trim();

  if (nombreCiudad === "") {
    resultado.innerHTML = `<p>Por favor, escribe una ciudad.</p>`;
    return;
  }

  try {
    const ciudades = await cargarCiudades();
    const ciudadEncontrada = buscarCiudad(nombreCiudad, ciudades);

    if (ciudadEncontrada) {
      mostrarCiudad(ciudadEncontrada);
    } else {
      mostrarError();
    }
  } catch (error) {
    resultado.innerHTML = `<p>Error al cargar el archivo JSON.</p>`;
    console.error(error);
  }
});

inputCiudad.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    botonBuscar.click();
  }
});