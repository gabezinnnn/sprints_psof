'use strict';

// Caminho da tela de login, a partir da pasta do index.html.
const LOGIN_PAGE = 'login/login.html';
const $ = s => document.querySelector(s);
const e = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const fmt = d => d.split('-').reverse().join('/');
const kg = n => n.toLocaleString('pt-BR', {maximumFractionDigits: 2});
// Ponto de integração: ao ligar o back-end, enviar a alteração de "k" para a API aqui.
const sync = k => {};
const IC = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  layers: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M2 20h20"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'
};
IC.arrow = '<path d="M5 12h14M13 6l6 6-6 6"/>';
const ic = n => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
let uid = 0;
const id = () => ++uid;

// Estrutura transcrita das fotos do Detalhado de 14/04/2026 (parcial: parte do almoço não aparece nas fotos).
const SEED = {
  'Almoço': {
    'Arroz branco': ['Arroz branco tipo 1', 'Arroz - Doação'],
    'Feijão carioca': ['Feijão carioca'],
    'Fricassé de frango': ['Manteiga', 'Queijo muçarela', 'Tomate molho', 'Batata palha', 'Requeijão', 'Queijo parmesão', 'Creme de leite', 'Milho em conserva', 'Sassami IQF'],
    'Fricassé de PTS clara': ['Molho shoyu', 'Tomate molho', 'Batata palha', 'Creme de soja', 'Milho em conserva', 'Proteína texturizada de soja clara', 'Creme vegetal', 'Proteína texturizada de soja grossa clara'],
    'Melão sem casca padrão': ['Melão'],
    'Salada de Alface americana, manga e cebola roxa': ['Alface americana', 'Cebola roxa', 'Manga palmer'],
    'Tempero': ['Alho poró', 'Azeite de oliva extra virgem', 'Cebola', 'Cebola roxa', 'Gengibre', 'Manjericão', 'Molho shoyu', 'Óleo de soja'],
    'Tempero salada': ['Azeite de oliva extra virgem', 'Limão taiti', 'Sal refinado', 'Vinagre de maçã']
  },
  'Lanche da manhã': {
    'Leite com café (descafeinado)': ['Açúcar refinado', 'Leite em pó', 'Café solúvel descafeinado'],
    'Mexerica ponkan': ['Mexerica ponkan'],
    'Pão de milho com requeijão': ['Requeijão', 'Pão de milho'],
    'Pão francês com pernil desfiado': ['Cebola', 'Pimentão vermelho', 'Tomate molho', 'Casal', 'Tomate salada', 'Pernil suíno sem osso', 'Alho descascado', 'Pão francês', 'Mini pão francês']
  },
  'Lanche da tarde': {
    'Mexerica ponkan': ['Mexerica ponkan'],
    'Pão francês com pernil desfiado': ['Cebola', 'Pimentão vermelho', 'Tomate molho', 'Casal', 'Tomate salada', 'Pernil suíno sem osso', 'Alho descascado', 'Pão francês', 'Mini pão francês'],
    'Suco de abacaxi (polpa)': ['Açúcar refinado', 'Polpa de abacaxi']
  }
};

const S = {
  unit: 'CE nº 356 - Amparo',
  date: '2026-04-14',
  insumos: [],
  meals: [],
  records: [],
  q: '',
  rep: 'dia',
  pv: false,
  csv: [],
  staff: [{id: id(), name: 'Nutricionista (demo)', role: 'Nutricionista', login: 'nutri', active: true}, {id: id(), name: 'Cozinheira 1 (demo)', role: 'Cozinheira', login: 'cozinha1', active: true}]
};
for (const [m, preps] of Object.entries(SEED)) {
  const meal = {id: id(), name: m, preps: []};
  for (const [p, its] of Object.entries(preps)) {
    const prep = {id: id(), name: p, items: []};
    for (const n of its) {
      let x = S.insumos.find(i => i.name === n);
      if (!x) {
        x = {id: id(), name: n, unit: 'kg', alias: [], status: 'Ativo'};
        S.insumos.push(x)
      }
      prep.items.push({id: id(), ins: x.id})
    }
    meal.preps.push(prep)
  }
  S.meals.push(meal)
}
S.insumos.find(i => i.name === 'Arroz branco tipo 1').alias.push('arroz branco');

const ins = i => S.insumos.find(x => x.id === i);
const items = () => S.meals.flatMap(m => m.preps.flatMap(p => p.items.map(it => ({...it, meal: m, prep: p, name: ins(it.ins).name}))));
const getItem = i => items().find(t => t.id === i);
const ctx = t => `${t.meal.name} › ${t.prep.name} › ${t.name}`;
const at = (n, p) => items().find(t => t.name === n && t.prep.name === p);
const recsOn = d => S.records.filter(r => r.date === d);
[['Arroz branco tipo 1', 'Arroz branco', 5, '2026-04-14'], ['Tomate molho', 'Fricassé de frango', 2, '2026-04-14'],
  ['Tomate molho', 'Fricassé de PTS clara', 1.5, '2026-04-14'], ['Açúcar refinado', 'Leite com café (descafeinado)', 1, '2026-04-14'],
  ['Arroz branco tipo 1', 'Arroz branco', 4.5, '2026-04-13']]
  .forEach(([n, p, q, d]) => S.records.push({id: id(), date: d, item: at(n, p).id, qty: q, unit: 'kg', src: 'demo'}));

let tt;
const toast = m => {
  const t = $('#toast');
  t.textContent = m;
  t.classList.add('on');
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove('on'), 3500)
};

// ---------- Voz (simulada por texto) ----------
const NUM = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  meio: .5,
  meia: .5
};
const STOP = ['de', 'da', 'do', 'em', 'sem', 'com'];
function voz(t) {
  const x = norm(t),
    m = x.match(/(\d+(?:[.,]\d+)?|\b(?:um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez|meio|meia)\b)\s*(quilos?|kg|gramas?|g|litros?|l)\b/);
  if (!m) return 'Não encontrei quantidade e unidade. Exemplo: "três quilos de arroz branco no almoço".';
  const q = NUM[m[1]] ?? parseFloat(m[1].replace(',', '.')),
    u = /^[qk]/.test(m[2]) ? 'kg' : m[2][0] === 'g' ? 'g' : 'L',
    w = x.split(/[^a-z0-9]+/);
  const sc = i => Math.max(...[i.name, ...i.alias].map(n => {
    const k = norm(n).split(/[^a-z0-9]+/).filter(z => z.length > 2 && !STOP.includes(z));
    return k.length ? k.filter(z => w.includes(z)).length / k.length : 0
    }));
  const best = Math.max(...S.insumos.map(sc));
  if (best < .5) return 'Insumo não reconhecido no cadastro. Cadastre-o ou use uma variação conhecida.';
  const ids = S.insumos.filter(i => sc(i) === best).map(i => i.id),
    M = S.meals.find(M => w.includes(norm(M.name).split(' ').pop()));
  const c = items().filter(t => ids.includes(t.ins) && (!M || t.meal.id === M.id));
  if (!c.length) return 'Insumo reconhecido, mas não consta em nenhuma preparação dessa refeição.';
  const rd = document.querySelector(`input[name=a][value=${areaOf(c[0])}]`);
  if (rd) rd.checked = true;
  $('#isel').innerHTML = c.map(t => `<option value="${t.id}">${e(t.name)} · ${e(t.prep.name)} · ${e(t.meal.name)}`).join('');
  $('#qq').value = q;
  $('#uu').value = u;
  return `${kg(q)} ${u} · ${c.length} contexto(s) possível(is). Confira a preparação e clique em Registrar.`
}

// ---------- Telas ----------
const V = {};
const LV = {ok: 'Funcional', demo: 'Demonstração', api: 'Depende do back-end'};
const STATUS = [['Insumos', 'demo', 'Cadastro, busca e variações do nome'], ['Registros e voz', 'demo', 'Voz simulada por texto; falta ESP32 e API'],
  ['Importação do Detalhado', 'api', 'Prévia pronta; leitura de PDF ou foto no back-end'], ['PDF do Detalhado', 'demo', 'Pela impressão do navegador; layout não validado'],
  ['Relatórios', 'demo', 'Diário, mensal e CSV'], ['Funcionárias e login', 'api', 'Senha e permissões no back-end'], ['Persistência', 'api', 'Recarregar a página volta aos dados de demonstração']];
const COL = ['#145560', '#34B27B', '#E9B44C'],
  SRC = {voz: 'ok', manual: 'am', 'importação': 'mint', demo: 'off'};
const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
};

V.painel = () => {
  const rs = recsOn(S.date),
    all = items();
  const tot = k => rs.filter(r => r.unit === 'kg' && areaOf(getItem(r.item)) === k).reduce((a, r) => a + r.qty, 0);
  const tots = AREAS.map(a => tot(a[0])),
    sum = tots.reduce((a, b) => a + b, 0),
    C = 2 * Math.PI * 52;
  let off = 0;
  const arcs = tots.map((t, i) => {
    const l = sum ? t / sum * C : 0,
      a = `<circle class="arc" cx="70" cy="70" r="52" stroke="${AREAS[i][2]}" stroke-dasharray="${l} ${C-l}" stroke-dashoffset="${-off}"/>`;
    off += l;
    return a
    }).join('');
  const miss = all.filter(t => !rs.some(r => r.item === t.id)).length;
  const days = [...Array(7)].map((_, k) => {
    const d = new Date(S.date + 'T12:00:00');
    d.setDate(d.getDate() - 6 + k);
    const iso = d.toISOString().slice(0, 10);
    return [iso, recsOn(iso).filter(r => r.unit === 'kg').reduce((a, r) => a + r.qty, 0)]
    });
  const mx = Math.max(1, ...days.map(d => d[1]));
  const kpi = (c, i, n, u, l, sub) => `
    <div class="card kpi"><i class="chip ${c}">${ic(i)}</i>
    <div><span>${l}</span><b>${n}<small>${u}</small></b><em>${sub}</em></div></div>`;
  return `
    <p class="hi">${greeting()}, ${e(S.user.name.split(' ')[0])}!</p>
    <h1>Visão geral</h1>
    <p class="sub">Registros e consumo de ${fmt(S.date)}</p>
<div class="g3">${kpi('c1','mic',rs.length,'','Registros do dia','Voz, manual e importação')}${kpi('c2','chart',kg(sum),'kg','Consumo em kg','Soma dos itens em kg')}${kpi('c3','file',miss,'','Itens sem registro','De '+all.length+' itens do Detalhado')}</div>
<div class="g2">
    <section class="card">
    <h2>Consumo nos últimos 7 dias (kg)</h2>
    <div class="chart">${days.map(([d,v])=>`<div class="col${d===S.date?' on':''}" title="${kg(v)} kg"><i style="height:${v/mx*100}%"></i><span>${d.slice(8)}/${d.slice(5,7)}</span></div>`).join('')}</div>
    </section>
<section class="card">
    <h2>Consumo por área</h2>
    <div class="donut"><svg viewBox="0 0 140 140" role="img" aria-label="Consumo por área"><circle class="trk" cx="70" cy="70" r="52"/>${arcs}<text class="dn" x="70" y="72" text-anchor="middle">${kg(sum)}</text><text class="du2" x="70" y="88" text-anchor="middle">kg no dia</text></svg>
    <ul class="leg">${AREAS.map(([k,n,c],i)=>`<li><span class="dot" style="background:${c}"></span>${n}<b>${kg(tots[i])} kg</b></li>`).join('')}
    </ul></div>
    </section></div>
<div class="g2 w">
    <section class="card">
    <h2>Últimos registros</h2>${rs.length?`<table><thead><tr><th>Item<th>Quantidade<th>Origem</tr></thead><tbody>${rs.slice(-6).reverse().map(r=>{const t=getItem(r.item);return`<tr><td><span class="dot" style="background:${AC(areaOf(t))[2]}"></span> ${e(t.name)}<small>${e(t.prep.name)}</small><td>${kg(r.qty)} ${r.unit}<td><span class="tag ${SRC[r.src]||'off'}">${e(r.src)}</span>`}).join('')}</tbody></table>`:'<p class="muted">Nenhum registro nesta data. Use a aba Registros.</p>'}
    </section>
<a class="promo" href="#detalhado">
    <div><h3>Detalhado de ${fmt(S.date)}</h3>
    <p>${miss} itens ainda sem quantidade. Confira a prévia e gere o PDF.</p></div><span>Abrir Detalhado ${ic('arrow')}</span></a></div>`
};

const insRows = () => S.insumos.filter(i => norm(i.name + ' ' + i.alias.join(' ')).includes(norm(S.q))).map(i => {
  const n = items().filter(t => t.ins === i.id).length;
  return `
    <tr><td>${e(i.name)}<td>${e(i.unit)}<td>${n}<td>${e(i.alias.join(', ')||'—')}<td><button class="tag ${i.status==='Ativo'?'ok':'off'}" data-act="tog" data-id="${i.id}">${i.status}</button>`
  }).join('') || '<tr><td colspan="5" class="muted">Nenhum insumo encontrado.';
V.insumos = () => `
  <h1>Insumos</h1>
<div class="panel">
  <h2>Novo insumo</h2>
  <form data-form="ins" class="row"><input name="n" placeholder="Nome oficial" required><select name="u"><option>kg<option>g<option>L<option>un</select><input name="a" placeholder="Variações (separe por vírgula)" size="30"><button>Cadastrar insumo</button>
  </form></div>
<div class="panel"><input data-filter placeholder="Buscar insumo" value="${e(S.q)}" aria-label="Buscar insumo">
  <table>
  <thead>
  <tr><th>Insumo<th>Unidade<th>Preparações<th>Variações<th>Situação</tr>
  </thead>
  <tbody id="tb">${insRows()}
  </tbody>
  </table>
<p class="muted">O mesmo insumo pode estar em várias preparações; a coluna "Preparações" conta em quantas ele aparece, sem tratar como duplicidade.</p></div>`;

const AREAS = [['horti', 'Hortifruti', '#7FA650', '#fff'], ['almoco', 'Almoço', '#E3A33B', '#2b2108'], ['lanche', 'Lanche', '#D9847A', '#3a1710'], ['suco', 'Suco', '#3A8799', '#fff']];
const AC = k => AREAS.find(a => a[0] === k);
// Regra provisória de área (a unidade deve confirmar): suco pela preparação; hortifruti pelo nome do insumo; o resto pela refeição.
const HORTI = /^(melao|alface|cebola|manga|alho|gengibre|manjericao|mexerica|tomate|pimentao|limao|casal)/;
const areaOf = t => /^suco/.test(norm(t.prep.name)) ? 'suco' : HORTI.test(norm(t.name)) ? 'horti' : t.meal.name === 'Almoço' ? 'almoco' : 'lanche';
const areaTag = k => `<span class="ar ar-${k}"><i></i>${AC(k)[1]}</span>`;
const itemOpts = k => items().filter(t => areaOf(t) === k).map(t => `<option value="${t.id}">${e(t.name)} · ${e(t.prep.name)} · ${e(t.meal.name)}`).join('');

const recTable = () => {
  const rs = recsOn(S.date);
  return rs.length ? `
    <table>
    <thead>
    <tr><th>Insumo<th>Área<th>Quantidade<th>Origem<th></tr>
    </thead>
    <tbody>${rs.map(r=>{const t=getItem(r.item);return`<tr><td>${e(t.name)}<small>${e(t.prep.name)} · ${e(t.meal.name)}</small><td>${areaTag(areaOf(t))}<td><b>${kg(r.qty)} ${r.unit}</b><td><span class="tag ${SRC[r.src]||'off'}">${e(r.src)}</span><td><button class="lnk" data-act="del" data-id="${r.id}">Excluir</button>`}).join('')}
    </tbody>
    </table>`
  : '<p class="muted">Nenhum registro nesta data. Use o formulário acima.</p>'
};
V.registros = () => `
  <h1>Registrar consumo</h1>
  <p class="sub">Escolha a área, o insumo e a quantidade.</p>
<form data-form="rec" class="card rec">
<div class="step"><b>1</b>Área</div>
  <div class="seg">${AREAS.map(([k,n,c,t],i)=>`<label class="seg-${k}"><input type="radio" name="a" value="${k}"${i?'':' checked'}><span>${n}</span></label>`).join('')}</div>
<div class="step"><b>2</b>Insumo</div><select name="i" id="isel" aria-label="Insumo">${itemOpts(AREAS[0][0])}</select>
<div class="step"><b>3</b>Quantidade</div>
  <div class="row"><input name="q" id="qq" type="number" step="0.01" min="0.01" placeholder="0,00" required aria-label="Quantidade"><select name="u" id="uu" aria-label="Unidade"><option>kg<option>g<option>L</select><button>Registrar</button></div>
  </form>
<form data-form="voz" class="card voz"><label>Comando de voz (simulação)</label>
  <div class="row"><input name="t" value="Registrar três quilos de arroz branco no almoço"><button class="ghost">Interpretar</button></div>
  <p id="vmsg" class="muted">A transcrição real virá do ESP32 pelo back-end. Aqui o texto é digitado e preenche o formulário acima.</p>
  </form>
<section class="card">
  <h2>Registros de ${fmt(S.date)}</h2>${recTable()}
  </section>`;

const areaView = ([k, n, c]) => () => {
  const mo = S.date.slice(0, 7),
    inA = r => areaOf(getItem(r.item)) === k,
    rs = recsOn(S.date).filter(inA);
  const sk = l => l.filter(r => r.unit === 'kg').reduce((a, r) => a + r.qty, 0),
    g = {};
  rs.forEach(r => {
    g[r.item] = g[r.item] || {t: getItem(r.item), q: 0, u: r.unit};
    g[r.item].q += r.qty
    });
  const rows = Object.values(g).sort((a, b) => b.q - a.q);
  const f = (l, v, u) => `
    <div class="card kpi ac-${k}">
    <div><span>${l}</span><b>${v}<small>${u}</small></b></div></div>`;
  return `
    <h1><span class="dot" style="background:${c}"></span>${n}</h1>
    <p class="sub">O que foi usado neste setor em ${fmt(S.date)}</p>
<div class="g3">${f('Total do dia',kg(sk(rs)),'kg')}${f('Total do mês',kg(sk(S.records.filter(r=>r.date.startsWith(mo)&&inA(r)))),'kg')}${f('Registros no dia',rs.length,'')}</div>
<section class="card ac-${k}" style="margin-top:16px">
    <h2>Consumo do dia</h2>${rows.length?`<table><thead><tr><th>Insumo<th>Preparação<th>Refeição<th>Quantidade</tr></thead><tbody>${rows.map(x=>`<tr><td>${e(x.t.name)}<td>${e(x.t.prep.name)}<td>${e(x.t.meal.name)}<td><b>${kg(x.q)} ${x.u}</b>`).join('')}</tbody><tfoot><tr><td colspan="3"><b>Total em kg</b><td><b>${kg(sk(rs))} kg</b></tfoot></table>`:'<p class="muted">Nada registrado neste setor nesta data.</p>'}
    </section>`
};
AREAS.forEach(a => {
  V['area-' + a[0]] = areaView(a)
  });

const docHTML = () => {
  const rs = recsOn(S.date);
  let miss = 0;
  const body = S.meals.map((m, i) => `
    <div class="mb m${i%3}">${e(m.name)}</div>${m.preps.map(p=>`<div class="pt">${e(p.name)}</div>${p.items.map(it=>{
  const v=rs.filter(r=>r.item===it.id),t=v.reduce((a,r)=>a+r.qty,0);if(!v.length)miss++;
  return`<div class="dr"><span>${e(ins(it.ins).name)}</span><span class="${v.length?'':'miss'}" title="${v.length?'Origem: '+e(v.map(r=>r.src).join(', ')):'Sem valor'}">${v.length?kg(t)+' '+v[0].unit:''}</span></div>`}).join('')}`).join('')}`).join('');
  return {
    miss,
    html: `
      <div id="doc">
      <div class="dh"><b class="logo">SESI</b><span>Controle de Estoque de Alimentos</span><span>${fmt(S.date)}</span></div>
      <div class="du">${e(S.unit)}</div>${body}</div>`
  }
};

const impHTML = () => `
  <p><b>${e(S.unit)}</b> · ${fmt(S.date)}</p>${S.meals.map(m=>`<details open><summary>${e(m.name)}</summary>${m.preps.map(p=>`<div class="prep"><input data-edit="${p.id}" value="${e(p.name)}" aria-label="Preparação"><div>${p.items.map(i=>`<span class="chip">${e(ins(i.ins).name)} <button class="x" data-act="rm" data-id="${i.id}" aria-label="Remover item">×</button></span>`).join('')}</div></div>`).join('')}</details>`).join('')}
<div class="review">Valor manuscrito encontrado na foto: <b>3 Kg</b> em "Arroz - Doação" (Almoço › Arroz branco). Confira antes de importar.</div>
<p><label><input type="radio" name="mode" value="s" checked> Importar só estrutura e cadastros</label><br><label><input type="radio" name="mode" value="c"> Importar também os consumos</label></p>
<button data-act="confirm">Confirmar importação</button>`;
V.detalhado = () => {
  const d = docHTML();
  return `
    <h1>Detalhado</h1>
<div class="panel">
    <h2>1. Importar</h2><input type="file" id="file" accept=".pdf,image/*" aria-label="Arquivo do Detalhado">
    <p class="muted">A leitura automática de PDF ou foto depende do back-end. Por enquanto, ao escolher um arquivo, a prévia carrega a estrutura transcrita das fotos de 14/04/2026. Edite os títulos e remova itens antes de confirmar.</p>
    <div id="imp">${S.pv?impHTML():''}</div></div>
<div class="panel">
    <h2>2. Prévia e geração</h2>
    <div class="attn">Layout provisório, montado a partir de fotos. Ainda não foi validado contra o PDF oficial.</div>
<p>${d.miss} campo(s) sem valor, em amarelo. No PDF eles ficam em branco, sem quantidade inventada. Passe o mouse sobre um valor para ver a origem. Cada quantidade vem só dos registros do próprio item, sem copiar o total entre preparações.</p>
<button class="cta" data-act="print">Gerar PDF (salvar pela impressão)</button>${d.html}</div>`
};

const hb = (l, c, v, mx, u, cl = '') => `
  <div class="hb ${cl}"><span class="hl" title="${l}">${l}</span>
  <div class="ht"><i style="width:${Math.max(v/mx*100,1.5)}%;background:${c}"></i></div><b>${kg(v)} ${u}</b></div>`;
V.relatorios = () => {
  const mo = S.rep === 'mes',
    m = S.date.slice(0, 7),
    rows = [];
  if (mo) {
    const g = {};
    S.records.filter(r => r.date.startsWith(m)).forEach(r => {
      const t = getItem(r.item),
        a = areaOf(t),
        k = a + '|' + t.name + '|' + r.unit;
      g[k] = g[k] || ['', t.name, 0, r.unit, a];
      g[k][2] += r.qty
      });
    rows.push(...Object.values(g))
  } else S.meals.forEach(M => M.preps.forEach(P => P.items.forEach(I => {
    const v = recsOn(S.date).filter(r => r.item === I.id);
    if (v.length) rows.push([P.name + ' · ' + M.name, ins(I.ins).name, v.reduce((a, r) => a + r.qty, 0), v[0].unit, areaOf(getItem(I.id))])
    })));
  rows.sort((a, b) => b[2] - a[2]);
  S.csv = rows.map(r => [...r.slice(0, 4), AC(r[4])[1]]);
  const byA = AREAS.map(([k, n, c]) => [n, c, rows.filter(r => r[4] === k && r[3] === 'kg').reduce((a, r) => a + r[2], 0)]),
    ma = Math.max(1, ...byA.map(x => x[2])),
    mx = Math.max(1, ...rows.slice(0, 10).map(r => r[2]));
  return `
    <h1>Relatórios</h1>
    <p class="sub">${mo?'Mês de '+m.split('-').reverse().join('/'):'Dia '+fmt(S.date)}</p>
<div class="row" style="margin-bottom:16px"><button data-act="rep" data-m="dia" aria-pressed="${!mo}">Diário</button><button data-act="rep" data-m="mes" aria-pressed="${mo}">Mensal</button><button data-act="csv">Baixar CSV</button></div>
${rows.length?`<div class="g2 eq"><section class="card"><h2>Total por área (kg)</h2>${byA.map(x=>hb(x[0],x[1],x[2],ma,'kg','big')).join('')}</section>
<section class="card"><h2>Insumos mais usados</h2>${rows.slice(0,10).map(r=>hb(e(r[1]),AC(r[4])[2],r[2],mx,r[3])).join('')}</section></div>
<section class="card"><h2>Detalhamento</h2><table><thead><tr><th>Área<th>Insumo<th>Preparação<th>Total</tr></thead><tbody>${rows.map(r=>`<tr><td>${areaTag(r[4])}<td>${e(r[1])}<td>${e(r[0]||'—')}<td><b>${kg(r[2])} ${r[3]}</b>`).join('')}</tbody></table></section>`
 :'<section class="card"><p class="muted">Nenhum registro neste período. Crie registros em Registrar consumo.</p></section>'}`
};

V.equipe = () => `
  <h1>Funcionárias</h1>
<div class="panel">
  <h2>Nova funcionária</h2>
  <form data-form="staff" class="row"><input name="n" placeholder="Nome" required><select name="r"><option>Cozinheira<option>Nutricionista</select><input name="l" placeholder="Usuário" required><button>Cadastrar</button>
  </form>
  <p class="muted">Senha e permissões serão definidas pelo back-end.</p></div>
<div class="panel">
  <table>
  <thead>
  <tr><th>Nome<th>Perfil<th>Usuário<th>Situação</tr>
  </thead>
  <tbody>${S.staff.map(s=>`<tr><td>${e(s.name)}<td>${e(s.role)}<td>${e(s.login)}<td><button class="tag ${s.active?'ok':'off'}" data-act="tgs" data-id="${s.id}">${s.active?'Ativa':'Inativa'}</button>`).join('')}
  </tbody>
  </table></div>`;

const R = [['painel', 'Painel', 'grid'], ['insumos', 'Insumos', 'layers'], ['registros', 'Registrar consumo', 'mic'], ...AREAS.map(a => ['area-' + a[0], a[1], null, a[2]]), ['detalhado', 'Detalhado', 'file'], ['relatorios', 'Relatórios', 'chart'], ['equipe', 'Funcionárias', 'users']];
let route = '';

// Menu lateral: no computador recolhe (fica só com ícones); no celular abre por cima da tela.
const isWide = () => window.matchMedia('(min-width: 801px)').matches;

function applyMenu() {
  let collapsed = false;
  try {
    collapsed = localStorage.getItem('qa-menu') === 'closed';
  } catch (_) {}
  $('#app').classList.toggle('collapsed', collapsed);
  $('#menuBtn').setAttribute('aria-expanded', String(isWide() ? !collapsed : $('#app').classList.contains('open')));
}

function toggleMenu() {
  const app = $('#app');
  if (isWide()) {
    const collapsed = app.classList.toggle('collapsed');
    try {
      localStorage.setItem('qa-menu', collapsed ? 'closed' : 'open');
    } catch (_) {}
  } else {
    app.classList.toggle('open');
  }
  applyMenu();
}
function render() {
  const u = S.user;
  if (!u) {
    location.replace(LOGIN_PAGE);
    return
  }
  $('#app').hidden = false;
  applyMenu();
  const ok = R.filter(([k]) => !(u.role === 'Cozinheira' && (k === 'relatorios' || k === 'equipe')));
  let r = (location.hash || '#painel').slice(1);
  if (!ok.some(x => x[0] === r)) {
    r = 'painel';
    history.replaceState(null, '', '#painel')
  }
  $('#nav').innerHTML = ok.map(([k, t, i, c]) => (k === 'area-horti' ? '<div class="grp">Registros por área</div>' : '') + (c ? `<a href="#${k}" title="${t}" class="sub ${k}${k===r?' on':''}"${k===r?' aria-current="page"':''}><span class="dot" style="background:${c}"></span><span class="lbl">${t}</span></a>` : `<a href="#${k}" title="${t}"${k===r?' class="on" aria-current="page"':''}>${ic(i)}<span class="lbl">${t}</span></a>`)).join('');
  $('#view').innerHTML = V[r]();
  $('#date').value = S.date;
  $('#unit').textContent = S.unit;
  $('#usr').innerHTML = `<i class="av">${e(u.name[0])}</i><span>${e(u.name)}<small>${e(u.role)}</small></span>`;
  $('#out').innerHTML = ic('logout') + 'Sair';
  document.title = ok.find(x => x[0] === r)[1] + ' · Quinta Auxiliar';
  if (route !== r) {
    window.scrollTo(0, 0);
    $('#app').classList.remove('open');
    route = r
  }
}

// ---------- Eventos ----------
document.addEventListener('submit', ev => {
  const f = ev.target.dataset.form;
  if (!f) return;
  ev.preventDefault();
  const d = Object.fromEntries(new FormData(ev.target));
  if (f === 'voz') {
    $('#vmsg').textContent = voz(d.t);
    return
  }
  if (f === 'ins') {
    S.insumos.push({
      id: id(),
      name: d.n.trim(),
      unit: d.u,
      alias: d.a.split(',').map(s => s.trim()).filter(Boolean),
      status: 'Ativo'
      });
    sync('insumos');
    toast('Insumo cadastrado. Associe-o a uma preparação na importação.')
  }
  if (f === 'rec') {
    let q = parseFloat(d.q),
      u = d.u;
    if (u === 'g') {
      q /= 1000;
      u = 'kg'
    }
    S.records.push({id: id(), date: S.date, item: +d.i, qty: q, unit: u, src: 'manual'});
    sync('registros');
    toast('Registro salvo')
  }
  if (f === 'staff') {
    S.staff.push({id: id(), name: d.n.trim(), role: d.r, login: d.l.trim(), active: true});
    sync('funcionarias');
    toast('Funcionária cadastrada')
  }
  render()
  });

document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-act]');
  if (!b) return;
  const a = b.dataset.act,
    i = +b.dataset.id;
  if (a === 'menu') {
    toggleMenu();
  } else if (a === 'shade') {
    $('#app').classList.remove('open');
    applyMenu();
  } else if (a === 'out') {
    S.user = null;
    route = '';
    try {
      sessionStorage.removeItem('qa')
    } catch (_) {}
    render()
  } else if (a === 'tog') {
    const x = ins(i);
    x.status = x.status === 'Ativo' ? 'Inativo' : 'Ativo';
    sync('insumos');
    $('#tb').innerHTML = insRows()
  } else if (a === 'tgs') {
    const s = S.staff.find(x => x.id === i);
    s.active = !s.active;
    sync('funcionarias');
    render()
  } else if (a === 'del') {
    S.records = S.records.filter(r => r.id !== i);
    sync('registros');
    render()
  } else if (a === 'rm') {
    S.meals.forEach(M => M.preps.forEach(P => P.items = P.items.filter(x => x.id !== i)));
    S.records = S.records.filter(r => r.item !== i);
    $('#imp').innerHTML = impHTML()
  } else if (a === 'confirm') {
    const mode = document.querySelector('input[name=mode]:checked').value;
    let msg = 'Estrutura e cadastros confirmados.';
    if (mode === 'c') {
      const t = at('Arroz - Doação', 'Arroz branco');
      if (!t) msg += ' O consumo manuscrito não tem item correspondente.';
      else if (S.records.some(r => r.item === t.id && r.date === S.date && r.qty === 3)) msg += ' Consumo duplicado ignorado.';
      else {
        S.records.push({id: id(), date: S.date, item: t.id, qty: 3, unit: 'kg', src: 'importação'});
        msg += ' 1 consumo importado.'
      }
    }
    sync('detalhado');
    toast(msg);
    render()
  } else if (a === 'print') window.print();
  else if (a === 'rep') {
    S.rep = b.dataset.m;
    render()
  } else if (a === 'csv') {
    const blob = new Blob(['\ufeffPreparação;Insumo;Total;Unidade;Área\n' + S.csv.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(';')).join('\n')], {type: 'text/csv'});
    const l = document.createElement('a');
    l.href = URL.createObjectURL(blob);
    l.download = `relatorio-${S.rep==='mes'?S.date.slice(0,7):S.date}.csv`;
    l.click()
  }
  });

document.addEventListener('input', ev => {
  const t = ev.target;
  if ('filter' in t.dataset) {
    S.q = t.value;
    $('#tb').innerHTML = insRows()
  } else if (t.dataset.edit) {
    S.meals.forEach(M => M.preps.forEach(P => {
      if (P.id === +t.dataset.edit) P.name = t.value
      }))
  }
  });

document.addEventListener('change', ev => {
  const t = ev.target;
  if (t.id === 'file' && t.files.length) {
    S.pv = true;
    $('#imp').innerHTML = impHTML()
  } else if (t.id === 'date' && t.value) {
    S.date = t.value;
    render()
  } else if (t.name === 'a') {
    $('#isel').innerHTML = itemOpts(t.value)
  }
  });

window.addEventListener('hashchange', render);
try {
  const l = sessionStorage.getItem('qa');
  S.user = S.staff.find(x => x.login === l && x.active) || null
} catch (_) {}
render();
