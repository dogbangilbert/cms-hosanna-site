# usage : python rendu.py planche|film 45|916
import asyncio, sys, os, pathlib, shutil, glob
from playwright.async_api import async_playwright
FPS = 25
MODE, FMT = sys.argv[1], sys.argv[2]
VP = {'45': (360, 450), '916': (360, 640)}[FMT]
CSS = ".cmd,.note,.fmt{display:none!important}body{margin:0!important}.wrap{padding:0!important;max-width:none!important}.stage{width:100vw!important;max-width:none!important;border-radius:0!important}"
JS = """([i,t,d])=>{const sc=document.querySelectorAll('.scene')[i];
sc.getAnimations({subtree:true}).forEach(a=>{try{a.pause();a.currentTime=t*1000}catch(e){}});
const pv=document.querySelector('.scene.prev');if(pv)pv.getAnimations({subtree:true}).forEach(a=>{try{a.pause();a.currentTime=1e7}catch(e){}});
window.majSous&&window.majSous(i,t);const tk=(window.TICKS||[])[i];tk&&tk(t);}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=glob.glob('/opt/pw-browsers/chromium-*/chrome-linux*/chrome')[0], args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': VP[0], 'height': VP[1]}, device_scale_factor=3)
        await pg.goto(pathlib.Path('page-complete.html').resolve().as_uri())
        await pg.add_style_tag(content=CSS)
        await pg.evaluate(f"document.getElementById('stage').className='stage f{FMT}'")
        await pg.evaluate('document.fonts.ready.then(()=>1)')
        await pg.wait_for_timeout(800)
        await pg.evaluate("window.RENDU=true")
        durs = await pg.evaluate("[...document.querySelectorAll('.scene')].map(s=>+s.dataset.t)")
        couv = await pg.evaluate("+(document.querySelector('.scene').dataset.couv||0)")
        out = f'fr{FMT}' if MODE == 'film' else f'planche{FMT}'
        shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
        n = 0
        for i, d in enumerate(durs):
            await pg.evaluate(f"va({i})")
            await pg.wait_for_timeout(300)
            temps = [k / FPS for k in range(int(d * FPS))] if MODE == 'film' else [x for x in (2.5, 6.5, 11) if x < d]
            for k, t in enumerate(temps):
                une = MODE == 'film' and i == 0 and k < 3
                await pg.evaluate(JS, [i, couv if une else t, d])
                if une: await pg.evaluate("document.getElementById('st').classList.remove('vu')")
                nom = f'{out}/{n:05d}.jpg' if MODE == 'film' else f'{out}/s{i+1}_{t:04.1f}.jpg'
                await pg.screenshot(path=nom, type='jpeg', quality=93); n += 1
                if MODE == 'film' and n == 1: shutil.copy(nom, f'couverture{FMT}.jpg')
        await b.close()
        print('fini', n)
asyncio.run(main())
