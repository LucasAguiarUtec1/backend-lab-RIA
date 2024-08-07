const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/register', (req, res) => {
  /* #swagger.summary = 'Registra un nuevo usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Registro de nuevo usuario.',
        schema: { $ref: '#/definitions/RegisterUser' }
    } */
  usuariosController.register(req, res);
});

router.post('/reset-password', async (req, res) => {
  /* #swagger.summary = 'Cambia la contraseña' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Cambia la contraseña de un usuario.',
        schema: { $ref: '#/definitions/ResetPassword' }
    } */
  try {
    await usuariosController.resetPassword(req, res);
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ message: 'Error interno al restablecer la contraseña' });
  }
});

router.put('/updateUser', async (req, res) => {
  /* #swagger.summary = 'Actualiza los datos del usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Actualiza todos los datos del usuario.',
        schema: { $ref: '#/definitions/updateUser' }
    } */
  try {
    await usuariosController.updateUser(req, res);
  } catch (error) {
    console.error('Error en updateUser:', error);
    res.status(500).json({ message: 'Error interno al atualizar la informacion del usuario' });
  }
});

router.post('/login', (req, res) => {
  /* #swagger.summary = 'Inicia sesión' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Credenciales de usuario.',
        schema: { $ref: '#/definitions/Login' }
    } */
  usuariosController.login(req, res);
});

router.post('/change-password', (req, res) => {
  /* #swagger.summary = 'Cambia la contraseña del usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Cambio de contraseña de usuario.',
        schema: { $ref: '#/definitions/ChangePassword' }
    } */
  usuariosController.changePassword(req, res);
});

router.post('/forgot-password', (req, res) => {
  /* #swagger.summary = 'Recupera la contraseña olvidada' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Recuperación de contraseña de usuario.',
        schema: { $ref: '#/definitions/ForgotPassword' }
    } */
  usuariosController.forgotPassword(req, res);
});

router.post('/enable-user', (req, res) => {
  /* #swagger.summary = 'Habilita un usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Habilitación de usuario.',
        schema: { $ref: '#/definitions/EnableDisableUser' }
    } */
  usuariosController.enableUser(req, res);
});

router.post('/disable-user', (req, res) => {
  /* #swagger.summary = 'Deshabilita un usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Deshabilitación de usuario.',
        schema: { $ref: '#/definitions/EnableDisableUser' }
    } */
  usuariosController.disableUser(req, res);
});

router.get('/obtener-panaderos', verifyToken, isAdmin, (req, res) => {
  /* #swagger.summary = 'Obtiene la lista de panaderos' */
  /* #swagger.tags = ['Usuarios'] */
  usuariosController.getPanaderos(req, res);
});

module.exports = router;
