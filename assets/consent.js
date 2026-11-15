(function(){
  var KEY='cms_hosanna_info_v1';
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}
  var css = '#cms-bandeau{position:fixed;left:12px;right:12px;bottom:84px;z-index:9999;max-width:900px;margin:0 auto;background:#fff;color:#3A4250;border:1px solid #d6dfec;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.15);padding:16px 18px;font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}'
    + '#cms-bandeau p{margin:0;flex:1 1 360px}#cms-bandeau a{color:#003399;text-decoration:underline}'
    + '#cms-bandeau button{background:#003399;color:#fff;border:0;border-radius:10px;padding:10px 18px;font-weight:600;cursor:pointer;min-height:44px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var box = document.createElement('div');
  box.id = 'cms-bandeau'; box.setAttribute('role','region'); box.setAttribute('aria-label','Information sur les cookies');
  box.innerHTML = '<p>Ce site n\'utilise ni cookie publicitaire ni cookie de suivi. Les statistiques de visite sont anonymes. Pour en savoir plus, lisez notre <a href="/confidentialite">politique de confidentialité</a>.</p><button type="button">J\'ai compris</button>';
  box.querySelector('button').addEventListener('click', function(){
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    box.remove();
  });
  document.body.appendChild(box);
})();
