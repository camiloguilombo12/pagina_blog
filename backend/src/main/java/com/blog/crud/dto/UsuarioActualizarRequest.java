package com.blog.crud.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// Para actualizar nombre/correo desde el CRUD. El cambio de contraseña
// se maneja aparte (endpoint distinto) para no mezclar responsabilidades.
@Data
public class UsuarioActualizarRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo no tiene un formato válido")
    private String correo;
}
