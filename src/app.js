app.js

import { OPINIONES_INICIALES, validarLogin } from "./core/reservas.js";

const CLAVE_OPINIONES = "gaviotas_opiniones";

function obtenerOpiniones() {
  const guardado = localStorage.getItem(CLAVE_OPINIONES);
  if (guardado) {
    return JSON.parse(guardado);
  }
  localStorage.setItem(CLAVE_OPINIONES, JSON.stringify(OPINIONES_INICIALES));
  return OPINIONES_INICIALES;
}

function mostrarMensaje(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `mensaje mensaje--${tipo}`;
}

function ocultarMensaje(elemento) {
  elemento.textContent = "";
  elemento.className = "mensaje oculto";
}

function mostrarSeccion(idSeccion, idDestacado = idSeccion) {
  document.querySelectorAll(".seccion").forEach((seccion) => {
    seccion.classList.toggle("seccion--activa", seccion.id === idSeccion);
  });

  document.querySelectorAll(".nav__enlace[data-seccion]").forEach((enlace) => {
    enlace.classList.toggle("nav__enlace--activo", enlace.dataset.seccion === idDestacado);
  });

  document.getElementById("menu-principal").classList.remove("nav--abierto");
  document.getElementById("boton-menu").setAttribute("aria-expanded", "false");

  if (idDestacado !== idSeccion) {
    const destino = document.getElementById(idDestacado);
    if (destino) {
      const maximoScroll = document.documentElement.scrollHeight - window.innerHeight;
      const posicion = Math.min(destino.getBoundingClientRect().top + window.scrollY, maximoScroll);
      window.scrollTo({ top: posicion, behavior: "smooth" });
    }
  }
}

function irADestino(id) {
  const elemento = document.getElementById(id);
  const esSeccionPrincipal = elemento?.classList.contains("seccion");
  mostrarSeccion(esSeccionPrincipal ? id : "inicio", id);

  if (id === "inicio") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function inicializarNavegacion() {
  document.querySelectorAll("[data-seccion]").forEach((elemento) => {
    elemento.addEventListener("click", (evento) => {
      evento.preventDefault();
      irADestino(elemento.dataset.seccion);
    });
  });

  const botonMenu = document.getElementById("boton-menu");
  const menuPrincipal = document.getElementById("menu-principal");
  botonMenu.addEventListener("click", () => {
    const abierto = menuPrincipal.classList.toggle("nav--abierto");
    botonMenu.setAttribute("aria-expanded", String(abierto));
  });
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

function inicializarLogin() {
  const formulario = document.getElementById("formulario-login");
  const mensaje = document.getElementById("mensaje-login");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const usuario = formulario.usuario.value.trim();
    const contrasena = formulario.contrasena.value;

    const resultado = validarLogin(usuario, contrasena);

    if (!resultado.valido) {
      mostrarMensaje(mensaje, resultado.mensaje, "error");
      return;
    }

    formulario.reset();
    mostrarMensaje(mensaje, resultado.mensaje, "exito");
  });
}

function inicializar() {
  inicializarNavegacion();
  inicializarLogin();
  renderizarOpiniones();
  mostrarSeccion("inicio");
}

inicializar();

