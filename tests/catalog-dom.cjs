const {JSDOM}=require(process.env.EXALCO_JSDOM_PATH || 'jsdom');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const catalog=Object.fromEntries(fs.readdirSync(path.join(root,'data')).filter(x=>x.endsWith('.json')&&fs.statSync(path.join(root,'data',x)).size).map(x=>[x.slice(0,-5),JSON.parse(read('data/'+x))]));
async function page(file,series,code,fail=false){
 const query=new URLSearchParams({series,...(code!==undefined?{code}:{})}).toString();
 const dom=new JSDOM(read('pages/'+file),{url:'https://exalcoaluminium.com/pages/'+file+'?'+query,runScripts:'outside-only'});
 await new Promise(resolve=>dom.window.document.addEventListener('DOMContentLoaded',resolve,{once:true}));
 dom.window.console.error=()=>{};
 dom.window.fetch=async u=>({ok:!fail&&!!catalog[series],json:async()=>catalog[series]});
 dom.window.eval(read('js/catalog-assets.js'));
 for(const el of dom.window.document.head.querySelectorAll('script:not([src])'))if(!el.type||el.type==='text/javascript')dom.window.eval(el.textContent);
 dom.window.eval(read('js/'+(file.startsWith('product-detail')?'detail-loader.js':'loader.js')));
 dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
 await new Promise(setImmediate);await new Promise(setImmediate);
 return dom;
}
(async()=>{
 let products=0,lists=0;
 for(const [series,entries] of Object.entries(catalog)){
  for(const sr of [false,true]){
   let dom=await page('products-list'+(sr?'-sr':'')+'.html',series);
   assert.equal(dom.window.document.querySelectorAll('#product-grid .profile-card').length,Object.keys(entries).length,series);
   assert.equal(dom.window.document.querySelectorAll('link[rel=canonical]').length,1);
   dom.window.close();lists++;
   for(const [code,p] of Object.entries(entries)){
    dom=await page('product-detail'+(sr?'-sr':'')+'.html',series,code);const d=dom.window.document;
    assert.equal(d.querySelectorAll('link[rel=canonical]').length,1,series+'/'+code);
    const canonical=new URL(d.querySelector('link[rel=canonical]').href);
    assert.equal(canonical.searchParams.get('series'),series);assert.equal(canonical.searchParams.get('code'),code);
    assert.equal(d.querySelectorAll('link[hreflang]').length,3);
    assert.ok(d.querySelector('h1.detail-title')?.textContent.trim());
    assert.ok(!d.querySelector('meta[name=robots]')?.content.includes('noindex'));
    for(const im of d.querySelectorAll('#detail-container img')){
     const u=new URL(im.src);assert.ok(fs.existsSync(path.join(root,decodeURIComponent(u.pathname))),series+'/'+code+' missing '+im.src);
    }
    const techExists=p.tech_image&&fs.existsSync(path.resolve(root,'pages',p.tech_image));
    assert.equal(!!d.querySelector('.drawing-unavailable'),!techExists,series+'/'+code+' drawing note');
    dom.window.close();products++;
   }
  }
 }
 for(const code of ['__proto__','constructor','not-a-product']){
  const dom=await page('product-detail.html','w60',code);const d=dom.window.document;
  assert.ok(d.querySelector('meta[name=robots]').content.includes('noindex'));assert.equal(d.querySelectorAll('link[rel=canonical]').length,0);dom.window.close();
 }
 for(const series of ['unknown','__proto__','../../']){
  const dom=await page('products-list.html',series);assert.ok(dom.window.document.querySelector('meta[name=robots]').content.includes('noindex'));dom.window.close();
 }
 const failed=await page('product-detail.html','w60','1039',true);assert.ok(failed.window.document.querySelector('meta[name=robots]').content.includes('noindex'));failed.window.close();
 const gallery=await page('product-detail.html','w55','1039');const d=gallery.window.document;
 assert.equal(d.querySelectorAll('.thumb-item').length,4,'extra images included');
 d.getElementById('next-pic').click();assert.ok(d.getElementById('main-product-img').alt.includes('technical drawing'));
 d.getElementById('next-pic').click();assert.ok(!d.getElementById('main-product-img').alt.includes('technical drawing'));
 gallery.window.close();
 console.log(JSON.stringify({productPages:products,seriesPages:lists,invalidAndFailureCases:7,galleryNavigation:'passed'}));
})().catch(e=>{console.error(e);process.exitCode=1;});
