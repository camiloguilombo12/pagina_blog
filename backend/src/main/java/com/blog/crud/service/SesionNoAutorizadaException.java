package com.blog.crud.service;

public class SesionNoAutorizadaException extends RuntimeException {
    public SesionNoAutorizadaException() {
        super("Debes iniciar sesión para realizar esta acción");
    }
}
