let pedidos = [
    {
      id: 1,
      email: "julian@gmail.com",
      estado: "pendiente",
      fecha: "20/07/2024",
      precioTotal: 660,
      panadero: 'sinAsignar',
      productos: [
        { nombre: "Tarta de Manzana", precio: 200, cantidad: 2, insumos: [
          { id: 1, cantidad: 0.8 }, 
          { id: 2, cantidad: 0.4 },  
          { id: 5, cantidad: 0.2 }, 
          { id: 7, cantidad: 2 },   
          { id: 8, cantidad: 0.2 },  
          { id: 19, cantidad: 0.2 } 
        ] },
        { nombre: "Bizcocho de Vainilla", precio: 260, cantidad: 1, insumos: [
          { id: 1, cantidad: 0.5 }, 
          { id: 2, cantidad: 0.3 },  
          { id: 5, cantidad: 0.2 },  
          { id: 7, cantidad: 3 },    
          { id: 8, cantidad: 0.2 },  
          { id: 10, cantidad: 0.1 } 
       ] }
      ]
    },
    {
      id: 2,
      email: "marta@gmail.com",
      estado: "en preparación",
      fecha: "13/07/2024",
      precioTotal: 395,
      panadero: 'panaderoBruno@gmail.com',
      productos: [
        { nombre: "Pan Francés", precio: 79, cantidad: 5,  insumos: [
          { id: 1, cantidad: 5 },   
          { id: 3, cantidad: 1.5 },
          { id: 4, cantidad: 1.5 }, 
          { id: 9, cantidad: 3 }  
       ] }
      ]
    },
  ];
  
  exports.pedidos = pedidos;
  
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
        const insumosProducto = productoDetalle.insumos.map(insumo => ({
          id: insumo.id,
          cantidad: parseFloat((insumo.cantidad * pedidoProducto.cantidad).toFixed(2))
        }));

        return {
            id: productoDetalle.id,
            nombre: productoDetalle.nombre,
            precio: productoDetalle.precio,
            cantidad: pedidoProducto.cantidad,
            insumos: insumosProducto
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
        panadero: 'sinAsignar',
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
exports.cambiarMail = (email, newEmail) => {
  pedidos.forEach(pedido => {
    if (pedido.email === email) {
      pedido.email = newEmail;
    }
  });
};