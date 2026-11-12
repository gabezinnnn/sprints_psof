const insumo = require('../models/insumo.model')

const cadastrarInsumo = async (req, res) => {
    const resp = await insumo(req.body)
    res.status(resp.status).json(resp.mensagem)
}

module.exports = cadastrarInsumo