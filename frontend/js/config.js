const hostname = window.location.hostname;
const protocol = window.location.protocol;

let BASE_URL;

if (hostname.includes("killercoda.com")) {
    BASE_URL = `${protocol}//${hostname.replace("-8081", "-8080")}`;
} else {
    BASE_URL = `${protocol}//${hostname}:8080`;
}

const AUTH_URL = `${BASE_URL}/api/auth`;
const USUARIOS_URL = `${BASE_URL}/api/usuarios`;
const FETCH_OPTS_BASE = { credentials: "include" };