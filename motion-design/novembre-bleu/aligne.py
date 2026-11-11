# Minutage mot à mot depuis l'audio réel : les pauses détectées servent d'ancres entre les phrases.
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
def force(w):  # force de la frontière : ? ! . plus fortes que :
    return 2 if re.search(r'[.!?]( [?!:;.,])*$', w) else (1 if re.search(r':( [?!:;.,])*$', w) else 0)
for n, l in enumerate(lignes, 1):
    toks = tokens(l); mp3 = f'voix_el/v{n}.mp3'
    x = lire(mp3); fr = np.sqrt(np.convolve(x * x, np.ones(HOP) / HOP, 'same'))[::HOP]
    on = fr > fr.max() * 10 ** (-38 / 20); idx = np.where(on)[0]; a, b = idx[0], idx[-1] + 1
    sil = []; k = a
    while k < b:
        if not on[k]:
            j = k
            while j < b and not on[j]: j += 1
            if (j - k) * .01 >= .13: sil.append((k, j))
            k = j
        else: k += 1
    fortes = [i for i, w in enumerate(toks[:-1]) if force(w) > 0]
    sil.sort(key=lambda s: s[0] - s[1])  # les plus longues d'abord
    m = min(len(sil), len(fortes))
    # on garde les m frontières les plus fortes (à force égale : les premières)
    gardees = sorted(sorted(fortes, key=lambda i: (-force(toks[i]), i))[:m])
    choisies = sorted(sil[:m], key=lambda s: s[0])
    segs = []; deb = a; prev = 0
    for (s0, s1), f in zip(choisies, gardees):
        segs.append((deb * .01, s0 * .01, toks[prev:f + 1])); deb = s1; prev = f + 1
    segs.append((deb * .01, b * .01, toks[prev:]))
    out = []
    for d0, d1, ws in segs:
        tot = sum(poids(w) for w in ws); t = d0
        for w in ws:
            d = (d1 - d0) * poids(w) / tot; out.append({'t': round(t, 3), 'd': round(d, 3), 'm': w}); t += d
    json.dump(out, open(f'voix/v{n}.json', 'w', encoding='utf-8'), ensure_ascii=False)
    print(n, 'parole', round(a * .01, 2), '->', round(b * .01, 2), 'ancres', m, '/', len(fortes))
