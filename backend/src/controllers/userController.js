const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  try {
    // Validar datos requeridos
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Email inválido' 
      });
    }

    // Validar contraseña
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Validar rol
    const validRoles = ['admin', 'coordinator'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Rol inválido' 
      });
    }

    const user = await User.create({
      email,
      password,
      role: role || 'coordinator'
    });

    // Remover el password del objeto de respuesta
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.message === 'El email ya está registrado') {
      return res.status(400).json({ 
        success: false,
        message: error.message 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Error al crear el usuario' 
    });
  }
};

module.exports = {
  createUser
};