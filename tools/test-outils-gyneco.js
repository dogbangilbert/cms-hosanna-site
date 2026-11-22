// Lancement : depuis la racine du site, servir les fichiers (python3 -m http.server 8765),
// installer axe-core dans un dossier de travail (npm i axe-core@4.10.2), puis :
// NODE_PATH=<dossier>/node_modules:$(npm root -g) node tools/test-outils-gyneco.js
// Variables facultatives : BASE (défaut http://localhost:8765), CAPTURES (dossier des captures).
// Tests navigateur des outils /regles et /infertilite-test (questionnaire par étapes)
const { chromium } = require('playwright');
const fs = require('fs');
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = process.env.BASE || 'http://localhost:8765';
const OUT = process.env.CAPTURES || require('os').tmpdir() + '/captures-outils-gyneco';
fs.mkdirSync(OUT, { recursive: true });
let echecs = 0, total = 0;
function ok(cond, msg) { total++; if (!cond) { echecs++; console.log('ÉCHEC', msg); } else console.log('ok   ', msg); }

async function ouvrir(browser, page, opts = {}) {
  const ctx = await browser.newContext(opts);
  const p = await ctx.newPage();
  const journal = { erreurs: [], nonGet: [], compteur: [], externes: new Set() };
  p.on('pageerror', e => journal.erreurs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|ERR_BLOCKED|net::/.test(m.text())) journal.erreurs.push('console: ' + m.text()); });
  p.on('request', r => {
    if (r.method() === 'GET') return;
    // Seule requête autorisée hors GET : le compteur anonyme, avec uniquement le nom de l'événement et la page.
    if (r.method() === 'POST' && new URL(r.url()).pathname === '/api/compteur') {
      let d = null; try { d = JSON.parse(r.postData() || ''); } catch (e) {}
      if (d && Object.keys(d).sort().join() === 'e,p' && /^[a-z_]+$/.test(d.e) && /^\/[a-z-]+(\.html)?$/.test(d.p)) { journal.compteur.push(d.e); return; }
    }
    journal.nonGet.push(r.method() + ' ' + r.url() + ' ' + (r.postData() || ''));
  });
  await p.route('**/*', r => { const u = new URL(r.request().url()); if (u.hostname !== 'localhost') { journal.externes.add(u.hostname); return r.abort(); } if (u.pathname === '/api/compteur') return r.fulfill({ status: 204 }); return r.continue(); }); // compteur simulé (fonction Netlify absente en local)
  await p.goto(BASE + page);
  return { ctx, p, journal };
}
async function axe(p, nom) {
  await p.addScriptTag({ content: AXE });
  const r = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } })).violations.map(v => v.id + ' (' + v.nodes.length + ') ' + v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')));
  ok(r.length === 0, nom + ' : axe-core WCAG AA sans violation ' + (r.length ? JSON.stringify(r) : ''));
}
// Contrôle strict : aucun élément visible ne dépasse la largeur de l'écran (body masque le débordement).
async function largeur(p, nom) {
  const w = await p.evaluate(() => { const vw = window.innerWidth; let max = document.documentElement.scrollWidth; document.querySelectorAll('section *').forEach(el => { const r = el.getBoundingClientRect(); if (r.width && el.offsetParent !== null) max = Math.max(max, Math.ceil(r.right)); }); return [max, vw]; });
  ok(w[0] <= w[1], nom + ' : rien ne dépasse de l\'écran (' + w[0] + ' <= ' + w[1] + ')');
}
const etape = p => p.evaluate(() => document.querySelector('.progression-texte').textContent);

// Remplit les réponses, puis avance d'étape en étape comme une patiente.
async function repondre(p, rep) {
  await p.reload();
  await p.evaluate(rep => {
    for (const [id, v] of Object.entries(rep.v || {})) document.getElementById(id).value = v;
    for (const [n, v] of Object.entries(rep.r || {})) { const el = document.querySelector(`input[name="${n}"][value="${v}"]`); el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); }
    for (const s of rep.c || []) document.querySelector(s).checked = true;
  }, rep);
  for (let k = 0; k < 8; k++) {
    if (await p.isVisible('.e-fin')) break;
    await p.click('.e-suiv');
    if (await p.isVisible('[role=alert]:not([hidden])')) break;
  }
  if (await p.isVisible('.e-fin')) await p.click('.e-fin');
}

// ---------- Outil 1 : règles ----------
async function regles(p, d) {
  const v = {}, r = {}, c = [];
  for (const k of ['age', 'cycle', 'duree', 'garn', 'jdouleur', 'mois', 'premieres', 'ecart', 'douleur', 'contra', 'debut']) if (d[k] !== undefined) v['r-' + k] = String(d[k]);
  r['r-statut'] = d.statut || 'viennent';
  if (d.avant) r['r-avant'] = d.avant; if (d.grossesse) r['r-grossesse'] = d.grossesse; if (d.allait) r['r-allait'] = d.allait;
  for (const x of d.coches || []) c.push('#r-' + x);
  await repondre(p, { v, r, c });
  return p.evaluate(() => ({
    visible: !document.getElementById('r-resultat').hidden,
    erreur: document.getElementById('r-erreur').hidden ? '' : document.getElementById('r-erreur').textContent,
    vous: [...document.querySelectorAll('#r-table tr.vous td:first-child')].map(t => t.textContent),
    niveau: document.getElementById('r-niveau').textContent,
    urgence: !document.getElementById('r-urgence').hidden,
    texte: document.getElementById('r-constats').textContent,
    questions: document.querySelectorAll('#r-questions li').length,
    recap: document.getElementById('r-recap').textContent,
    wa: document.getElementById('r-rdv').href,
    c1: document.getElementById('r-c1').textContent, c1n: document.getElementById('r-c1n').textContent, c2: document.getElementById('r-c2').textContent,
  }));
}
const V = 'Vert · repères habituels', O1 = 'Orange · consultez dans le mois', O2 = 'Orange · consultez dans les 2 semaines', R = 'Rouge · urgence : consultez maintenant';
const base = { age: 25, cycle: 28, duree: 5, garn: 3 };
const CAS_R = [
  ['Cycle normal', base, r => r.vous.join() === 'Cycle normal' && r.niveau === V && !r.urgence && r.c1 === '28 jours' && r.questions > 0 && /Cycle28 jours/.test(r.recap)],
  ['Polyménorrhée (21 j)', { ...base, cycle: 21 }, r => r.vous.join() === 'Polyménorrhée (cycles trop fréquents)' && r.niveau === O1],
  ['Limites 24 j et 38 j normales', { ...base, cycle: 38 }, r => r.vous.join() === 'Cycle normal'],
  ['Oligoménorrhée 42 j + irrégulier', { ...base, cycle: 42, ecart: '10' }, r => r.vous.includes('Oligoménorrhée (cycles espacés)') && r.vous.includes('Cycles irréguliers') && /42 jours est plus long/.test(r.texte)],
  ['Écart 8-9 j à 30 ans : irrégulier', { ...base, age: 30, ecart: '8' }, r => r.vous.includes('Cycles irréguliers')],
  ['Écart 8-9 j à 22 ans : normal', { ...base, age: 22, ecart: '8' }, r => r.vous.join() === 'Cycle normal'],
  ['Adolescente, règles depuis 2 ans, cycle 42 j : normal', { ...base, age: 14, premieres: 12, cycle: 42, ecart: '10' }, r => r.vous.join() === 'Cycle normal' && /21 à 45/.test(r.c1n) && /moins de 3 ans/.test(r.texte)],
  ['Adolescente, cycle 50 j : oligoménorrhée', { ...base, age: 14, premieres: 12, cycle: 50 }, r => r.vous.join() === 'Oligoménorrhée (cycles espacés)'],
  ['Adolescente, cycle 22 j : normal', { ...base, age: 15, premieres: 13, cycle: 22 }, r => r.vous.join() === 'Cycle normal'],
  ['Règles de 10 j + 8 garnitures', { ...base, duree: 10, garn: 8 }, r => r.vous.includes('Règles prolongées') && r.vous.includes('Hyperménorrhée (ménorragie)') && r.niveau === O2 && /indice/.test(r.texte)],
  ['3 garnitures : normal', base, r => r.vous.join() === 'Cycle normal'],
  ['4 garnitures : abondant (seuil de Gilbert)', { ...base, garn: 4 }, r => r.vous.join() === 'Hyperménorrhée (ménorragie)' && /4 garnitures/.test(r.texte)],
  ['Adulte, règles de 8 j : normal', { ...base, duree: 8 }, r => r.vous.join() === 'Cycle normal'],
  ['Adolescente, règles de 8 j : prolongées (repère 7 j)', { ...base, age: 14, premieres: 12, duree: 8 }, r => r.vous.join() === 'Règles prolongées' && /repère de 7 jours/.test(r.texte)],
  ['Caillots seuls : hyperménorrhée', { ...base, coches: ['caillots'] }, r => r.vous.join() === 'Hyperménorrhée (ménorragie)'],
  ['Hypoménorrhée : vert', { ...base, garn: 1, coches: ['peu'] }, r => r.vous.join() === 'Hypoménorrhée' && r.niveau === V],
  ['Métrorragies + après rapports : 2 semaines', { ...base, coches: ['entre', 'apres'] }, r => r.vous.includes('Métrorragies') && r.vous.includes('Saignements après les rapports') && r.niveau === O2],
  ['Implant + saignements entre les règles : effet de la méthode', { ...base, contra: 'implant', cycle: 45, coches: ['entre'] }, r => r.vous.join() === 'Saignements modifiés par la contraception' && r.niveau === V && /plus de 3 mois/.test(r.texte)],
  ['Implant + saignement après rapports : reste orange', { ...base, contra: 'implant', coches: ['apres'] }, r => r.vous.includes('Saignements après les rapports') && r.niveau === O2],
  ['Stérilet cuivre + règles abondantes : signalé', { ...base, contra: 'cuivre', garn: 9 }, r => r.vous.includes('Hyperménorrhée (ménorragie)') && /cuivre/.test(r.texte)],
  ['Dysménorrhée légère : vert', { ...base, douleur: 1 }, r => r.vous.join() === 'Dysménorrhée' && r.niveau === V],
  ['Douleur apparue tard : à explorer', { ...base, douleur: 2, debut: 'tard' }, r => /endométriose/.test(r.texte) && r.niveau === O1],
  ['Douleur hors règles : à explorer', { ...base, douleur: 1, coches: ['hors'] }, r => /en dehors des règles/.test(r.texte) && r.niveau === O1],
  ['Dysménorrhée invalidante + signes', { ...base, douleur: 3, jdouleur: 5, coches: ['inefficace', 'rapports'] }, r => r.vous.includes('Dysménorrhée invalidante') && /ne permettent pas de poser un diagnostic/.test(r.texte) && /5 jours/.test(r.texte)],
  ['Urgence : malaise', { ...base, garn: 10, coches: ['malaise'] }, r => r.urgence && r.niveau === R],
  ['Urgence : grossesse possible + saignement', { ...base, coches: ['entre'], grossesse: 'oui' }, r => r.urgence && r.niveau === R],
  ['Urgence même sous implant si grossesse possible', { ...base, contra: 'implant', coches: ['entre'], grossesse: 'nsp' }, r => r.urgence],
  ['Grossesse possible sans saignement : pas d’urgence', { ...base, grossesse: 'nsp' }, r => !r.urgence],
  ['Aménorrhée secondaire 4 mois (régulières)', { statut: 'arretees', age: 30, mois: 4, avant: 'oui' }, r => r.vous.join() === 'Aménorrhée secondaire' && r.c2 === 'plus de 3 mois' && r.niveau === O1],
  ['Retard 4 mois (irrégulières) : pas encore aménorrhée', { statut: 'arretees', age: 30, mois: 4, avant: 'non' }, r => r.vous.length === 0 && /pas encore une aménorrhée/.test(r.texte)],
  ['Injection, 8 mois sans règles : effet de la méthode', { statut: 'arretees', age: 30, mois: 8, contra: 'injection' }, r => r.vous.join() === 'Saignements modifiés par la contraception' && r.niveau === V],
  ['Allaitement, 7 mois sans règles : normal', { statut: 'arretees', age: 27, mois: 7, allait: 'oui' }, r => r.vous.join() === 'Absence de règles de l\'allaitement' && /6 mois/.test(r.texte)],
  ['Ménopause probable', { statut: 'arretees', age: 52, mois: 14 }, r => r.vous.join() === 'Ménopause' && r.niveau === V],
  ['Saignement après ménopause : 2 semaines', { statut: 'arretees', age: 52, mois: 14, coches: ['reprise'] }, r => r.vous.includes('Métrorragies') && r.niveau === O2],
  ['Arrêt + grossesse possible : test conseillé', { statut: 'arretees', age: 28, mois: 2, grossesse: 'oui' }, r => /test de grossesse/.test(r.texte) && !r.urgence],
  ['Aménorrhée primaire à 16 ans', { statut: 'jamais', age: 16 }, r => r.vous.join() === 'Aménorrhée primaire'],
  ['Pas de règles à 13 ans : normal possible', { statut: 'jamais', age: 13 }, r => r.vous.length === 0 && /peut être normal/.test(r.texte) && r.niveau === V],
];
const INV_R = [
  ['Âge vide', { cycle: 28, duree: 5 }, /votre âge/],
  ['Âge 5 ans : orientation (règles précoces)', { age: 5, cycle: 28, duree: 5 }, /trop précoces/],
  ['Âge 65 ans : orientation (saignement anormal)', { age: 65, cycle: 28, duree: 5 }, /Après 60 ans, tout saignement/],
  ['Premières règles après l\'âge', { age: 12, premieres: 14, cycle: 28, duree: 5 }, /premières règles/],
  ['Cycle vide', { age: 25, duree: 5 }, /durée habituelle/],
  ['Cycle 200 j', { age: 25, cycle: 200, duree: 5 }, /entre 10 et 120/],
  ['Durée 0', { age: 25, cycle: 28, duree: 0 }, /entre 1 et 30/],
  ['Garnitures 99', { age: 25, cycle: 28, duree: 5, garn: 99 }, /entre 0 et 40/],
  ['Contradiction peu + abondant', { age: 25, cycle: 28, duree: 5, garn: 9, coches: ['peu'] }, /vérifiez vos réponses/],
  ['Mois d’arrêt vide', { statut: 'arretees', age: 30 }, /depuis combien de mois/],
];

// ---------- Outil 2 : infertilité ----------
async function inf(p, d) {
  const v = {}, r = {}, c = [];
  for (const [k, id] of [['af', 'agef'], ['ah', 'ageh'], ['m', 'mois'], ['freq', 'freq']]) if (d[k] !== undefined) v['i-' + id] = String(d[k]);
  if (d.gf) r['i-gf'] = d.gf; if (d.gh) r['i-gh'] = d.gh;
  for (const x of d.ff || []) c.push(`.i-ff[value="${x}"]`);
  for (const x of d.fh || []) c.push(`.i-fh[value="${x}"]`);
  await repondre(p, { v, r, c });
  return p.evaluate(() => ({
    visible: !document.getElementById('i-resultat').hidden,
    erreur: document.getElementById('i-erreur').hidden ? '' : document.getElementById('i-erreur').textContent,
    vous: [...document.querySelectorAll('#i-table tr.vous td:first-child')].map(t => t.textContent),
    niveau: document.getElementById('i-niveau').textContent,
    texte: document.getElementById('i-constats').textContent,
    questions: document.getElementById('i-questions').textContent,
    recap: document.getElementById('i-recap').textContent,
    c1: document.getElementById('i-c1').textContent, c2: document.getElementById('i-c2').textContent,
    wa: document.getElementById('i-rdv').href,
    lien: !!document.querySelector('#i-resultat a[href="/infertilite"]'),
  }));
}
const CAS_I = [
  ['28 ans, 5 mois : continuer', { af: 28, ah: 30, m: 5 }, r => r.vous.join() === 'Moins de 6 mois' && /^Vert/.test(r.niveau) && r.c2 === 'dès 12 mois' && /encore 7 mois/.test(r.texte) && /pas une obligation/.test(r.texte) && /deux partenaires/.test(r.texte)],
  ['28 ans, 11 mois : continuer', { af: 28, ah: 30, m: 11 }, r => r.vous.join() === '6 à 11 mois' && /encore 1 mois/.test(r.texte)],
  ['28 ans, 12 mois : infertilité OMS primaire', { af: 28, ah: 30, m: 12 }, r => r.vous.join() === '12 mois ou plus' && /OMS/.test(r.niveau) && /infertilité primaire/.test(r.texte) && r.c1 === '1 an'],
  ['30 ans, 26 mois, grossesse antérieure : secondaire', { af: 30, ah: 35, m: 26, gf: 'oui' }, r => /secondaire/.test(r.texte) && r.c1 === '2 ans et 2 mois'],
  ['35 ans, 5 mois : continuer (repère 6)', { af: 35, ah: 36, m: 5 }, r => r.c2 === 'dès 6 mois' && /^Vert/.test(r.niveau)],
  ['37 ans, 7 mois : bilan maintenant', { af: 37, ah: 40, m: 7 }, r => /bilan conseillé/.test(r.niveau) && r.vous.join() === '6 à 11 mois' && /spermogramme/.test(r.questions)],
  ['41 ans, 2 mois : sans attendre', { af: 41, ah: 45, m: 2 }, r => r.c2 === 'sans attendre' && /^Orange/.test(r.niveau) && /homme diminue/.test(r.texte) && /réserve ovarienne/.test(r.questions)],
  ['29 ans, SOPK : sans attendre', { af: 29, ah: 31, m: 3, ff: ['ovaires polykystiques (SOPK)'] }, r => r.c2 === 'sans attendre' && /SOPK/.test(r.texte) && /ovulation/.test(r.questions) && /SOPK/.test(decodeURIComponent(r.wa))],
  ['Grossesse extra-utérine : question sur les trompes', { af: 29, ah: 31, m: 3, ff: ['grossesse extra-utérine'] }, r => /trompes/.test(r.questions)],
  ['Varicocèle, 4 mois : repère 6 mois', { af: 26, ah: 30, m: 4, fh: ['varicocèle ou hernie opérée'] }, r => r.c2 === 'dès 6 mois' && /^Vert/.test(r.niveau) && /encore 2 mois/.test(r.texte) && /varicocèle/.test(r.recap)],
  ['Varicocèle, 7 mois : bilan', { af: 26, ah: 30, m: 7, fh: ['varicocèle ou hernie opérée'] }, r => /bilan conseillé/.test(r.niveau) && /avec cet antécédent/.test(r.texte)],
  ['Fibrome : repère 6 mois', { af: 30, ah: 30, m: 2, ff: ['fibrome connu'] }, r => r.c2 === 'dès 6 mois'],
  ['Infection génitale chez la femme : sans attendre', { af: 30, ah: 30, m: 2, ff: ['infection génitale ancienne'] }, r => r.c2 === 'sans attendre'],
  ['Fausses couches : message, délai inchangé', { af: 30, ah: 30, m: 2, ff: ['2 fausses couches ou plus'] }, r => r.c2 === 'dès 12 mois' && /fausses couches ou plus : ce n'est pas une infertilité/.test(r.texte)],
  ['Oreillons : sans attendre', { af: 26, ah: 30, m: 4, fh: ['oreillons avec testicules gonflés'] }, r => r.c2 === 'sans attendre' && /bilan conseillé/.test(r.niveau)],
  ['Rapports rares : remarque', { af: 26, ah: 30, m: 14, freq: '0' }, r => /moins d'une fois par semaine/.test(r.texte)],
  ['0 mois : arrêt de contraception', { af: 26, ah: 30, m: 0 }, r => /contraception/.test(r.texte) && r.vous.join() === 'Moins de 6 mois'],
  ['Lien vers /infertilite et WhatsApp', { af: 26, ah: 30, m: 13 }, r => r.lien && /wa\.me\/22890038313\?text=/.test(r.wa)],
];
const INV_I = [
  ['Âge femme vide', { ah: 30, m: 5 }, /âge de la femme/],
  ['Âge femme 12', { af: 12, ah: 30, m: 5 }, /entre 15 et 55/],
  ['Âge homme vide', { af: 30, m: 5 }, /âge de l'homme/],
  ['Mois vide', { af: 30, ah: 30 }, /combien de mois/],
  ['Mois 400', { af: 30, ah: 30, m: 400 }, /entre 0 et 360/],
];

(async () => {
  const browser = await chromium.launch();
  for (const [page, nom, fn, cas, inv, resCas] of [['/regles.html', 'Règles', regles, CAS_R, INV_R, 21], ['/infertilite-test.html', 'Infertilité', inf, CAS_I, INV_I, 6]]) {
    const { ctx, p, journal } = await ouvrir(browser, page);
    const meta = await p.evaluate(() => ({ robots: document.querySelector('meta[name=robots]').content, bandeau: !!document.querySelector('p.brouillon'), mention: document.querySelector('form .mention').textContent, bouton: document.querySelector('.actions-outil a[href^="https://wa.me"]').textContent, avis: (document.querySelector('.avis') || {}).textContent || '' }));
    ok(meta.robots === 'noindex', nom + ' : page en noindex (indexation après relecture finale de Gilbert)');
    ok(!meta.bandeau, nom + ' : bandeau « en attente de validation » retiré');
    ok(meta.mention === "Vos réponses sont uniquement avec vous et ne vont nulle part ailleurs. Nous comptons seulement le nombre d'utilisations, de façon anonyme.", nom + ' : phrase de confidentialité de Gilbert');
    ok(meta.bouton === 'Demander un avis (WhatsApp)', nom + ' : bouton neutre « Demander un avis (WhatsApp) »');
    ok(/^Pour un avis adapté à votre situation, faites-vous consulter par un professionnel de santé\. Si vous le souhaitez, l'équipe du CMS HOSANNA peut aussi vous répondre\.$/.test(meta.avis), nom + ' : phrase de fin neutre');
    // Parcours par étapes
    const n = nom === 'Règles' ? 5 : 4;
    ok((await etape(p)) === 'Étape 1 sur ' + n + (nom === 'Règles' ? ' · Vous' : ' · Le couple'), nom + ' : progression « Étape 1 sur ' + n + ' »');
    ok(!(await p.isVisible('.e-prec')) && !(await p.isVisible('.e-fin')), nom + ' : étape 1 sans « Précédent » ni bouton final');
    await axe(p, nom + ' (étape 1)');
    await p.click('.e-suiv');
    ok(/^Étape 1/.test(await etape(p)) && await p.isVisible('[role=alert]:not([hidden])'), nom + ' : « Suivant » bloqué si l\'âge manque, message affiché');
    const champ = nom === 'Règles' ? '#r-age' : '#i-agef';
    ok(await p.evaluate(c => document.activeElement === document.querySelector(c), champ), nom + ' : le curseur va sur le champ à corriger');
    if (nom === 'Règles') { await p.fill('#r-age', '30'); await p.press('#r-age', 'Enter'); }
    else { await p.fill('#i-agef', '30'); await p.fill('#i-ageh', '32'); await p.fill('#i-mois', '4'); await p.press('#i-mois', 'Enter'); }
    ok(/^Étape 2/.test(await etape(p)) && !(await p.isVisible(nom === 'Règles' ? '#r-resultat' : '#i-resultat')), nom + ' : la touche Entrée passe à l\'étape suivante');
    await p.click('.e-prec');
    ok(/^Étape 1/.test(await etape(p)), nom + ' : « Précédent » revient en arrière');
    if (nom === 'Règles') {
      await p.check('input[name="r-statut"][value="arretees"]');
      ok(/^Étape 1 sur 3/.test(await etape(p)), 'Règles : règles arrêtées → 3 étapes seulement (questions inutiles retirées)');
      await p.check('input[name="r-statut"][value="jamais"]');
      ok(/^Étape 1 sur 2/.test(await etape(p)) && !(await p.isVisible('#r-contra')), 'Règles : jamais de règles → 2 étapes, sans questions de contraception');
    }
    // Cas types et saisies invalides
    for (const [titre, d, attendu] of cas) {
      const r = await fn(p, d);
      let bon = false; try { bon = r.visible && !r.erreur && attendu(r); } catch (e) {}
      ok(bon, nom + ' — ' + titre + (bon ? '' : ' → ' + JSON.stringify(r)));
    }
    for (const [titre, d, re] of inv) {
      const r = await fn(p, d);
      ok(!r.visible && re.test(r.erreur), nom + ' — saisie invalide : ' + titre + (re.test(r.erreur) ? '' : ' → « ' + r.erreur + ' »'));
    }
    await fn(p, cas[resCas][1]);
    await axe(p, nom + ' (résultat)');
    const mention = await p.evaluate(() => document.body.textContent.includes('Information générale. Ne remplace pas une consultation.'));
    ok(mention, nom + ' : mention « Information générale. Ne remplace pas une consultation. »');
    await p.click(nom === 'Règles' ? '#r-modifier' : '#i-modifier');
    ok(/^Étape 1/.test(await etape(p)) && !(await p.isVisible(nom === 'Règles' ? '#r-resultat' : '#i-resultat')), nom + ' : « Modifier mes réponses » revient à l\'étape 1');
    ok(journal.erreurs.length === 0, nom + ' : aucune erreur JavaScript ' + journal.erreurs.join(' / '));
    ok(journal.nonGet.length === 0, nom + ' : aucune requête autre que GET, sauf le compteur anonyme ' + journal.nonGet.join(' / '));
    const evt = nom === 'Règles' ? 'regles_resultat' : 'infertilite_resultat';
    ok(journal.compteur.includes(evt) && journal.compteur.every(e => [evt, 'imprimer_clic', 'rdv_whatsapp_clic'].includes(e)), nom + ' : compteur « ' + evt + ' » envoyé, sans aucune réponse (' + [...new Set(journal.compteur)].join(', ') + ')');
    ok(!journal.externes.has('static.cloudflareinsights.com'), nom + ' : pas de mesure d\'audience chargée');
    console.log('      hôtes externes demandés (bloqués pendant le test) :', [...journal.externes].join(', '));
    await ctx.close();

    // Mobile 375 px
    const m = await ouvrir(browser, page, { viewport: { width: 375, height: 760 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await largeur(m.p, nom + ' mobile 375 px (étape 1)');
    await m.p.screenshot({ path: `${OUT}/${nom}-etape1-375.png`, fullPage: true });
    await fn(m.p, cas[resCas][1]);
    await largeur(m.p, nom + ' mobile 375 px (résultat)');
    await m.p.locator(nom === 'Règles' ? '#r-resultat' : '#i-resultat').screenshot({ path: `${OUT}/${nom}-resultat-375.png` });
    await m.p.evaluate(() => { window.print = () => {}; });
    await m.p.click(nom === 'Règles' ? '#r-imprimer' : '#i-imprimer');
    await m.p.waitForTimeout(200);
    ok(m.journal.compteur.includes('imprimer_clic'), nom + ' : clic « Imprimer » compté');
    await m.p.emulateMedia({ media: 'print' });
    await m.p.pdf({ path: `${OUT}/${nom}-fiche.pdf`, format: 'A4', printBackground: true });
    ok(m.journal.erreurs.length === 0 && m.journal.nonGet.length === 0, nom + ' mobile : aucune erreur JS ni requête non-GET');
    await m.ctx.close();
  }
  await browser.close();
  console.log(`\n${total - echecs}/${total} contrôles réussis, ${echecs} échec(s)`);
  process.exit(echecs ? 1 : 0);
})();
