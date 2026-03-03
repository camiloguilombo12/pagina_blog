function cargarSeccion(ruta, idContenedor, mensajeError) {
    fetch(ruta)
        .then(response => response.text())
        .then(data => {
            document.getElementById(idContenedor).innerHTML = data;
        })
        .catch(error => console.error(mensajeError, error));
}

cargarSeccion("components/header.html", "header-container", "Error al cargar el header");
cargarSeccion("pages/basicas.html", "basicas", "Error al cargar la página de básicas");
cargarSeccion("pages/texto.html", "texto","Error al cargar la página de texto" );
cargarSeccion("pages/formularios.html", "formularios", "Error al cargar la página de formularios" );

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form-ejemplo");
  const resultado = document.getElementById("resultado-formulario");

  if (!formulario || !resultado) return; // por si esta página no está cargada

  formulario.addEventListener("submit", (event) => {
    event.preventDefault(); // evita que la página se recargue

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const mensaje = document.getElementById("mensaje").value;
    const tema = document.getElementById("tema").value || "No seleccionado";

    resultado.innerHTML = `
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${correo}</p>
      <p><strong>Mensaje:</strong> ${mensaje || "Sin mensaje"}</p>
      <p><strong>Tema:</strong> ${tema}</p>
    `;
  });
});