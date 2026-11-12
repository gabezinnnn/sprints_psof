require('dotenv').config();

const { execFile } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const executar = promisify(execFile);

async function transcreverAudio(caminhoAudio) {

    try {
        const executavel = path.resolve(
            process.env.WHISPER_EXECUTAVEL
        );

        const modelo = path.resolve(
            process.env.WHISPER_MODELO
        );

        const { stdout } = await executar(
            executavel,
            [
                '-m', modelo,
                '-f', caminhoAudio,
                '-l', 'pt',
                '-nt'
            ],
            {
                windowsHide: true,
                maxBuffer: 10 * 1024 * 1024,
                env: {
                    ...process.env,
                    PATH: `${path.dirname(executavel)};${process.env.PATH}`
                }
            }
        );

        return stdout.trim();

    } catch (erro) {
        console.error('Erro na transcrição:', erro);
        throw erro;
    }
}

module.exports = {
    transcreverAudio
};