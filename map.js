(() => {
 'use strict';
 const host=document.getElementById('project-map');
 if(!host)return;
 const records=JSON.parse(document.getElementById('geography-data').textContent);
 const byId=id=>document.getElementById(id);
 const points=host.querySelector('.map-points'),world=host.querySelector('.map-world');
 const select=byId('map-project-select'),filters=[...document.querySelectorAll('[data-map-filter]')];
 const levels=[1,1.5,2,3,4];
 let visible=records,selected=records.find(p=>p.number===16),zoom=1,panX=0,panY=0;
 let geometry,drag=null,suppressClick=false;
 const countText=n=>n+' '+(n%10===1&&n%100!==11?'проект':n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'проекта':'проектов');
 const position=p=>({x:geometry.cx+(p.x/100-.5)*geometry.bw*zoom+panX,y:geometry.cy+(p.y/100-.5)*geometry.bh*zoom+panY});
 function constrain(){
  if(zoom===1){panX=panY=0;return;}
  const maxX=geometry.bw*(zoom-1)/2+geometry.w*.18,maxY=geometry.bh*(zoom-1)/2+geometry.h*.18;
  panX=Math.max(-maxX,Math.min(maxX,panX));panY=Math.max(-maxY,Math.min(maxY,panY));
 }
 function measure(){
  const w=host.clientWidth,h=host.clientHeight,bw=Math.min(w*.94,(h-76)*1256/670),bh=bw*670/1256;
  geometry={w,h,bw,bh,cx:w/2,cy:60+(h-60)/2};
  Object.assign(world.style,{inset:'auto',width:bw+'px',height:bh+'px',left:(geometry.cx-bw/2)+'px',top:(geometry.cy-bh/2)+'px'});
  constrain();render();
 }
 function render(){
  const focusWasPoint=document.activeElement?.classList.contains('map-point');
  world.style.setProperty('--map-x',panX+'px');world.style.setProperty('--map-y',panY+'px');world.style.setProperty('--map-zoom',zoom);
  const groups=[];
  for(const p of visible){
   const point=position(p);
   if(point.x< -22||point.x>geometry.w+22||point.y< -22||point.y>geometry.h+22)continue;
   let group=groups.find(g=>Math.hypot(g.x-point.x,g.y-point.y)<46);
   if(!group)groups.push({x:point.x,y:point.y,items:[p]});
   else{const n=group.items.length;group.x=(group.x*n+point.x)/(n+1);group.y=(group.y*n+point.y)/(n+1);group.items.push(p);}
  }
  const fragment=document.createDocumentFragment();let focusTarget;
  for(const group of groups){
   const button=document.createElement('button'),multiple=group.items.length>1,active=group.items.includes(selected);
   button.type='button';button.className='map-point'+(multiple?' is-cluster':'');
   button.style.left=group.x+'px';button.style.top=group.y+'px';button.setAttribute('aria-pressed',String(active));
   button.dataset.projects=group.items.map(p=>p.id).join(',');
   const label=multiple?countText(group.items.length)+' рядом. '+(zoom<4?'Увеличить карту.':'Выбрать следующий проект.'):group.items[0].region+': '+group.items[0].title;
   button.setAttribute('aria-label',label);button.title=label;
   if(multiple)button.textContent=group.items.length;
   else{const dot=document.createElement('span');dot.className='point-dot';dot.setAttribute('aria-hidden','true');button.append(dot);}
   button.addEventListener('click',()=>{
    if(suppressClick)return;
    const current=group.items.indexOf(selected);
    const project=multiple&&zoom===4?group.items[(current+1)%group.items.length]:group.items[0];
    selectProject(project,false);
    if(multiple&&zoom<4){
     const next=zoom<2?2:4,baseX=(group.x-geometry.cx-panX)/zoom,baseY=(group.y-geometry.cy-panY)/zoom;
     zoom=next;panX=geometry.w/2-geometry.cx-baseX*zoom;panY=geometry.h/2-geometry.cy-baseY*zoom;constrain();
    }
    render();points.querySelector('[aria-pressed=true]')?.focus({preventScroll:true});
   });
   if(active)focusTarget=button;fragment.append(button);
  }
  points.replaceChildren(fragment);
  if(focusWasPoint)(focusTarget||host).focus({preventScroll:true});
  byId('map-scale').textContent=String(zoom).replace('.',',');
  byId('map-zoom-in').disabled=zoom===4;byId('map-zoom-out').disabled=zoom===1;
  byId('map-help').textContent=zoom===4?'Нажимайте на группу, чтобы переключать близкие проекты, или выберите проект из списка. Карту можно перемещать.':zoom>1?'Нажмите на группу, чтобы приблизить ещё. Перемещайте карту или выбирайте проект из списка.':'Нажмите на группу точек, чтобы приблизить карту. Проект можно выбрать из списка.';
 }
 function selectProject(project,center=true){
  selected=project;select.value=project.id;
  byId('map-preview-region').textContent=project.region;byId('map-preview-measure').textContent=project.unit==='км'?'Протяжённость':'Объём работ';
  byId('map-preview-title').textContent=project.title;
  byId('map-preview-location').textContent=project.location;
  const image=byId('map-preview-image');image.src='assets/'+project.image;image.alt=project.title+' — фотография из материалов ЦБТ';image.loading='eager';
  byId('map-preview-area').replaceChildren(document.createTextNode(project.area));const unit=document.createElement('span');unit.textContent=project.unit;byId('map-preview-area').append(unit);
  byId('map-project-index').textContent=String(visible.indexOf(project)+1).padStart(2,'0')+' / '+String(visible.length).padStart(2,'0');
  if(center&&zoom>1){panX=geometry.w/2-geometry.cx-(project.x/100-.5)*geometry.bw*zoom;panY=geometry.h/2-geometry.cy-(project.y/100-.5)*geometry.bh*zoom;constrain();}
  render();
 }
 function populate(){
  select.replaceChildren(...visible.map(p=>{const option=document.createElement('option');option.value=p.id;option.textContent=String(p.number).padStart(2,'0')+' / '+p.region+' — '+p.title;return option;}));
  byId('map-visible-count').textContent=countText(visible.length);
 }
 function reset(){zoom=1;panX=panY=0;render();}
 function changeZoom(direction){
  const old=zoom,next=levels[Math.max(0,Math.min(levels.length-1,levels.indexOf(zoom)+direction))];
  const x=(geometry.w/2-geometry.cx-panX)/old,y=(geometry.h/2-geometry.cy-panY)/old;
  zoom=next;panX=geometry.w/2-geometry.cx-x*zoom;panY=geometry.h/2-geometry.cy-y*zoom;constrain();render();
 }
 select.addEventListener('change',()=>selectProject(records.find(p=>p.id===select.value)));
 filters.forEach(button=>button.addEventListener('click',()=>{
  const zone=button.dataset.mapFilter;visible=records.filter(p=>zone==='all'||p.zone===zone);
  filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  populate();reset();selectProject(visible.includes(selected)?selected:visible[0],false);
 }));
 byId('map-project-prev').addEventListener('click',()=>selectProject(visible[(visible.indexOf(selected)+visible.length-1)%visible.length]));
 byId('map-project-next').addEventListener('click',()=>selectProject(visible[(visible.indexOf(selected)+1)%visible.length]));
 byId('map-project-detail').addEventListener('click',event=>document.dispatchEvent(new CustomEvent('uav:project-open',{detail:{project:selected,opener:event.currentTarget}})));
 byId('map-zoom-in').addEventListener('click',()=>changeZoom(1));byId('map-zoom-out').addEventListener('click',()=>changeZoom(-1));byId('map-reset').addEventListener('click',reset);
 host.addEventListener('keydown',event=>{
  if(event.target!==host)return;
  if(event.key==='+'||event.key==='='){event.preventDefault();changeZoom(1);}
  else if(event.key==='-'){event.preventDefault();changeZoom(-1);}
  else if(event.key==='Home'){event.preventDefault();reset();}
  else if(zoom>1&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
   event.preventDefault();panX+=event.key==='ArrowLeft'?60:event.key==='ArrowRight'?-60:0;panY+=event.key==='ArrowUp'?60:event.key==='ArrowDown'?-60:0;constrain();render();
  }
 });
 host.addEventListener('pointerdown',event=>{
  if(event.target.closest('button')||zoom===1||!event.isPrimary||event.button!==0)return;
  drag={id:event.pointerId,x:event.clientX,y:event.clientY,panX,panY,moved:false};host.setPointerCapture(event.pointerId);
 });
 host.addEventListener('pointermove',event=>{
  if(!drag||drag.id!==event.pointerId)return;
  const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(Math.hypot(dx,dy)>5)drag.moved=true;
  if(drag.moved){host.classList.add('is-dragging');panX=drag.panX+dx;panY=drag.panY+dy;constrain();render();}
 });
 const endDrag=()=>{if(drag?.moved){suppressClick=true;setTimeout(()=>suppressClick=false,0);}drag=null;host.classList.remove('is-dragging');};
 host.addEventListener('pointerup',endDrag);host.addEventListener('pointercancel',endDrag);
 new ResizeObserver(measure).observe(host);
 populate();measure();selectProject(selected,false);
})();
