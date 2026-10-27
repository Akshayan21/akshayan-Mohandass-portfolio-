import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const menu = document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav = document.querySelector<HTMLElement>('#main-nav');
function closeMenu(){ nav?.classList.remove('is-open'); menu?.setAttribute('aria-expanded','false'); }
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded',String(open)); nav?.classList.toggle('is-open',open); });
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
document.addEventListener('keydown', event => { if(event.key === 'Escape'){ const wasOpen = menu?.getAttribute('aria-expanded') === 'true'; closeMenu(); document.querySelectorAll<HTMLDetailsElement>('.nav-services[open]').forEach(d => d.open = false); if(wasOpen) menu?.focus(); } });
const form = document.querySelector<HTMLFormElement>('#enquiry');
const serviceOptions = form?.querySelectorAll<HTMLInputElement>('input[name=service]');
const requested = new URLSearchParams(location.search).get('service');
if(requested) serviceOptions?.forEach(option => { if(option.value === requested) option.checked = true; });
const output = document.querySelector<HTMLTextAreaElement>('#prepared-enquiry');
const status = document.querySelector<HTMLElement>('#enquiry-status');
form?.addEventListener('submit', event => {
  event.preventDefault();
  if(!form.reportValidity()) return;
  const data = new FormData(form);
  const val = (key:string) => String(data.get(key) || '').trim();
  const subject = `Project enquiry: ${val('service')}`;
  const body = `Your name: ${val('name')}\nBusiness or product: ${val('business')}\nWhere do you need help?: ${val('service')}\n\nWhat prompted the project?\n${val('brief')}\n\nBudget range: ${val('budget')}\nTiming: ${val('timing')}`;
  if(output) output.value = `Subject: ${subject}\n\n${body}`;
  const result = document.querySelector<HTMLElement>('#enquiry-result');
  if(result) result.hidden = false;
  if(status) status.textContent = 'Your brief is ready. Review it in your email app, or copy it below if the app didn’t open.';
  window.location.href = `mailto:akshayanmohandass@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
document.querySelector('#copy-enquiry')?.addEventListener('click', async () => {
  if(!output || !status) return;
  try { await navigator.clipboard.writeText(output.value); status.textContent = 'Your enquiry has been copied. Paste it into an email to akshayanmohandass@gmail.com.'; }
  catch { output.focus(); output.select(); status.textContent = 'Automatic copying is unavailable. Your enquiry is selected; use your device’s copy command.'; }
});
const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  const hero = document.querySelector<HTMLElement>('[data-home-hero]');
  if(!hero) return;
  const entrance = gsap.timeline({defaults:{duration:.85,ease:'power3.out',clearProps:'opacity,transform,clipPath'}});
  entrance.from(hero.querySelector('.hero-meta'),{opacity:0,y:12})
    .from(hero.querySelector('h1'),{opacity:0,y:48,clipPath:'inset(0 0 100% 0)',duration:1.15},.12)
    .from(hero.querySelector('.hero-symbol'),{rotation:-55,scale:.6,opacity:0,duration:1.2},.3)
    .from(hero.querySelectorAll('.hero-copy > *'),{opacity:0,y:22,stagger:.1},.45)
    .from(hero.querySelector('.hero-foot'),{opacity:0,y:12},.7);

  const removers:(()=>void)[]=[];
  // Reveal only non-interactive introductions; pinned tracks and form fields own their motion.
  document.querySelectorAll<HTMLElement>('#main > .content-section:not(.text):not(.about):not(.contact) > .section-heading, #main > .content-section > .section-intro, .service-scope, .faq-list > details').forEach(target => {
    const reveal=gsap.from(target,{opacity:.15,y:26,duration:.8,ease:'power3.out',clearProps:'opacity,transform',scrollTrigger:{trigger:target,start:'top 94%',once:true}});
    const finish=()=>reveal.progress(1);
    target.addEventListener('focusin',finish);
    removers.push(()=>target.removeEventListener('focusin',finish));
  });
  return ()=>removers.forEach(remove=>remove());
});
motion.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',()=>{
  const hero=document.querySelector<HTMLElement>('[data-home-hero]');
  const symbol=hero?.querySelector('svg');
  if(!hero || !symbol) return;
  // Animate the SVG inside the entrance wrapper so the two effects never fight.
  const moveX=gsap.quickTo(symbol,'x',{duration:.7,ease:'power3.out'});
  const moveY=gsap.quickTo(symbol,'y',{duration:.7,ease:'power3.out'});
  const rotate=gsap.quickTo(symbol,'rotation',{duration:.8,ease:'power3.out'});
  const move=(event:PointerEvent)=>{
    const rect=hero.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5;
    const y=(event.clientY-rect.top)/rect.height-.5;
    moveX(x*28);moveY(y*24);rotate(x*12);
  };
  const reset=()=>{moveX(0);moveY(0);rotate(0);};
  hero.addEventListener('pointermove',move);
  hero.addEventListener('pointerleave',reset);
  return ()=>{hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',reset);};
});
motion.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('.service-hero h1', {y:35,opacity:0,duration:.85,ease:'power3.out',clearProps:'all'});
  gsap.from('.service-hero .hero-symbol', {rotation:-35,scale:.75,duration:1.1,ease:'power3.out',clearProps:'all'});
  document.querySelectorAll<HTMLElement>('.content-section.text:not(.has-cards):not(.home-story)').forEach(section => {
    gsap.from(section.querySelector('.section-marker'), {rotation:-90, scale:.7, ease:'none',scrollTrigger:{trigger:section,start:'top 85%',end:'top 30%',scrub:1}});
    gsap.from(section.querySelector('.section-heading h2'), {x:-18,ease:'none',scrollTrigger:{trigger:section,start:'top 85%',end:'top 35%',scrub:1}});
  });
});
motion.add('(min-width: 1100px) and (min-height: 850px) and (prefers-reduced-motion: no-preference)', () => {
  const section = document.querySelector<HTMLElement>('[data-horizontal]');
  if(!section) return;
  const viewport = section.querySelector<HTMLElement>('.cards-viewport')!;
  const track = section.querySelector<HTMLElement>('.content-grid')!;
  const cards = [...track.querySelectorAll<HTMLElement>('.content-card')];
  const progress = section.querySelector<HTMLElement>('.work-progress span')!;
  const previous = section.querySelector<HTMLButtonElement>('[data-work-prev]')!;
  const next = section.querySelector<HTMLButtonElement>('[data-work-next]')!;
  const counter = section.querySelector<HTMLElement>('[data-work-counter]')!;
  const shapes = cards.map(card=>gsap.quickSetter(card.querySelector('.project-shape'),'x','px'));
  const setProgress = gsap.quickSetter(progress,'scaleX');
  let navigation: gsap.core.Tween | undefined;
  section.classList.add('is-horizontal');
  let trackDistance=0;
  let viewportWidth=0;
  let cardOffsets:number[]=[];
  const measure = () => {
    viewportWidth=viewport.clientWidth;
    trackDistance=Math.max(0,track.scrollWidth-viewportWidth);
    const origin=cards[0].offsetLeft;
    cardOffsets=cards.map(card=>card.offsetLeft-origin);
  };
  measure();
  const distance = () => trackDistance;
  const stops = () => cardOffsets.map(offset=>Math.min(1,offset/Math.max(1,distance())));
  const nearest = (value:number) => stops().reduce((best,stop,index,all)=>Math.abs(stop-value)<Math.abs(all[best]-value)?index:best,0);
  const tween = gsap.to(track, {x:()=>-distance(),ease:'none',scrollTrigger:{
    trigger:section,start:'top top',end:()=>`+=${distance()*1.15}`,pin:true,scrub:1.05,anticipatePin:1,invalidateOnRefresh:true,onRefreshInit:measure,
    // Settle only close to a project, leaving mid-project reading positions alone.
    snap:{snapTo:value=>{const stop=stops()[nearest(value)];return Math.abs(stop-value)<.065?stop:value;},directional:false,inertia:false,delay:.3,duration:{min:.25,max:.65},ease:'power2.inOut'}
  },onUpdate(){
    const value=this.progress();
    setProgress(value);
    const index=nearest(value);
    counter.textContent=`${String(index+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
    previous.disabled=value<.001;next.disabled=value>.999;
    cardOffsets.forEach((offset,i)=>{const relative=(offset-value*distance())/Math.max(1,viewportWidth);shapes[i](gsap.utils.clamp(-22,22,relative*22));});
  }});
  const trigger = tween.scrollTrigger!;
  const cancelNavigation = () => {navigation?.kill();navigation=undefined;};
  const goTo = (index:number, behavior:ScrollBehavior='smooth') => {
    cancelNavigation();trigger.getTween(true)?.kill();
    const offset = cardOffsets[Math.max(0,Math.min(index,cards.length-1))];
    const fraction = Math.min(1,offset / Math.max(1,distance()));
    const top=trigger.start+(trigger.end-trigger.start)*fraction;
    if(behavior==='instant'){window.scrollTo({top,behavior:'instant'});return;}
    const position={top:window.scrollY};
    navigation=gsap.to(position,{top,duration:.95,ease:'power3.inOut',onUpdate:()=>window.scrollTo({top:position.top,behavior:'instant'}),onComplete:()=>{navigation=undefined;}});
  };
  const current = () => nearest(tween.progress());
  const prevClick = () => goTo(current()-1);
  const nextClick = () => goTo(current()+1);
  const focusCard = (event:FocusEvent) => {
    const index = cards.findIndex(card=>card.contains(event.target as Node));
    if(index<0) return;
    viewport.scrollLeft=0;
    goTo(index,'instant');
    tween.progress(trigger.progress);
  };
  previous.addEventListener('click',prevClick);
  next.addEventListener('click',nextClick);
  track.addEventListener('focusin',focusCard);
  window.addEventListener('wheel',cancelNavigation,{passive:true});
  window.addEventListener('touchstart',cancelNavigation,{passive:true});
  window.addEventListener('keydown',cancelNavigation);
  return () => {
    cancelNavigation();
    window.removeEventListener('wheel',cancelNavigation);window.removeEventListener('touchstart',cancelNavigation);window.removeEventListener('keydown',cancelNavigation);
    previous.removeEventListener('click',prevClick);next.removeEventListener('click',nextClick);track.removeEventListener('focusin',focusCard);
    section.classList.remove('is-horizontal');
    gsap.set(progress,{clearProps:'transform'});
    cards.forEach(card=>gsap.set(card.querySelector('.project-shape'),{clearProps:'transform'}));
    counter.textContent=`01 / ${String(cards.length).padStart(2,'0')}`;
  };
});
window.addEventListener('pagehide',()=>motion.revert(),{once:true});

motion.add('(min-width: 1000px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)',()=>{
  const cleanups=[...document.querySelectorAll<HTMLElement>('[data-benefit-sequence]')].map(sequence=>{
  const track=sequence.querySelector<HTMLElement>('.benefit-track')!;
  const viewport=sequence.querySelector<HTMLElement>('.benefit-viewport')!;
  const cards=[...sequence.querySelectorAll<HTMLElement>('.benefit-card')];
  const previous=sequence.querySelector<HTMLButtonElement>('[data-benefit-prev]')!;
  const next=sequence.querySelector<HTMLButtonElement>('[data-benefit-next]')!;
  const setProgress=gsap.quickSetter(sequence.querySelector('.benefit-progress>span'),'scaleX');
  sequence.classList.add('is-pinned');
  let distance=0,offsets:number[]=[];
  const measure=()=>{distance=Math.max(0,track.scrollWidth-viewport.clientWidth+10);const origin=cards[0].offsetLeft;offsets=cards.map(card=>card.offsetLeft-origin);};
  measure();
  let navigation:gsap.core.Tween|undefined;
  const tween=gsap.to(track,{x:()=>-distance,ease:'none',onUpdate(){setProgress(this.progress());previous.disabled=this.progress()<.001;next.disabled=this.progress()>.999;},scrollTrigger:{trigger:sequence,start:'top 24px',end:()=>`+=${distance*1.15}`,pin:true,scrub:1,anticipatePin:1,invalidateOnRefresh:true,onRefreshInit:measure}});
  const trigger=tween.scrollTrigger!;
  const cancel=()=>{navigation?.kill();};
  const current=()=>offsets.reduce((best,offset,i)=>Math.abs(Math.min(offset,distance)-tween.progress()*distance)<Math.abs(Math.min(offsets[best],distance)-tween.progress()*distance)?i:best,0);
  const go=(index:number,instant=false)=>{
    cancel();const top=trigger.start+(trigger.end-trigger.start)*Math.min(1,offsets[Math.max(0,Math.min(index,cards.length-1))]/Math.max(1,distance));
    if(instant){window.scrollTo({top,behavior:'instant'});trigger.update();trigger.getTween()?.progress(1);return;}
    const position={top:scrollY};navigation=gsap.to(position,{top,duration:.9,ease:'power3.inOut',onUpdate:()=>window.scrollTo({top:position.top,behavior:'instant'})});
  };
  const prev=()=>go(current()-1),advance=()=>go(current()+1);
  const focus=(event:FocusEvent)=>{const index=cards.findIndex(card=>card.contains(event.target as Node));if(index>=0){viewport.scrollLeft=0;go(index,true);}};
  previous.addEventListener('click',prev);next.addEventListener('click',advance);track.addEventListener('focusin',focus);
  window.addEventListener('wheel',cancel,{passive:true});window.addEventListener('touchstart',cancel,{passive:true});
  return ()=>{cancel();previous.removeEventListener('click',prev);next.removeEventListener('click',advance);track.removeEventListener('focusin',focus);window.removeEventListener('wheel',cancel);window.removeEventListener('touchstart',cancel);sequence.classList.remove('is-pinned');gsap.set(sequence.querySelector('.benefit-progress>span'),{clearProps:'transform'});};
  });
  return ()=>cleanups.forEach(cleanup=>cleanup());
});
document.fonts.ready.then(()=>ScrollTrigger.refresh());

motion.add('(prefers-reduced-motion: no-preference)',()=>{
  document.querySelectorAll<HTMLElement>('.home-story').forEach(section=>{
    const art=section.querySelector<HTMLElement>('.home-story-art')!;
    gsap.from(art,{y:32,opacity:.25,duration:.9,ease:'power3.out',clearProps:'opacity,transform',scrollTrigger:{trigger:art,start:'top 92%',once:true}});
    gsap.from(section.querySelectorAll('[data-story-piece]'),{y:24,rotation:section.querySelector('.is-product')?-4:3,stagger:.12,ease:'none',scrollTrigger:{trigger:art,start:'top 90%',end:'bottom 65%',scrub:.7}});
    const line=section.querySelector('.story-flow-line');
    if(line) gsap.from(line,{scaleX:0,ease:'none',scrollTrigger:{trigger:art,start:'top 85%',end:'bottom 65%',scrub:.7}});
  });
});

motion.add('(min-width: 1000px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)',()=>{
  const stack=document.querySelector<HTMLElement>('[data-stacking-cards]');
  if(!stack) return;
  const cards=[...stack.querySelectorAll<HTMLElement>('.starting-stack-card')];
  stack.classList.add('is-stacking');
  cards.slice(0,-1).forEach((card,index)=>{
    gsap.to(card,{scale:.96,ease:'none',scrollTrigger:{trigger:cards[index+1],start:'top 90%',end:()=>`top ${48+(index+1)*18}px`,scrub:.7,invalidateOnRefresh:true}});
  });
  return ()=>stack.classList.remove('is-stacking');
});
document.querySelectorAll<HTMLElement>('.faq-list').forEach(list=>{
  const toggles=new Map<HTMLDetailsElement,(open:boolean)=>void>();
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  list.querySelectorAll<HTMLDetailsElement>('details').forEach(detail=>{
    const summary=detail.querySelector('summary')!;
    const answer=detail.querySelector<HTMLElement>('.faq-answer')!;
    let expanded=detail.open;
    let animation:gsap.core.Tween|undefined;
    const finish=()=>{detail.open=expanded;answer.style.removeProperty('height');answer.style.removeProperty('opacity');answer.inert=!expanded;ScrollTrigger.refresh();};
    const toggle=(open:boolean)=>{
      if(open===expanded) return;
      expanded=open;
      animation?.kill();
      const height=detail.open?answer.getBoundingClientRect().height:0;
      detail.open=true;
      answer.inert=!open;
      if(reduced.matches){finish();return;}
      animation=gsap.fromTo(answer,{height,opacity:open?.35:1},{height:open?answer.scrollHeight:0,opacity:open?1:0,duration:open?.5:.35,ease:'power3.inOut',onComplete:finish});
    };
    toggles.set(detail,toggle);
    summary.addEventListener('click',event=>{
      event.preventDefault();
      const open=!expanded;
      if(open) toggles.forEach((close,other)=>{if(other!==detail) close(false);});
      toggle(open);
    });
    reduced.addEventListener('change',()=>{if(reduced.matches){animation?.kill();finish();}});
  });
});

const explorer = document.querySelector<HTMLElement>('[data-service-explorer]');
if(explorer){
  const buttons = [...explorer.querySelectorAll<HTMLButtonElement>('.service-selector')];
  const panels = [...explorer.querySelectorAll<HTMLElement>('.service-panel')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeService = -1;
  let serviceScroll: ScrollTrigger | undefined;
  let outgoingPanel: HTMLElement | undefined;
  const clearPanelMotion = () => {
    if(outgoingPanel){gsap.killTweensOf(outgoingPanel);outgoingPanel.remove();outgoingPanel=undefined;}
    panels.forEach(panel=>{
      const targets=[panel,...panel.querySelectorAll('h3, .service-panel-copy > *')];
      gsap.killTweensOf(targets);gsap.set(targets,{clearProps:'opacity,transform'});
    });
  };
  function chooseService(index:number, animate=true){
    if(index===activeService) return;
    const previousIndex=activeService;
    const direction=index>previousIndex?1:-1;
    clearPanelMotion();
    // The outgoing copy is visual only; the active panel remains the sole accessible panel.
    if(animate && !reducedMotion.matches && previousIndex>=0 && innerWidth>760){
      const previous=panels[previousIndex];
      const rect=previous.getBoundingClientRect();
      const container=explorer!.getBoundingClientRect();
      outgoingPanel=previous.cloneNode(true) as HTMLElement;
      outgoingPanel.removeAttribute('id');outgoingPanel.removeAttribute('aria-labelledby');
      outgoingPanel.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
      outgoingPanel.setAttribute('aria-hidden','true');outgoingPanel.inert=true;
      outgoingPanel.classList.add('service-transition-ghost');
      Object.assign(outgoingPanel.style,{left:`${rect.left-container.left}px`,top:`${rect.top-container.top}px`,width:`${rect.width}px`,height:`${rect.height}px`});
      explorer!.append(outgoingPanel);
      const ghost=outgoingPanel;
      gsap.to(ghost,{opacity:0,y:-8*direction,duration:.3,ease:'power2.inOut',onComplete:()=>{ghost.remove();if(outgoingPanel===ghost) outgoingPanel=undefined;}});
    }
    activeService=index;
    panels[index].scrollTop=0;
    panels.forEach((panel,i)=>{gsap.killTweensOf(panel);gsap.set(panel,{clearProps:'opacity,transform'});panel.hidden=i!==index;buttons[i].setAttribute('aria-expanded',String(i===index));});
    if(animate && !reducedMotion.matches){
      const content=panels[index].querySelectorAll('h3, .service-panel-copy > *');
      gsap.fromTo(content,{opacity:0,y:10*direction},{opacity:1,y:0,duration:.6,stagger:{amount:.16},ease:'power3.out',clearProps:'opacity,transform',onComplete:()=>{if(!serviceScroll) ScrollTrigger.refresh();}});
    }
    if(!serviceScroll) ScrollTrigger.refresh();
  }
  explorer.classList.add('is-interactive');
  chooseService(0,false);
  const selectService = (index:number) => {
    if(serviceScroll) window.scrollTo({top:serviceScroll.start+(serviceScroll.end-serviceScroll.start)*(index+.2)/panels.length,behavior:'instant'});
    chooseService(index);
  };
  buttons.forEach((button,index)=>{
    button.addEventListener('click',()=>{
      selectService(index);
      if(window.innerWidth<=760) button.scrollIntoView({block:'start',behavior:reducedMotion.matches?'instant':'smooth'});
    });
    button.addEventListener('keydown',event=>{
      let target:number|undefined;
      if(event.key==='ArrowDown') target=(index+1)%buttons.length;
      if(event.key==='ArrowUp') target=(index-1+buttons.length)%buttons.length;
      if(event.key==='Home') target=0;
      if(event.key==='End') target=buttons.length-1;
      if(target!==undefined){event.preventDefault();buttons[target].focus({preventScroll:true});selectService(target);}
    });
  });
  motion.add('(min-width: 1000px) and (min-height: 500px) and (prefers-reduced-motion: no-preference)',()=>{
    // Fit the sequence to the actual browser viewport, including zoomed laptop windows.
    const sizePanels=()=>{
      const height=innerHeight-64;
      explorer.style.setProperty('--service-panel-height',`${height}px`);
      explorer.style.minHeight=`${height}px`;
    };
    sizePanels();
    explorer.classList.add('is-scroll-driven');
    serviceScroll=ScrollTrigger.create({
      id:'service-sequence',trigger:explorer,start:'top 32px',end:()=>`+=${innerHeight*panels.length*.8}`,pin:true,anticipatePin:1,invalidateOnRefresh:true,refreshPriority:10,onRefreshInit:sizePanels,
      onUpdate:self=>{
        const position=self.progress*panels.length;
        gsap.to(explorer,{'--service-progress':self.progress===1?1:position%1,duration:.18,overwrite:'auto',ease:'power1.out'});
        const candidate=Math.min(panels.length-1,Math.floor(position));
        // A small boundary tolerance prevents trackpad jitter from repeatedly swapping panels.
        if(candidate===activeService || Math.abs(position-Math.max(candidate,activeService))>.06) chooseService(candidate);
      }
    });
    ScrollTrigger.refresh();
    return ()=>{
      serviceScroll=undefined;
      explorer.classList.remove('is-scroll-driven');
      explorer.style.removeProperty('min-height');explorer.style.removeProperty('--service-progress');explorer.style.removeProperty('--service-panel-height');
      panels.forEach(panel=>panel.removeAttribute('tabindex'));
      gsap.killTweensOf(explorer);
      clearPanelMotion();
    };
  });
  reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches) clearPanelMotion();});
}

motion.add('(prefers-reduced-motion: no-preference)',()=>{
  const about=document.querySelector<HTMLElement>('#about');
  if(!about) return;
  gsap.from(about.querySelector('.about-identity'),{y:24,ease:'none',scrollTrigger:{trigger:about,start:'top 85%',end:'top 30%',scrub:1}});
  gsap.from(about.querySelectorAll('.about-story h3, .about-story .prose > p'),{opacity:.4,y:14,stagger:.08,ease:'none',scrollTrigger:{trigger:about.querySelector('.about-story'),start:'top 85%',end:'bottom 85%',scrub:.8}});
  gsap.from(about.querySelectorAll('.about-fields > a'),{opacity:.4,y:12,stagger:.1,ease:'none',scrollTrigger:{trigger:about.querySelector('.about-fields'),start:'top 95%',end:'top 65%',scrub:.7}});
});

motion.add('(prefers-reduced-motion: no-preference)',()=>{
  const contact=document.querySelector<HTMLElement>('#contact');
  if(!contact) return;
  const removeListeners:(()=>void)[]=[];
  gsap.from(contact.querySelector('h2'),{opacity:.25,y:18,duration:.8,ease:'power3.out',clearProps:'opacity,transform',scrollTrigger:{trigger:contact,start:'top 85%',once:true}});
  gsap.from(contact.querySelectorAll('.contact-introduction > *'),{opacity:.25,y:14,duration:.7,stagger:.08,ease:'power3.out',clearProps:'opacity,transform',scrollTrigger:{trigger:contact.querySelector('.contact-introduction'),start:'top 88%',once:true}});
  gsap.from(contact.querySelector('.enquiry-heading'),{opacity:.35,y:12,duration:.65,ease:'power3.out',clearProps:'opacity,transform',scrollTrigger:{trigger:contact.querySelector('.enquiry'),start:'top 90%',once:true}});
  // Only reveal rows as they enter; never scrub a focused input or move it on scroll.
  contact.querySelectorAll<HTMLElement>('.enquiry > label, .enquiry > .form-grid, .enquiry-action').forEach(row=>{
    const reveal=gsap.from(row,{opacity:.45,y:10,duration:.6,ease:'power3.out',clearProps:'opacity,transform',scrollTrigger:{trigger:row,start:'top 96%',once:true}});
    const finish=()=>reveal.progress(1);
    row.addEventListener('focusin',finish);
    // Native validation may focus a required field before the reveal reaches it.
    row.addEventListener('invalid',finish,true);
    removeListeners.push(()=>{row.removeEventListener('focusin',finish);row.removeEventListener('invalid',finish,true);});
  });
  return ()=>removeListeners.forEach(remove=>remove());
});
