async function mostrarSeccion(seccion) {
  const respuesta = await fetch("publicaciones.json");
  const datos = await respuesta.json();

  const publicaciones = datos[seccion] || [];
  const contenedor = document.getElementById("contenido");

  contenedor.innerHTML = `<h2>${seccion.toUpperCase()}</h2>`;

  if (publicaciones.length === 0) {
    contenedor.innerHTML += "<p>No hay publicaciones en esta sección.</p>";
  } else {
    publicaciones.forEach(pub => {
      contenedor.innerHTML += `
        <div class="publicacion">
          <h3>${pub.titulo}</h3>
          <p><em>${pub.fecha}</em></p>
          <p>${pub.texto}</p>
          ${pub.imagen ? `<img src="${pub.imagen}" alt="Imagen" style="max-width:100%">` : ""}
          ${pub.video ? `<iframe src="${pub.video}" width="100%" height="300"></iframe>` : ""}
          ${pub.audio ? `<audio controls src="${pub.audio}"></audio>` : ""}
          ${pub.enlace ? `<p><a href="${pub.enlace}" target="_blank">Ver más</a></p>` : ""}
        </div>
      `;
    });
  }
}
