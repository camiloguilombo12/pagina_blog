package com.blog.crud.repository;

import com.blog.crud.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Spring Data JPA genera automáticamente el SQL a partir del nombre del método:
    // "SELECT * FROM usuarios WHERE correo = ?"
    Optional<Usuario> findByCorreo(String correo);

    boolean existsByCorreo(String correo);
}
