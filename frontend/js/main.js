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
    const maxPages = Math.min(total, 30); // Limitar a 10 páginas para no saturar
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

// ==================== DETALLE ====================
async function loadMovieDetail() {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');
    if (!movieId) {
        window.location.href = '/catalog.html';
        return;
    }
    const container = document.getElementById('detailContainer');
    if (!container) return;
    container.innerHTML = '<p>Cargando...</p>';
    try {
        const res = await fetch(`${API_BASE}/movies/${movieId}`, { headers: getHeaders() });
        const data = await res.json();
        const movie = data.movie;
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+poster';
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Desconocido';
        container.innerHTML = `
            <div class="detail-container">
                <div class="poster"><img src="${posterUrl}" alt="${movie.title}"></div>
                <div class="info">
                    <h2>${movie.title}</h2>
                    <p><strong>Año:</strong> ${year}</p>
                    <p><strong>Duración:</strong> ${movie.runtime ? movie.runtime + ' min' : 'N/A'}</p>
                    <div class="rating">⭐ ${movie.vote_average} (${movie.vote_count} votos)</div>
                    <p><strong>Sinopsis:</strong><br>${movie.overview || 'No disponible'}</p>
                    <button class="back-btn" onclick="window.location.href='/catalog.html'">← Volver</button>
                </div>
            </div>
        `;
    } catch (err) {
        container.innerHTML = '<p>Error al cargar detalles.</p>';
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
        
        // Listas (puede ser array u objeto)
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
    // Proteger páginas que requieren login
    if (!path.includes('login.html') && !path.includes('register.html') && !getToken()) {
        window.location.href = '/login.html';
        return;
    }
    // Botón de logout
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
    }
    else if (path.includes('movieDetail.html')) loadMovieDetail();
    else if (path.includes('profile.html')) loadMyProfile();
    else if (path.includes('login.html')) {
        const btn = document.getElementById('loginBtn');
        if (btn) btn.onclick = () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            login(email, password);
        };
    }
    else if (path.includes('register.html')) {
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