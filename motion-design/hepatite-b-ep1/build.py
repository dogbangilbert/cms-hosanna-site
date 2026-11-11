import json, base64, html, re, math, sys
s = open('source.html', encoding='utf-8').read()
logo = 'data:image/jpeg;base64,' + base64.b64encode(open('logo.jpg', 'rb').read()).decode()
CHIFFRES = {'neuf': '9', 'dix': '10', 'cinquante': '50', 'cent': '100'}
norm = lambda x: re.sub(r"[^\wéèêàâùûôîïç'-]", '', x.lower().replace('’', "'"))
lignes = open('voix.txt', encoding='utf-8').read().strip().split('\n')
MOTS = {}; FIN = {}; MARQ = {}
NMAX = len(lignes)
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
        w.append([round(m['t'] + .6, 3), round(m['d'], 3), CHIFFRES.get(base.lower(), base) + tk[len(base):]])
    MOTS[n] = [(norm(tk), x[0]) for tk, x in zip(toks, w)]
    FIN[n] = w[-1][0] + w[-1][1]
    s = s.replace(f'__W{n}__', html.escape(json.dumps(w, ensure_ascii=False)))
    s = s.replace(f'__S{n}__', html.escape(ligne))
    dur = max(10, math.ceil((FIN[n] + 2.0) * 2) / 2) if n == NMAX else math.ceil((FIN[n] + 2.0) * 2) / 2
    s = s.replace(f'__T{n}__', str(dur))
def tm(m):
    n, mot = int(m.group(1)), norm(m.group(2))
    for tk, t in MOTS[n]:
        if tk == mot or tk.startswith(mot):
            MARQ.setdefault(n, []).append(round(t, 2)); return str(round(t, 2))
    raise SystemExit(f'mot introuvable : scène {n} « {mot} »')
s = s.replace('__GRISE__', '{{1:savent}}')
s = re.sub(r'\{\{(\d+):([^}]+)\}\}', tm, s)
s = s.replace('__LOGO__', logo)
for k in ('foie','couple','flacon','prelevement'):
    s = s.replace(f'__IMG_{k}__', 'data:image/jpeg;base64,' + base64.b64encode(open(f'img/{k}.jpg','rb').read()).decode())
json.dump({'marq': MARQ, 'fin': FIN, 'durees': [max(10, math.ceil((FIN[n] + 2.0) * 2) / 2) if n == NMAX else math.ceil((FIN[n] + 2.0) * 2) / 2 for n in sorted(FIN)]}, open('timing.json', 'w'))
open('minute-sante-hepatite-b-1.html', 'w', encoding='utf-8').write(s)
open('page-complete.html', 'w', encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + s + '</body></html>')
print('ok, durées', [math.ceil((FIN[n] + 2.0) * 2) / 2 for n in FIN], 'total ≈', sum(10 if n == NMAX else math.ceil((FIN[n] + 2.0) * 2) / 2 for n in FIN))
