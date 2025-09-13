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
    const a = document.createElement('a');
    a.href = '#' + section.id;
    a.textContent = section.name;
    li.appendChild(a);

    if(section.children && section.children.length){
      const sub = document.createElement('div');
      sub.className = 'submenu';
      section.children.forEach(ch => {
        const ca = document.createElement('a');
        ca.href = '#' + ch.id;
        ca.textContent = ch.name;
        sub.appendChild(ca);
      });
      li.appendChild(sub);
      li.addEventListener('mouseover',()=>{sub.style.display='block';});
      li.addEventListener('mouseout',()=>{sub.style.display='none';});
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
    div.innerHTML=`<img src="${slide.image}" alt="${slide.title}">`;
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
  const section = (CONTENT.sections || []).find(s=>s.id===id)
    || (CONTENT.sections||[]).flatMap(s=>s.children||[]).find(c=>c.id===id);

  const main = $('section-content');
  main.innerHTML = '';

  if(!section){
    main.innerHTML='<h2>Sección no encontrada</h2>'; return;
  }

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
