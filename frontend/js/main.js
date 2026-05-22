// ==================== GLOBALES ====================
const API_BASE = 'http://localhost:3000/api';

function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
}

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

// ==================== AUTENTICACIÓN ====================
async function login(email, password) {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            setToken(data.token);
            window.location.href = '/catalog.html';
        } else {
            alert(data.error || 'Error al iniciar sesión');
        }
    } catch (err) {
        alert('Error de red');
    }
}

async function register(name, email, password) {
    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            setToken(data.token);
            window.location.href = '/catalog.html';
        } else {
            alert(data.error || 'Error en el registro');
        }
    } catch (err) {
        alert('Error de red');
    }
}

function logout() {
    setToken(null);
    window.location.href = '/login.html';
}

// ==================== CATÁLOGO ====================
async function loadPopularMovies(page = 1) {
    const grid = document.getElementById('moviesGrid');
    if (!grid) return;
    grid.innerHTML = '<p>Cargando...</p>';
    try {
        const res = await fetch(`${API_BASE}/movies/popular?page=${page}`, { headers: getHeaders() });
        const data = await res.json();
        renderMovies(data.results);
        renderPagination(data.page, data.total_pages, 'popular');
    } catch (err) {
        grid.innerHTML = '<p>Error cargando películas</p>';
    }
}

async function searchMovies(page = 1) {
    const query = document.getElementById('searchInput')?.value.trim();
    if (!query) return;
    const grid = document.getElementById('moviesGrid');
    if (grid) grid.innerHTML = '<p>Buscando...</p>';
    try {
        const res = await fetch(`${API_BASE}/movies/search?query=${encodeURIComponent(query)}&page=${page}`, { headers: getHeaders() });
        const data = await res.json();
        renderMovies(data.results);
        renderPagination(data.page, data.total_pages, 'search');
    } catch (err) {
        if (grid) grid.innerHTML = '<p>Error en la búsqueda</p>';
    }
}

function renderMovies(movies) {
    const grid = document.getElementById('moviesGrid');
    if (!grid) return;
    if (!movies || movies.length === 0) {
        grid.innerHTML = '<p>No se encontraron películas.</p>';
        return;
    }
    grid.innerHTML = '';
    movies.forEach(movie => {
        const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+poster';
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('data-id', movie.id);
        card.innerHTML = `
            <img src="${poster}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.release_date?.substring(0,4) || '?'}</p>
        `;
        card.addEventListener('click', () => {
            window.location.href = `/movieDetail.html?id=${movie.id}`;
        });
        grid.appendChild(card);
    });
}

function renderPagination(current, total, type) {
    const pagDiv = document.getElementById('pagination');
    if (!pagDiv) return;
    pagDiv.innerHTML = '';

    // Si no hay páginas o solo una, no mostramos nada (opcional)
    if (total <= 1) return;

    // Botón "Anterior"
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '◀';
    prevBtn.disabled = current === 1;
    prevBtn.onclick = () => {
        if (type === 'popular') loadPopularMovies(current - 1);
        else if (type === 'search') searchMovies(current - 1);
    };
    pagDiv.appendChild(prevBtn);

    // Calcular rango de páginas a mostrar (máximo 5 a cada lado, total máximo 10)
    let startPage = Math.max(1, current - 4);
    let endPage = Math.min(total, startPage + 9);
    if (endPage - startPage < 9) startPage = Math.max(1, endPage - 9);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.onclick = () => {
            if (type === 'popular') loadPopularMovies(i);
            else if (type === 'search') searchMovies(i);
        };
        if (i === current) btn.disabled = true;
        pagDiv.appendChild(btn);
    }

    // Botón "Siguiente"
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '▶';
    nextBtn.disabled = current === total;
    nextBtn.onclick = () => {
        if (type === 'popular') loadPopularMovies(current + 1);
        else if (type === 'search') searchMovies(current + 1);
    };
    pagDiv.appendChild(nextBtn);
}
// ==================== DASHBOARD ====================
async function loadDashboard() {
    const token = getToken();
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/dashboard`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Error al cargar estadísticas');
        const data = await res.json();

        // Actualizar tarjetas de estadísticas
        document.getElementById('totalUsers').textContent = data.totalUsers;
        document.getElementById('totalReviews').textContent = data.totalReviews;
        document.getElementById('avgRating').textContent = data.avgRating.toFixed(1);

        // Películas más comentadas (clickeables)
        const topMoviesDiv = document.getElementById('topMovies');
        if (data.topMovies.length === 0) {
            topMoviesDiv.innerHTML = '<p>No hay reseñas aún.</p>';
        } else {
            topMoviesDiv.innerHTML = '';
            data.topMovies.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.className = 'top-movie-item';
                movieCard.innerHTML = `
                    <div class="movie-title">
                        <a href="/movieDetail.html?id=${movie.movie_id}" class="movie-link">${movie.movie_title}</a>
                    </div>
                    <div class="movie-stats">⭐ ${movie.avg_rating} (${movie.review_count} reseñas)</div>
                `;
                topMoviesDiv.appendChild(movieCard);
            });
        }

        // Actividad reciente (clickeable: nombre del usuario y película)
        const activityDiv = document.getElementById('recentActivity');
        if (data.recentActivity.length === 0) {
            activityDiv.innerHTML = '<p>No hay actividad reciente.</p>';
        } else {
            activityDiv.innerHTML = '';
            data.recentActivity.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.innerHTML = `
                    <div class="activity-user">
                        <a href="/otherProfile.html?id=${activity.user_id}" class="user-link">${activity.user_name}</a>
                    </div>
                    <div class="activity-review">
                        <a href="/movieDetail.html?id=${activity.movie_id}" class="movie-link"><strong>${activity.movie_title}</strong></a> - ⭐ ${activity.rating}/10
                    </div>
                    <div class="activity-date">${new Date(activity.created_at).toLocaleString()}</div>
                `;
                activityDiv.appendChild(activityItem);
            });
        }
    } catch (err) {
        console.error('Error en loadDashboard:', err);
        document.getElementById('topMovies').innerHTML = '<p>Error al cargar datos. Intenta de nuevo.</p>';
    }
}

// ==================== DETALLE COMPLETO ====================
async function loadMovieDetail() {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');
    if (!movieId) {
        window.location.href = '/catalog.html';
        return;
    }

    const container = document.getElementById('detailContainer');
    if (!container) return;
    container.innerHTML = '<div class="loading">Cargando detalles...</div>';

    try {
        // Obtener datos de la película (TMDB + nuestras reseñas)
        const res = await fetch(`${API_BASE}/movies/${movieId}`, { headers: getHeaders() });
        const data = await res.json();

        if (!res.ok || !data.movie) {
            container.innerHTML = `<div class="error-container"><p>${data.error || 'No se pudo cargar la película.'}</p><button class="back-btn" onclick="window.location.href='/catalog.html'">← Volver al catálogo</button></div>`;
            return;
        }

        const movie = data.movie;
        const videos = data.videos || [];
        const credits = data.credits || [];
        const tmdbReviews = data.reviews || [];

        // Obtener promedio local y reseñas de nuestra BD
        const localReviewsRes = await fetch(`${API_BASE}/movies/${movieId}/reviews`, { headers: getHeaders() });
        const localReviews = localReviewsRes.ok ? await localReviewsRes.json() : [];
        const avgRes = await fetch(`${API_BASE}/movies/${movieId}/average`, { headers: getHeaders() });
        const avgData = avgRes.ok ? await avgRes.json() : { average: 0, total: 0 };
        const communityAvg = avgData.average;
        const totalCommunityVotes = avgData.total;

        // Datos básicos
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+poster';
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Desconocido';
        const genres = movie.genres ? movie.genres.map(g => g.name).join(', ') : 'No especificado';
        const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';
        const tmdbRating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        const trailer = videos.find(v => v.type === 'Trailer') || videos.find(v => v.type === 'Teaser');
        const trailerLink = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

        // HTML principal (sin emojis en botones de listas)
        let html = `
            <div class="detail-wrapper">
                <div class="detail-poster">
                    <img src="${posterUrl}" alt="${movie.title}">
                </div>
                <div class="detail-info">
                    <h2>${movie.title}</h2>
                    <div class="detail-meta">
                        <span class="year">${year}</span>
                        <span class="runtime">${runtime}</span>
                        <span class="genres">${genres}</span>
                    </div>
                    <div class="rating-tmdb">
                        <span class="stars">⭐ ${tmdbRating}</span>
                        <span class="votes">(${movie.vote_count} votos TMDB)</span>
                    </div>
                    <div class="rating-community">
                        <span class="stars">⭐ ${communityAvg > 0 ? communityAvg.toFixed(1) : 'N/A'}</span>
                        <span class="votes">(${totalCommunityVotes} votos comunidad)</span>
                    </div>
                    <div class="action-buttons">
                        <button class="list-btn fav">Favoritas</button>
                        <button class="list-btn pending">Pendientes</button>
                        <button class="list-btn watched">Vistas</button>
                    </div>
                    <div class="synopsis">
                        <h3>Sinopsis</h3>
                        <p>${movie.overview || 'No disponible'}</p>
                    </div>
                    <div class="trailer-link">
                        ${trailerLink ? `<button class="trailer-btn" data-trailer="${trailerLink}">▶ Ver tráiler</button>` : ''}
                        <button class="back-btn" onclick="window.location.href='/catalog.html'">← Volver al catálogo</button>
                    </div>
                </div>
            </div>
        `;

        // Reparto principal
        if (credits.length > 0) {
            html += `<div class="cast-section"><h3>Reparto principal</h3><div class="cast-list">`;
            credits.forEach(actor => {
                const actorPhoto = actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/185x278?text=No+photo';
                html += `
                    <div class="cast-card">
                        <img src="${actorPhoto}" alt="${actor.name}">
                        <div class="cast-name">${actor.name}</div>
                        <div class="cast-character">${actor.character || ''}</div>
                    </div>
                `;
            });
            html += `</div></div>`;
        } else {
            html += `<div class="cast-section"><p>No hay información de reparto disponible.</p></div>`;
        }

        // Formulario para escribir reseña
        html += `
            <div class="write-review-section">
                <h3>Escribe tu reseña</h3>
                <div class="rating-input">
                    <label>Tu calificación (1 a 10):</label>
                    <div class="star-rating">
                        ${Array.from({ length: 10 }, (_, i) => `<span class="star" data-value="${i+1}">★</span>`).join('')}
                    </div>
                    <input type="hidden" id="ratingValue" value="0">
                </div>
                <textarea id="reviewContent" rows="4" placeholder="¿Qué te pareció la película?" maxlength="2000"></textarea>
                <button id="submitReviewBtn" class="submit-review-btn">Publicar reseña</button>
            </div>
        `;

        // Reseñas de la comunidad (locales) - con nombre clickeable
        html += `<div class="reviews-section"><h3>Reseñas de la comunidad de Viperdbox</h3>`;
        if (localReviews.length > 0) {
            localReviews.forEach(review => {
                html += `
                    <div class="review-card" data-review-id="${review.id}">
                        <div class="review-header">
                            <span class="review-author" data-user-id="${review.user_id}" style="cursor: pointer;">${review.user_name}</span>
                            <span class="review-rating">⭐ ${review.rating}/10</span>
                            <span class="review-date">${new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <p class="review-content">${review.content}</p>
                        <div class="like-section">
                            <button class="like-btn" data-review-id="${review.id}">❤️ <span class="like-count">${review.like_count || 0}</span></button>
                        </div>
                    </div>
                `;
            });
        } else {
            html += `<p>No hay reseñas de la comunidad aún. ¡Sé el primero en escribir una!</p>`;
        }
        html += `</div>`;

        // Reseñas de TMDB (opcional)
        if (tmdbReviews.length > 0) {
            html += `<div class="reviews-section"><h3>Reseñas de TMDB</h3>`;
            tmdbReviews.forEach(review => {
                const rating = review.author_details?.rating ? `⭐ ${review.author_details.rating}/10` : '';
                html += `
                    <div class="review-card tmdb-review">
                        <div class="review-header">
                            <span class="review-author">${review.author}</span>
                            <span class="review-rating">${rating}</span>
                        </div>
                        <p class="review-content">${review.content.length > 300 ? review.content.substring(0, 300) + '...' : review.content}</p>
                        <a href="${review.url}" target="_blank" class="read-more">Leer más en TMDB</a>
                    </div>
                `;
            });
            html += `</div>`;
        }

        container.innerHTML = html;

        // ========== INTERACTIVIDAD ==========
        const movieTitle = movie.title;

        // 1. Selector de estrellas (calificación 1-10)
        const stars = document.querySelectorAll('.star');
        const ratingInput = document.getElementById('ratingValue');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = parseInt(star.dataset.value);
                ratingInput.value = value;
                stars.forEach(s => {
                    if (parseInt(s.dataset.value) <= value) s.classList.add('active');
                    else s.classList.remove('active');
                });
            });
        });

        // 2. Publicar reseña
        const submitBtn = document.getElementById('submitReviewBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', async () => {
                const rating = parseInt(ratingInput.value);
                const content = document.getElementById('reviewContent').value.trim();
                if (!rating || rating < 1 || rating > 10) {
                    alert('Por favor selecciona una calificación de 1 a 10 estrellas.');
                    return;
                }
                if (!content) {
                    alert('Por favor escribe tu reseña.');
                    return;
                }
                try {
                    const res = await fetch(`${API_BASE}/movies/${movieId}/reviews`, {
                        method: 'POST',
                        headers: getHeaders(),
                        body: JSON.stringify({ rating, content })
                    });
                    const data = await res.json();
                    if (res.ok) {
                        alert('¡Reseña publicada!');
                        window.location.reload();
                    } else {
                        alert(data.error || 'Error al publicar reseña');
                    }
                } catch (err) {
                    console.error(err);
                    alert('Error de red');
                }
            });
        }

        // 3. Botones de listas (sin emojis)
        const favBtn = document.querySelector('.list-btn.fav');
        const pendingBtn = document.querySelector('.list-btn.pending');
        const watchedBtn = document.querySelector('.list-btn.watched');

        async function updateListStatus(listName, btn) {
            try {
                const res = await fetch(`${API_BASE}/profile/lists/${listName}/${movieId}/check`, { headers: getHeaders() });
                const data = await res.json();
                if (data.inList) btn.classList.add('active');
                else btn.classList.remove('active');
            } catch (err) {}
        }

        async function handleListClick(listName, btn) {
            const isActive = btn.classList.contains('active');
            const url = `${API_BASE}/profile/lists/${listName}`;
            if (isActive) {
                const deleteUrl = `${url}/${movieId}`;
                const res = await fetch(deleteUrl, { method: 'DELETE', headers: getHeaders() });
                if (res.ok) {
                    btn.classList.remove('active');
                    alert(`Película eliminada de ${listName}`);
                } else {
                    alert('Error al eliminar');
                }
            } else {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify({ movieId, movieTitle })
                });
                if (res.ok) {
                    btn.classList.add('active');
                    alert(`Película agregada a ${listName}`);
                } else {
                    alert('Error al agregar');
                }
            }
        }

        if (favBtn) {
            await updateListStatus('favoritas', favBtn);
            favBtn.addEventListener('click', () => handleListClick('favoritas', favBtn));
        }
        if (pendingBtn) {
            await updateListStatus('pendientes', pendingBtn);
            pendingBtn.addEventListener('click', () => handleListClick('pendientes', pendingBtn));
        }
        if (watchedBtn) {
            await updateListStatus('vistas', watchedBtn);
            watchedBtn.addEventListener('click', () => handleListClick('vistas', watchedBtn));
        }

        // 4. Likes en reseñas
        document.querySelectorAll('.like-btn').forEach(btn => {
            const reviewId = btn.dataset.reviewId;
            fetch(`${API_BASE}/movies/reviews/${reviewId}/like`, { headers: getHeaders() })
                .then(res => res.json())
                .then(data => {
                    const countSpan = btn.querySelector('.like-count');
                    if (countSpan) countSpan.textContent = data.count;
                    if (data.liked) btn.classList.add('liked');
                })
                .catch(console.error);
            btn.addEventListener('click', async () => {
                try {
                    const res = await fetch(`${API_BASE}/movies/reviews/${reviewId}/like`, { method: 'POST', headers: getHeaders() });
                    const data = await res.json();
                    const countSpan = btn.querySelector('.like-count');
                    if (countSpan) countSpan.textContent = data.count;
                    if (data.liked) btn.classList.add('liked');
                    else btn.classList.remove('liked');
                } catch (err) {
                    console.error(err);
                }
            });
        });

        // 5. Modal de tráiler
        const trailerBtn = document.querySelector('.trailer-btn');
        if (trailerBtn && trailerBtn.dataset.trailer) {
            trailerBtn.addEventListener('click', () => {
                const trailerUrl = trailerBtn.dataset.trailer.replace('watch?v=', 'embed/');
                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <iframe src="${trailerUrl}" allowfullscreen></iframe>
                    </div>
                `;
                document.body.appendChild(modal);
                modal.style.display = 'flex';
                modal.querySelector('.close-modal').onclick = () => modal.remove();
                window.onclick = (e) => { if (e.target === modal) modal.remove(); };
            });
        }

        // 6. Click en nombre del autor (ir a perfil)
        container.addEventListener('click', (e) => {
            const authorSpan = e.target.closest('.review-author');
            if (authorSpan && authorSpan.dataset.userId) {
                const userId = authorSpan.dataset.userId;
                window.location.href = `/otherProfile.html?id=${userId}`;
            }
        });

    } catch (err) {
        console.error('Error en loadMovieDetail:', err);
        container.innerHTML = '<div class="error-container"><p>Error de conexión. Intenta de nuevo más tarde.</p><button class="back-btn" onclick="window.location.href=\'/catalog.html\'">← Volver al catálogo</button></div>';
    }
}
// Repetir para pendientes y vistas (cambiar listName y botón)

// ==================== PERFIL ====================
async function loadMyProfile() {
    const token = getToken();
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/profile/me`, { headers: getHeaders() });
        const data = await res.json();

        if (!res.ok || !data.user) {
            document.getElementById('profileInfo').innerHTML = `<p>Error: ${data.error || 'No se pudo cargar el perfil'}</p>`;
            return;
        }

        // Datos del usuario
        document.getElementById('profileName').textContent = data.user.name;
        document.getElementById('profileEmail').textContent = data.user.email;
        document.getElementById('profileSince').textContent = new Date(data.user.created_at).toLocaleDateString();

        // Reseñas del usuario
        const reviewsDiv = document.getElementById('myReviews');
        if (data.reviews && data.reviews.length > 0) {
            reviewsDiv.innerHTML = data.reviews.map(r => `
                <div class="review-item">
                    <strong>${r.movie_title}</strong> - ⭐ ${r.rating}/10<br>
                    ${r.content}<br>
                    <small>${new Date(r.created_at).toLocaleDateString()}</small>
                </div>
            `).join('');
        } else {
            reviewsDiv.innerHTML = '<p>No has escrito ninguna reseña aún.</p>';
        }

        // Listas del usuario (con enlaces)
        const listsContainer = document.getElementById('listsContainer');
        if (listsContainer) {
            const lists = data.lists || [];
            if (lists.length === 0) {
                listsContainer.innerHTML = '<p>No tienes listas aún. Agrega películas desde su página de detalle.</p>';
            } else {
                listsContainer.innerHTML = '';
                let favCount = 0, pendCount = 0, viewCount = 0;
                for (const list of lists) {
                    const listName = list.name;
                    const movies = list.movies || [];
                    if (listName === 'favoritas') favCount = movies.length;
                    else if (listName === 'pendientes') pendCount = movies.length;
                    else if (listName === 'vistas') viewCount = movies.length;

                    const listDiv = document.createElement('div');
                    listDiv.className = 'list-section';
                    const displayName = listName.charAt(0).toUpperCase() + listName.slice(1);
                    listDiv.innerHTML = `<h3>${displayName}</h3><div class="list-movies"></div>`;
                    const moviesDiv = listDiv.querySelector('.list-movies');
                    if (movies.length === 0) {
                        moviesDiv.innerHTML = '<p>No hay películas en esta lista.</p>';
                    } else {
                        movies.forEach(movie => {
                            const link = document.createElement('a');
                            link.href = `/movieDetail.html?id=${movie.id}`;
                            link.textContent = movie.title;
                            link.className = 'list-movie-link';
                            moviesDiv.appendChild(link);
                            moviesDiv.appendChild(document.createElement('br'));
                        });
                    }
                    listsContainer.appendChild(listDiv);
                }
                document.getElementById('favCount').textContent = favCount;
                document.getElementById('pendCount').textContent = pendCount;
                document.getElementById('viewCount').textContent = viewCount;
            }
        }
    } catch (err) {
        console.error('Error en loadMyProfile:', err);
        document.getElementById('profileInfo').innerHTML = '<p>Error al cargar perfil. Revisa tu conexión.</p>';
    }
}
async function loadOtherProfile(userId) {
    const token = getToken();
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/profile/user/${userId}`, { headers: getHeaders() });
        const data = await res.json();
        if (!res.ok || !data.user) {
            document.getElementById('profileName').textContent = 'Error';
            return;
        }

        const user = data.user;
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profileSince').textContent = new Date(user.created_at).toLocaleDateString();
        document.getElementById('userNameSpan').textContent = user.name;
        document.getElementById('userNameListSpan').textContent = user.name;

        // Reseñas
        const reviewsDiv = document.getElementById('otherReviews');
        if (data.reviews && data.reviews.length > 0) {
            reviewsDiv.innerHTML = data.reviews.map(r => `
                <div class="review-item">
                    <strong>${r.movie_title}</strong> - ⭐ ${r.rating}/10<br>
                    ${r.content}<br>
                    <small>${new Date(r.created_at).toLocaleDateString()}</small>
                </div>
            `).join('');
        } else {
            reviewsDiv.innerHTML = '<p>Este usuario no ha escrito ninguna reseña aún.</p>';
        }

        // Listas
        const listsContainer = document.getElementById('otherLists');
        const lists = data.lists || [];
        if (lists.length === 0) {
            listsContainer.innerHTML = '<p>Este usuario no tiene películas en listas.</p>';
        } else {
            listsContainer.innerHTML = '';
            let favCount = 0, pendCount = 0, viewCount = 0;
            for (const list of lists) {
                const listName = list.name;
                const movies = list.movies || [];
                if (listName === 'favoritas') favCount = movies.length;
                else if (listName === 'pendientes') pendCount = movies.length;
                else if (listName === 'vistas') viewCount = movies.length;

                const listDiv = document.createElement('div');
                listDiv.className = 'list-section';
                const displayName = listName.charAt(0).toUpperCase() + listName.slice(1);
                listDiv.innerHTML = `<h3>${displayName}</h3><div class="list-movies"></div>`;
                const moviesDiv = listDiv.querySelector('.list-movies');
                if (movies.length === 0) {
                    moviesDiv.innerHTML = '<p>No hay películas en esta lista.</p>';
                } else {
                    movies.forEach(movie => {
                        const link = document.createElement('a');
                        link.href = `/movieDetail.html?id=${movie.id}`;
                        link.textContent = movie.title;
                        link.className = 'list-movie-link';
                        moviesDiv.appendChild(link);
                        moviesDiv.appendChild(document.createElement('br'));
                    });
                }
                listsContainer.appendChild(listDiv);
            }
            document.getElementById('favCount').textContent = favCount;
            document.getElementById('pendCount').textContent = pendCount;
            document.getElementById('viewCount').textContent = viewCount;
        }
    } catch (err) {
        console.error(err);
        document.getElementById('profileName').textContent = 'Error al cargar';
    }
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (!path.includes('login.html') && !path.includes('register.html') && !getToken()) {
        window.location.href = '/login.html';
        return;
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.onclick = logout;

    if (path.includes('catalog.html')) {
        const searchBtn = document.getElementById('searchBtn');
        const clearBtn = document.getElementById('clearBtn');
        if (searchBtn) searchBtn.onclick = () => searchMovies();
        if (clearBtn) {
            clearBtn.onclick = () => {
                const inp = document.getElementById('searchInput');
                if (inp) inp.value = '';
                loadPopularMovies();
            };
        }
        loadPopularMovies();
    } else if (path.includes('movieDetail.html')) {
        loadMovieDetail();
    } else if (path.includes('profile.html')) {
        loadMyProfile();
    } else if (path.includes('login.html')) {
        const btn = document.getElementById('loginBtn');
        if (btn) btn.onclick = () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            login(email, password);
        };
    } else if (path.includes('register.html')) {
        const btn = document.getElementById('registerBtn');
        if (btn) btn.onclick = () => {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirm = document.getElementById('confirmPassword')?.value;
            if (password !== confirm) { alert('Las contraseñas no coinciden'); return; }
            register(name, email, password);
        };
    }
});
async function loadAdminDashboard() {
    const token = getToken();
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/admin/dashboard`, { headers: getHeaders() });
        if (res.status === 403) {
            alert('No tienes permisos de administrador');
            window.location.href = '/catalog.html';
            return;
        }
        if (!res.ok) throw new Error('Error al cargar panel');

        const data = await res.json();

        // Actualizar estadísticas
        document.getElementById('totalUsers').textContent = data.stats.totalUsers || 0;
        document.getElementById('totalReviews').textContent = data.stats.totalReviews || 0;
        document.getElementById('totalMovies').textContent = data.stats.totalMovies || 0;

        // Mostrar usuarios (solo información, sin botones de promoción)
        const usersDiv = document.getElementById('usersList');
        if (data.users.length === 0) {
            usersDiv.innerHTML = '<p>No hay usuarios registrados.</p>';
        } else {
            usersDiv.innerHTML = '';
            data.users.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.className = 'admin-user-item';
                userDiv.innerHTML = `
                    <div><strong>${user.name}</strong> (${user.email}) - Rol: ${user.role}</div>
                `;
                usersDiv.appendChild(userDiv);
            });
        }

        // Mostrar reseñas con botón eliminar
        const reviewsDiv = document.getElementById('reviewsList');
        if (data.reviews.length === 0) {
            reviewsDiv.innerHTML = '<p>No hay reseñas aún.</p>';
        } else {
            reviewsDiv.innerHTML = '';
            data.reviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.className = 'admin-review-item';
                reviewDiv.innerHTML = `
                    <div><strong>${review.user_name}</strong> - ${review.movie_title} (⭐ ${review.rating}/10)</div>
                    <div class="review-content-preview">${review.content.substring(0, 100)}${review.content.length > 100 ? '...' : ''}</div>
                    <button class="btn-delete-review" data-review-id="${review.id}">🗑️ Eliminar reseña</button>
                `;
                reviewsDiv.appendChild(reviewDiv);
            });
        }

        // Eventos para eliminar reseñas
        document.querySelectorAll('.btn-delete-review').forEach(btn => {
            btn.addEventListener('click', async () => {
                const reviewId = btn.dataset.reviewId;
                if (confirm('¿Eliminar esta reseña permanentemente?')) {
                    try {
                        const delRes = await fetch(`${API_BASE}/admin/reviews/${reviewId}`, {
                            method: 'DELETE',
                            headers: getHeaders()
                        });
                        if (delRes.ok) {
                            btn.closest('.admin-review-item').remove();
                            alert('Reseña eliminada');
                            // Opcional: actualizar contadores (recargar o restar)
                            const currentCount = parseInt(document.getElementById('totalReviews').textContent);
                            document.getElementById('totalReviews').textContent = currentCount - 1;
                        } else {
                            alert('Error al eliminar');
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Error de red');
                    }
                }
            });
        });

    } catch (err) {
        console.error('Error en loadAdminDashboard:', err);
        document.getElementById('usersList').innerHTML = '<p>Error al cargar panel. Revisa consola.</p>';
    }
}