const BACKEND_PORT = 8080;
const BASE_URL = `http://${window.location.hostname}:${BACKEND_PORT}`;
const AUTH_URL = `${BASE_URL}/api/auth`;
const USUARIOS_URL = `${BASE_URL}/api/usuarios`;
const FETCH_OPTS_BASE = { credentials: "include" };
