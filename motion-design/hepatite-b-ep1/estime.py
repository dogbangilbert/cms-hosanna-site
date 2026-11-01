# Minutage ESTIMÉ (en attendant la vraie voix) : écrit voix/vN.json comme le ferait tts_mots.py
import json, os
os.makedirs('voix', exist_ok=True)
for n, ligne in enumerate(open('voix.txt', encoding='utf-8').read().strip().split('\n'), 1):
    toks = []
    for tk in ligne.split():
        if all(c in '?!:;.,' for c in tk) and toks: toks[-1] += ' ' + tk
        else: toks.append(tk)
    t = 0; out = []
    for tk in toks:
        d = (len(tk.strip('?!:;.,')) + 2.2) / 15.5
        if tk.rstrip()[-1] in '.?!:': d += .28
        elif tk[-1] == ',': d += .12
        out.append({'t': round(t, 3), 'd': round(d, 3), 'm': tk}); t += d
    json.dump(out, open(f'voix/v{n}.json', 'w', encoding='utf-8'), ensure_ascii=False)
