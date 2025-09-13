async function cargarPublicaciones() {
  const resp = await fetch("publicaciones.json");
  const data = await resp.json();

  const menu = document.getElementById("menu");
  const contenido = document.getElementById("contenido");

  // Crear menú dinámico
  let htmlMenu = "<ul>";
  data.secciones.forEach(sec => {
    htmlMenu += `<li onclick="mostrarSeccion('${sec.id}')">${sec.nombre}</li>`;
  });
  htmlMenu += "</ul>";
  menu.innerHTML = htmlMenu;

  // Función para mostrar publicaciones
  window.mostrarSeccion = (id) => {
    const seccion = data.secciones.find(s => s.id === id);
    contenido.innerHTML = `<h2>${seccion.nombre}</h2>`;
    const pubs = data.publicaciones.filter(p => p.seccionId === id);
    if (pubs.length === 0) {
      contenido.innerHTML += `<p>No hay publicaciones en esta sección.</p>`;
    }
    pubs.forEach(pub => {
      contenido.innerHTML += `<div class='pub'><h3>${pub.titulo}</h3>${pub.contenido}</div>`;
    });
  }
}

cargarPublicaciones();
