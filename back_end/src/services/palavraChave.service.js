function normalizarTexto(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function verificarComando(texto) {

    const textoNormalizado = normalizarTexto(texto);

    //Mudar comando Aqui:

    const regex = /\bregistrar insumo\b[:,]?\s*(.*)/i;

    const resultado = textoNormalizado.match(regex);

    if (!resultado) {
        return {
            ativado: false,
            comando: null
        };
    }

    return {
        ativado: true,
        comando: resultado[1].trim()
    };
}

module.exports = {
    verificarComando,
    normalizarTexto
};