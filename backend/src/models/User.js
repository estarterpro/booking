const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(data) {
    try {
      // Verificar si el email ya existe
      const existingUser = await this.findByEmail(data.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Crear usuario
      const { rows } = await db.query(
        'CALL sp_create_user($1, $2, $3, $4)',
        [data.email, hashedPassword, data.role || 'coordinator', null]
      );
      
      // Retornar usuario creado
      return this.findByEmail(data.email);
    } catch (error) {
      console.error('Error in create user:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const { rows } = await db.query(
        'SELECT * FROM sp_get_user_by_email($1)',
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in findByEmail:', error);
      throw error;
    }
  }
}

module.exports = User;