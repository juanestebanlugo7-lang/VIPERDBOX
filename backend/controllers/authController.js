const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const List = require('../models/List');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await User.create({ name, email, password: hashedPassword });

        await List.createDefaultLists(userId);

        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: userId,
                name,
                email
            }
        });
    } catch (error) {
        console.error('Error en register:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};