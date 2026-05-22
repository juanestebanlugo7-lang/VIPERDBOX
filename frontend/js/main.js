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
    const maxPages = Math.min(total, 10);
    for (let i = 1; i <= maxPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.onclick = () => {
            if (type === 'popular') loadPopularMovies(i);
            else searchMovies(i);
        };
        if (i === current) btn.disabled = true;
        pagDiv.appendChild(btn);
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
        const res = await fetch(`${API_BASE}/movies/${movieId}`, { headers: getHeaders() });
        const data = await res.json();

        if (!res.ok || !data.movie) {
            container.innerHTML = `
                <div class="error-container">
                    <p>${data.error || 'No se pudo cargar la película.'}</p>
                    <button class="back-btn" onclick="window.location.href='/catalog.html'">← Volver al catálogo</button>
                </div>
            `;
            return;
        }

        const movie = data.movie;
        const videos = data.videos || [];
        const credits = data.credits || [];
        const reviews = data.reviews || [];

        const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : 'https://via.placeholder.com/300x450?text=No+poster';
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Desconocido';
        const genres = movie.genres ? movie.genres.map(g => g.name).join(', ') : 'No especificado';
        const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';
        const tmdbRating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        const trailer = videos.find(v => v.type === 'Trailer') || videos.find(v => v.type === 'Teaser');
        const trailerKey = trailer ? trailer.key : null;

        // Construir HTML principal
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
                        <span class="votes">(${movie.vote_count} votos)</span>
                    </div>
                    <div class="action-buttons">
                        <button class="list-btn fav">❤️ Favoritas</button>
                        <button class="list-btn pending">⏰ Pendientes</button>
                        <button class="list-btn watched">✅ Vistas</button>
                    </div>
                    <div class="synopsis">
                        <h3>Sinopsis</h3>
                        <p>${movie.overview || 'No disponible'}</p>
                    </div>
                    <div class="trailer-link">
                        ${trailerKey ? `<button class="trailer-btn" data-key="${trailerKey}">▶ Ver tráiler</button>` : ''}
                        <button class="back-btn" onclick="window.location.href='/catalog.html'">← Volver al catálogo</button>
                    </div>
                </div>
            </div>
        `;

        // Sección de reparto
        if (credits.length > 0) {
            html += `<div class="cast-section"><h3>Reparto principal</h3><div class="cast-list">`;
            credits.forEach(actor => {
                const actorPhoto = actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : 'https://via.placeholder.com/185x278?text=No+photo';
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

        // Sección de reseñas
        if (reviews.length > 0) {
            html += `<div class="reviews-section"><h3>Reseñas de la comunidad</h3>`;
            reviews.forEach(review => {
                const rating = review.author_details?.rating ? `⭐ ${review.author_details.rating}/10` : '';
                html += `
                    <div class="review-card">
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
        } else {
            html += `<div class="reviews-section"><p>No hay reseñas de la comunidad para mostrar.</p></div>`;
        }

        container.innerHTML = html;

        // Agregar modal para tráiler
        if (trailerKey) {
            // Crear el modal dinámicamente
            const modal = document.createElement('div');
            modal.id = 'trailerModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <iframe id="trailerIframe" width="100%" height="400" src="https://www.youtube.com/embed/${trailerKey}?autoplay=0" frameborder="0" allowfullscreen></iframe>
                </div>
            `;
            document.body.appendChild(modal);

            // Mostrar modal al hacer clic en el botón
            const trailerBtn = document.querySelector('.trailer-btn');
            const modalElement = document.getElementById('trailerModal');
            const closeBtn = modalElement.querySelector('.close-modal');
            const iframe = document.getElementById('trailerIframe');

            trailerBtn.onclick = () => {
                modalElement.style.display = 'flex';
                iframe.src = `https://www.youtube.com/embed/${trailerKey}?autoplay=1`;
            };
            closeBtn.onclick = () => {
                modalElement.style.display = 'none';
                iframe.src = `https://www.youtube.com/embed/${trailerKey}?autoplay=0`;
            };
            window.onclick = (event) => {
                if (event.target === modalElement) {
                    modalElement.style.display = 'none';
                    iframe.src = `https://www.youtube.com/embed/${trailerKey}?autoplay=0`;
                }
            };
        }
    } catch (err) {
        console.error('Error en loadMovieDetail:', err);
        container.innerHTML = `
            <div class="error-container">
                <p>Error de conexión. Intenta de nuevo más tarde.</p>
                <button class="back-btn" onclick="window.location.href='/catalog.html'">← Volver al catálogo</button>
            </div>
        `;
    }
}

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
        if (data.user) {
            document.getElementById('profileName').textContent = data.user.name;
            document.getElementById('profileEmail').textContent = data.user.email;
            document.getElementById('profileSince').textContent = new Date(data.user.created_at).toLocaleDateString();
        } else {
            document.getElementById('profileInfo').innerHTML = '<p>Error al cargar perfil</p>';
            return;
        }
        // Reseñas (si las hubiera, pero no son necesarias)
        const reviewsDiv = document.getElementById('myReviews');
        if (data.reviews && data.reviews.length > 0) {
            reviewsDiv.innerHTML = data.reviews.map(r => `
                <div class="review-item"><strong>${r.movie_title}</strong> - ⭐ ${r.rating}/10<br>${r.content}<br><small>${new Date(r.created_at).toLocaleDateString()}</small></div>
            `).join('');
        } else {
            reviewsDiv.innerHTML = '<p>No has escrito ninguna reseña aún.</p>';
        }
        // Listas
        let fav=0, pend=0, view=0;
        if (Array.isArray(data.lists)) {
            fav = data.lists.find(l => l.name === 'favoritas')?.movies?.length || 0;
            pend = data.lists.find(l => l.name === 'pendientes')?.movies?.length || 0;
            view = data.lists.find(l => l.name === 'vistas')?.movies?.length || 0;
        } else if (data.lists && typeof data.lists === 'object') {
            fav = data.lists.favoritas?.movies?.length || 0;
            pend = data.lists.pendientes?.movies?.length || 0;
            view = data.lists.vistas?.movies?.length || 0;
        }
        document.getElementById('favCount').textContent = fav;
        document.getElementById('pendCount').textContent = pend;
        document.getElementById('viewCount').textContent = view;
    } catch (err) {
        console.error(err);
        document.getElementById('profileInfo').innerHTML = '<p>Error al cargar perfil</p>';
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