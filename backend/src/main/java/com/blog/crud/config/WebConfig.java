package com.blog.crud.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Origen adicional configurable mediante variable de entorno.
    // En local usa http://localhost:8081 por defecto.
    @Value("${FRONTEND_ORIGIN:http://localhost:8081}")
    private String frontendOrigin;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // El interceptor de sesión protege únicamente el CRUD de usuarios.
        // Las rutas de /api/auth/** permanecen libres para login y registro.
        registry.addInterceptor(new SesionInterceptor())
                .addPathPatterns("/api/usuarios/**");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/**")
                .allowedOriginPatterns(
                        // Desarrollo local
                        "http://localhost:8081",
                        "https://localhost:8081",
                        "http://127.0.0.1:8081",
                        "https://127.0.0.1:8081",

                        // Red local
                        "http://192.168.*.*:8081",
                        "https://192.168.*.*:8081",
                        "http://10.*.*.*:8081",
                        "https://10.*.*.*:8081",

                        // Docker / redes privadas
                        "http://172.*.*.*:8081",
                        "https://172.*.*.*:8081",

                        // Killercoda
                        "https://*-8081.*.killercoda.com",

                        // Origen configurable
                        frontendOrigin
                )
                .allowedMethods(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}