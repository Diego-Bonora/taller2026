import {
  CATALOGO_HABITACIONES,
  OPINIONES_INICIALES,
  validarLogin,
  validarReserva,
} from "./core/reservas.js";

const CLAVE_RESERVAS = "gaviotas_reservas";
const CLAVE_OPINIONES = "gaviotas_opiniones";

let esAdmin = false;
let idReservaAEliminar = null;

function generarId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `reserva-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

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

function buscarHabitacion(id) {
  return CATALOGO_HABITACIONES.find((habitacion) => habitacion.id === id);
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

function poblarSelectHabitaciones() {
  const select = document.getElementById("reserva-tipo-habitacion");
  CATALOGO_HABITACIONES.forEach((habitacion) => {
    const opcion = document.createElement("option");
    opcion.value = habitacion.id;
    opcion.textContent = `${habitacion.tipo} — ${habitacion.precio} USD/noche`;
    select.appendChild(opcion);
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

function renderizarResumenReserva(reserva, habitacion) {
  const contenedor = document.getElementById("resumen-reserva");

  contenedor.innerHTML = `
    <h3>Resumen de tu reserva</h3>
    <dl>
      <dt>Huésped</dt><dd>${reserva.nombre} ${reserva.apellido}</dd>
      <dt>Teléfono</dt><dd>${reserva.telefono}</dd>
      <dt>E-mail</dt><dd>${reserva.email}</dd>
      <dt>Tipo de habitación</dt><dd>${habitacion.tipo} (${habitacion.precio} USD/noche)</dd>
      <dt>Huéspedes</dt><dd>${reserva.cantidadHuespedes}</dd>
      <dt>Fecha de entrada</dt><dd>${reserva.fechaEntrada}</dd>
      <dt>Fecha de salida</dt><dd>${reserva.fechaSalida}</dd>
      ${reserva.serviciosAdicionales ? `<dt>Servicios adicionales</dt><dd>${reserva.serviciosAdicionales}</dd>` : ""}
      ${reserva.comentariosAdicionales ? `<dt>Comentarios</dt><dd>${reserva.comentariosAdicionales}</dd>` : ""}
    </dl>
  `;
  contenedor.classList.remove("oculto");
}

function inicializarFormularioReserva() {
  const formulario = document.getElementById("formulario-reserva");
  const mensaje = document.getElementById("mensaje-reserva");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const datos = {
      nombre: formulario.nombre.value.trim(),
      apellido: formulario.apellido.value.trim(),
      telefono: formulario.telefono.value.trim(),
      email: formulario.email.value.trim(),
      tipoHabitacion: formulario.tipoHabitacion.value,
      cantidadHuespedes: formulario.cantidadHuespedes.value,
      fechaEntrada: formulario.fechaEntrada.value,
      fechaSalida: formulario.fechaSalida.value,
      serviciosAdicionales: formulario.serviciosAdicionales.value.trim(),
      comentariosAdicionales: formulario.comentariosAdicionales.value.trim(),
    };

    const reservasExistentes = obtenerReservas();
    const resultado = validarReserva(datos, reservasExistentes);

    if (!resultado.valido) {
      mostrarMensaje(mensaje, resultado.errores.join(" "), "error");
      document.getElementById("resumen-reserva").classList.add("oculto");
      return;
    }

    const nuevaReserva = { id: generarId(), ...datos };
    guardarReservas([...reservasExistentes, nuevaReserva]);

    mostrarMensaje(mensaje, "¡Reserva confirmada con éxito!", "exito");
    renderizarResumenReserva(nuevaReserva, buscarHabitacion(datos.tipoHabitacion));
    formulario.reset();

    if (esAdmin) {
      renderizarListadoReservas();
    }
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
    .map((reserva) => {
      const habitacion = buscarHabitacion(reserva.tipoHabitacion);
      return `
        <article class="reserva-tarjeta">
          <p><strong>Cliente:</strong> ${reserva.nombre} ${reserva.apellido}</p>
          <p><strong>Teléfono:</strong> ${reserva.telefono}</p>
          <p><strong>E-mail:</strong> ${reserva.email}</p>
          <p><strong>Habitación:</strong> ${habitacion ? habitacion.tipo : reserva.tipoHabitacion}</p>
          <p><strong>Huéspedes:</strong> ${reserva.cantidadHuespedes}</p>
          <p><strong>Fechas:</strong> ${reserva.fechaEntrada} — ${reserva.fechaSalida}</p>
          <div class="reserva-tarjeta__acciones">
            <button type="button" class="boton boton--secundario" data-accion="eliminar" data-id="${reserva.id}">
              Eliminar Reserva
            </button>
          </div>
        </article>
      `;
    })
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
  poblarSelectHabitaciones();
  inicializarLogin();
  inicializarFormularioReserva();
  inicializarListadoReservas();
  renderizarOpiniones();
  mostrarSeccion("inicio");
}

inicializar();
