# usage : python rendu.py planche | python rendu.py film
import asyncio, sys, os, pathlib, shutil
from playwright.async_api import async_playwright
FPS = 25
CSS = ".cmd,.note{display:none!important}body{margin:0!important}.wrap{padding:0!important;max-width:none!important}.stage{width:100vw!important;border-radius:0!important}"
JS = """([i,t,d])=>{const sc=document.querySelectorAll('.scene')[i];
sc.getAnimations({subtree:true}).forEach(a=>{try{a.pause();a.currentTime=t*1000}catch(e){}});
const pv=document.querySelector('.scene.prev');if(pv)pv.getAnimations({subtree:true}).forEach(a=>{try{a.pause();a.currentTime=1e7}catch(e){}});
window.majSous&&window.majSous(i,t);const tk=(window.TICKS||[])[i];tk&&tk(t);
document.querySelectorAll('#barre span i').forEach((f,j)=>{f.style.width=j<i?'100%':j==i?(t/d*100)+'%':'0'});}"""
async def main(mode):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=__import__('glob').glob('/opt/pw-browsers/chromium-*/chrome-linux*/chrome')[0], args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 360, 'height': 640}, device_scale_factor=3)
        await pg.goto(pathlib.Path('page-complete.html').resolve().as_uri())
        await pg.add_style_tag(content=CSS)
        await pg.evaluate('document.fonts.ready.then(()=>1)')
        await pg.wait_for_timeout(800)
        await pg.evaluate("window.RENDU=true")
        durs = await pg.evaluate("[...document.querySelectorAll('.scene')].map(s=>+s.dataset.t)")
        couv = await pg.evaluate("+(document.querySelector('.scene').dataset.couv||0)")
        os.makedirs('fr' if mode == 'film' else 'planche', exist_ok=True)
        n = 0
        for i, d in enumerate(durs):
            await pg.evaluate(f"va({i})")
            await pg.wait_for_timeout(300)
            temps = [k / FPS for k in range(int(d * FPS))] if mode == 'film' else [x for x in (7,) if x < d]
            for k, t in enumerate(temps):
                # 3 premières images = accroche complète sans sous-titre : Facebook en fait la miniature
                une = mode == 'film' and i == 0 and k < 3
                await pg.evaluate(JS, [i, couv if une else t, d])
                if une: await pg.evaluate("document.getElementById('st').classList.remove('vu')")
                nom = f'fr/{n:05d}.jpg' if mode == 'film' else f'planche/s{i+1}_{t:05.1f}.jpg'
                await pg.screenshot(path=nom, type='jpeg', quality=93); n += 1
                if mode == 'film' and n == 1: shutil.copy(nom, 'couverture.jpg')
        await b.close()
        print('fini', n)
asyncio.run(main(sys.argv[1]))
