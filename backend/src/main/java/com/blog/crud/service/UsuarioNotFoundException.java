package com.blog.crud.service;

public class UsuarioNotFoundException extends RuntimeException {
    public UsuarioNotFoundException(Long id) {
        super("No se encontró el usuario con id " + id);
    }
}
