package com.blog.crud.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

// Este interceptor se ejecuta ANTES de que la petición llegue al controlador.
// Revisa si existe una sesión activa (o sea, si el usuario ya hizo login).
// Si no la hay, corta la petición ahí mismo con un 401 y el controlador
// ni se entera de que la petición existió.
//
// Esta es la "seguridad básica" sin JWT: en vez de un token que el frontend
// guarda y envía manualmente en cada petición, el navegador envía automáticamente
// una cookie de sesión (JSESSIONID) que Spring genera al hacer login.
public class SesionInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
	if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }  
      // "false" = no crear una sesión nueva si no existe, solo consultar
        HttpSession sesion = request.getSession(false);

        boolean haySesionActiva = sesion != null && sesion.getAttribute("usuarioId") != null;

        if (!haySesionActiva) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"No autorizado\", \"mensaje\": \"Debes iniciar sesión\"}");
            return false; // corta la cadena: el controlador nunca se ejecuta
        }

        return true; // sigue hacia el controlador normalmente
    }
}
