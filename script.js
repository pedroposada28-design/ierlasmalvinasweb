// script.js (módulo simple, compatible con GitHub Pages)
const contentPath = 'contenido.json';
let CONTENT = null;

// helpers
const $ = id => document.getElementById(id);
const q = s => document.querySelector(s);

// carga JSON
async function loadContent(){
  const r = await fetch(contentPath + '?t=' + Date.now());
  CONTENT = await r.json();
  renderSite();
}

// crear menú dinámico con secciones y subsecciones
function renderMenu(){
  const nav = document.getElementById('site-nav');
  nav.innerHTML = ''; // limpio
  const ul = document.createElement('ul');

  (CONTENT.sections || []).forEach(section => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + section.id;
    a.textContent = section.name;
    li.appendChild(a);

    // subsecciones
    if(section.children && section.children.length){
      const sub = document.createElement('div');
      sub.className = 'submenu';
      section.children.forEach(ch => {
        const ca = document.createElement('a');
        ca.href = '#' + ch.id;
        ca.textContent = ch.name;
        ca.onclick = (e)=>{ /* nothing */ };
        sub.appendChild(ca);
      });
      li.appendChild(sub);
    }
    ul.appendChild(li);
  });

  nav.appendChild(ul);
}

// render hero (inicio)
function renderHero(){
  const heroTitle = CONTENT.hero?.title || 'IER Las Malvinas';
  const heroSub = CONTENT.hero?.subtitle || '';
  const heroImg = CONTENT.hero?.image || 'img/portada.jpg';

  $('hero-title').textContent = heroTitle;
  $('hero-sub').textContent = heroSub;
  const img = $('hero-img');
  img.src = heroImg;
}

// mostrar sección identificada por id
function showSection(id){
  // find section or subsection
  const section = (CONTENT.sections || []).find(s => s.id === id)
                || (CONTENT.sections || []).flatMap(s => s.children || []).find(c=>c.id===id);

  const main = $('section-content');
  main.innerHTML = '';
  if(!section){
    // fallback: if id corresponds to content key
    if(CONTENT.content && CONTENT.content[id]){
      renderContentList(id, CONTENT.content[id], main, section?.name || id);
      return;
    }
    main.innerHTML = '<h2>Sección no encontrada</h2>';
    return;
  }

  // title
  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = section.name;
  main.appendChild(title);

  // if there is text blocks in CONTENT.content[section.id]
  const items = (CONTENT.content && CONTENT.content[section.id]) || [];
  if(items.length === 0){
    const p = document.createElement('p');
    p.className = 'lead';
    p.textContent = 'No hay publicaciones en esta sección.';
    main.appendChild(p);
    return;
  }
  renderContentList(section.id, items, main, section.name);
}

// render lista de publicaciones (cards)
function renderContentList(sectionId, items, container, title){
  // header already added by caller
  const grid = document.createElement('div');
  grid.className = 'cards';

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-aos','fade-up');

    // imagen / video preview
    if(item.image){
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.title || '';
      card.appendChild(img);
    } else if(item.video){
      // embed responsive via iframe
      const iframe = document.createElement('div');
      iframe.style = 'position:relative;padding-top:56.25%';
      const f = document.createElement('iframe');
      f.src = item.video;
      f.style = 'position:absolute;top:0;left:0;width:100%;height:100%';
      f.frameBorder = 0;
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.appendChild(f);
      card.appendChild(iframe);
    }

    // content
    const h3 = document.createElement('h3');
    h3.textContent = item.title || '';
    card.appendChild(h3);

    if(item.date){
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = item.date;
      card.appendChild(meta);
    }

    const p = document.createElement('div');
    p.innerHTML = item.text || '';
    card.appendChild(p);

    // audio
    if(item.audio){
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = item.audio;
      audio.style.width = '100%';
      card.appendChild(audio);
    }

    // enlace externo
    if(item.link){
      const a = document.createElement('p');
      a.innerHTML = `<a href="${item.link}" target="_blank" rel="noopener">Ver más</a>`;
      card.appendChild(a);
    }

    // boton ver detalle (abre modal)
    const btn = document.createElement('button');
    btn.textContent = 'Ver nota';
    btn.style = 'margin-top:10px;padding:8px 10px;border-radius:8px;border:0;background:var(--primary);color:#fff;cursor:pointer';
    btn.onclick = ()=> openModal(item);
    card.appendChild(btn);

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

// modal
function openModal(item){
  const modal = $('modal');
  const body = $('modal-body');
  body.innerHTML = `<h3>${item.title || ''}</h3>
    <p style="color:var(--muted)">${item.date || ''}</p>
    ${item.image ? `<img src="${item.image}" style="max-width:100%;border-radius:8px;margin-bottom:8px">`:''}
    ${item.text ? `<div>${item.text}</div>` : ''}
    ${item.video ? `<div style="position:relative;padding-top:56.25%;margin-top:10px"><iframe src="${item.video}" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0" allowfullscreen></iframe></div>` : ''}
    ${item.audio ? `<audio controls src="${item.audio}" style="width:100%;margin-top:10px"></audio>` : ''}
    ${item.link ? `<p><a href="${item.link}" target="_blank">Abrir enlace</a></p>` : ''}
  `;
  modal.setAttribute('aria-hidden','false');
}

// close modal
function closeModal(){
  const modal = $('modal');
  modal.setAttribute('aria-hidden','true');
  $('modal-body').innerHTML = '';
}

// router: on hash change
function router(){
  const hash = location.hash.replace('#','') || null;
  if(!hash) {
    // default: show hero + latest news
    renderHero();
    renderLanding();
  } else {
    showSection(hash);
  }
}

// landing: show a grid of latest content (combine first items of noticias/events)
function renderLanding(){
  const main = $('section-content');
  main.innerHTML = '';
  const title = document.createElement('h2'); title.className='section-title'; title.textContent='Últimas noticias';
  main.appendChild(title);

  const latest = [];
  const keys = Object.keys(CONTENT.content || {});
  keys.forEach(k => {
    const list = CONTENT.content[k] || [];
    if(list.length) latest.push(...list.slice(0,2));
  });

  if(latest.length === 0){
    main.innerHTML += `<p class="lead">No hay noticias aún.</p>`;
    return;
  }
  renderContentList('latest', latest, main, 'Últimas noticias');
}

// build everything and start router
function renderSite(){
  renderMenu();
  renderHero();
  router();
}

// events
window.addEventListener('hashchange', router);
window.addEventListener('load', loadContent);
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal').addEventListener('click', (e)=> {
  if(e.target === document.getElementById('modal')) closeModal();
});

// hamburger toggle for mobile
document.getElementById('btn-menu').addEventListener('click', ()=>{
  const nav = document.querySelector('.main-nav');
  if(nav.style.display === 'block') nav.style.display = '';
  else nav.style.display = 'block';
});
