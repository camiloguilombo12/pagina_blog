# ---------- ETAPA 1: Construcción (build) ----------
# Usamos una imagen con Maven + JDK 17 solo para compilar el proyecto
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copiamos primero el pom.xml para aprovechar la caché de dependencias de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiamos el resto del código fuente y construimos el .jar (sin correr los tests)
COPY src ./src
RUN mvn clean package -DskipTests

# ---------- ETAPA 2: Ejecución (runtime) ----------
# Imagen final: mucho más liviana, solo con el JRE (no todo Maven)
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiamos SOLO el .jar generado en la etapa anterior
COPY --from=build /app/target/crud-usuarios.jar app.jar

# Puerto que expone el backend dentro del contenedor
EXPOSE 8080

# Comando que arranca la aplicación Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
