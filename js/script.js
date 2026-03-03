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
cargarSeccion("pages/listas.html", "listas", "Error al cargar la página de listas")
cargarSeccion("pages/formularios.html", "formularios", "Error al cargar la página de formularios" );

document.addEventListener("DOMContentLoaded", () => {
 
  const secciones = document.querySelectorAll(".seccion");

  function mostrarSeccion(id) {
    secciones.forEach(sec => {
      if (sec.id === id) {
        sec.style.display = "block";
      } else {
        sec.style.display = "none";
      }
    });
  }

 
  mostrarSeccion("basicas");


  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-seccion]");
    if (!link) return;

    event.preventDefault();
    const idSeccion = link.getAttribute("data-seccion");
    mostrarSeccion(idSeccion);
  });

  const formulario = document.getElementById("form-ejemplo");
  const resultado = document.getElementById("resultado-formulario");

  if (!formulario || !resultado) return;

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();

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