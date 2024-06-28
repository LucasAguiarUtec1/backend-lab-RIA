let productos = [
  { id: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', insumos: [{ id: 1, cantidad: 3 }, { id: 2, cantidad: 1 }], imagen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', precio: 10.0 },
  { id: 2, nombre: 'Producto 2', descripcion: 'Descripción 2', insumos: [{ id: 2, cantidad: 4 }], imagen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', precio: 20.0 },
  { id: 3, nombre: 'Producto 3', descripcion: 'Descripción 3', insumos: [{ id: 4, cantidad: 3 }], imagen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', precio: 100.0 },
  { id: 4, nombre: 'Producto 4', descripcion: 'Descripción 4', insumos: [{ id: 2, cantidad: 19 }], imagen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', precio: 80.0 },
  { id: 5, nombre: 'Producto 5', descripcion: 'Descripción 5', insumos: [], imagen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', precio: 80.0 },
  { id: 6, nombre: 'Producto 6', descripcion: 'Descripción 6', insumos: [], imagen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', precio: 80.0 },
];

exports.productos = productos;

const { pedidos } = require('./pedidosController');

exports.getProductos = (req, res) => {
  res.json(productos);
};

exports.getProductoById = (req, res) => {
  const { id } = req.params;
  const producto = productos.find(p => p.id == id);
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
};

exports.createProducto = (req, res) => {
  const newProducto = req.body;
  newProducto.id = productos.length ? productos[productos.length - 1].id + 1 : 1;
  productos.push(newProducto);
  res.status(201).json(newProducto);
};

exports.updateProducto = (req, res) => {
  const { id } = req.params;
  const updatedProducto = req.body;
  const productoIndex = productos.findIndex(p => p.id == id);
  if (productoIndex !== -1) {
    productos[productoIndex] = { ...productos[productoIndex], ...updatedProducto };
    res.json(productos[productoIndex]);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
};

exports.deleteProducto = (req, res) => {
  const { id } = req.params;
  const productoIndex = productos.findIndex(p => p.id == id);
  if (productoIndex !== -1) {
    const deletedProducto = productos.splice(productoIndex, 1);
    res.json(deletedProducto);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
};

exports.addInsumoToProducto = (req, res) => {
  const { id, insumoId } = req.params;
  const { cantidad } = req.body;
  const producto = productos.find(p => p.id == id);

  if (producto) {
    if (!producto.insumos) {
      producto.insumos = [];
    }
    const insumoExistente = producto.insumos.find(i => i.id == insumoId);
    if (insumoExistente) {
      insumoExistente.cantidad += cantidad;
    } else {
      producto.insumos.push({ id: insumoId, cantidad });
    }
    pedidos.forEach(pedido => {
      pedido.productos.forEach(producto2 => {
        if (pedido.estado != 'entregado' && pedido.estado != 'listo para entregar') {
          if (producto2.nombre == producto.nombre) {
            if (!producto2.insumos) {
              producto2.insumos = [];
            }
            const insumoExistente = producto2.insumos.find(i => i.id == insumoId);
            if (insumoExistente) {
              insumoExistente.cantidad += cantidad;
            } else {
              producto2.insumos.push({ id: insumoId, cantidad });
            }
            productoModificado = producto2;
          }
        }
      });
    });
    res.json(producto);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
};


exports.removeInsumoFromProducto = (req, res) => {
  const { id, insumoId } = req.params;
  const producto = productos.find(p => p.id == id);

  if (producto) {
    const insumoIndex = producto.insumos.findIndex(i => i.id == insumoId);
    if (insumoIndex !== -1) {
      producto.insumos.splice(insumoIndex, 1);
      pedidos.forEach(pedido => {
        console.log(pedido.estado);
        if (pedido.estado != 'entregado' && pedido.estado != 'listo para entregar') {
          pedido.productos.forEach(producto2 => {
            if (producto2.nombre == producto.nombre) {
              const index = producto2.insumos.findIndex(i => i.id == insumoId);
              if (index !== -1) {
                producto2.insumos.splice(index, 1);
              }
            }
          });
        }
      });
      res.json(producto);
    } else {
      res.status(404).json({ message: 'Insumo no encontrado en el producto' });
    }
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
};

exports.removeInsumoFromAllProductos = (insumoId) => {
  productos.forEach(producto => {
    producto.insumos = producto.insumos.filter(insumo => insumo.id != insumoId);
  });
};
