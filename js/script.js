fetch("components/header.html")
    .then(response=> response.text())
    .then(data=>{
        document.getElementById("header-container").innerHTML=data;
    })
    .catch(error=>console.error("Error al cargar el header", error));

    fetch("pages/basicas.html")
    .then(response=> response.text())
    .then(data=>{
        document.getElementById("basicas").innerHTML=data;
    })
    .catch(error=>console.error("Error al cagar la pagina de basicas", error));