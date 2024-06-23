let pedidos = [
    {
      id: 1,
      email: "user@example2.com",
      estado: "pendiente",
      fecha: "25/06/2024",
      precioTotal: 440,
      panadero: 'sinAsignar',
      productos: [
        { nombre: "Producto 2", precio: 20, cantidad: 2 },
        { nombre: "Producto 4", precio: 80, cantidad: 5 }
      ]
    },
    {
      id: 2,
      email: "user@example.com",
      estado: "en preparación",
      fecha: "29/06/2024",
      precioTotal: 180,
      panadero: 'sinAsignar',
      productos: [
        { nombre: "Producto 2", precio: 20, cantidad: 2 }
      ]
    },
    {
      id: 3,
      email: "user@example4.com",
      estado: "listo para entregar",
      fecha: "28/08/2024",
      precioTotal: 210,
      panadero: 'sinAsignar',
      productos: [
        { nombre: "Producto 4", precio: 80, cantidad: 5 }
      ]
    },
    {
      id: 4,
      email: "user@example2.com",
      estado: "entregado",
      fecha: "17/07/2024",
      precioTotal: 180,
      panadero: 'sinAsignar',
      productos: [
        { nombre: "Producto 2", precio: 20, cantidad: 2 }
      ]
    },
    {
      id: 5,
      email: "user@example.com",
      estado: "pendiente",
      fecha: "28/07/2024",
      precioTotal: 240,
      panadero: 'sinAsignar',
      productos: [
        { nombre: "Producto 2", precio: 20, cantidad: 2 },
        { nombre: "Producto 4", precio: 80, cantidad: 5 }
      ]
    }
  ];
  
const { usuarios } = require('./usuariosController');
const { productos } = require('./productosController');

exports.addPedido = (req, res) => {
    const { email, productosPedido, precioTotal, fechaEntrega } = req.body;
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
    }
    const productosConDetalles = productosPedido.map(pedidoProducto => {
        const productoDetalle = productos.find(p => p.nombre === pedidoProducto.nombre);
        if (!productoDetalle) {
            return null; // o manejar el error si el producto no existe
        }
        return {
            nombre: pedidoProducto.nombre, // Solo incluir el nombre del producto
            precio: productoDetalle.precio,
            cantidad: pedidoProducto.cantidad // Asumiendo que pedidoProducto incluye un campo cantidad
        };
    }).filter(p => p !== null);
    const fechaObj = new Date(fechaEntrega);
    const fechaFormateada = `${fechaObj.getDate().toString().padStart(2, '0')}/${(fechaObj.getMonth() + 1).toString().padStart(2, '0')}/${fechaObj.getFullYear()}`;
    const newPedido = {
        id: pedidos.length ? pedidos[pedidos.length - 1].id + 1 : 1,
        email,
        productos: productosConDetalles,
        precioTotal,
        fecha: fechaFormateada,
        estado: 'pendiente',
        panadero: 'sinAsignar'
      };
      pedidos.push(newPedido);
      res.status(201).json(newPedido);
};

exports.getPedidos = (req, res) => {
    const { email } = req.body;
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
    }
    const pedidosUsuario = pedidos.filter(p => p.email === email);
    res.json(pedidosUsuario);
}

exports.getAllPedidos = (req, res) => {
  res.json(pedidos);
}

exports.tomarPedido = (req, res) => {
  const { pedido, nombre } = req.body;
  const pedidoTomar = pedidos.find(p => p.id === pedido.id);
  if (!pedidoTomar) {
    return res.status(400).json({ message: 'Pedido no encontrado' });
  }
  pedidoTomar.panadero = nombre;
  res.json(pedido);
}

exports.cambiarEstado = (req, res) => {
  const { pedido, estado } = req.body;
  const pedidoCambiar = pedidos.find(p => p.id === pedido.id);
  if (!pedidoCambiar) {
    return res.status(400).json({ message: 'Pedido no encontrado' });
  }
  pedidoCambiar.estado = estado;
  res.json(pedido);
}