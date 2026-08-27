package com.blog.crud.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Representa la tabla "usuarios" en MySQL.
// IMPORTANTE: el campo "password" SIEMPRE guarda el hash de BCrypt,
// nunca la contraseña en texto plano. Eso se garantiza en UsuarioService,
// no aquí (la entidad no sabe ni le importa cómo se generó el hash).
@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false, length = 120)
    private String nombre;

    // El correo funciona como "usuario" de acceso: debe ser único
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo no tiene un formato válido")
    @Column(nullable = false, unique = true, length = 150)
    private String correo;

    // Aquí SIEMPRE va el hash de BCrypt (algo como "$2a$10$...."), nunca texto plano
    @NotBlank(message = "La contraseña es obligatoria")
    @Column(nullable = false, length = 255)
    private String password;
}
