const con = require("../db/bd")

const entrar = (req, res) => {
    const dados = req.body
    try {
        const comando = `select case when email = "${dados.email}" and senha = SHA2("${dados.senha}", 256) then 1 else 0 end from usuario`
        con.query(comando, (err, result) => {
            if (err) {
                console.error(err)
                res.status(500).json({ error: 'Erro ao fazer login.' })
            } else {
                if (result) {
                    res.json(`Bem-vindo!`)
                } else {
                    res.json(`ERRO: Email ou senha incorretos`)
                }
            }
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Erro ao fazer login.', details: 'Informe { email, senha }' })
    }
}

module.exports = {
    entrar
}
