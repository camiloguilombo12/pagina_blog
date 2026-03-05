// ----------------------------------------------------------
// script.js
// Archivo principal de JavaScript del proyecto.
// Aquí se maneja:
//  - El formulario de ejemplo (mostrar los datos enviados).
//  - La carga de cada sección HTML dentro de index.html.
//  - La navegación entre secciones (mostrar/ocultar).
//  - El botón "Copiar código" de los ejemplos.
// ----------------------------------------------------------

// Inicializa el comportamiento del formulario de contacto
function initFormulario() {
    const formulario = document.querySelector("#formularios #form-ejemplo");
    const resultado = document.querySelector("#formularios #resultado-formulario");

    // Si todavía no se ha cargado el HTML del formulario, salimos de la función
    if (!formulario || !resultado) return;

    // Escuchamos el evento "submit" cuando el usuario envía el formulario
    formulario.addEventListener("submit", (event) => {
        // Evita que la página se recargue al enviar el formulario
        event.preventDefault();

        // Obtenemos los valores escritos por el usuario
        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correo").value;
        const mensaje = document.getElementById("mensaje").value;
        const tema = document.getElementById("tema").value || "No seleccionado";

        // Mostramos un resumen de la información debajo del formulario
        resultado.innerHTML = `
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${correo}</p>
      <p><strong>Mensaje:</strong> ${mensaje || "Sin mensaje"}</p>
      <p><strong>Tema:</strong> ${tema}</p>
    `;
    });
}

// Función genérica para cargar cualquier sección HTML externa
function cargarSeccion(ruta, idContenedor, mensajeError) {
    fetch(ruta)
        .then(response => response.text())
        .then(data => {
            // Insertamos el HTML descargado dentro del contenedor indicado
            document.getElementById(idContenedor).innerHTML = data;

            // Si acabamos de cargar la sección de formularios, activamos su lógica
            if (idContenedor === "formularios") {
                initFormulario();
            }
        })
        .catch(error => console.error(mensajeError, error));
}

// Cargamos cada una de las secciones del blog
cargarSeccion("components/header.html", "header-container", "Error al cargar el header");
cargarSeccion("components/footer.html", "footer-container", "Error al cargar el footer");
cargarSeccion("pages/basicas.html", "basicas", "Error al cargar la página de básicas");
cargarSeccion("pages/texto.html", "texto","Error al cargar la página de texto" );
cargarSeccion("pages/listas.html", "listas", "Error al cargar la página de listas")
cargarSeccion("pages/formularios.html", "formularios", "Error al cargar la página de formularios" );
cargarSeccion("pages/tablas.html", "tablas", "Error al cargar la página de tablas" );
cargarSeccion("pages/multimedia.html", "multimedia", "Error al cargar la página de multimedia" );
cargarSeccion("pages/nosotros.html", "nosotros", "Error al cargar la página de nosotros" );

// Cuando el documento ya está listo, configuramos la navegación entre secciones
document.addEventListener("DOMContentLoaded", () => {
 
  // Seleccionamos todas las secciones que se pueden mostrar/ocultar
  const secciones = document.querySelectorAll(".seccion");

  // Esta función recibe el id de una sección y solo muestra esa
  function mostrarSeccion(id) {
    secciones.forEach(sec => {
      if (sec.id === id) {
        sec.style.display = "block";
      } else {
        sec.style.display = "none";
      }
    });
  }

  // Al iniciar la página, mostramos por defecto la sección "basicas"
  mostrarSeccion("basicas");

  // Escuchamos todos los clics y buscamos enlaces con el atributo data-seccion
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-seccion]");
    if (!link) return;

    // Evitamos que el enlace recargue la página
    event.preventDefault();

    // Leemos el valor de data-seccion y mostramos esa parte
    const idSeccion = link.getAttribute("data-seccion");
    mostrarSeccion(idSeccion);
  });

});

// Lógica del botón "Copiar código" de los ejemplos
document.addEventListener("click", (e) => {
  // Solo reaccionamos si el clic fue sobre un botón con la clase .copia-btn
  if (!e.target.classList.contains("copia-btn")) return;

  // El botón está justo después del bloque <pre class="ejemplo-codigo">
  const contenedor = e.target.previousElementSibling;
  if (!contenedor || !contenedor.classList.contains("ejemplo-codigo")) return;

  // Tomamos el texto dentro de la etiqueta <code> y lo copiamos al portapapeles
  const codigo = contenedor.querySelector("code").innerText;
  navigator.clipboard.writeText(codigo);

  // Cambiamos el texto del botón para dar feedback al usuario
  e.target.textContent = "Copiado!";
  setTimeout(() => {
    e.target.textContent = "Copiar código";
  }, 1500);
});