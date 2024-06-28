let insumos = [
   { id: 1, nombre: 'Harina', unidad: 'Kg'},
   { id: 2, nombre: 'Azucar', unidad: 'Kg'},
   { id: 3, nombre: 'Leche', unidad: 'Lts'},
   { id: 4, nombre: 'Levadura', unidad: 'Gr'},
   { id: 5, nombre: 'Agua', unidad: 'Lts'},
   { id: 6, nombre: 'Dulce de Leche', unidad: 'Kg'},
];

const productosController = require('./productosController');
const { pedidos } = require('./pedidosController');

exports.getInsumos = (req, res) => {
    res.json(insumos);
};

exports.getInsumoById = (req, res) => {
    const {id} = req.params;
    const insumo = insumos.find(i => i.id == id);
    if (insumo) {
        res.json(insumo);
    } else {
        res.status(404).json({message: 'Insumo no encontrado'});
    }
};

exports.createInsumo = (req, res) => {
    const newInsumo = req.body;
    newInsumo.id = insumos.length ? insumos[insumos.length - 1].id + 1 : 1;
    insumos.push(newInsumo);
    res.status(201).json(newInsumo);
};

exports.updateInsumo = (req, res) => {
    const { id } = req.params;
    const updateInsumo = req.body;
    const insumoIndex = insumos.findIndex(i => i.id == id);
    if (insumoIndex !== -1) {
        insumos[insumoIndex] = { ...insumos[insumoIndex], ...updateInsumo };
        pedidos.forEach(pedido => {
            pedido.productos.forEach(producto2 => {
                const insumoExistente = producto2.insumos.find(i => i.id == id);
                if (insumoExistente) {
                    insumoExistente.nombre = updateInsumo.nombre;
                    insumoExistente.unidad = updateInsumo.unidad;
                }
            });
        });
        res.json(insumos[insumoIndex]);
    } else {
        res.status(404).json({ message: 'Insumo no encontrado' });
    }
};

exports.deleteInsumo = (req, res) => {
    const {id} = req.params;
    const insumoIndex = insumos.findIndex(i => i.id == id);
    if (insumoIndex !== -1) {
        const deletedInsumo = insumos.splice(insumoIndex, 1);
        pedidos.forEach(pedido => {
            if (pedido.estado != 'entregado' && pedido.estado != 'listo para entregar') {
                pedido.productos.forEach(producto2 => {
                    const index = producto2.insumos.findIndex(insumo => insumo.id == id);
                    if (index !== -1) {
                        producto2.insumos.splice(index, 1);
                    }
                });
            }
        });
        productosController.removeInsumoFromAllProductos(id);

        res.json(deletedInsumo);
    } else {
        res.status(404).json({message: 'Insumo no encontrado'})
    }
}