import { OPINIONES_INICIALES } from "./core/reservas.js";

const CLAVE_OPINIONES = "gaviotas_opiniones";

function obtenerOpiniones() {
  const guardado = localStorage.getItem(CLAVE_OPINIONES);
  if (guardado) {
    return JSON.parse(guardado);
  }
  localStorage.setItem(CLAVE_OPINIONES, JSON.stringify(OPINIONES_INICIALES));
  return OPINIONES_INICIALES;
}

function renderizarOpiniones() {
  const contenedor = document.getElementById("lista-opiniones");
  const opiniones = obtenerOpiniones();

  contenedor.innerHTML = opiniones
    .map(
      (opinion) => `
        <li class="opinion">
          <p class="opinion__estrellas">${"★".repeat(opinion.estrellas)}${"☆".repeat(5 - opinion.estrellas)} (${opinion.estrellas}/5)</p>
          <p class="opinion__nombre">${opinion.nombre}</p>
          <p class="opinion__comentario">"${opinion.comentario}"</p>
        </li>
      `
    )
    .join("");
}

function inicializar() {
  renderizarOpiniones();
}

inicializar();
