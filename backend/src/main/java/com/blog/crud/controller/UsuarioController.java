package com.blog.crud.controller;

import com.blog.crud.dto.UsuarioActualizarRequest;
import com.blog.crud.dto.UsuarioResponse;
import com.blog.crud.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Todas estas rutas empiezan con /api/usuarios y están protegidas por
// SesionInterceptor (ver WebConfig): si no hay sesión activa, ni siquiera
// llegan a estos métodos, el interceptor responde 401 antes.
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // GET /api/usuarios -> lista todos los usuarios (solo si hay sesión)
    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    // GET /api/usuarios/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    // PUT /api/usuarios/{id} -> actualiza nombre/correo
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioActualizarRequest datos) {
        return ResponseEntity.ok(usuarioService.actualizar(id, datos));
    }

    // DELETE /api/usuarios/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
