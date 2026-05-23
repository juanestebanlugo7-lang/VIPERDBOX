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
Users
| Campo | Tipo| Descripcion|
| Id    |Serial| PK|
| name  |Vachar(100)| 
| email | Varchar(255)|unico|
|password|Varchar(255)| Hash BCrypt|
|role    |Varchar(20)| "user" o "admin"|
|create_at| TIMESTAMP

reviews
| Campo | Tipo| Descripcion|
| id    |SERIAL | PK|
|user_id|INT | FK a users(id)
|movie_id | INT | ID TMDB|
| movie_title| VARCHAR(255)| cache|
|content | TEXT |
|rating |INT | 1-10 |
|like_count| INT |
|created_at | TIMESTAMP|

review_likes
| Campo | Tipo |
|id | SERIAL PK|
|user_id| INT FK|
|review_id| INT FK|
| created_at| TIMESTAMP

lists
| Campo | Tipo |
|id | SERIAL PK|
|user_id | INT FK|
|name | VARCHAR (50)|

list_movies
| Campo | Tipo |
|id     | SERIAL PK|
|list_id | INT FK|
|movie_id|INT|
|movie_title| VARCHAR (255)
|added_at | TIMESTAMP|



