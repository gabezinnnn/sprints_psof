const express = require("express")
const router = express.Router()
const login = require("./controllers/login")

const rotaInicial = (req, res) => {
    res.json("Back-end respondendo")
}

router.get('/',rotaInicial)
router.get('/login', login.entrar)

module.exports = router