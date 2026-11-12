const con = require("../db/bd")

const entrar = async (dados) => {

    if(!dados){
        return {
            status: 400,
            mensagem: 'Informe o email e a senha.',
            auth: null,
            id: null
        }
    }

     try {
        const comando = `select id, nutricionista from usuario where email = ? and senha = SHA2(?, 256)`
        const [result] = await con.query(comando)

        if(result[0].nutricionista){
            return {
                status: 200,
                mensagem: "Sucesso.",
                auth: 'admin',
                id: result.id
            }
        }else{
            return {
                status: 200,
                mensagem: "Sucesso.",
                auth: 'user',
                id: result.id
            }
        }

    } catch (error) {
        console.error(error)
        return {
            status: 500,
            mensagem: 'Erro interno no servidor.',
            auth: null,
            id: null
        }
    }
}

module.exports = entrar