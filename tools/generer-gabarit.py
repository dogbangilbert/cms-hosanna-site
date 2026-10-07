"""Fabrique netlify/redaction/gabarit.ts à partir d'un article existant du blog,
pour que les articles de Rédaction HOSANNA aient exactement la présentation du site.
À relancer si l'en-tête, le pied de page ou les styles du site changent :
    python3 tools/generer-gabarit.py
"""
import json, re
src = open('blog/signes-diabete.html', encoding='utf-8').read()
css = re.search(r'<style>(.*?)</style>', src, re.S).group(1)
header = src[src.index('<header>'):src.index('</header>') + 9]
footer = src[src.index('<footer>'):src.index('</footer>') + 9]
apres = src[src.index('</footer>') + 9:src.index('</body>')]
def absolu(s):
    s = s.replace('href="../', 'href="/').replace('src="../', 'src="/')
    return s
header, footer, apres = absolu(header), absolu(footer), absolu(apres)
header = header.replace(' class="active"', '').replace('href="/blog.html"', 'href="/blog.html" class="active"')
out = '// Fichier généré par tools/generer-gabarit.py — ne pas modifier à la main\n'
for nom, val in [('CSS', css), ('ENTETE', header), ('PIED', footer), ('SCRIPTS', apres)]:
    out += f'export const {nom} = {json.dumps(val, ensure_ascii=False)};\n'
open('netlify/redaction/gabarit.ts', 'w', encoding='utf-8').write(out)
print('gabarit.ts :', len(out), 'caractères')
