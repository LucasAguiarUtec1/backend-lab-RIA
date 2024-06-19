let pedidos = [];
const { usuarios } = require('./usuariosController');
const { productos } = require('./productosController');

exports.addPedido = (req, res) => {
    const { email, productosPedido, precioTotal, fechaEntrega } = req.body;
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
    }
    const idUser = usuario.id;
    const productosConDetalles = productosPedido.map(pedidoProducto => {
        const productoDetalle = productos.find(p => p.nombre === pedidoProducto.nombre);
        if (!productoDetalle) {
            return null; // o manejar el error si el producto no existe
        }
        return {
            ...productoDetalle,
            cantidad: pedidoProducto.cantidad // Asumiendo que pedidoProducto incluye un campo cantidad
        };
    }).filter(p => p !== null);
    const fechaObj = new Date(fechaEntrega);
    const fechaFormateada = `${fechaObj.getDate().toString().padStart(2, '0')}/${(fechaObj.getMonth() + 1).toString().padStart(2, '0')}/${fechaObj.getFullYear()}`;
    const newPedido = {
        id: pedidos.length ? pedidos[pedidos.length - 1].id + 1 : 1,
        idUser,
        productos: productosConDetalles,
        precioTotal,
        fecha: fechaFormateada,
        estado: 'pendiente'
      };
      pedidos.push(newPedido);
      res.status(201).json(newPedido);
};