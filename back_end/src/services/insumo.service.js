function identificarInsumo(texto) {

    const regex = /^(\d+(?:[.,]\d+)?)\s*(kg|quilo(?:s)?|g|gramas?|l|litros?|ml|mililitros?|unidades?|un|pacotes?|caixas?)\s*(?:de\s+)?(.+)$/i;

    const resultado = texto.trim().match(regex);

    if (!resultado) {
        return {
            sucesso: false,
            mensagem: 'Não foi possível identificar o insumo.'
        };
    }

    const quantidade = Number(
        resultado[1].replace(',', '.')
    );

    const unidadeOriginal = resultado[2].toLowerCase();

    const nome = resultado[3].trim();

    const unidades = {
        kg: 'kg',
        quilo: 'kg',
        quilos: 'kg',
        g: 'g',
        grama: 'g',
        gramas: 'g',
        l: 'l',
        litro: 'l',
        litros: 'l',
        ml: 'ml',
        mililitro: 'ml',
        mililitros: 'ml',
        unidade: 'un',
        unidades: 'un',
        un: 'un',
        pacote: 'pacote',
        pacotes: 'pacote',
        caixa: 'caixa',
        caixas: 'caixa'
    };

    return {
        sucesso: true,
        quantidade,
        unidade: unidades[unidadeOriginal],
        nome
    };
}

module.exports = {
    identificarInsumo
};