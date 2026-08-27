package com.blog.crud.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Orígenes desde los que se permite llamar a la API (el frontend).
    // Se define por variable de entorno para poder ajustarlo fácil en Docker/intranet.
    @Value("${FRONTEND_ORIGIN:http://localhost:8081}")
    private String frontendOrigin;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // El interceptor de sesión SOLO protege el CRUD de usuarios.
        // Las rutas de /api/auth/** (registro, login) deben quedar libres,
        // porque ahí es justamente donde todavía no hay sesión.
        registry.addInterceptor(new SesionInterceptor())
                .addPathPatterns("/api/usuarios/**");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // allowCredentials(true) es INDISPENSABLE para que el navegador mande
        // la cookie de sesión en peticiones cross-origin (frontend en :8081,
        // backend en :8080). Por eso NO se puede usar origin "*" aquí:
        // el estándar CORS prohíbe combinar "*" con credenciales.
        //
        // Se usa allowedOriginPatterns (en vez de allowedOrigins) porque SÍ admite
        // comodines. Esto permite aceptar cualquier IP/host de la red local o del
        // entorno donde se despliegue (VM, Killercoda, etc.) siempre que use el
        // puerto 8081, sin depender de una IP fija que cambia entre entornos.
        registry.addMapping("/api/**")
                .allowedOriginPatterns(
                        "http://localhost:8081",
                        "http://127.0.0.1:8081",
                        "http://192.168.*.*:8081",
                        "http://10.*.*.*:8081",
                        "http://172.16.*.*:8081", "http://172.17.*.*:8081", "http://172.18.*.*:8081",
                        "http://172.19.*.*:8081", "http://172.2*.*.*:8081", "http://172.3*.*.*:8081",
                        frontendOrigin
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
