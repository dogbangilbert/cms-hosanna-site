import json, base64, html, re, math
s = open('source.html', encoding='utf-8').read()
logo = 'data:image/jpeg;base64,' + base64.b64encode(open('logo.jpg', 'rb').read()).decode()
CHIFFRES = {}
norm = lambda x: re.sub(r"[^\wéèêàâùûôîïçœ'-]", '', x.lower().replace('’', "'"))
lignes = open('voix.txt', encoding='utf-8').read().strip().split('\n')
NMAX = len(lignes); MOTS = {}; FIN = {}; MARQ = {}; STAMPS = {}
for n, ligne in enumerate(lignes, 1):
    mots = json.load(open(f'voix/v{n}.json', encoding='utf-8'))
    toks = []
    for tk in ligne.split():
        if all(c in '?!:;.,' for c in tk) and toks: toks[-1] += ' ' + tk
        else: toks.append(tk)
    assert len(toks) == len(mots), (n, len(toks), len(mots))
    w = []
    for tk, m in zip(toks, mots):
        base = tk.rstrip('?!:;., ')
        w.append([round(m['t'] + .5, 3), round(m['d'], 3), CHIFFRES.get(base.lower(), base) + tk[len(base):]])
    MOTS[n] = [(norm(tk), x[0]) for tk, x in zip(toks, w)]
    FIN[n] = w[-1][0] + w[-1][1]
    s = s.replace(f'__W{n}__', html.escape(json.dumps(w, ensure_ascii=False)))
    s = s.replace(f'__S{n}__', html.escape(ligne))
durees = [max(9.5, math.ceil((FIN[n] + 1.5) * 2) / 2) if n == NMAX else max(5.5, math.ceil((FIN[n] + 1.3) * 2) / 2) for n in sorted(FIN)]
for n, d in enumerate(durees, 1): s = s.replace(f'__T{n}__', str(d))
def cherche(n, spec):
    mot, _, k = spec.partition('#'); mot = norm(mot); k = int(k or 1); c = 0
    for tk, t in MOTS[n]:
        if tk == mot or tk.startswith(mot):
            c += 1
            if c == k: return t
    raise SystemExit(f'mot introuvable : scène {n} « {spec} »')
def tm(m):
    n = int(m.group(1)); t = cherche(n, m.group(2)); MARQ.setdefault(n, []).append(round(t, 2)); return str(round(t, 2))
def tamp(m):
    n = int(m.group(1)); t = cherche(n, m.group(2)); STAMPS.setdefault(n, []).append(round(t, 2)); return str(round(t, 2))
s = re.sub(r'\[\[(\d+):([^\]]+)\]\]', tamp, s)
s = re.sub(r'\{\{(\d+):([^}]+)\}\}', tm, s)
s = s.replace('__LOGO__', logo)
import glob, os
for f in glob.glob('img/*.jpg'):
    s = s.replace('__IMG_%s__' % os.path.basename(f)[:-4], 'data:image/jpeg;base64,' + base64.b64encode(open(f,'rb').read()).decode())
json.dump({'marq': MARQ, 'stamps': STAMPS, 'fin': FIN, 'durees': durees}, open('timing.json', 'w'))
open('minute-sante.html', 'w', encoding='utf-8').write(s)
open('page-complete.html', 'w', encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + s + '</body></html>')
print('ok', durees, 'total', sum(durees))
