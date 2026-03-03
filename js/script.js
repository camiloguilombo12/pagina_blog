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
