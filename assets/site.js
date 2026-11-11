'use strict';
const offers={
 'ai-org':{name:'AI 原生组织',title:'《AI 使用现状速查》',give:'告诉我们一个部门、一件最想先做的事。',get:'免费回你一份《AI 使用现状速查》：你的人现在把 AI 用在哪，这件事值不值得先做。'},
 ecommerce:{name:'AI 电商运营',title:'《电商经营体检》',give:'给一个关键词或一份店铺报表。',get:'当天看到价格证据、经营日报和诊断。'},
 service:{name:'AI 客服管理',title:'《客服聊天体检》',give:'选一家店，跑一天聊天。',get:'当天告诉你问题在哪、估算丢了多少单。'},
 visual:{name:'AI 视觉设计',title:'《电商对比稿》',give:'给一张产品图、卖点和参考图。',get:'出一版，和你现在的图摆在一起比。'},
 content:{name:'AI 内容生产',title:'免费试做样片',give:'给一款产品和卖点。',get:'做一条带货样片。'},
 geo:{name:'AI 搜索优化（GEO）',title:'《AI 搜索速查》',give:'给品牌名和 2–3 个竞品。',get:'把主流 AI 的回答摆给你看。'}
};
const header=document.querySelector('.global-header');
if(header){
 const compact=()=>header.classList.toggle('compact',scrollY>30);addEventListener('scroll',compact,{passive:true});compact();
 const toggle=document.querySelector('.mobile-toggle'),links=document.querySelector('.global-links');
 const closeMenu=()=>{header.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false')};
 toggle.addEventListener('click',()=>{const on=header.classList.toggle('menu-open');toggle.setAttribute('aria-expanded',String(on))});
 const solutionToggle=document.querySelector('.solution-toggle'),dropdown=document.querySelector('.solution-dropdown');
 const closeDropdown=()=>{dropdown.hidden=true;solutionToggle.setAttribute('aria-expanded','false')};
 solutionToggle.addEventListener('click',()=>{dropdown.hidden=!dropdown.hidden;solutionToggle.setAttribute('aria-expanded',String(!dropdown.hidden))});
 document.addEventListener('click',e=>{if(!e.target.closest('.solution-menu'))closeDropdown();if(!e.target.closest('.global-header'))closeMenu()});
 links.addEventListener('click',e=>{if(e.target.closest('a, [data-offer], [data-contact]')){closeMenu();closeDropdown()}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!dropdown.hidden){closeDropdown();solutionToggle.focus()}if(header.classList.contains('menu-open')){closeMenu();toggle.focus()}}});
}
const dialog=document.querySelector('.contact-dialog');
let previousFocus,previousOverflow;
function openContact(key,contact=false){
 if(!dialog)return;const offer=offers[key]||offers['ai-org'];previousFocus=document.activeElement;previousOverflow=document.body.style.overflow;
 dialog.querySelector('h2').textContent=contact?'联系我们':offer.name+' · 免费第一步';
 dialog.querySelector('.dialog-offer').textContent=offer.title;
 dialog.querySelector('[data-give]').textContent=offer.give;dialog.querySelector('[data-get]').textContent=offer.get;
 dialog.showModal();document.body.style.overflow='hidden';dialog.querySelector('.dialog-close').focus();
}
if(dialog){
 document.addEventListener('click',e=>{const trigger=e.target.closest('[data-offer], [data-contact]');if(trigger){e.preventDefault();openContact(trigger.dataset.offer||document.body.dataset.page,trigger.hasAttribute('data-contact'))}});
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow||'';previousFocus?.focus()});
}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.faq-list').forEach(list=>list.addEventListener('toggle',e=>{if(e.target.open)list.querySelectorAll('details').forEach(d=>{if(d!==e.target)d.open=false})},true));
const counters=document.querySelectorAll('[data-count]');
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target,target=Number(el.dataset.count),suffix=el.dataset.suffix||'',start=performance.now();observer.unobserve(el);if(reduced.matches)return;function frame(now){const t=Math.min((now-start)/1000,1);el.textContent=Math.round(target*(1-(1-t)**3))+suffix;if(t<1)requestAnimationFrame(frame)}requestAnimationFrame(frame)}),{threshold:.35});counters.forEach(el=>observer.observe(el));
const carousel=document.querySelector('.carousel');
if(carousel){
 const viewport=carousel.querySelector('.carousel-window'),track=carousel.querySelector('.carousel-track'),original=Array.from(track.children),count=original.length,dots=Array.from(carousel.querySelectorAll('.carousel-dots button')),pauseButton=carousel.querySelector('[data-pause]');
 const mobile=matchMedia('(max-width:768px)');let position=0,hover=false,focused=false,paused=false,last=0,hold=0,step=0;
 // Clones keep the desktop belt continuous. They are excluded from keyboard and assistive navigation.
 original.forEach(card=>{const clone=card.cloneNode(true);clone.dataset.clone='true';clone.tabIndex=-1;clone.setAttribute('aria-hidden','true');track.append(clone)});
 const clones=Array.from(track.querySelectorAll('[data-clone]'));
 function size(){const gap=parseFloat(getComputedStyle(track).gap);step=original[0].getBoundingClientRect().width+gap;clones.forEach(c=>c.style.display=mobile.matches?'none':'');position=0;viewport.scrollLeft=0;draw()}
 function draw(){if(!mobile.matches)track.style.transform=`translateX(${-position}px)`;const active=mobile.matches?Math.round(viewport.scrollLeft/step)%count:Math.floor((position+step*.35)/step)%count;dots.forEach((d,i)=>d.setAttribute('aria-current',String(i===active)))}
 function go(index){index=(index+count)%count;hold=performance.now()+4500;if(mobile.matches)viewport.scrollTo({left:index*step,behavior:reduced.matches?'instant':'smooth'});else{position=index*step;draw()}}
 carousel.querySelector('[data-prev]').addEventListener('click',()=>go(Math.round((mobile.matches?viewport.scrollLeft:position)/step)-1));
 carousel.querySelector('[data-next]').addEventListener('click',()=>go(Math.round((mobile.matches?viewport.scrollLeft:position)/step)+1));dots.forEach((dot,i)=>dot.addEventListener('click',()=>go(i)));
 function updatePause(){pauseButton.textContent=paused?'▶':'Ⅱ';pauseButton.setAttribute('aria-label',paused?'播放自动轮播':'暂停自动轮播');pauseButton.setAttribute('aria-pressed',String(paused))}
 pauseButton.addEventListener('click',()=>{paused=!paused;updatePause()});carousel.addEventListener('pointerenter',()=>hover=true);carousel.addEventListener('pointerleave',()=>hover=false);carousel.addEventListener('focusin',()=>{focused=true});carousel.addEventListener('focusout',()=>{focused=carousel.contains(document.activeElement)});
 viewport.addEventListener('scroll',()=>{if(mobile.matches)draw()},{passive:true});
 function frame(now){const dt=last?Math.min(now-last,60):0;last=now;if(!mobile.matches&&!reduced.matches&&!hover&&!focused&&!paused&&!document.hidden&&now>hold){position=(position+dt*.022)%(step*count);draw()}requestAnimationFrame(frame)}
 addEventListener('resize',size);size();requestAnimationFrame(frame);
 // Keyboard focus must always reveal its card, including cards outside the current belt window.
 original.forEach((card,i)=>card.addEventListener('focus',()=>go(i)));
}
const guideEntry=document.querySelector('.guide-entry');
if(guideEntry&&window===parent){
 guideEntry.addEventListener('click',event=>{
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();history.replaceState({...history.state,guideY:scrollY},'');location.assign(guideEntry.href+'?from=product');
 });
 addEventListener('pageshow',()=>{if(Number.isFinite(history.state?.guideY))scrollTo({top:history.state.guideY,behavior:'instant'})});
}
