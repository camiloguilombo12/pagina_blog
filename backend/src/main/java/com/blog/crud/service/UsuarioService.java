package com.blog.crud.service;

import com.blog.crud.dto.UsuarioActualizarRequest;
import com.blog.crud.dto.UsuarioLoginRequest;
import com.blog.crud.dto.UsuarioRegistroRequest;
import com.blog.crud.dto.UsuarioResponse;
import com.blog.crud.model.Usuario;
import com.blog.crud.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // -------------------- REGISTRO --------------------
    public UsuarioResponse registrar(UsuarioRegistroRequest datos) {
        if (usuarioRepository.existsByCorreo(datos.getCorreo())) {
            throw new CorreoDuplicadoException(datos.getCorreo());
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(datos.getNombre());
        usuario.setCorreo(datos.getCorreo());
        // Nunca guardamos datos.getPassword() directo: siempre pasa por el hash primero
        usuario.setPassword(passwordEncoder.encode(datos.getPassword()));

        Usuario guardado = usuarioRepository.save(usuario);
        return UsuarioResponse.desde(guardado);
    }

    // -------------------- LOGIN --------------------
    // Devuelve el usuario si las credenciales son correctas; lanza excepción si no.
    // NO crea la sesión aquí: eso lo hace el controller, que es quien tiene acceso
    // al HttpServletRequest.
    public UsuarioResponse login(UsuarioLoginRequest datos) {
        Usuario usuario = usuarioRepository.findByCorreo(datos.getCorreo())
                .orElseThrow(CredencialesInvalidasException::new);

        // passwordEncoder.matches compara el texto plano contra el hash guardado.
        // BCrypt vuelve a aplicar el mismo salt que se usó al guardar y compara los hashes,
        // así que NUNCA se desencripta la contraseña guardada (no se puede: es un hash, no un cifrado reversible).
        boolean coincide = passwordEncoder.matches(datos.getPassword(), usuario.getPassword());
        if (!coincide) {
            throw new CredencialesInvalidasException();
        }

        return UsuarioResponse.desde(usuario);
    }

    // -------------------- CRUD --------------------
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(UsuarioResponse::desde)
                .toList();
    }

    public UsuarioResponse buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException(id));
        return UsuarioResponse.desde(usuario);
    }

    public UsuarioResponse actualizar(Long id, UsuarioActualizarRequest datos) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException(id));

        usuario.setNombre(datos.getNombre());
        usuario.setCorreo(datos.getCorreo());

        Usuario actualizado = usuarioRepository.save(usuario);
        return UsuarioResponse.desde(actualizado);
    }

    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new UsuarioNotFoundException(id);
        }
        usuarioRepository.deleteById(id);
    }
}
