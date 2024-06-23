const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const { verifyToken, isUser, isPanadero, isAdmin } = require('../middleware/auth');

router.post('/agregar-pedido', verifyToken, isUser, (req, res) => {
  pedidosController.addPedido(req, res);
});

router.post('/obtener-pedidos', verifyToken, isUser, (req, res) => {
  pedidosController.getPedidos(req, res);
});

router.get('/obtener-todos-los-pedidos', verifyToken, isPanadero, (req, res) => {
  pedidosController.getAllPedidos(req, res);
});

router.post('/tomar-pedido', verifyToken, isPanadero, (req, res) => {
  pedidosController.tomarPedido(req, res);
});

router.post('/cambiar-estado-pedido', verifyToken, isPanadero, (req, res) => {
  pedidosController.cambiarEstado(req, res);
});

module.exports = router;