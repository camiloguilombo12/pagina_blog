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

// LÓGICA DEL BOTÓN "COPIAR CÓDIGO"
// Esta parte se encarga de que, al hacer clic en el botón "Copiar código",
// se copie al portapapeles el texto que está dentro del bloque <code>.
// Si el navegador no soporta la API moderna, se usa un método alternativo.
document.addEventListener("click", (e) => {
  // Si el clic NO fue sobre un botón con la clase .copia-btn, salimos
  if (!e.target.classList.contains("copia-btn")) return;

  // El botón de copiar siempre está después del bloque <pre class="ejemplo-codigo">
  const contenedor = e.target.previousElementSibling;
  // Si por algún motivo no encontramos el bloque correcto, no hacemos nada
  if (!contenedor || !contenedor.classList.contains("ejemplo-codigo")) return;

  // Dentro del bloque de código buscamos específicamente la etiqueta <code>
  const codeElement = contenedor.querySelector("code");
  if (!codeElement) return;

  // Obtenemos el texto plano que se va a copiar
  const codigo = codeElement.innerText;

  // PRIMER INTENTO: usar la API moderna del portapapeles (navigator.clipboard)
  // Esta API solo funciona en contextos seguros (https o localhost)
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(codigo).then(() => {
      // Si todo salió bien, mostramos el mensaje de "Copiado!"
      mostrarMensajeCopiado(e.target);
    }).catch(() => {
      // Si hubo un error, usamos el método alternativo
      copiarConFallback(codigo, e.target);
    });
  } else {
    // Si el navegador no soporta navigator.clipboard, usamos el método alternativo
    copiarConFallback(codigo, e.target);
  }
});

// FUNCIÓN ALTERNATIVA PARA COPIAR (FALLBACK)
// Esta función se usa cuando navigator.clipboard no está disponible.
// Crea un <textarea> oculto, copia el texto allí y usa document.execCommand("copy").
function copiarConFallback(texto, boton) {
  // Creamos un textarea invisible donde pondremos el texto a copiar
  const textarea = document.createElement("textarea");
  textarea.value = texto;
  textarea.style.position = "fixed";   // fixed para que no se mueva con el scroll
  textarea.style.top = "-9999px";      // lo posicionamos fuera de la pantalla
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);

  // Seleccionamos el texto dentro del textarea
  textarea.focus();
  textarea.select();

  try {
    // Intentamos ejecutar el comando de copiado clásico
    const exito = document.execCommand("copy");
    if (exito) {
      // Si funcionó, mostramos el mensaje de "Copiado!"
      mostrarMensajeCopiado(boton);
    } else {
      // Si no funcionó, avisamos al usuario que copie manualmente
      alert("Tu navegador no permite copiar automáticamente. Selecciona y copia el texto manualmente.");
    }
  } catch (err) {
    // Si ocurre un error, también avisamos al usuario
    alert("Tu navegador no permite copiar automáticamente. Selecciona y copia el texto manualmente.");
  }

  // Eliminamos el textarea oculto para no dejar basura en el DOM
  document.body.removeChild(textarea);
}

// FUNCIÓN PARA MOSTRAR EL MENSAJE "COPIADO!"
// Esta función SOLO cambia el texto del botón unos segundos
// para que el usuario vea que la acción de copiar se realizó.
function mostrarMensajeCopiado(boton) {
  const textoOriginal = boton.textContent; // Guardamos el texto que tenía antes
  boton.textContent = "Copiado!";          // Mostramos el nuevo texto temporalmente
  setTimeout(() => {
    boton.textContent = textoOriginal;     // Pasados 1,5 segundos, volvemos al texto original
  }, 1500);
}