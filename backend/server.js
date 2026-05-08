require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ===== CONFIGURACIÓN DE RUTAS ESTÁTICAS =====
const viewsPath = path.join(__dirname, '..', 'frontend', 'views');
const cssPath = path.join(__dirname, '..', 'frontend', 'css');
const jsPath = path.join(__dirname, '..', 'frontend', 'js');

console.log('Sirviendo HTML desde:', viewsPath);
console.log('Sirviendo CSS desde:', cssPath);
console.log('Sirviendo JS desde:', jsPath);

// Servir archivos estáticos
app.use(express.static(viewsPath));        // Para HTML
app.use('/css', express.static(cssPath));  // Para CSS (la URL /css/styles.css)
app.use('/js', express.static(jsPath));    // Para JS (la URL /js/main.js)

// ===== RUTAS DE LA API =====
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// ===== RUTA PRINCIPAL =====
app.get('/', (req, res) => {
  res.sendFile(path.join(viewsPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));