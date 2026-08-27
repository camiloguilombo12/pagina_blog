# Sistema de Acceso (Login) — Aplicación Multicapa

Proyecto para la actividad "Despliegue de una aplicación multicapa en Docker sobre Linux".

## 1. Arquitectura tecnológica seleccionada

| Componente    | Tecnología                     | Puerto (host) | Función                                  |
|---------------|---------------------------------|---------------|-------------------------------------------|
| Frontend      | HTML + CSS + JavaScript (Nginx) | 8081          | Interfaz de usuario                        |
| Backend       | Java 17 + Spring Boot 3         | 8080          | API REST de registro, login y CRUD de usuarios |
| Base de datos | MySQL 8.0                       | 3306          | Persistencia de usuarios                   |

**Justificación:**
- **HTML/CSS/JS**: la guía permite explícitamente esta opción. Se amplía un proyecto ya
  existente (blog educativo de etiquetas HTML), servido en producción con Nginx.
- **Spring Boot**: con Spring Data JPA se simplifica el CRUD; la autenticación se maneja
  con `HttpSession` (cookies), sin necesidad de JWT.
- **MySQL**: motor relacional con imagen oficial estable en Docker.

## 2. Seguridad implementada (sin JWT)

- Las contraseñas **nunca se guardan en texto plano**: se hashean con **BCrypt**
  (`spring-security-crypto`) antes de tocar la base de datos.
- Al iniciar sesión, el backend crea una **sesión de servidor** (`HttpSession`) y el
  navegador recibe automáticamente una cookie (`JSESSIONID`).
- Un **interceptor** (`SesionInterceptor`) protege las rutas `/api/usuarios/**`: si no
  hay sesión activa, responde `401` antes de llegar al controlador.
- La API nunca devuelve la contraseña (ni el hash) en ninguna respuesta — se usa un DTO
  (`UsuarioResponse`) separado de la entidad.
- CORS está configurado con `allowCredentials(true)` y un **origen específico**
  (`FRONTEND_ORIGIN`), no con `*`, porque el estándar CORS prohíbe combinar credenciales
  con origen comodín.

## 3. Comunicación entre componentes

```
FRONTEND (Nginx :80 -> host :8081)
     │  fetch() con credentials:"include"
     ▼
BACKEND (Spring Boot :8080)
     │  JDBC (Spring Data JPA)
     ▼
BASE DE DATOS (MySQL :3306)
```

## 4. Estructura del proyecto

```
proyecto-final/
├── docker-compose.yml
├── .env
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/blog/crud/
│       ├── model/Usuario.java
│       ├── dto/ (UsuarioRegistroRequest, UsuarioLoginRequest, UsuarioActualizarRequest, UsuarioResponse)
│       ├── repository/UsuarioRepository.java
│       ├── service/UsuarioService.java
│       ├── controller/AuthController.java      (registro, login, logout, sesión — público)
│       ├── controller/UsuarioController.java   (CRUD — protegido)
│       └── config/
│           ├── SeguridadConfig.java   (bean BCryptPasswordEncoder)
│           ├── SesionInterceptor.java (protege /api/usuarios/**)
│           ├── WebConfig.java         (registra el interceptor + CORS con cookies)
│           └── GlobalExceptionHandler.java
└── frontend/
    ├── Dockerfile
    ├── index.html
    ├── components/ (header, footer)
    ├── pages/ (incluye acceso.html)
    ├── js/ (config.js, script.js, auth.js)
    └── css/styles.css
```

## 5. Variables de entorno (`.env`)

| Variable              | Descripción                                          |
|-----------------------|--------------------------------------------------------|
| MYSQL_ROOT_PASSWORD   | Contraseña root de MySQL                                |
| MYSQL_DATABASE        | Nombre de la base de datos                              |
| MYSQL_USER / PASSWORD | Usuario de aplicación para el backend                   |
| DB_HOST / DB_PORT     | Host y puerto que usa el backend para conectarse a MySQL |
| SERVER_PORT           | Puerto interno del backend                              |
| FRONTEND_ORIGIN       | Origen exacto permitido por CORS (debe coincidir con la URL del frontend) |
| FRONTEND_PORT         | Puerto expuesto del frontend en el host                 |
| BACKEND_PORT          | Puerto expuesto del backend en el host                  |
| MYSQL_PORT            | Puerto expuesto de MySQL en el host                     |

## 6. Endpoints de la API

| Método | Ruta                  | Protegida | Descripción                          |
|--------|------------------------|-----------|----------------------------------------|
| POST   | /api/auth/registro     | No        | Crea una cuenta nueva                  |
| POST   | /api/auth/login        | No        | Valida credenciales y crea la sesión   |
| POST   | /api/auth/logout       | No        | Destruye la sesión                     |
| GET    | /api/auth/sesion       | Sí (sesión) | Devuelve el usuario logueado         |
| GET    | /api/usuarios          | Sí        | Lista todos los usuarios               |
| GET    | /api/usuarios/{id}     | Sí        | Obtiene un usuario por id              |
| PUT    | /api/usuarios/{id}     | Sí        | Actualiza nombre/correo                |
| DELETE | /api/usuarios/{id}     | Sí        | Elimina un usuario                     |

## 7. Notas importantes para el despliegue

- Si el frontend se abre desde otra URL/IP (ej. acceso desde la intranet), hay que
  actualizar **dos lugares**, no solo uno:
  1. `frontend/js/config.js` → `BASE_URL` (a dónde le pega el navegador)
  2. `.env` → `FRONTEND_ORIGIN` (a quién le permite el backend hacer CORS con cookies)
     y reconstruir el backend después de cambiarlo.
- Las cookies de sesión usan `SameSite=Lax`, lo cual funciona bien entre distintos
  puertos del mismo host (ej. `localhost:8081` hablando con `localhost:8080`), pero
  puede dar problemas si frontend y backend quedan en **dominios/IPs distintas** — en
  ese caso ambos deben accederse por la misma IP, solo cambiando el puerto.
- Los datos de MySQL persisten en el volumen `datos_mysql` aunque se reinicien o
  reconstruyan los contenedores.
