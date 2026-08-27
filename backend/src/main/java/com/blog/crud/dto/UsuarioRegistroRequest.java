package com.blog.crud.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// Lo que llega del frontend cuando alguien se registra.
// Aquí SÍ viaja la contraseña en texto plano (una sola vez, por HTTPS en producción real),
// pero nunca se guarda así: UsuarioService la hashea antes de tocar la base de datos.
@Data
public class UsuarioRegistroRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo no tiene un formato válido")
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener mínimo 6 caracteres")
    private String password;
}
