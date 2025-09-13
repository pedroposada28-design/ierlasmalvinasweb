function showSection(id){
  const main = $('section-content');
  main.innerHTML = '';

  // Mostrar solo banner en inicio
  if(id==='inicio'){
    $('hero').innerHTML = `
      <div class="hero-inner">
        <img src="${CONTENT.content.inicio[0].image}" alt="Bienvenidos">
      </div>
    `;
    // Limpiar contenido principal para que no aparezca nada debajo
    main.innerHTML = '';
    return;
  } else {
    // Limpiar banner si no es inicio
    $('hero').innerHTML = '';
  }

  // Mostrar contenido de otras secciones
  const section = (CONTENT.sections || []).find(s=>s.id===id)
    || (CONTENT.sections||[]).flatMap(s=>s.children||[]).find(c=>c.id===id);

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
