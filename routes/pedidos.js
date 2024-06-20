const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const { verifyToken, isUser } = require('../middleware/auth');

router.post('/agregar-pedido', verifyToken, isUser, (req, res) => {
  pedidosController.addPedido(req, res);
});

router.post('/obtener-pedidos', verifyToken, isUser, (req, res) => {
  pedidosController.getPedidos(req, res);
});

module.exports = router;