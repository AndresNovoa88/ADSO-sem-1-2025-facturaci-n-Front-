module.exports = {
    secret: process.env.JWT_SECRET || 'secret_key_segura',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  };