# Minutage mot à mot à partir de l'audio réel (pauses détectées) ; scène sans audio = minutage synthétique
import json, os, subprocess, re, numpy as np, imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe(); SR = 16000; HOP = int(.01 * SR)
def lire(mp3):
    raw = subprocess.run([FF, '-v', 'quiet', '-i', mp3, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
lignes = open('voix.txt', encoding='utf-8').read().strip().split('\n')
os.makedirs('voix', exist_ok=True)
poids = lambda w: len(w.strip('?!:;.,')) + 2
def tokens(l):
    t = []
    for tk in l.split():
        if all(c in '?!:;.,' for c in tk) and t: t[-1] += ' ' + tk
        else: t.append(tk)
    return t
for n, l in enumerate(lignes, 1):
    toks = tokens(l); mp3 = f'voix_el/v{n}.mp3'
    if not os.path.exists(mp3):
        T = 7.6; tot = sum(poids(w) for w in toks); t = .3; out = []
        for w in toks:
            d = T * poids(w) / tot; out.append({'t': round(t, 3), 'd': round(d, 3), 'm': w}); t += d
        json.dump(out, open(f'voix/v{n}.json', 'w', encoding='utf-8'), ensure_ascii=False); print(n, 'SANS VOIX (texte animé)', round(t, 2)); continue
    x = lire(mp3); fr = np.sqrt(np.convolve(x * x, np.ones(HOP) / HOP, 'same'))[::HOP]
    thr = fr.max() * 10 ** (-38 / 20); on = fr > thr
    idx = np.where(on)[0]; a, b = idx[0], idx[-1] + 1
    sil = []; k = a
    while k < b:
        if not on[k]:
            j = k
            while j < b and not on[j]: j += 1
            if (j - k) * .01 >= .13: sil.append((k, j))
            k = j
        else: k += 1
    fortes = [i for i, w in enumerate(toks[:-1]) if re.search(r'[.!?:]( [?!:;.,])*$', w)]
    sil.sort(key=lambda s: s[0] - s[1])  # plus longues d'abord
    choisies = sorted(sil[:len(fortes)], key=lambda s: s[0])
    if len(choisies) < len(fortes): choisies = []; fortes = []
    bornes = [(a, None)] + [(s[0], s[1]) for s in choisies]  # segments : [début, fin de parole] puis reprises
    segs = []; deb = a; wi = 0; prev = 0
    for (s0, s1), f in zip([(c[0], c[1]) for c in choisies], fortes):
        segs.append((deb * .01, s0 * .01, toks[prev:f + 1])); deb = s1; prev = f + 1
    segs.append((deb * .01, b * .01, toks[prev:]))
    out = []
    for d0, d1, ws in segs:
        tot = sum(poids(w) for w in ws); t = d0
        for w in ws:
            d = (d1 - d0) * poids(w) / tot; out.append({'t': round(t, 3), 'd': round(d, 3), 'm': w}); t += d
    json.dump(out, open(f'voix/v{n}.json', 'w', encoding='utf-8'), ensure_ascii=False)
    print(n, 'parole', round(a * .01, 2), '->', round(b * .01, 2), 'pauses utilisées', len(choisies), '/', len(fortes))
