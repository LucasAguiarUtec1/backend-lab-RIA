const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarios = [];
const nodemailer = require('nodemailer');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
};

// Función para crear usuarios por defecto
const createDefaultUsers = async () => {
  const defaultUsers = [
    { email: 'admin@example.com', password: 'admin123', role: 'ADMIN', telefono: '123456789' },
    { email: 'panadero@example.com', password: 'panadero123', role: 'PANADERO', telefono: '987654321' },
    { email: 'user@example.com', password: 'user123', role: 'USER', telefono: '456123789' },
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

  if (user) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'labriasistemadegetiondepedidos@gmail.com',
        pass: 'jmtb hxyb qjls qaf'
      }
    });
    
    // Paso 4: Definir las opciones del correo electrónico
    const mailOptions = {
      from: 'labriasistemadegetiondepedidos@gmail.com', // Remitente
      to: email, // Destinatario
      subject: 'Asunto del correo', // Asunto
      text: 'Contenido del correo.' // Cuerpo del mensaje
    };
    
    // Paso 5: Enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Correo enviado: ' + info.response);
      }
    });
  }
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
  enableUser,
  disableUser,
  getPanaderos
};
