let insumos = [
    { id: 1, nombre: 'Harina de trigo', unidad: 'kg' },
    { id: 2, nombre: 'Azúcar', unidad: 'kg' },
    { id: 3, nombre: 'Sal', unidad: 'kg' },
    { id: 4, nombre: 'Levadura', unidad: 'g' },
    { id: 5, nombre: 'Mantequilla', unidad: 'kg' },
    { id: 6, nombre: 'Aceite vegetal', unidad: 'L' },
    { id: 7, nombre: 'Huevos', unidad: 'docena' },
    { id: 8, nombre: 'Leche', unidad: 'L' },
    { id: 9, nombre: 'Agua', unidad: 'L' },
    { id: 10, nombre: 'Vainilla', unidad: 'ml' },
    { id: 11, nombre: 'Canela', unidad: 'g' },
    { id: 12, nombre: 'Chocolate', unidad: 'kg' },
    { id: 13, nombre: 'Frutas secas', unidad: 'kg' },
    { id: 14, nombre: 'Esencia de almendra', unidad: 'ml' },
    { id: 15, nombre: 'Cremor tártaro', unidad: 'g' },
    { id: 16, nombre: 'Bicarbonato de sodio', unidad: 'g' },
    { id: 17, nombre: 'Polvo de hornear', unidad: 'g' },
    { id: 18, nombre: 'Miel', unidad: 'kg' },
    { id: 19, nombre: 'Sémola de maíz', unidad: 'kg' },
    { id: 20, nombre: 'Avena', unidad: 'kg' }
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