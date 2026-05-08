const User = require('../models/User');
const List = require('../models/List');

// Perfil propio
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const lists = await List.getUserLists(userId);

    res.json({ user,  lists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};


// Funciones de listas 
exports.addToList = async (req, res) => {
  res.status(501).json({ error: 'No implementado' });
};
exports.removeFromList = async (req, res) => {
  res.status(501).json({ error: 'No implementado' });
};