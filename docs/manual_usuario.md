**Versión:** 1.0  
**Fecha:** 22 de mayo de 2026  
**Aplicación:** Viperdbox  
**Equipo de desarrollo:** The Reservoir Dogs  
## 1. Introducción
Viperdbox es un aaplicacionweb social que te permitira descubir, reseñar y organizar tu peliculas en lista personalizadas (Pendientes, vistas, favoritas) estas fuertemente inspirada en plataformas como Letterboxd.
---

## 2. Primeros pasos

### 2.1. Acceso a la aplicación
Abre tu navegador de preferencia(Opera, Edge, Chrome) y ve a la URL por ejemplo en este caso  `http://localhost:3000` si es ejecutada localmente.

### 2.2. Registro de una cuenta
1. En la pantalla de inicio, haz clic en "Registrarse".
2. Conpleta el. formulario con los siguientes datos 
   - "Nombre completo" (Como te veran los demas usuarios)
   - "Correo electronico" (debe ser unico, se usara para iniciar sesion).
   - "Contraseña"(Elige una segura)
   - "Comfirmar contraseña" (escribe la contraseña de nuevo para verificar)
3. Da click en el boton de "Registrarse".
4. Si los datos son validos, seras redirigido automaticamente al catalogo de peliculas.
**Nota:** Si el correo electrónico ya está registrado, verás un mensaje de error. Debes usar otro correo.

### 2.3. Inicio de sesión
1. En la pantalla principal, haz clic en "Iniciar sesion".
2. Introduce tu "Correo electronico" y "Contraseña".
3. Haz clic en "Ingresar"
4. Si las credenciales son correctas, accederas al catalogo de peliculas.

### 2.4. Cierre de sesión
- En cualquier panatalla que estes, haz clic en "Cerrar sesion" en la barra de navegacion.
seras redirigido a la pantalla de inicion de sesion.

## 3. Explorando el catálogo de películas
Cuando hayas iniciado sesion la pantalla principal sera el "catalogo" en este veras las pelicullas mas populares del momento.

### 3.1. Búsqueda de películas
1. Escribe el titulo de la pelicula en la barra de busqueda.
2. Haz clic en el boton "Buscar"
3. Los resultados se moostraran en tarjetas con poster, titulo y año.

### 3.2. Limpiar la búsqueda

- Haz clic en el botón "Limpiar"para volver a ver las películas populares.

### 3.3. Paginación
- usa los botones "◀" (anterior), losn numeros de pagin y "▶"(siguiente) para navegar entre los resultados.
- cada pagina muestra 20 peliculas.

### 3.4. Ver el detalle de una película
- Haz clic en la tarjeta de la pelicula que te interese y se abrira la vista a detalle.

## 4. Detalle de una película
En la vista a detalle podras encontrar toda la infolracionm de la pelicula:
- "Poster" (Imagen grande)
-  "Titulo","año","duracion" y "generos"
-  "Calificacion de TMDB" (Global) y "Calificacion de promedio de la comunidad de Viperdbox".
-  "Sipnosis"
-  "Boton de ver trailer"(abre un modal con el video de Youtube).
-  "Reparto principal"(Fotos, nombre de los acyores y sus roles en las peliculas).
-  "Boton para listas":Favoritas, pendientes, vistas.
- "Formulario para escribir una reseña" 
- "Reseñas de la comunidad"(Con posibilidad de dar "Me gusta").
- "Reseñas externas de TMDB"

## 5. Calificar y escribir reseñas

### 5.1. Calificación (1 a 10 estrellas)
1. En la pagina de detalle, deplazate hasta "Escribe tu reseña".
2. Selecciona tu calificacion haciendo clic en las estrellas cuando estes haciendo la reseña.(1 a 10 estrellas).

### 5.2. Escribir una reseña de texto
1. En el mismo formulario, escribe tu opinion hacerca de la pelicula en el campo de texto (Maximo 2000 caracteres).
2. haz clic en "Publicar reseña".
3. La pagina se recargara y la reseña aparecera en la seccion "Reseñas de la comunidad de viperdbox". Ademas, la calificacio promedio de la pelicula se actualizara.

### 5.3. Dar "me gusta" a una reseña

- Cada reseña de la comunidad tiene un botón con un corazón (❤️) y un contador.
- Haz clic en el corazón para dar "me gusta". Vuelve a clicar para quitarlo.
- Solo puedes dar "me gusta" una vez por reseña.

### 5.4. Ver el perfil del autor de una reseña
El nombre del usuario en la reseña es un enlace haz clic en el para ver su perfil publico(Sus reseñas y listas)

## 6. Listas personalizadas

Viperdbox te permite organizar tus películas en tres listas:

- "Favoritas": Peliculas que te gustaron.
- "Pendientes": Peliculas que quieres ver en un futuro.
- "Vistas": Peliculas que ya viste.

### 6.1. Agregar una película a una lista

1. Ve a la vista a detalle de la pelicula de tu interes.
2. Haz clic en el boton correspondiente :"Favoritas","Pendientes" o "Vistas".
3. El boton cambiara de color y saldra un mensaje para indicarf que la pelicula se ha agregado correctamente.

### 6.2. Eliminar una película de una lista

- Realiza la misma accion de agregar , dar clic en la lista para eliminar la pelicula.

### 6.3. Ver tus listas en tu perfil
1. Haz clic en "Mi perfil" en la barra de navegacion.
2. Ve hasta la seccion "Mis listas".
3. Se vera cada lista con las peliculas que hayas agregado a cada una.
4. Haz clic en cualquier titulo para ir a la vista detalle de esa pelicula.

## 7. Perfil de usuario

### 7.1. Tu perfil
- Accede desde la seccion "Mi perfil" en la barra de navegacion.
- Encontraras
  - Datos personales:nombre, correo electronico y fecha de registro.
  - contadores:numero de peliculas que tengas en cda lista.
  - Reseñas: Todas las reseñas que hayas publicado con titulo de la pelicula, calificacion, contenido de la reseña y fecha.
- Listas:Las peliculas que has guardado en tus listas, si le das clic te redirigira a la vista a detalle de esta misma.
- 
### 7.2. Perfil de otro usuario
- En la seccion de reseñas da clic al nombre del autor y se abrira al perfil publico del usuario.
- En el perfil se podra ver sus reseñas y listas.

## 8. Dashboard de estadísticas
1. Haz clic en "Dashboard" en la barra de navegacion.
2. Se mostrara la informacion global de la comunidad:
   - "Usuarios registrados":Total de cuentas.
   - "Reseñas escritas": Total de reseñas publicadas.
   - "Calificacion promedio": Media de todas las calificaciones (de 1 a 10).
   - "Peliculas mas comentadas":top 5 de peliculas con mas reseñas,
   - "Actividad reciente":Ultimas 10 reseñas, con el nombre del usuario y el titulo de la peliculas , ambos son clickeables para ir a su respectiva vista.

## 9. Panel de administración (solo para administradores)
>Esta seccion solo va a ser visible para usuarios con el rol de admin, para asignar este rol tiene que ser echo por el administrador de la base de datos.(No se puede obtener es rol de ningun otro modo).
1. Cuando este con el rol de administrador, ve a /admin.html(No sale en el menu por defecto debes buscarlo con la URL).
2. El panel de admin muestra:
   - "Estadisticas globales": Total de usuarios, reseñas, cantidad de peliculas reseñadas.
   - "Listado de todos los usuarios registrados"
   - "Listado de reseñas recienstes", con un boton para eliminarlas.
3. Como eliminar una reseña:
  - Haz clic en el boton de eliminar
  - Confirma en la ventana emergente.
  - La reseña se eliminara permanentemente y los contadores se actualizaran.


## 10. Solución de problemas
1. (Problema)No puedo inicar sesion 
  - (Posible causa)Credenciales incorrectas 
  -(Solucion) Verifica que el correo y las contraseñas sean correctos.
2. (Problema)La pagina a detalle muestra "Error al cargar detalles".
  - (Posible causa) Problema de conexion con la API.
  - (Solucion):Revisa tu conexion a internet, si el problema no se revuelve puede ser un error externo con el servicio de la API.
3. (Problema)El Dashboard muestra todo en cero.
   - (Posible causa) Aun no hay reseñas o usuarios.
   - (Solucion) Escribe algunas reseñas para generar estadisticas.
4. (Problema) Las imagenes de los posters aparecen rotas.
   - (Posible causa) Problema de red.
   - (Solucion) Recarga la pagina. Si no se soluciona, puede ser un problema temporal de TMDB.

## 11. Posibles preguntas (FAQ)

**P1: ¿Puedo cambiar mi contraseña?**  
R1: Por el momento no hay una opción desde la interfaz. Contacta al administrador si necesitas restablecerla.

**P2: ¿Cómo elimino una reseña que he escrito?**  
R2: Solo los administradores pueden eliminar reseñas. Si necesitas eliminar una reseña propia, pídele al administrador que lo haga.

**P3: ¿Puedo agregar una misma película a varias listas?**  
R3: Las peliculas puedn esta en todas las listas.

**P4: ¿Se pueden buscar películas por género o año?**  
R5: Por ahora, la búsqueda solo es por título. Los filtros de género y año no están implementados.

**P5: ¿Cómo puedo ser administrador?**  
R6: El rol se asigna directamente en la base de datos. Contacta con el equipo de desarrollo.

## 12. Glosario

- **API:** Interfaz de programación que permite que dos aplicaciones se comuniquen.
- **Bootstrap:** Framework de diseño web para crear interfaces responsivas.
- **JWT (JSON Web Token):** Token seguro para autenticación entre cliente y servidor.
- **PostgreSQL:** Sistema de gestión de bases de datos relacional.
- **TMDB (The Movie Database):** Base de datos en línea que proporciona información de películas.
- **Spring Boot:** Framework de Java para el desarrollo de backend.
- 
## 13. Contacto y soporte

Si encuentras algún problema no cubierto en este manual, puedes contactar al equipo de desarrollo a través del repositorio oficial de GitHub:  
[https://github.com/juanestebanlugo7-lang/viperdbox]