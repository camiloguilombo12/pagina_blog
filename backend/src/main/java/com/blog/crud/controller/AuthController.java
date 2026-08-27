package com.blog.crud.controller;

import com.blog.crud.dto.UsuarioLoginRequest;
import com.blog.crud.dto.UsuarioRegistroRequest;
import com.blog.crud.dto.UsuarioResponse;
import com.blog.crud.service.SesionNoAutorizadaException;
import com.blog.crud.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Estas rutas son PÚBLICAS (no pasan por el SesionInterceptor):
// /api/auth/registro, /api/auth/login, /api/auth/logout, /api/auth/sesion
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // POST /api/auth/registro -> crea la cuenta (no inicia sesión automáticamente)
    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponse> registro(@Valid @RequestBody UsuarioRegistroRequest datos) {
        UsuarioResponse creado = usuarioService.registrar(datos);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    // POST /api/auth/login -> valida credenciales y CREA LA SESIÓN
    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@Valid @RequestBody UsuarioLoginRequest datos, HttpServletRequest request) {
        UsuarioResponse usuario = usuarioService.login(datos);

        // "true" = crear la sesión si no existe. Aquí es donde realmente
        // "inicia sesión" el usuario: Spring genera una cookie JSESSIONID
        // y la manda automáticamente en la respuesta.
        HttpSession sesion = request.getSession(true);
        sesion.setAttribute("usuarioId", usuario.getId());
        sesion.setAttribute("usuarioCorreo", usuario.getCorreo());

        return ResponseEntity.ok(usuario);
    }

    // POST /api/auth/logout -> destruye la sesión
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        HttpSession sesion = request.getSession(false);
        if (sesion != null) {
            sesion.invalidate();
        }
        return ResponseEntity.noContent().build();
    }

    // GET /api/auth/sesion -> le permite al frontend preguntar "¿sigo logueado?"
    // (por ejemplo, al recargar la página)
    @GetMapping("/sesion")
    public ResponseEntity<UsuarioResponse> sesionActual(HttpServletRequest request) {
        HttpSession sesion = request.getSession(false);
        Long usuarioId = (sesion != null) ? (Long) sesion.getAttribute("usuarioId") : null;

        if (usuarioId == null) {
            throw new SesionNoAutorizadaException();
        }

        return ResponseEntity.ok(usuarioService.buscarPorId(usuarioId));
    }
}
