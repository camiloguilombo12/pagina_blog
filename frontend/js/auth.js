// ----------------------------------------------------------
// auth.js
// Contiene toda la lógica de la sección "Acceso":
//  - Registro de usuarios (POST /api/auth/registro)
//  - Login (POST /api/auth/login) -> crea la sesión (cookie)
//  - Logout (POST /api/auth/logout) -> destruye la sesión
//  - Verificar si hay sesión activa al cargar la página (GET /api/auth/sesion)
//  - CRUD de usuarios protegido (GET/PUT/DELETE /api/usuarios) -> requiere sesión
//
// Usa las constantes AUTH_URL, USUARIOS_URL y FETCH_OPTS_BASE definidas en config.js
// ----------------------------------------------------------

// Inicializa toda la sección. Se llama cuando ya se cargó pages/acceso.html.
function initAcceso() {
    const seccion = document.querySelector("#acceso");
    if (!seccion) return;

    document.querySelector("#acceso #form-login").addEventListener("submit", manejarLogin);
    document.querySelector("#acceso #form-registro").addEventListener("submit", manejarRegistro);
    document.querySelector("#acceso #btn-logout").addEventListener("click", manejarLogout);
    document.querySelector("#acceso #form-editar-usuario").addEventListener("submit", manejarActualizarUsuario);
    document.querySelector("#acceso #btn-cancelar-edicion").addEventListener("click", cerrarFormularioEdicion);

    // Cada vez que se entra a la sección, preguntamos si ya hay sesión activa
    // (por ejemplo, si el usuario recarga la página después de haber iniciado sesión)
    verificarSesion();
}

// -------------------- VERIFICAR SESIÓN --------------------
function verificarSesion() {
    fetch(`${AUTH_URL}/sesion`, { ...FETCH_OPTS_BASE })
        .then(response => {
            if (!response.ok) throw new Error("Sin sesión");
            return response.json();
        })
        .then(usuario => mostrarBloqueConSesion(usuario))
        .catch(() => mostrarBloqueSinSesion());
}

function mostrarBloqueConSesion(usuario) {
    document.querySelector("#acceso #bloque-sin-sesion").style.display = "none";
    document.querySelector("#acceso #bloque-con-sesion").style.display = "block";
    document.querySelector("#acceso #bienvenida-texto").textContent =
        `Sesión iniciada como ${usuario.nombre} (${usuario.correo}).`;
    cargarUsuarios();
}

function mostrarBloqueSinSesion() {
    document.querySelector("#acceso #bloque-sin-sesion").style.display = "block";
    document.querySelector("#acceso #bloque-con-sesion").style.display = "none";
}

// -------------------- LOGIN --------------------
function manejarLogin(event) {
    event.preventDefault();

    const credenciales = {
        correo: document.querySelector("#acceso #login-correo").value.trim(),
        password: document.querySelector("#acceso #login-password").value
    };

    fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        ...FETCH_OPTS_BASE,
        body: JSON.stringify(credenciales)
    })
        .then(async response => {
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.mensaje || "No se pudo iniciar sesión");
            }
            return response.json();
        })
        .then(usuario => {
            document.querySelector("#acceso #form-login").reset();
            mostrarBloqueConSesion(usuario);
        })
        .catch(error => mostrarMensaje("login-mensaje", error.message, "error"));
}

// -------------------- REGISTRO --------------------
function manejarRegistro(event) {
    event.preventDefault();

    const datos = {
        nombre: document.querySelector("#acceso #registro-nombre").value.trim(),
        correo: document.querySelector("#acceso #registro-correo").value.trim(),
        password: document.querySelector("#acceso #registro-password").value
    };

    fetch(`${AUTH_URL}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        ...FETCH_OPTS_BASE,
        body: JSON.stringify(datos)
    })
        .then(async response => {
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.mensaje || "No se pudo crear la cuenta");
            }
            return response.json();
        })
        .then(() => {
            mostrarMensaje("registro-mensaje", "Cuenta creada. Ya puedes iniciar sesión.", "exito");
            document.querySelector("#acceso #form-registro").reset();
        })
        .catch(error => mostrarMensaje("registro-mensaje", error.message, "error"));
}

// -------------------- LOGOUT --------------------
function manejarLogout() {
    fetch(`${AUTH_URL}/logout`, { method: "POST", ...FETCH_OPTS_BASE })
        .finally(() => mostrarBloqueSinSesion());
}

// -------------------- LISTAR USUARIOS (protegido) --------------------
function cargarUsuarios() {
    const tbody = document.querySelector("#acceso #usuarios-tbody");
    if (!tbody) return;

    fetch(USUARIOS_URL, { ...FETCH_OPTS_BASE })
        .then(response => {
            // Si el backend responde 401, significa que la sesión expiró
            if (response.status === 401) {
                mostrarBloqueSinSesion();
                throw new Error("Tu sesión expiró, vuelve a iniciar sesión.");
            }
            if (!response.ok) throw new Error("No se pudo conectar con el backend");
            return response.json();
        })
        .then(usuarios => renderizarUsuarios(usuarios))
        .catch(error => {
            tbody.innerHTML = `<tr><td colspan="4">${error.message}</td></tr>`;
        });
}

function renderizarUsuarios(usuarios) {
    const tbody = document.querySelector("#acceso #usuarios-tbody");

    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">Aún no hay usuarios registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.nombre}</td>
            <td>${u.correo}</td>
            <td>
                <button type="button" class="btn-editar" data-id="${u.id}">Editar</button>
                <button type="button" class="btn-eliminar" data-id="${u.id}">Eliminar</button>
            </td>
        </tr>
    `).join("");

    tbody.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", () => abrirFormularioEdicion(btn.dataset.id, usuarios));
    });
    tbody.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => eliminarUsuario(btn.dataset.id));
    });
}

// -------------------- EDITAR USUARIO --------------------
function abrirFormularioEdicion(id, usuarios) {
    const usuario = usuarios.find(u => String(u.id) === String(id));
    if (!usuario) return;

    document.querySelector("#acceso #editar-id").value = usuario.id;
    document.querySelector("#acceso #editar-nombre").value = usuario.nombre;
    document.querySelector("#acceso #editar-correo").value = usuario.correo;

    document.querySelector("#acceso #form-editar-wrapper").style.display = "block";
    document.querySelector("#acceso #form-editar-wrapper").scrollIntoView({ behavior: "smooth" });
}

function cerrarFormularioEdicion() {
    document.querySelector("#acceso #form-editar-usuario").reset();
    document.querySelector("#acceso #form-editar-wrapper").style.display = "none";
}

function manejarActualizarUsuario(event) {
    event.preventDefault();

    const id = document.querySelector("#acceso #editar-id").value;
    const datos = {
        nombre: document.querySelector("#acceso #editar-nombre").value.trim(),
        correo: document.querySelector("#acceso #editar-correo").value.trim()
    };

    fetch(`${USUARIOS_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        ...FETCH_OPTS_BASE,
        body: JSON.stringify(datos)
    })
        .then(async response => {
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.mensaje || "No se pudo actualizar el usuario");
            }
            return response.json();
        })
        .then(() => {
            mostrarMensaje("usuarios-mensaje", "Usuario actualizado correctamente.", "exito");
            cerrarFormularioEdicion();
            cargarUsuarios();
        })
        .catch(error => mostrarMensaje("usuarios-mensaje", error.message, "error"));
}

// -------------------- ELIMINAR USUARIO --------------------
function eliminarUsuario(id) {
    if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

    fetch(`${USUARIOS_URL}/${id}`, { method: "DELETE", ...FETCH_OPTS_BASE })
        .then(response => {
            if (!response.ok && response.status !== 204) {
                throw new Error("No se pudo eliminar el usuario");
            }
            mostrarMensaje("usuarios-mensaje", "Usuario eliminado.", "exito");
            cargarUsuarios();
        })
        .catch(error => mostrarMensaje("usuarios-mensaje", error.message, "error"));
}

// -------------------- MENSAJES --------------------
function mostrarMensaje(idContenedor, texto, tipo) {
    const contenedor = document.querySelector(`#acceso #${idContenedor}`);
    if (!contenedor) return;

    contenedor.textContent = texto;
    contenedor.className = tipo === "exito" ? "mensaje-exito" : "mensaje-error";

    setTimeout(() => {
        contenedor.textContent = "";
        contenedor.className = "";
    }, 3000);
}
