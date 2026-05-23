# Resumen de Documentación de Viperdbox
- [Introducción](#introducción)
- [Requisitos](#requisitos)
- [Arquitectura](#arquitectura)
- [Base de Datos](#base-de-datos-postgresql)

# Introducción

## Propósito

**Viperdbox** es una aplicación web social para descubrir, calificar, reseñar y organizar películas, inspirada en Letterboxd. El propósito de este proyecto es ofrecer a los amantes del cine una plataforma donde puedan:

- Registrar las películas que han visto, quieren ver o les gustan.
- Compartir opiniones mediante calificaciones (1 a 10 estrellas) y reseñas de texto.
- Interactuar con la comunidad (likes, visualización de perfiles).
- Descubrir tendencias mediante un dashboard con estadísticas reales.
- Moderar el contenido (para administradores).

## Alcance

**Dentro del alcance (MVP funcional):**

- Registro e inicio de sesión con autenticación JWT.
- Búsqueda de películas en tiempo real usando la API de TMDB.
- Calificación de películas (1-10) asociada a una reseña.
- Escritura y lectura de reseñas.
- Likes en reseñas.
- Listas personalizadas: favoritas, pendientes, vistas.
- Perfil propio y consulta de perfiles de otros usuarios.
- Dashboard con estadísticas globales (usuarios, reseñas, promedio, top películas, actividad reciente).
- Panel de administración (eliminar reseñas, ver usuarios).
- Interfaz responsive y oscura.

**Fuera del alcance (versiones futuras):**

- Autenticación de doble factor (2FA).
- Recomendaciones personalizadas.
- Filtros avanzados (género, año).
- Modo claro/oscuro.
- Aplicación móvil nativa.

## Tecnologías utilizadas
- Backend: Java , Spring Boot, PostgreSQL, JWT.
- Frontend: HTML, CSS, JavaScript, Bootstrap.
- API externa: TMDB API
# Requisitos

## Requisitos Funcionales (RF)
- RFO1(Registro de usuarios):El sistema permite crear cuentas con nombre, email y contraseña.
- RFO2(Inicio de sesión):Autenticacion con email y contraseña, devuelve token JWT.
- RFO3(Busqueda de peliculas):Buesqueda por  titulo usando la api TMBD API.
- RFO3.1(Calificacion de peliculas):El usuario puede calificar pelicuals de 1 a 10 estrellas la cual va a estar asociada aa una reseña.
- RFO3.2(Escrituras de reseñas):El usuario puede escribir reseñas y publicarlas (solo texto).
- RFO4(Like a reseñas):El usuario puede da "Me gusta" a reseñas de otros usuarios.
- RFO5(Listas personalizadas):El ususario podra agregar y eliminar peliculas de lista en la vista a detalle: favoritas, pendientes y vistas.
- RFO6(Perfil de usuario):Ver datos personales, reseñas y listas , podra hacer lo mkismo con otros usuarios.
- RFO7(Dashboard):Muestra estadisticas globales: total de usuarios, reseñas, promedio, top peliculas mas comentadas y actividad reciente.
- RFO8(Panel de administracion):El administrador puede ver a los usuarios registrados y eliminar reseñas.


## Requisitos No Funcionales (RNF)
- RNF1(Rendimiento): La pagina debe de cargar en menos de 3 segundos.
- RNF2(Seguridad):Contraseñas encriptadas (BCrypt).
- RNF3(Usabilidad):Interfaz responsive.

# Arquitectura

## Backend 
**Estructura de carpetas**:
backend/
├── config/ # Configuración BD, seguridad
├── controllers/ # Controladores REST
├── middleware/ # Autenticación JWT y verificación de admin
├── models/ # Entidades y acceso a datos
├── routes/ # Definición de endpoints
├── services/ # Servicios (TMDB)
├── .env
└── server.js
**Controladores principales:**
- authController.js: Registro, login, generacion de  JWT.
- movieController.js: Peliculas (Populasres, busqueda, detalle, reseñas, likes, promedio).
- profileController.js:perfil propio, listas (agregar, eliminar,verfificar).
- adminController.js: Panel de administracion y eliminacion de reseñas.

**Modelos (entidades):**

- User: id, name, email, password, role, created_at.
- Review: id, user_id, movie_id, movie_title, content, rating, like_count, created_at.
- List: id, user_id, name (favoritas/pendientes/vistas), created_at.
- ListMovie: id, list_id, movie_id, movie_title, added_at.
- Like: id, user_id, review_id, created_at.

## Frontend (HTML/CSS/JS)

**Estructura de carpetas:**

frontend/
├── views/  Archivos HTML
├── css/styles.css
└── js/main.js
**Funciones principales en main.js:**

- login(), register(), logout() – autenticación.
- loadPopularMovies(), `searchMovies() – catálogo y paginación.
- loadMovieDetail() – detalle de película (reseñas, likes, listas).
- loadMyProfile() – perfil del usuario.
- loadOtherProfile(userId) – perfil de otro usuario.
- loadDashboard() – estadísticas.
- loadAdminDashboard() – panel de administración.

## Base de Datos (PostgreSQL)

**Tablas principales:**
1. Users
- Campo : Id
- Tipo : Serial
- Descripcion: PK.

- Campo : name
- Tipo : Varchar(100)
- Descripcion:

- Campo : email
- Tipo : Varchar(255)
- Descripcion: unico

- Campo : password
- Tipo : Varchar(255)
- Descripcion: Hash BCrypt

- Campo : role
- Tipo : Varchar(20)
- Descripcion: "user" o "admin"

- Campo : create_at
- Tipo : TIMESTAMP
- Descripcion:

2. reviews
- Campo : id
- Tipo : SERIAL
- Descripcion: PK

- Campo : user_id
- Tipo : INT
- Descripcion: FK a users(id)

- Campo : movie_id
- Tipo : INT
- Descripcion: ID TMDB

- Campo : movie_title
- Tipo : VARCHAR(255)
- Descripcion: cache

- Campo : content
- Tipo : TEXT
- Descripcion:

- Campo : rating
- Tipo : INT
- Descripcion: 1-10

- Campo : like_count
- Tipo : INT
- Descripcion:

- Campo : created_at
- Tipo : TIMESTAMP
- Descripcion:

3. review_likes
- Campo : id
- Tipo : SERIAL PK
- Descripcion:

- Campo : user_id
- Tipo : INT FK
- Descripcion:

- Campo : review_id
- Tipo : INT FK
- Descripcion:

- Campo : created_at
- Tipo : TIMESTAMP
- Descripcion:

4. lists
- Campo : id
- Tipo : SERIAL PK
- Descripcion:

- Campo : user_id
- Tipo : INT FK
- Descripcion:

- Campo : name
- Tipo : VARCHAR(50)
- Descripcion:

5. list_movies
- Campo : id
- Tipo : SERIAL PK
- Descripcion:

- Campo : list_id
- Tipo : INT FK
- Descripcion:

- Campo : movie_id
- Tipo : INT
- Descripcion:

- Campo : movie_title
- Tipo : VARCHAR(255)
- Descripcion:

- Campo : added_at
- Tipo : TIMESTAMP
- Descripcion:



