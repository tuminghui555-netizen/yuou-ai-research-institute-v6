'use strict';
const manualImages=[...document.querySelectorAll('.manual-document img')];
// 章节直达要等图片占位稳定，避免后加载的长图把目标推到屏幕外。
for(const image of manualImages)image.loading='eager';
addEventListener('load',()=>{const id=location.hash.slice(1);if(id)document.getElementById(id)?.scrollIntoView({block:'start'})});
if(manualImages.length){
 const dialog=document.createElement('dialog');dialog.className='manual-lightbox';
 dialog.innerHTML='<header><span>图片详情</span><button type="button">关闭</button></header><div class="manual-image-view"><img alt=""></div>';
 document.body.append(dialog);
 const large=dialog.querySelector('img'),label=dialog.querySelector('header span');
 function open(image){large.src=image.src;large.alt=image.alt;label.textContent=image.alt||'图片详情';dialog.showModal();}
 dialog.querySelector('button').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 for(const image of manualImages){
  image.tabIndex=0;image.setAttribute('role','button');image.setAttribute('aria-label','放大查看：'+(image.alt||'手册图片'));
  image.addEventListener('click',()=>open(image));
  image.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open(image)}});
 }
}
const chapters=[...document.querySelectorAll('.reader-nav a')];
function markChapter(){
 const edge=document.querySelector('.reader-nav').getBoundingClientRect().bottom+28;
 const current=chapters.filter(link=>document.querySelector(link.hash).getBoundingClientRect().top<=edge).pop()||chapters[0];
 for(const link of chapters)if(link===current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
}
addEventListener('scroll',markChapter,{passive:true});addEventListener('load',markChapter);markChapter();
if(window===parent){
 document.addEventListener('click',event=>{
  const a=event.target.closest('a');
  if(!a||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  if(a.matches('.reader-back')&&location.search==='?from=product'&&history.length>1){event.preventDefault();history.back();return}
  if(a.hash&&a.pathname===location.pathname){const target=document.getElementById(a.hash.slice(1));if(target){event.preventDefault();target.scrollIntoView({behavior:'instant'});}}
 });
}
