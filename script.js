const $ = id => document.getElementById(id);
let CONTENT = null;

async function loadContent(){
  const r = await fetch('contenido.json');
  CONTENT = await r.json();
  renderMenu();
  renderSlider();
  router();
}

function renderMenu(){
  const nav = $('site-nav');
  nav.innerHTML = '';
  const ul = document.createElement('ul');

  (CONTENT.sections || []).forEach(section => {
    const li = document.createElement('li');
    li.style.position = 'relative';
    const a = document.createElement('a');
    a.href = '#' + section.id;
    a.textContent = section.name;
    li.appendChild(a);

    // Submenu si hay hijos
    if(section.children && section.children.length){
      const sub = document.createElement('div');
      sub.className = 'submenu';
      sub.style.position = 'absolute';
      sub.style.top = '100%';
      sub.style.left = '0';
      sub.style.background='#fff';
      sub.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';
      sub.style.display='none';
      section.children.forEach(ch => {
        const ca = document.createElement('a');
        ca.href = '#' + ch.id;
        ca.textContent = ch.name;
        ca.style.display='block';
        ca.style.padding='8px 12px';
        ca.style.color='#000';
        ca.style.textDecoration='none';
        ca.addEventListener('mouseover',()=>{ca.style.background='#f0f0f0'});
        ca.addEventListener('mouseout',()=>{ca.style.background='transparent'});
        sub.appendChild(ca);
      });
      li.appendChild(sub);
      // Mostrar submenu al pasar el mouse
      li.addEventListener('mouseover',()=>{sub.style.display='block'});
      li.addEventListener('mouseout',()=>{sub.style.display='none'});
    }

    ul.appendChild(li);
  });

  nav.appendChild(ul);
}

function renderSlider(){
  const container = $('slider-container');
  container.innerHTML = '';
  const slides = (CONTENT.content.noticias || []).slice(0,3);
  slides.forEach(slide=>{
    const div = document.createElement('div');
    div.className='slide';
    div.style.width='100%';
    div.style.transition='transform 0.5s ease';
    div.innerHTML=`<img src="${slide.image}" alt="${slide.title}" style="width:100%; border-radius:12px;">`;
    container.appendChild(div);
  });
  let index=0;
  setInterval(()=>{
    const slidesDOM = document.querySelectorAll('.slide');
    index = (index+1)%slidesDOM.length;
    slidesDOM.forEach((s,i)=>s.style.transform=`translateX(-${index*100}%)`);
  },5000);
}

function showSection(id){
  const hero = document.getElementById('hero');

  if(id==='inicio'){
    hero.style.display = 'block';
    $('section-content').innerHTML = '';
    return;
  } else {
    hero.style.display = 'none';
  }

  const section = (CONTENT.sections || []).find(s=>s.id===id)
    || (CONTENT.sections||[]).flatMap(s=>s.children||[]).find(c=>c.id===id);

  const main = $('section-content');
  main.innerHTML = '';

  if(!section){main.innerHTML='<h2>Sección no encontrada</h2>';return;}

  const title = document.createElement('h2');
  title.className='section-title';
  title.textContent = section.name;
  main.appendChild(title);

  const items = CONTENT.content[section.id] || [];
  if(items.length===0){
    const p = document.createElement('p');
    p.className='lead';
    p.textContent='No hay publicaciones en esta sección.';
    main.appendChild(p);
    return;
  }

  const grid = document.createElement('div');
  grid.className='cards';
  items.forEach(item=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML=`
      ${item.image?`<img src="${item.image}" alt="${item.title}">`:''}
      <h3>${item.title}</h3>
      <div class="meta">${item.date||''} ${item.author?'- '+item.author:''}</div>
      <p>${item.text}</p>
    `;
    grid.appendChild(card);
  });
  main.appendChild(grid);
}

function router(){
  const hash = window.location.hash.replace('#','') || 'inicio';
  showSection(hash);
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', loadContent);
