const express = require("express")
const cors = require("cors")

const login = require("./src/routes/login.routes")

const rotaInicial = (req, res) => {
    res.json("Back-end respondendo")
}

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(login)
app.get('/',rotaInicial)
const porta = 3000

app.listen(porta, () => {
    console.log(`Servidor respondendo em: http://localhost:${porta}`)
})