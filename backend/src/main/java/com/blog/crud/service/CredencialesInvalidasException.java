package com.blog.crud.service;

// A propósito el mensaje es genérico ("correo o contraseña incorrectos") y NO dice
// cuál de los dos falló. Si dijéramos "el correo no existe" vs "contraseña incorrecta",
// un atacante podría usar la API para averiguar qué correos están registrados.
public class CredencialesInvalidasException extends RuntimeException {
    public CredencialesInvalidasException() {
        super("Correo o contraseña incorrectos");
    }
}
