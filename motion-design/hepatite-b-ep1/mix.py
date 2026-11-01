# bande-son : agbadja (libre de droits, composée en Python) + voix + bruitages
import numpy as np, wave, subprocess, imageio_ffmpeg, json, os
T = json.load(open('timing.json')); SC = T['durees']; DEB = np.cumsum([0] + SC[:-1]); TOT = sum(SC); NS = len(SC)
SR = 44100; N = int(TOT * SR); rng = np.random.default_rng(7); FF = imageio_ffmpeg.get_ffmpeg_exe()
def lire(mp3):
    raw = subprocess.run([FF, '-v', 'quiet', '-i', mp3, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
def pose(buf, x, t0, g=1.0):
    i = int(t0 * SR); j = min(len(buf), i + len(x))
    if 0 <= i < len(buf): buf[i:j] += g * x[:j - i]
def env(n, a=.002, dec=.1):
    tt = np.arange(n) / SR; return np.minimum(1, tt / a) * np.exp(-tt / dec)
def ton(f, dur, dec, parts=(1,), amps=(1,)):
    n = int(dur * SR); tt = np.arange(n) / SR
    return sum(a * np.sin(2 * np.pi * f * p * tt) for p, a in zip(parts, amps)) * env(n, .001, dec)
def bruit(dur, dec, lisse=0):
    n = int(dur * SR); x = rng.standard_normal(n)
    x = np.convolve(x, np.ones(lisse) / lisse, 'same') if lisse else np.diff(x, prepend=0)
    return x * env(n, .001, dec)
mus = np.zeros(N); CR = 60 / 112 / 3; MES = 12 * CR
CLOCHE = lambda f: ton(f, .5, .07, (1, 2.76, 5.4, 8.9), (1, .5, .25, .12))
ACC = [(261.6, 329.6, 392), (349.2, 440, 523.3), (392, 493.9, 587.3), (261.6, 329.6, 392)]
m = 0
while m * MES < TOT:
    t0 = m * MES; acc = ACC[m % 4]
    for k in range(12):
        tk = t0 + k * CR
        if k in (0, 2, 4, 5, 7, 9, 11): pose(mus, CLOCHE(820 if k == 0 else 1180), tk, .22)
        pose(mus, bruit(.06, .015), tk, .05 if k in (0, 3, 6, 9) else .025)
        if k in (2, 5, 8, 11): pose(mus, ton(430, .2, .05, (1, 1.5), (1, .3)), tk, .16)
        if k in (3, 4, 9, 10): pose(mus, ton(300, .25, .06, (1, 1.6), (1, .3)), tk, .14)
        if k in (0, 7) or (m % 4 == 3 and k in (9, 10, 11)): pose(mus, ton(150, .4, .12, (1, 2), (1, .2)), tk, .3)
        if k in (0, 6):
            n = int(.3 * SR); tt = np.arange(n) / SR
            pose(mus, np.sin(2 * np.pi * (50 * tt + 70 * (1 - np.exp(-tt * 30)) / 30)) * env(n, .001, .12), tk, .45)
        if k in (0, 3, 6, 9): pose(mus, ton(acc[(k // 3) % 3] * 2, .5, .18, (1, 2, 3), (1, .4, .2)), tk, .1)
    n = int(MES * SR); tt = np.arange(n) / SR
    pose(mus, sum(np.sin(2 * np.pi * f * tt) for f in acc) * np.minimum(1, tt / .3) * np.minimum(1, (MES - tt) / .3), t0, .025)
    m += 1
voix = np.zeros(N)
for k in range(NS):
    p = f'voix_el/v{k+1}.mp3'
    if os.path.exists(p):
        v = lire(p); v = v / (np.abs(v).max() + 1e-9) * .9; pose(voix, v, DEB[k] + .6)
L = int(.25 * SR); c = np.concatenate([np.zeros(L // 2), np.abs(voix), np.zeros(L - L // 2)]).cumsum()
e = (c[L:] - c[:-L])[:N] / L; e = np.clip(e / (e.max() + 1e-9) * 4, 0, 1); mus *= 1 - .8 * e
fx = np.zeros(N)
def whoosh(t):
    n = int(.6 * SR); x = np.convolve(rng.standard_normal(n), np.ones(30) / 30, 'same')
    pose(fx, x * np.sin(np.pi * np.arange(n) / n) ** 2, t - .45, .9)
def pop(t, f=900, g=.4):
    n = int(.12 * SR); tt = np.arange(n) / SR
    pose(fx, np.sin(2 * np.pi * (f * tt + 1500 * tt * tt)) * env(n, .001, .03), t, g)
def kaching(t):
    pose(fx, ton(2093, .8, .25, (1, 1.5, 2.01), (1, .5, .3)), t, .25); pose(fx, ton(2637, .8, .25, (1, 2.01), (1, .3)), t + .07, .22)
def carillon(t):
    for k, f in enumerate((1046.5, 1318.5, 1568, 2093)): pose(fx, ton(f, 1.6, .5, (1, 2.76), (1, .2)), t + k * .12, .2)
def sourd(t): pose(fx, ton(90, .5, .12, (1, 1.5), (1, .4)) + .3 * bruit(.5, .03, 20), t, .6)
for k in range(1, NS): whoosh(DEB[k])
for k in range(NS):
    for tm in T['marq'].get(str(k + 1), []): pop(DEB[k] + tm, 700 + 90 * (hash((k, tm)) % 5), .3)
kaching(DEB[0] + .5); kaching(DEB[6] + T['marq']['7'][0] if '7' in T['marq'] else DEB[6] + 2)
sourd(DEB[9] + .3)
carillon(DEB[NS - 1] + 2.4); pose(fx, ton(1568, 1.2, .35, (1, 2.4), (1, .3)), DEB[NS - 1] + 3.4, .3)
out = .6 * mus + 1.0 * voix + .8 * fx
sans = np.abs(voix) < 1e-4
fi, fo = int(.5 * SR), int(2.5 * SR); out[:fi] *= np.linspace(0, 1, fi); out[-fo:] *= np.linspace(1, 0, fo)
# scène 10 sans voix : musique remontée
i0, i1 = int(DEB[9] * SR), int((DEB[9] + SC[9]) * SR); out[i0:i1] += .35 * mus[i0:i1] / .6 * .6
out = np.tanh(out * 1.1); out = out / np.abs(out).max() * .92
st = (np.stack([out, out], 1) * 32767).astype(np.int16)
with wave.open('bande-son.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
print('bande-son', round(len(out) / SR, 2), 's', 'voix max', round(float(np.abs(voix).max()), 2))
