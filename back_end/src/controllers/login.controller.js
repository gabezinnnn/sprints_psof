const login = require('../models/login.model')

const entrar = async (req, res) => {
    const resp = await login(req.body)
    res.status(resp.status).json({mensagem: resp.mensagem, auth: resp.auth, id: resp.id})
}

module.exports = {
    entrar
}
