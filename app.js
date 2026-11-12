(() => {
 'use strict';
 const services=[
  {
    "title": "Геодезическая аэрофотосъёмка",
    "image": "result-plan-1280.webp",
    "caption": "Ортофотоплан и топографические слои · демонстрация"
  },
  {
    "title": "Воздушное лазерное сканирование",
    "image": "result-model-1280.webp",
    "caption": "Модель поверхности · демонстрация"
  },
  {
    "title": "Подсчёт объёмов запасов",
    "image": "result-volume-1280.webp",
    "caption": "Расчётная поверхность · демонстрация"
  },
  {
    "title": "Векторизация топосъёмки",
    "image": "result-plan-1280.webp",
    "caption": "Топографические слои · демонстрация"
  },
  {
    "title": "Съёмка сельскохозяйственных угодий",
    "image": "agriculture-illustration.webp",
    "caption": "Агротехнологии с БПЛА · иллюстрация"
  },
  {
    "title": "Обработка агродронами",
    "image": "agriculture-illustration.webp",
    "caption": "Работа агродрона · иллюстрация"
  },
  {
    "title": "Художественная аэросъёмка",
    "image": "hero-city-1600.webp",
    "caption": "Аэрофотосъёмка территории · иллюстрация"
  },
  {
    "title": "Сертификат эксплуатанта",
    "image": "certificate.webp",
    "caption": "Сертификат АР-289 · опубликованный документ"
  }
];
 const projects=[
  {
    "id": "kuzbass",
    "title": "Топографическая основа для газопровода",
    "region": "Кемеровская область",
    "area": "4 150",
    "client": "ООО «Аланс»",
    "image": "case-kemerovo.webp",
    "description": "Ортофотоплан, топоплан, цифровая модель местности и материалы для отчёта о геодезических изысканиях.",
    "detail": "Проектирование газопровода высокого и среднего давления в Кузбассе. По материалам компании, полный комплекс работ выполнен за 94 дня. Срок относится к этому проекту; график нового объекта рассчитывается отдельно.",
    "zone": "siberia"
  },
  {
    "id": "amur",
    "title": "Данные для проектной документации",
    "region": "Комсомольск-на-Амуре",
    "area": "2 208",
    "client": "ЗАО «Золотопроект»",
    "image": "case-amur.webp",
    "description": "Инженерно-топографические планы для проектирования существующих и строящихся объектов.",
    "detail": "Комплекс инженерно-геодезических изысканий. В опубликованном проекте указаны планы масштабов 1:1000 и 1:2000; состав результата включает данные о сооружениях, планировке и условиях территории.",
    "zone": "east"
  },
  {
    "id": "dalnegorsk",
    "title": "Топоплан для подсчёта горных работ",
    "region": "Дальнегорск",
    "area": "200",
    "client": "ООО «Ваш Партнер Геодезист»",
    "image": "case-dalnegorsk.webp",
    "description": "Аэрофотосъёмка и обрисовка территории для учёта горных и отвальных работ.",
    "detail": "По материалам компании, съёмка и обрисовка для подсчёта горных работ выполнены в масштабе 1:500, отвальных — 1:2000. Результатом стал топографический план с высотными отметками.",
    "zone": "east"
  }
];
 const all=(selector,root=document)=>[...root.querySelectorAll(selector)];
 const byId=id=>document.getElementById(id);
 const mobile=matchMedia('(max-width:760px)');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const menu=byId('main-nav'),menuButton=document.querySelector('.mobile-menu');
 function closeMenu(focus=false){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');menu.classList.remove('mobile-open');document.body.classList.remove('menu-open');all('.nav-group').forEach(e=>e.open=false);if(focus)menuButton.focus();}
 menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';if(open){menu.classList.add('mobile-open');menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','Закрыть меню');document.body.classList.add('menu-open');}else closeMenu();});
 menu.addEventListener('click',e=>{if(e.target.closest('a[href]'))closeMenu();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('mobile-open'))closeMenu(true);});
 document.addEventListener('click',e=>{if(menu.classList.contains('mobile-open')&&!e.target.closest('.header'))closeMenu();});
 mobile.addEventListener('change',()=>closeMenu());
 let previousScroll=scrollY;
 addEventListener('scroll',()=>{const current=scrollY;document.querySelector('.header').classList.toggle('header-away',current>200&&current>previousScroll);previousScroll=current;},{passive:true});
 const requestSection=byId('request'),requestHome=document.createComment('Desktop request position');requestSection.before(requestHome);
 const sectionLabels=new Map(all('main>.section').map(section=>[section,section.querySelector('.eyebrow').textContent]));
 function prioritize(){if(mobile.matches)document.querySelector('.home-hero').after(requestSection);else requestHome.after(requestSection);all('main>.section').forEach((section,i)=>{const original=sectionLabels.get(section);section.querySelector('.eyebrow').textContent=mobile.matches?original.replace(/^\d+/,String(i+1).padStart(2,'0')):original;});}
 prioritize();mobile.addEventListener('change',prioritize);
 // Keep the service image synchronized with the one open row.
 const rows=all('.service-row');
 function setService(index){const item=services[index];if(!item)return;rows.forEach((r,i)=>r.open=i===index);byId('service-image').src='assets/'+item.image;byId('service-image').alt=item.caption;document.querySelector('.service-frame').classList.toggle('is-document',item.image==='certificate.webp');byId('service-caption').textContent=item.caption;byId('service-counter').textContent=String(index+1).padStart(2,'0')+' / 08';}
 rows.forEach((row,i)=>row.addEventListener('toggle',()=>{if(row.open){rows.forEach(other=>{if(other!==row)other.open=false;});const item=services[i];byId('service-image').src='assets/'+item.image;byId('service-image').alt=item.caption;document.querySelector('.service-frame').classList.toggle('is-document',item.image==='certificate.webp');byId('service-caption').textContent=item.caption;byId('service-counter').textContent=String(i+1).padStart(2,'0')+' / 08';}}));
 all('[data-service-target]').forEach(button=>button.addEventListener('click',()=>{const i=Number(button.dataset.serviceTarget);setService(i);rows[i].scrollIntoView({block:'center',behavior:reduced.matches?'instant':'smooth'});rows[i].querySelector('summary').focus({preventScroll:true});}));
 // Two independent accessible tab groups, with automatic keyboard activation.
 function activateTab(tab,focus=false){const list=tab.closest('[role=tablist]');all('[role=tab]',list).forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;byId(t.getAttribute('aria-controls')).hidden=!selected;});if(focus)tab.focus();}
 all('[role=tablist]').forEach(list=>{const tabs=all('[role=tab]',list);tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activateTab(tab));tab.addEventListener('keydown',e=>{const next={ArrowRight:(index+1)%tabs.length,ArrowDown:(index+1)%tabs.length,ArrowLeft:(index+tabs.length-1)%tabs.length,ArrowUp:(index+tabs.length-1)%tabs.length,Home:0,End:tabs.length-1}[e.key];if(next===undefined)return;e.preventDefault();activateTab(tabs[next],true);});});});
 all('[data-direction-link]').forEach(link=>link.addEventListener('click',()=>activateTab(byId('direction-'+link.dataset.directionLink))));
 const directionPreload=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){all('.direction-panel img').forEach(img=>img.loading='eager');directionPreload.disconnect();}},{rootMargin:'800px'});directionPreload.observe(byId('directions'));
 all('[data-project-filter]').forEach(button=>button.addEventListener('click',()=>{const zone=button.dataset.projectFilter;all('[data-project-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;all('.project-card').forEach(card=>{const visible=zone==='all'||card.dataset.zone===zone;card.hidden=!visible;if(visible)count++;});byId('project-count').textContent=count+(count===1?' проект':' проекта');}));
 // Native dialogs maintain the focus trap, Escape handling and return focus.
 const requestDialog=byId('request-dialog'),projectDialog=byId('project-dialog');
 const dialogOpeners=new Map();
 function showDialog(dialog,opener){dialogOpeners.set(dialog,opener||document.activeElement);closeMenu();dialog.showModal();document.body.classList.add('dialog-open');dialog.querySelector('h2')?.setAttribute('tabindex','-1');dialog.querySelector('h2')?.focus({preventScroll:true});dialog.scrollTop=0;}
 all('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('dialog-open');const opener=dialogOpeners.get(dialog);const summary=opener?.closest('.nav-group')?.querySelector('summary');const target=opener?.checkVisibility()?opener:summary?.checkVisibility()?summary:menuButton;target?.focus({preventScroll:true});});let downOutside=false;const outside=e=>{const r=dialog.getBoundingClientRect();return e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom;};dialog.addEventListener('pointerdown',e=>downOutside=e.target===dialog&&outside(e));dialog.addEventListener('click',e=>{if(downOutside&&e.target===dialog&&outside(e))dialog.close();downOutside=false;});});
 let selectedProject;
 all('[data-project]').forEach(button=>button.addEventListener('click',()=>{const p=projects.find(item=>item.id===button.dataset.project);if(!p)return;selectedProject=p;byId('project-dialog-title').textContent=p.title;byId('project-dialog-region').textContent=p.region+' / '+p.area+' га';byId('project-dialog-description').textContent=p.description;byId('project-dialog-detail').textContent=p.detail;byId('project-dialog-image').src='assets/'+p.image;byId('project-dialog-image').alt=p.title+' — фотография из материалов ЦБТ';showDialog(projectDialog,button);}));
 const quick=byId('quick-request'),complete=byId('request-complete');let draft;
 function openRequest(interest,opener){complete.hidden=true;quick.hidden=false;quick.elements.interest.value=interest||'Инженерные услуги';byId('request-dialog-title').innerHTML='Расскажите,<br> что нужно<br> сделать.';showDialog(requestDialog,opener);document.querySelector('.request-dialog-grid').scrollTop=0;document.querySelector('.request-dialog-body').scrollTop=0;}
 all('[data-request],[data-estimate-open]').forEach(button=>button.addEventListener('click',e=>{e.preventDefault();openRequest(button.dataset.request||'Инженерные услуги',button);}));
 byId('project-dialog-request').addEventListener('click',()=>{const opener=dialogOpeners.get(projectDialog);projectDialog.close();openRequest('Похожий объект: '+selectedProject.title,opener);});
 function validate(form){const contact=form.elements.contact,value=contact.value.trim();const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);const phone=/^[+()\d\s.-]+$/.test(value)&&value.replace(/\D/g,'').length>=10&&value.replace(/\D/g,'').length<=15;contact.setCustomValidity(email||phone?'':'Укажите корректный телефон или e-mail.');const bad=all('input,select,textarea',form).find(e=>!e.checkValidity());if(bad){bad.reportValidity();return false;}return true;}
 function readForm(form){return {contact:form.elements.contact.value.trim(),interest:form.elements.interest.value.trim(),region:form.elements.region?.value.trim()||'',task:form.elements.task?.value.trim()||''};}
 function draftText(){return ['Запрос — Центр беспилотных технологий','',...Object.entries({Контакт:draft.contact,Тема:draft.interest,Объект:draft.region||'Уточняется',Задача:draft.task||'Уточняется'}).map(([k,v])=>k+': '+v),'','Стоимость и сроки определяются индивидуально.','Сформировано в демонстрации. Автоматической отправки не было.'].join('\r\n');}
 function showComplete(data,opener){draft=data;quick.hidden=true;complete.hidden=false;byId('request-summary').replaceChildren();for(const [name,value]of[['Контакт',data.contact],['Тема',data.interest],['Объект',data.region],['Задача',data.task]]){if(!value)continue;const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=name;dd.textContent=value;row.append(dt,dd);byId('request-summary').append(row);}byId('email-request').href='mailto:info@uavcenter.ru?subject='+encodeURIComponent('Запрос: '+data.interest)+'&body='+encodeURIComponent(draftText());byId('request-dialog-title').innerHTML='От задачи<br> к следующему<br> шагу.';if(!requestDialog.open)showDialog(requestDialog,opener);complete.focus({preventScroll:true});document.querySelector('.request-dialog-body').scrollTop=0;document.querySelector('.request-dialog-grid').scrollTop=0;}
 all('.request-form').forEach(form=>{form.addEventListener('input',()=>{form.elements.contact.setCustomValidity('');});form.addEventListener('submit',e=>{e.preventDefault();if(!validate(form))return;showComplete(readForm(form),form.querySelector('[type=submit]'));});});
 byId('edit-request').addEventListener('click',()=>{complete.hidden=true;quick.hidden=false;quick.elements.contact.value=draft.contact;quick.elements.interest.value=draft.interest;quick.elements.task.value=[draft.region,draft.task].filter(Boolean).join('\n');quick.elements.consent.checked=true;byId('request-dialog-title').innerHTML='Расскажите,<br> что нужно<br> сделать.';quick.elements.contact.focus();});
 byId('download-request').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['\uFEFF'+draftText()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ЦБТ-запрос.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 const sticky=document.querySelector('.mobile-cta');
 document.addEventListener('focusin',e=>{if(e.target.matches('input,textarea,select')){sticky.classList.add('is-hidden');sticky.inert=true;}});
 document.addEventListener('focusout',()=>setTimeout(()=>{if(!document.activeElement.matches('input,textarea,select')){sticky.classList.remove('is-hidden');sticky.inert=false;}},0));
 // Preserve native values while adding a small branded listbox where supported.
 if('showPopover'in HTMLElement.prototype){all('select').forEach((select,index)=>{const label=select.closest('label'),id=select.id||'interest-'+index;select.id=id;label.htmlFor=id;const wrap=document.createElement('span');wrap.className='design-select';const trigger=document.createElement('button');trigger.type='button';trigger.className='design-select-trigger';trigger.setAttribute('role','combobox');trigger.setAttribute('aria-label','Направление обращения');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',id+'-list');trigger.setAttribute('aria-haspopup','listbox');const list=document.createElement('div');list.id=id+'-list';list.className='design-select-list';list.setAttribute('popover','manual');list.setAttribute('role','listbox');list.setAttribute('aria-label','Направление обращения');let active=select.selectedIndex;const opts=[...select.options].map((o,i)=>{const el=document.createElement('div');el.className='design-select-option';el.id=id+'-option-'+i;el.setAttribute('role','option');el.textContent=o.textContent;el.addEventListener('pointerdown',e=>e.preventDefault());el.addEventListener('click',e=>{e.preventDefault();commit(i);});list.append(el);return el;});select.after(wrap);wrap.append(trigger,list);select.hidden=true;select.tabIndex=-1;
 function sync(){trigger.textContent=select.selectedOptions[0].textContent;opts.forEach((o,i)=>o.setAttribute('aria-selected',String(i===select.selectedIndex)));}
 function close(){if(list.matches(':popover-open'))list.hidePopover();trigger.setAttribute('aria-expanded','false');trigger.removeAttribute('aria-activedescendant');}
 function highlight(i){active=Math.max(0,Math.min(opts.length-1,i));opts.forEach((o,j)=>o.classList.toggle('is-active',j===active));trigger.setAttribute('aria-activedescendant',opts[active].id);opts[active].scrollIntoView({block:'nearest'});}
 function open(){const r=trigger.getBoundingClientRect(),h=Math.min(260,opts.length*49+14),up=innerHeight-r.bottom<h&&r.top>h;list.style.width=Math.min(r.width,innerWidth-24)+'px';list.style.left=Math.max(12,r.left)+'px';list.style.top=(up?r.top-h-6:r.bottom+6)+'px';list.style.maxHeight=Math.max(100,Math.min(h,up?r.top-12:innerHeight-r.bottom-12))+'px';list.showPopover();trigger.setAttribute('aria-expanded','true');highlight(select.selectedIndex);}
 function commit(i){select.selectedIndex=i;sync();close();select.dispatchEvent(new Event('change',{bubbles:true}));trigger.focus({preventScroll:true});}
 trigger.addEventListener('click',()=>list.matches(':popover-open')?close():open());trigger.addEventListener('keydown',e=>{const isOpen=list.matches(':popover-open');if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();if(!isOpen)open();else highlight(e.key==='Home'?0:e.key==='End'?opts.length-1:active+(e.key==='ArrowDown'?1:-1));}else if(e.key==='Enter'||e.key===' '){e.preventDefault();isOpen?commit(active):open();}else if(e.key==='Escape'&&isOpen){e.preventDefault();e.stopImmediatePropagation();close();}else if(e.key==='Tab')close();});document.addEventListener('pointerdown',e=>{if(!wrap.contains(e.target))close();});document.addEventListener('focusin',e=>{if(!wrap.contains(e.target))close();});window.addEventListener('resize',close);document.addEventListener('scroll',e=>{if(!list.contains(e.target))close();},true);select.addEventListener('change',sync);sync();});}
 // Branded rolling labels are visual duplicates only; their accessible name stays singular.
 all('.btn,.text-link').forEach(el=>{if(el.querySelector('.roll-label'))return;const nodes=[...el.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());if(!nodes.length)return;const text=nodes.map(n=>n.textContent).join('').trim(),label=document.createElement('span'),first=document.createElement('span'),second=document.createElement('span');label.className='roll-label';first.className='roll-primary';second.className='roll-secondary';second.setAttribute('aria-hidden','true');first.textContent=second.textContent=text;label.append(first,second);nodes[0].before(label);nodes.forEach(n=>n.remove());});
 const headingObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('heading-entered');headingObserver.unobserve(entry.target);}}),{threshold:.12});
 all('[data-heading]').forEach(heading=>{const original=heading.cloneNode(true);all('br',original).forEach(br=>br.replaceWith(' '));heading.setAttribute('aria-label',original.textContent.replace(/\s+/g,' ').trim());const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);let order=0;nodes.forEach(node=>{const f=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim()){f.append(document.createTextNode(word));return;}const mask=document.createElement('span'),inner=document.createElement('span');mask.className='motion-word';mask.setAttribute('aria-hidden','true');mask.style.setProperty('--word-order',Math.min(order++,5));inner.className='motion-inner';inner.textContent=word;mask.append(inner);f.append(mask);});node.replaceWith(f);});headingObserver.observe(heading);});
 const photoObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){if(!reduced.matches)entry.target.classList.add('photo-entered');photoObserver.unobserve(entry.target);}}),{threshold:.15});all('.project-photo img,.news-card img,.team-photo>img').forEach(img=>photoObserver.observe(img));
 const photo=document.querySelector('.hero-photo');let scheduled=false;
 function updatePhoto(){scheduled=false;if(reduced.matches||!matchMedia('(min-width:1001px) and (pointer:fine)').matches){photo.style.removeProperty('--photo-shift');return;}const r=document.querySelector('.hero-main').getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;photo.style.setProperty('--photo-shift',Math.max(-12,Math.min(12,-r.top*.025))+'px');}
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updatePhoto);}},{passive:true});addEventListener('resize',updatePhoto);reduced.addEventListener('change',updatePhoto);
})();
