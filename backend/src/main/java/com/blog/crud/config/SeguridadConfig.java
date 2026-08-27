package com.blog.crud.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SeguridadConfig {

    // BCrypt agrega automáticamente un "salt" distinto a cada contraseña,
    // así que dos usuarios con la misma contraseña NUNCA tienen el mismo hash guardado.
    // Esto evita ataques de tablas precalculadas (rainbow tables).
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
