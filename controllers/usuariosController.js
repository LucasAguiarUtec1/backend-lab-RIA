const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');
const crypto = require('crypto');
const usuarios = [];

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
};

// Función para crear usuarios por defecto
const createDefaultUsers = async () => {
  const defaultUsers = [
    { email: 'admin@example.com', password: 'admin123', role: 'ADMIN', telefono: '123456789' },
    { email: 'panadero@example.com', password: 'panadero123', role: 'PANADERO', telefono: '987654321' },
    { email: 'user@example.com', password: 'user123', role: 'USER', telefono: '456123789' },
    { email: 'lucas.aguiar@estudiantes.utec.edu.uy', password: 'user123', role: 'USER', telefono: '456123789' },
  ];

  for (const user of defaultUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = {
      id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      telefono: user.telefono,
      enabled: true,
    };
    usuarios.push(newUser);
  }
};

// Llama a la función para crear usuarios por defecto al inicio
createDefaultUsers();

const register = async (req, res) => {
  const { email, password, role, telefono } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1,
    email,
    password: hashedPassword,
    role,
    telefono,
    enabled: true,
  };
  usuarios.push(newUser);
  res.status(201).json(newUser);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = usuarios.find(u => u.email === email);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = generateToken(user);
    res.json({ token, nombre: user.email, role: user.role });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  const user = usuarios.find(u => u.id == id);
  if (user && await bcrypt.compare(oldPassword, user.password)) {
    user.password = await bcrypt.hash(newPassword, 10);
    res.json({ message: 'Password updated' });
  } else {
    res.status(400).json({ message: 'Invalid password' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = usuarios.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de expiración

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'laboratorioria04@gmail.com',
      pass: 'mbxz jxvr hbmt xpye' // Usa variables de entorno en producción
    }
  });

  const mailOptions = {
    from: 'laboratorioria04@gmail.com',
    to: user.email,
    subject: 'Restablecimiento de contraseña',
    html: `
      <p>Por favor, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <p><a href="http://localhost:4200/reset-password/${token}">Restablecer contraseña</a></p>
      <p>Gracias,<br>El equipo de soporte</p>
      <img src="cid:unique@nodemailer.com"/>
    `,
    attachments: [{
      filename: 'imagen.png',
      path: path.join(__dirname, '../asset/imagen.png'), // Ruta a la imagen en tu servidor
      cid: 'unique@nodemailer.com'
    }]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error al enviar el correo electrónico' });
    } else {
      console.log('Correo enviado: ' + info.response);
      return res.status(200).json({ message: 'Correo enviado correctamente' });
    }
  });
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = usuarios.find(u => u.resetPasswordToken === token && u.resetPasswordExpires > Date.now());

  if (!user) {
    return res.status(400).json({ message: 'Token inválido o expirado' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  res.json({ message: 'Contraseña restablecida con éxito' });
};

const enableUser = (req, res) => {
  const { id } = req.body;
  const user = usuarios.find(u => u.id == id);
  if (user) {
    user.enabled = true;
    res.json({ message: 'User enabled' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const disableUser = (req, res) => {
  const { id } = req.body;
  const user = usuarios.find(u => u.id == id);
  if (user) {
    user.enabled = false;
    res.json({ message: 'User disabled' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const getPanaderos = (req, res) => {
  const panaderos = usuarios.filter(u => u.role === 'PANADERO');
  res.json(panaderos);
}

module.exports = {
  usuarios,
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  enableUser,
  disableUser,
  getPanaderos
};
