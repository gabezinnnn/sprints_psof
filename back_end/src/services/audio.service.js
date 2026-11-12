const portAudio = require('naudiodon');
const fs = require('fs');
const path = require('path');

const pastaAudios = path.resolve(__dirname, '../audios');

if (!fs.existsSync(pastaAudios)) {
    fs.mkdirSync(pastaAudios, { recursive: true });
}

const audio = new portAudio.AudioIO({
    inOptions: {
        channelCount: 1,
        sampleFormat: portAudio.SampleFormat16Bit,
        sampleRate: 16000,
        deviceId: -1,
        closeOnError: true
    }
});

let gravando = false;
let partesAudio = [];
let preAudio = [];
let silencio = 0;

const LIMITE_VOLUME = 500;
const TEMPO_SILENCIO = 1200;
const MAX_PRE_AUDIO = 5;

function calcularVolume(buffer) {
    let soma = 0;
    const quantidade = buffer.length / 2;

    for (let i = 0; i < buffer.length; i += 2) {
        const valor = buffer.readInt16LE(i);
        soma += valor * valor;
    }

    return Math.sqrt(soma / quantidade);
}

function criarWav(buffer) {
    const cabecalho = Buffer.alloc(44);

    cabecalho.write('RIFF', 0);
    cabecalho.writeUInt32LE(36 + buffer.length, 4);
    cabecalho.write('WAVE', 8);
    cabecalho.write('fmt ', 12);
    cabecalho.writeUInt32LE(16, 16);
    cabecalho.writeUInt16LE(1, 20);
    cabecalho.writeUInt16LE(1, 22);
    cabecalho.writeUInt32LE(16000, 24);
    cabecalho.writeUInt32LE(32000, 28);
    cabecalho.writeUInt16LE(2, 32);
    cabecalho.writeUInt16LE(16, 34);
    cabecalho.write('data', 36);
    cabecalho.writeUInt32LE(buffer.length, 40);

    return Buffer.concat([cabecalho, buffer]);
}

async function finalizarAudio(callback) {
    const audioFinal = Buffer.concat(partesAudio);

    partesAudio = [];
    gravando = false;
    silencio = 0;

    try {
        const wav = criarWav(audioFinal);

        const nomeArquivo = `audio-${Date.now()}.wav`;
        const caminho = path.join(pastaAudios, nomeArquivo);

        await fs.promises.writeFile(caminho, wav);

        await callback(caminho);

    } catch (erro) {
        console.error('Erro ao salvar áudio:', erro);
    }
}

function iniciarCaptura(callback) {
    audio.on('data', (buffer) => {
        const volume = calcularVolume(buffer);

        if (!gravando) {
            preAudio.push(Buffer.from(buffer));

            if (preAudio.length > MAX_PRE_AUDIO) {
                preAudio.shift();
            }

            if (volume > LIMITE_VOLUME) {
                gravando = true;
                partesAudio = [...preAudio];
                preAudio = [];
            }

        } else {
            partesAudio.push(Buffer.from(buffer));

            if (volume < LIMITE_VOLUME) {
                silencio += buffer.length / 32000 * 1000;
            } else {
                silencio = 0;
            }

            if (silencio >= TEMPO_SILENCIO) {
                finalizarAudio(callback);
            }
        }
    });

    audio.start();
}

function pararCaptura() {
    audio.quit();
}

module.exports = {
    iniciarCaptura,
    pararCaptura
};