let insumos = [
   { id: 1, nombre: 'Harina', unidad: 'Kg'},
   { id: 2, nombre: 'Azucar', unidad: 'Kg'},
   { id: 3, nombre: 'Leche', unidad: 'Lts'}
];

const productosController = require('./productosController');

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

        productosController.removeInsumoFromAllProductos(id);

        res.json(deletedInsumo);
    } else {
        res.status(404).json({message: 'Insumo no encontrado'})
    }
}