package com.blog.crud.service;

public class CorreoDuplicadoException extends RuntimeException {
    public CorreoDuplicadoException(String correo) {
        super("Ya existe una cuenta registrada con el correo " + correo);
    }
}
