# Génère nb1/nb2/nb3 source.html à partir du gabarit CSS/JS de l'épisode 3
src = open('gabarit-ep3/source.html', encoding='utf-8').read()
HEAD = src[:src.index('<div class="wrap">')]
TAIL = src[src.index('<div class="fmt">'):]
HEAD = HEAD.replace('Minute santé Dépistage à deux', 'Minute santé Novembre bleu')
HEAD = HEAD.replace('--bleu:#003399;--nuit:#002266;--clair:#4A90D9;--pale:#EAF3FC;--fond:#F5F8FC;--accent:#F9A825', '--bleu:#0B46D6;--nuit:#06206E;--clair:#29A8FF;--pale:#E4F2FF;--fond:#F1F8FF;--accent:#FF8A1F')
HEAD = HEAD.replace('linear-gradient(160deg,#003399 0%,#1B55B8 100%)', 'linear-gradient(160deg,#0B46D6 0%,#18A6FF 100%)')
HEAD = HEAD.replace('rgba(0,51,153,.13)', 'rgba(11,70,214,.12)')
HEAD = HEAD.replace('.s-nuit{--bg:var(--nuit)', '.s-nuit{--bg:linear-gradient(170deg,#06206E 0%,#0B46D6 130%)')
HEAD = HEAD.replace('</style>', '''
/* ---- Novembre bleu ---- */
.rang-t{position:relative;display:flex;align-items:center;gap:3cqw;background:#fff;color:var(--encre);border:.9cqw solid var(--encre);border-radius:4cqw;box-shadow:1.4cqw 1.4cqw 0 var(--encre);padding:2.4cqw 5cqw;font-weight:900;font-size:10cqw;line-height:1}
.rang-t i{font-style:normal;font-family:Bangers,Impact,sans-serif;font-size:13cqw;color:var(--vert)}
.rang-t.psa i{color:var(--rouge)}
.rang-t.psa{background:var(--accent)}
.scene.on .rang-t.psa i{animation:flotte 1.4s ease-in-out infinite}
.titre-nb{font-family:Bangers,Impact,sans-serif;font-size:17cqw;line-height:1;margin:0;color:#fff;letter-spacing:.03em;text-shadow:.9cqw .9cqw 0 var(--encre)}
.fiction{position:absolute!important;z-index:6;left:5cqw;top:12cqw;font-size:2.9cqw;font-weight:800;background:rgba(255,255,255,.92);color:var(--encre);border:.5cqw solid var(--encre);border-radius:3cqw;padding:.6cqw 2.4cqw}
.f45 .fiction{top:12.5cqw}
.chrono{position:relative;width:34cqw;height:34cqw;border-radius:50%;border:1.1cqw solid var(--encre);background:#fff;color:var(--encre);box-shadow:1.4cqw 1.4cqw 0 var(--encre);display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none}
.f45 .chrono{width:30cqw;height:30cqw}
.chrono b{font-family:Bangers,Impact,sans-serif;font-size:16cqw;line-height:.9;color:var(--bleu)}
.chrono span{font-weight:900;font-size:3.6cqw}
.chrono .aig{position:absolute;left:50%;top:5%;width:.9cqw;height:45%;margin-left:-.45cqw;background:var(--rouge);border-radius:1cqw;transform-origin:50% 100%}
.scene.on .chrono .aig{animation:tourne 2s linear infinite}
@keyframes tourne{to{transform:rotate(360deg)}}
.hommes{display:flex;gap:2.6cqw;justify-content:center;width:100%}
.h{position:relative;width:19cqw;height:22cqw;border:.9cqw solid var(--encre);border-radius:3.4cqw;background:#fff;box-shadow:1.1cqw 1.1cqw 0 var(--encre);display:grid;place-items:center;font-size:12cqw}
.h.tard{background:#FDE7E7;border-color:var(--rouge)}
.h.tard::after{content:"III/IV";position:absolute;bottom:-2.6cqw;left:50%;transform:translateX(-50%);background:var(--rouge);color:#fff;font-weight:900;font-size:3.1cqw;padding:.4cqw 1.6cqw;border-radius:2cqw;border:.5cqw solid var(--encre);white-space:nowrap}
.h.tot{background:#E3F2E4;border-color:var(--vert)}
.h.tot::after{content:"stade I/II";position:absolute;bottom:-2.6cqw;left:50%;transform:translateX(-50%);background:var(--vert);color:#fff;font-weight:900;font-size:3.1cqw;padding:.4cqw 1.6cqw;border-radius:2cqw;border:.5cqw solid var(--encre);white-space:nowrap}
.srcc{margin:0;font-size:2.9cqw;font-weight:700;opacity:.8;text-align:center}
.qcard{width:100%;background:#fff;color:var(--encre);border:.9cqw solid var(--encre);border-radius:4.5cqw;box-shadow:1.6cqw 1.6cqw 0 var(--encre);padding:3cqw 4.5cqw;text-align:left}
.qcard .num{display:inline-block;font-family:Bangers,Impact,sans-serif;font-size:7cqw;background:var(--bleu);color:#fff;border-radius:2cqw;padding:0 2.4cqw;margin-bottom:1.4cqw}
.qcard p{margin:0;font-weight:900;font-size:6.4cqw;line-height:1.12}
.qcard .rep{display:flex;gap:3cqw;margin-top:2.6cqw}
.qcard .rep span{font-weight:900;font-size:5cqw;padding:1cqw 5cqw;border-radius:3cqw;border:.7cqw solid var(--encre)}
.qcard .rep .o{background:#E3F2E4}.qcard .rep .n{background:#FDE7E7}
.grand-oui{font-family:Bangers,Impact,sans-serif;font-size:12.5cqw;white-space:nowrap;line-height:1;margin:0;color:var(--accent);text-shadow:.8cqw .8cqw 0 var(--encre)}
.scene.on .grand-oui{animation:slam2 .5s var(--d) cubic-bezier(.2,1.4,.4,1) both}
.f45 .s-final{gap:1.4cqw}.f45 .s-final .cadre-logo{width:24cqw;height:24cqw}.f45 .s-final .cadre-logo img{inset:1.6cqw;width:20.8cqw;height:20.8cqw}.lignes{z-index:3}
@property --p{syntax:'<number>';inherits:false;initial-value:0}
.donut{position:relative;width:44cqw;aspect-ratio:1;border-radius:50%;background:conic-gradient(var(--rouge) calc(var(--p)*1%),#cfe2ff 0);display:grid;place-items:center;border:.9cqw solid var(--encre);box-shadow:1.4cqw 1.4cqw 0 var(--encre);flex:none}
.f45 .donut{width:36cqw}
.donut::after{content:"";position:absolute;inset:5.2cqw;border-radius:50%;background:#fff;border:.7cqw solid var(--encre)}
.donut div{position:relative;z-index:2;text-align:center;color:var(--encre);line-height:1}
.donut b{display:block;font-family:Bangers,Impact,sans-serif;font-size:11.5cqw;color:var(--rouge)}
.donut small{display:block;font-weight:900;font-size:2.8cqw;margin-top:.6cqw}
.scene.on .donut{animation:donut 1.6s var(--d,0s) cubic-bezier(.3,.8,.3,1) forwards}
@keyframes donut{from{--p:0}to{--p:76}}
.anat-w{position:relative;width:90cqw;height:50cqw;flex:none}
.f45 .anat-w{height:42cqw}
.anat{position:absolute;left:4cqw;top:0;height:100%;width:auto;filter:drop-shadow(1.2cqw 1.2cqw 0 rgba(7,16,51,.9))}
.anat-w .tg{position:absolute;left:54cqw;font-weight:900;font-size:4.4cqw;background:#fff;color:var(--encre);border:.7cqw solid var(--encre);border-radius:2.6cqw;padding:.8cqw 2.6cqw;box-shadow:.9cqw .9cqw 0 var(--encre);white-space:nowrap}
.anat-w .tg.p{background:var(--accent)}
.prost{transform-box:fill-box;transform-origin:center}
.scene.on .prost{animation:grossit 3.2s var(--d,0s) ease-in-out both}
@keyframes grossit{from{transform:scale(1)}to{transform:scale(1.5)}}
.canal{transform-box:fill-box;transform-origin:center}
.scene.on .canal{animation:serre 3.2s var(--d,0s) ease-in-out both}
@keyframes serre{from{transform:scaleX(1)}to{transform:scaleX(.3)}}
.av{color:var(--encre)}
.s-photo{--bg:#06206E}
.s-photo .fond{height:64%!important;bottom:auto!important}
.f916 .s-photo .fond{height:54%!important}
.s-photo .voile{background:linear-gradient(180deg,rgba(6,32,110,.25) 0%,rgba(6,32,110,0) 22%,rgba(6,32,110,0) 46%,rgba(6,32,110,.9) 62%,#06206E 66%)}
.f916 .s-photo .voile{background:linear-gradient(180deg,rgba(6,32,110,.25) 0%,rgba(6,32,110,0) 22%,rgba(6,32,110,0) 40%,rgba(6,32,110,.9) 52%,#06206E 56%)}
.s-photo .qcard{margin-bottom:0}
.s-photo .lignes .lg{background:rgba(255,255,255,.96)}
.tampon.bleu{color:var(--bleu)}
.scene.on .barre i.ok{background:var(--vert)}.barre i.ko{background:var(--rouge)}
</style>''')

LOGO = '<img class="logo" src="__LOGO__" alt="CMS HOSANNA">'
BADGE = '<span class="badge">💙 NOVEMBRE BLEU</span>'
def scene(n, cls, tr, inner, extra='', fiction=False):
    f = '<span class="fiction">Histoire inventée pour illustrer</span>' if fiction else ''
    return (f'<section class="scene {cls} {tr}" data-t="__T{n}__" {extra} data-w="__W{n}__" data-sub="__S{n}__">'
            f'{BADGE}{LOGO}{f}{inner}</section>\n')
def lg(emo, txt, d): return f'<div class="lg pop" style="--d:{d}s"><span class="em">{emo}</span>{txt}</div>'
def bulle(side, av, txt, d, w=''):
    k = 'q' if side == 'q' else 'r'
    st = ' style="font-size:3cqw;font-weight:900;letter-spacing:-.02em"' if av.isalpha() else ''
    return f'<div class="msg {k} a" style="--d:{d}s{w}"><span class="av"{st}>{av}</span><div class="bulle">{txt}</div></div>'
def offre(n, m_date, m_cons, m_psa, m_echo, m_wa, intro='', etiq2='💙 Novembre bleu', m_e2=None):
    return scene(n, 's-clair', 'tr-a', f'''
  {intro}
  <div class="offre">
   <div class="polaroid pop" style="--d:{m_date}s"><img src="__IMG_batiment__" alt="Le Centre médico-social HOSANNA"></div>
   <div class="cote">
    <div class="etiq pop" style="--d:{m_date}s">Du 16 au 30 novembre</div>
    <div class="etiq b pop" style="--d:{m_e2 or m_cons}s">{etiq2}</div>
   </div>
  </div>
  <div class="svc">
   <div class="pop" style="--d:{m_cons}s"><span class="em">🩺</span>Consultation</div>
   <div class="pop" style="--d:{m_psa}s"><span class="em">🩸</span>PSA</div>
   <div class="pop" style="--d:{m_echo}s"><span class="em">📡</span>Échographie</div>
  </div>
  <div class="msg q a" style="--d:{m_wa}s;width:100%"><span class="av">💬</span><div class="bulle" style="font-size:4.1cqw;white-space:nowrap">Écrivez-nous sur <b>WhatsApp</b> · 90 03 83 13</div></div>''')
MENTION = "Information générale. Ne remplace pas une consultation. En cas de symptômes, consultez un professionnel de santé."
def final(n, lignes, m_btn, m_msg, m_end, fiction_note=False, msg='ça peut sauver un papa'):
    note = ' Histoire inventée pour illustrer ; images générées par IA.' if fiction_note else ' Images illustratives générées par IA.'
    return f'''<section class="scene s-bleu s-final tr-a" data-t="__T{n}__" data-w="__W{n}__" data-sub="__S{n}__">
  <img class="fond-bat" src="__IMG_batiment__" alt="Le Centre médico-social HOSANNA">
  {BADGE}
  {lignes}
  <div class="cadre-logo">
   <img class="fondu" style="--d:2.4s" id="logoFinal" src="__LOGO__" alt="CMS HOSANNA">
   <svg class="trace" viewBox="0 0 100 100" preserveAspectRatio="none"><rect x="1" y="1" width="98" height="98" rx="12"/></svg>
  </div>
  <div class="boutons a" style="--d:{m_btn}s"><span class="btn btn-r clic" style="--c:calc({m_btn}s + .9s)">🔔 Abonne-toi</span><span class="btn btn-b">↗ Partage</span><span class="doigt" style="--dd:{m_btn}s">👆🏾</span></div>
  <p class="sous a" style="--d:{m_msg}s;font-size:4.4cqw">💙 Partage : {msg}</p>
  <p class="adresse a" style="--d:{m_end}s">CMS HOSANNA · Lomé Attiégou</p>
  <p class="mention fondu" style="--d:{m_end}s">{MENTION}{note}</p>
  <canvas class="poussiere" id="poussiere"></canvas>
 </section>
'''
def page(scenes): return HEAD + '<div class="wrap">\n<div class="stage f45" id="stage">\n' + ''.join(scenes) + ' <div class="st" id="st"></div>\n</div>\n' + TAIL


IA = 'Image illustrative · IA'
def pscene(n, tr, img, pos, inner, extra='', tag=IA):
    f = f'<span class="fiction">{tag}</span>' if tag else ''
    return (f'<section class="scene s-photo {tr}" data-t="__T{n}__" {extra} data-w="__W{n}__" data-sub="__S{n}__">'
            f'<img class="fond" src="__IMG_{img}__" alt="" style="object-position:{pos}"><div class="voile"></div>'
            f'{BADGE}{LOGO}{f}{inner}</section>\n')
def anat(grossit_d=None, tags=None):
    d = f'--d:{grossit_d}s' if grossit_d else '--d:99s'
    t = tags or []
    tg = ''.join(f'<span class="tg {c} pop" style="top:{y}%;--d:{dl}s">{txt}</span>' for txt, y, c, dl in t)
    return f"""<div class="anat-w" style="{d}"><svg class="anat" viewBox="0 0 240 236">
 <defs><linearGradient id="gv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B5E0FF"/><stop offset="1" stop-color="#4FA8F5"/></linearGradient>
 <radialGradient id="gp" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#FFC27A"/><stop offset="1" stop-color="#F26D00"/></radialGradient></defs>
 <path d="M72 4 C72 38 86 52 100 60" fill="none" stroke="#071033" stroke-width="14" stroke-linecap="round"/><path d="M72 4 C72 38 86 52 100 60" fill="none" stroke="#FFC9B8" stroke-width="7" stroke-linecap="round"/>
 <path d="M168 4 C168 38 154 52 140 60" fill="none" stroke="#071033" stroke-width="14" stroke-linecap="round"/><path d="M168 4 C168 38 154 52 140 60" fill="none" stroke="#FFC9B8" stroke-width="7" stroke-linecap="round"/>
 <path d="M66 82 C64 46 176 46 174 82 C176 122 150 134 120 134 C90 134 64 122 66 82Z" fill="url(#gv)" stroke="#071033" stroke-width="4.5"/>
 <path d="M120 126 L120 222" stroke="#071033" stroke-width="30" stroke-linecap="round" fill="none"/><path d="M120 126 L120 222" stroke="#FFE3BF" stroke-width="21" stroke-linecap="round" fill="none"/>
 <ellipse class="prost" cx="120" cy="156" rx="48" ry="31" fill="url(#gp)" stroke="#071033" stroke-width="4.5"/>
 <ellipse cx="102" cy="144" rx="15" ry="7" fill="#fff" opacity=".4"/>
 <rect class="canal" x="113" y="128" width="14" height="92" rx="7" fill="#fff" opacity=".92"/>
</svg>{tg}</div>"""
def donut(d, legend='stades III–IV'):
    return f'<div class="donut" style="--d:{d}s"><div><b>3/4</b><small>{legend}</small></div></div>'

# ---------- FILM 1 : LE TESTAMENT ----------
s1 = [
 pscene(1, 'tr-a', 'homme45', '50% 20%', """
  <p class="titre-nb a" style="--d:.3s">Messieurs…</p>
  <div class="rang-t pop" style="--d:{{1:testament}}s">📜 Testament <i>✓</i></div>
  <div class="rang-t psa pop" style="--d:{{1:PSA}}s">🩸 PSA <i>?</i></div>""", 'data-couv="{{1:PSA}}"'),
 scene(2, 's-clair', 'tr-b', bulle('r', '💡', 'Le <b>PSA</b> ?', .2) +
   '<div class="lg pop" style="--d:{{2:prise}}s"><span class="em">🩸</span>Une simple prise de sang</div>' +
   anat(None, [('Vessie', 14, '', '{{2:surveille}}'), ('Prostate', 52, 'p', '{{2:prostate}}'), ('Urètre', 82, '', '{{2:glande}}')]) +
   '<p class="srcc a" style="--d:{{2:hommes}}s;font-weight:900;font-size:4.2cqw">Tous les hommes en ont une</p>'),
 scene(3, 's-nuit', 'tr-c', bulle('q', '❓', 'Ce cancer, c’est <b>fréquent</b> ?', .2) +
   '<div class="chrono pop" style="--d:{{3:vingt}}s"><i class="aig"></i><b>20</b><span>secondes</span></div>' +
   lg('🌍', '1 homme diagnostiqué toutes les 20 s', '{{3:diagnostic}}') + lg('🥇', 'Afrique de l’Ouest : 1er cancer mortel de l’homme', '{{3:Afrique}}') +
   '<p class="srcc fondu" style="--d:{{3:Afrique}}s">Sources : GLOBOCAN 2022 (IARC/OMS)</p>'),
 scene(4, 's-clair', 'tr-a', """
  <p class="legende a" style="--d:.2s">Stade au diagnostic · Afrique subsaharienne</p>""" + donut('{{4:trois}}') + """
  <div class="verdict"><span class="tampon faux" style="--d:[[4:tard#2]]s;font-size:12cqw">TROP TARD</span></div>
  <p class="srcc fondu" style="--d:{{4:registres}}s">Source : registres d’Afrique subsaharienne, 2021</p>"""),
 scene(5, 's-bleu', 'tr-b', bulle('q', '❓', 'Découvert <b>tôt</b>…', .2) + """
  <div class="graphe">
   <div class="l"><span>Cancer localisé</span><b>99 %+</b></div>
   <div class="barre"><i class="ok" style="--w:99%;--d:{{5:quatre-vingt-dix-neuf}}s"></i></div>
   <div class="l"><span>Déjà propagé</span><b>37 %</b></div>
   <div class="barre"><i class="ko" style="--w:37%;--d:{{5:trente-sept}}s"></i></div>
   <p class="src">En vie 5 ans après · États-Unis (ACS)</p>
  </div>"""),
 scene(6, 's-clair', 'tr-c', '<div class="photo-c pop" style="--d:.2s"><img src="__IMG_prise_sang__" alt="Prise de sang au centre" style="object-position:68% 35%"><span class="leg">Image illustrative · IA</span></div><div class="lignes">' +
   lg('🌍', 'Hommes d’origine africaine : risque ×2', '{{6:deux}}') + lg('🎂', 'Dès 45 ans : parlez-en à un soignant', '{{6:quarante-cinq}}') +
   lg('🧬', 'Dès 40 ans si père ou frère touché', '{{6:père}}') + '</div>' +
   '<p class="srcc fondu" style="--d:{{6:père}}s">Sources : Commission Lancet 2024 · Prostate Cancer Foundation 2024</p>'),
 offre(7, '{{7:seize}}', '{{7:consultation}}', '{{7:PSA}}', '{{7:échographie}}', '{{7:WhatsApp}}'),
 final(8, """<p class="sous a" style="--d:{{8:prévoyant}}s;font-size:5.4cqw">📜 Prévoyant : le testament</p>
  <p class="sous a" style="--d:{{8:responsable}}s;font-size:5.4cqw">🩺 Responsable : <span class="pastille" style="font-size:4.6cqw;white-space:nowrap">aussi le bilan</span></p>""", '{{8:Partage}}', '{{8:homme}}', '{{8:aimes}}'),
]
open('film1/source.html', 'w', encoding='utf-8').write(page(s1))

# ---------- FILM 2 : PAPA, FAIS-LE POUR NOUS ----------
TAG2 = 'Histoire inventée · images IA'
s2 = [
 pscene(1, 'tr-a', 'pere_fille', '47% 30%', """
  <p class="gros-titre a" style="--d:{{1:Papa}}s">Papa,</p>
  <p class="sous-titre a" style="--d:{{1:fort}}s">tu es fort.</p>
  <p class="sous-titre a" style="--d:{{1:seul}}s;font-size:6cqw">Une chose que tu ne peux pas <span class="pastille">porter seul</span></p>""", 'data-couv="{{1:seul}}"', TAG2),
 scene(2, 's-clair', 'tr-b', """
  <p class="sous-titre a" style="--d:{{2:quarante-cinq}}s;color:var(--encre);text-shadow:none;font-size:6.4cqw">Après <span class="pastille">45 ans</span>, elle grossit en silence</p>""" +
   anat('{{2:silence}}', [('Vessie', 14, '', '.3'), ('Prostate', 52, 'p', '{{2:prostate}}'), ('Urètre', 82, '', '{{2:fièvre}}')]) +
   '<div class="lignes">' + lg('🌙', 'Se lever la nuit', '{{2:nuit}}') + lg('💧', 'Un jet plus faible', '{{2:jet}}') + '</div>'),
 scene(3, 's-nuit', 'tr-c', """
  <p class="legende a" style="--d:.2s;color:#fff">Afrique de l’Ouest</p>
  <div class="lg pop" style="--d:{{3:emporte}}s"><span class="em">🥇</span>1er cancer mortel de l’homme</div>""" + donut('{{3:trois}}') + """
  <div class="verdict"><span class="tampon faux" style="--d:[[3:tard]]s;font-size:12cqw">TROP TARD</span></div>
  <p class="srcc fondu" style="--d:{{3:emporte}}s">Sources : GLOBOCAN 2022 · registres d’Afrique subsaharienne</p>"""),
 scene(4, 's-clair', 'tr-b', '<div class="dial">' +
   bulle('q', 'PAPA', 'Moi, je ne suis jamais <b>malade</b>, ma fille. L’hôpital, ce n’est pas pour moi.', '{{4:Moi}}') +
   bulle('r', 'MOI', 'Papa… <b>cinq minutes</b>, une prise de sang. Fais-le <b>pour nous</b>.', '{{4:Papa}}') + '</div>', '', True),
 pscene(5, 'tr-a', 'famille', '50% 40%', """
  <div class="lignes">""" + lg('💍', 'Être là pour mon mariage', '{{5:mariage}}') + lg('🏡', 'Porter tes petits-enfants', '{{5:petits-enfants}}') + lg('🎉', 'Rire encore ensemble', '{{5:rie}}') + '</div>', '', TAG2),
 pscene(6, 'tr-c', 'pere_fille', '47% 25%', """
  <span class="tfaux tvrai pop" style="--d:{{6:D'accord}}s">D’ACCORD</span>
  <div class="msg r a" style="--d:{{6:Merci}}s;width:100%"><span class="av" style="font-size:3cqw;font-weight:900">MOI</span><div class="bulle">Merci, <b>papa</b> 💙</div></div>""", '', TAG2),
 offre(7, '{{7:seize}}', '{{7:Consultation}}', '{{7:PSA}}', '{{7:échographie}}', '{{7:WhatsApp}}', '', '🤝 Papas · maris · frères', '{{7:papas}}'),
 final(8, """<p class="sous a" style="--d:{{8:Partage}}s;font-size:4.2cqw;white-space:nowrap">Partage à un homme que tu aimes</p>
  <p class="sous a" style="--d:{{8:preuve}}s;font-size:4.2cqw;white-space:nowrap">💙 La plus belle <span class="pastille" style="font-size:4.2cqw;white-space:nowrap">preuve d’amour</span></p>""", '{{8:C\'était}}', '{{8:C\'était}}', '{{8:Minute}}', True),
]
open('film2/source.html', 'w', encoding='utf-8').write(page(s2))

# ---------- FILM 3 : LE TEST ----------
def q(num, txt, d, rep=True):
    r = '<div class="rep"><span class="o">OUI</span><span class="n">NON</span></div>' if rep else ''
    return f'<div class="qcard pop" style="--d:{d}s"><span class="num">{num}</span><p>{txt}</p>{r}</div>'
s3 = [
 pscene(1, 'tr-a', 'homme45', '50% 15%', '<p class="titre-nb a" style="--d:{{1:Petit}}s;font-size:10.5cqw">TEST · 5 secondes</p>' + q('1', '📅 Plus de <b style="color:var(--bleu)">45 ans</b> ?', '{{1:Question}}'), 'data-couv="{{1:Question}}"'),
 pscene(2, 'tr-b', 'nuit', '42% 30%', q('2', '🌙 Vous vous levez la nuit pour uriner ?<br>💧 Ou jet plus faible ?', '{{2:Question}}')),
 pscene(3, 'tr-c', 'prise_sang', '68% 35%', q('3', '🩸 Déjà fait un <b style="color:var(--bleu)">PSA</b> ?', '{{3:Question}}')),
 scene(4, 's-bleu', 'tr-a', """
  <p class="grand-oui" style="--d:{{4:oui}}s">OUI · OUI · JAMAIS</p>
  <div class="verdict" style="margin-top:2cqw"><span class="tampon vrai" style="--d:[[4:vous]]s;font-size:11cqw">POUR VOUS</span></div>
  """ + lg('🤫', 'Souvent : aucun symptôme', '{{4:aucun}}')),
 scene(5, 's-clair', 'tr-b', '<div class="dial">' +
   bulle('q', '❓', 'Vrai ou faux ? <b>1er cancer mortel</b> de l’homme en Afrique de l’Ouest', .2) +
   '<div class="verdict"><span class="tampon vrai" style="--d:[[5:vrai#2]]s">VRAI</span><div class="bulle">Source : GLOBOCAN 2022 (IARC / OMS)</div></div></div>'),
 scene(6, 's-bleu', 'tr-c', bulle('q', '❓', 'Vrai ou faux ? Découvert <b>tôt</b>, on s’en sort bien', .2) + """
  <div class="graphe">
   <div class="l"><span>Cancer localisé</span><b>99 %+</b></div>
   <div class="barre"><i class="ok" style="--w:99%;--d:{{6:quatre-vingt-dix-neuf}}s"></i></div>
   <div class="l"><span>Déjà propagé</span><b>37 %</b></div>
   <div class="barre"><i class="ko" style="--w:37%;--d:{{6:trente-sept}}s"></i></div>
   <p class="src">En vie 5 ans après · États-Unis (ACS)</p>
  </div>
  <div class="verdict"><span class="tampon vrai" style="--d:[[6:vrai#2]]s;font-size:11cqw">VRAI</span></div>"""),
 offre(7, '{{7:seize}}', '{{7:consultation}}', '{{7:PSA}}', '{{7:échographie}}', '{{7:WhatsApp}}'),
 final(8, """<p class="sous a" style="--d:{{8:Partage}}s;font-size:3.7cqw;white-space:nowrap">Partage ce test à un homme que tu aimes</p>""", '{{8:Partage}}', '{{8:homme}}', '{{8:aimes}}', False, 'ça peut sauver une vie'),
]
open('film3/source.html', 'w', encoding='utf-8').write(page(s3))
print('ok')
