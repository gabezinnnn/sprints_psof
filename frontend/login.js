'use strict';

// Usuários de demonstração. Com o back-end, troque por uma chamada à API de login.
const DEMO_USERS = ['nutri', 'cozinha1'];
const DEMO_PASSWORD = 'demo123';
const SESSION_KEY = 'qa';
// Caminho do sistema, a partir da pasta login/ (uma pasta acima).
const HOME = '../index.html';

const form = document.querySelector('#loginForm');
const errorBox = document.querySelector('#lerr');

// Quem já entrou vai direto para o sistema.
try {
  if (DEMO_USERS.includes(sessionStorage.getItem(SESSION_KEY))) {
    location.replace(HOME);
  }
} catch (_) {}

// Forma de onda decorativa do painel verde.
document.querySelector('#wave').innerHTML = [...Array(32)].map((_, i) => {
  const h = 10 + Math.abs(Math.sin(i * .7) * Math.cos(i * .23)) * 80;
  return `<rect x="${i * 14}" y="${100 - h}" width="6" height="${h}" rx="3"/>`;
}).join('') + '<rect x="0" y="98" width="448" height="2"/>';

form.addEventListener('submit', ev => {
  ev.preventDefault();
  // Ignora espaços e maiúsculas (o teclado do celular costuma capitalizar a 1ª letra).
  const user = form.u.value.trim().toLowerCase();

  if (!DEMO_USERS.includes(user) || form.p.value !== DEMO_PASSWORD) {
    errorBox.textContent = 'Usuário ou senha incorretos. Confira os dados e tente de novo.';
    return;
  }

  try {
    sessionStorage.setItem(SESSION_KEY, user);
  } catch (_) {
    errorBox.textContent = 'Não foi possível iniciar a sessão neste navegador.';
    return;
  }
  location.href = HOME;
});

document.querySelector('#forgot').addEventListener('click', () => {
  errorBox.textContent = 'A redefinição de senha será feita pelo back-end. Por enquanto, peça à nutricionista.';
});