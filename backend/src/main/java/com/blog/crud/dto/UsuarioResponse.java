package com.blog.crud.dto;

import com.blog.crud.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;

// Esto es lo único que sale hacia el frontend: NUNCA incluye el password,
// ni siquiera el hash. Así, aunque alguien inspeccione las respuestas de la API
// desde las herramientas del navegador, jamás va a ver una contraseña.
@Data
@AllArgsConstructor
public class UsuarioResponse {

    private Long id;
    private String nombre;
    private String correo;

    // Método de fábrica: convierte la entidad completa (con password) en la
    // versión segura que sí se puede exponer.
    public static UsuarioResponse desde(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getCorreo());
    }
}
