# Imagen liviana de Nginx: sirve archivos estáticos (HTML, CSS, JS)
FROM nginx:latest

# Borramos el contenido de ejemplo que trae Nginx por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiamos todo nuestro sitio (HTML, CSS, JS, componentes, páginas, media)
# a la carpeta que Nginx sirve por defecto
COPY . /usr/share/nginx/html

# Puerto en el que Nginx escucha dentro del contenedor
EXPOSE 80

# Nginx ya trae su propio ENTRYPOINT/CMD, no hace falta agregarlo

# Nos aseguramos de que todos los archivos y carpetas copiadas tengan permiso
# de lectura para "otros" (o) y que las carpetas tengan permiso de "ejecución/entrada" (X).
#
# Por qué es necesario: el proceso maestro de Nginx corre como root, pero los
# procesos "worker" (los que realmente atienden las peticiones HTTP) corren con
# un usuario sin privilegios. Si las carpetas copiadas no tienen permiso de
# entrada para ese usuario, Nginx no puede ni siquiera "atravesarlas" para leer
# los archivos de adentro, aunque el archivo en sí sea legible.
#
# Esto ocurre típicamente cuando el código se copia desde un sistema Windows
# (que no maneja permisos tipo Unix) hacia Linux: las carpetas terminan con
# permisos restrictivos (ej: drwx------) y Nginx responde 403 Forbidden al
# intentar servir cualquier archivo dentro de ellas (CSS, JS, imágenes, etc).
RUN chmod -R o+rX /usr/share/nginx/html
