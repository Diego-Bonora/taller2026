import { OPINIONES_INICIALES, validarLogin } from "./core/reservas.js";

const CLAVE_RESERVAS = "gaviotas_reservas";
const CLAVE_OPINIONES = "gaviotas_opiniones";

let esAdmin = false;
let idReservaAEliminar = null;

function obtenerReservas() {
  const guardado = localStorage.getItem(CLAVE_RESERVAS);
  return guardado ? JSON.parse(guardado) : [];
}

function guardarReservas(reservas) {
  localStorage.setItem(CLAVE_RESERVAS, JSON.stringify(reservas));
}

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

  if (idSeccion === "admin-reservas") {
    renderizarListadoReservas();
  }

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

function actualizarVisibilidadAdmin() {
  document.getElementById("nav-acceso-admin").parentElement.classList.toggle("oculto", esAdmin);
  document.querySelectorAll(".nav__solo-admin").forEach((elemento) => {
    elemento.classList.toggle("oculto", !esAdmin);
  });
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

    esAdmin = true;
    actualizarVisibilidadAdmin();
    formulario.reset();
    ocultarMensaje(mensaje);
    mostrarSeccion("admin-reservas");
  });

  document.getElementById("boton-cerrar-sesion").addEventListener("click", () => {
    esAdmin = false;
    actualizarVisibilidadAdmin();
    mostrarSeccion("inicio");
  });
}

function renderizarListadoReservas() {
  const contenedor = document.getElementById("lista-reservas");
  const reservas = obtenerReservas();

  if (reservas.length === 0) {
    contenedor.innerHTML = "<p>No hay reservas registradas.</p>";
    return;
  }

  contenedor.innerHTML = reservas
    .map(
      (reserva) => `
        <article class="reserva-tarjeta">
          <p><strong>Cliente:</strong> ${reserva.nombre} ${reserva.apellido}</p>
          <p><strong>Teléfono:</strong> ${reserva.telefono}</p>
          <p><strong>E-mail:</strong> ${reserva.email}</p>
          <p><strong>Habitación:</strong> ${reserva.tipoHabitacion}</p>
          <p><strong>Huéspedes:</strong> ${reserva.cantidadHuespedes}</p>
          <p><strong>Fechas:</strong> ${reserva.fechaEntrada} — ${reserva.fechaSalida}</p>
          <div class="reserva-tarjeta__acciones">
            <button type="button" class="boton boton--secundario" data-accion="eliminar" data-id="${reserva.id}">
              Eliminar Reserva
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function abrirModalCancelacion(id) {
  idReservaAEliminar = id;
  document.getElementById("modal-cancelacion").classList.remove("oculto");
}

function cerrarModalCancelacion() {
  idReservaAEliminar = null;
  document.getElementById("modal-cancelacion").classList.add("oculto");
}

function inicializarListadoReservas() {
  document.getElementById("lista-reservas").addEventListener("click", (evento) => {
    const boton = evento.target.closest('[data-accion="eliminar"]');
    if (!boton) return;
    abrirModalCancelacion(boton.dataset.id);
  });

  document.getElementById("modal-cancelar").addEventListener("click", cerrarModalCancelacion);

  document.getElementById("modal-confirmar").addEventListener("click", () => {
    const reservas = obtenerReservas().filter((reserva) => reserva.id !== idReservaAEliminar);
    guardarReservas(reservas);
    cerrarModalCancelacion();
    renderizarListadoReservas();

    const mensajeAdmin = document.getElementById("mensaje-admin");
    mostrarMensaje(mensajeAdmin, "Reserva cancelada con éxito.", "exito");
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

function inicializar() {
  inicializarNavegacion();
  actualizarVisibilidadAdmin();
  inicializarLogin();
  inicializarListadoReservas();
  renderizarOpiniones();
  mostrarSeccion("inicio");
}

inicializar();

