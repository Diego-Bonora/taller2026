const MAX_HUESPEDES = 3;
const MIN_HUESPEDES = 1;
const MAX_DIAS_RESERVA = 31;
const UNIDADES_POR_TIPO = 5;

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONO_CELULAR_UY = /^0?9\d{7}$/;

const CATALOGO_HABITACIONES = [
  { id: "standard", tipo: "Standard", precio: 100, unidadesTotales: UNIDADES_POR_TIPO },
  { id: "premium", tipo: "Premium", precio: 110, unidadesTotales: UNIDADES_POR_TIPO },
  { id: "luxury", tipo: "Luxury", precio: 120, unidadesTotales: UNIDADES_POR_TIPO },
  { id: "presidencial", tipo: "Presidencial", precio: 130, unidadesTotales: UNIDADES_POR_TIPO },
];

function fechaValida(valor) {
  if (!valor) return null;
  const fecha = new Date(`${valor}T00:00:00`);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

function hoySinHora() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy;
}

function rangosSuperpuestos(entradaA, salidaA, entradaB, salidaB) {
  return entradaA < salidaB && entradaB < salidaA;
}

function buscarHabitacion(tipoHabitacionId) {
  return CATALOGO_HABITACIONES.find((habitacion) => habitacion.id === tipoHabitacionId);
}

function esCelularUruguayoValido(telefono) {
  const normalizado = telefono.replace(/[\s-]/g, "");
  return REGEX_TELEFONO_CELULAR_UY.test(normalizado);
}

function validarReserva(datos, reservasExistentes = []) {
  const errores = [];
  const {
    nombre,
    apellido,
    telefono,
    email,
    tipoHabitacion,
    cantidadHuespedes,
    fechaEntrada,
    fechaSalida,
  } = datos || {};

  if (!nombre) errores.push("El nombre es obligatorio.");
  if (!apellido) errores.push("El apellido es obligatorio.");
  if (!telefono) errores.push("El teléfono es obligatorio.");
  if (!email) errores.push("El e-mail es obligatorio.");
  if (!tipoHabitacion) errores.push("El tipo de habitación es obligatorio.");
  if (cantidadHuespedes === undefined || cantidadHuespedes === null || cantidadHuespedes === "") {
    errores.push("La cantidad de huéspedes es obligatoria.");
  }
  if (!fechaEntrada) errores.push("La fecha de entrada es obligatoria.");
  if (!fechaSalida) errores.push("La fecha de salida es obligatoria.");

  if (telefono && !esCelularUruguayoValido(telefono)) {
    errores.push("El teléfono debe ser un celular uruguayo válido (ej: 099123456).");
  }
  if (email && !REGEX_EMAIL.test(email)) {
    errores.push("El e-mail no tiene un formato válido.");
  }

  const habitacion = tipoHabitacion ? buscarHabitacion(tipoHabitacion) : undefined;
  if (tipoHabitacion && !habitacion) {
    errores.push("El tipo de habitación seleccionado no existe.");
  }

  const cantidad = Number(cantidadHuespedes);
  if (cantidadHuespedes !== undefined && cantidadHuespedes !== null && cantidadHuespedes !== "") {
    if (!Number.isInteger(cantidad) || cantidad < MIN_HUESPEDES || cantidad > MAX_HUESPEDES) {
      errores.push(`La cantidad de huéspedes debe ser un número entero entre ${MIN_HUESPEDES} y ${MAX_HUESPEDES}.`);
    }
  }

  const entrada = fechaValida(fechaEntrada);
  const salida = fechaValida(fechaSalida);

  if (fechaEntrada && !entrada) errores.push("La fecha de entrada no es válida.");
  if (fechaSalida && !salida) errores.push("La fecha de salida no es válida.");

  if (entrada && salida) {
    if (entrada >= salida) {
      errores.push("La fecha de entrada no puede ser posterior o igual a la fecha de salida.");
    }

    if (entrada < hoySinHora()) {
      errores.push("La fecha de entrada no puede ser anterior a la fecha actual.");
    }

    const duracionDias = (salida - entrada) / (1000 * 60 * 60 * 24);
    if (duracionDias > MAX_DIAS_RESERVA) {
      errores.push("La cantidad máxima de días de reserva no puede superar un mes.");
    }

    if (habitacion) {
      const superpuestas = reservasExistentes.filter((reserva) => {
        if (reserva.tipoHabitacion !== tipoHabitacion) return false;
        const entradaExistente = fechaValida(reserva.fechaEntrada);
        const salidaExistente = fechaValida(reserva.fechaSalida);
        if (!entradaExistente || !salidaExistente) return false;
        return rangosSuperpuestos(entrada, salida, entradaExistente, salidaExistente);
      });

      if (superpuestas.length >= habitacion.unidadesTotales) {
        errores.push("No hay disponibilidad de esa habitación para las fechas seleccionadas.");
      }
    }
  }

  return { valido: errores.length === 0, errores };
}

if (typeof module !== "undefined") {
  module.exports = { CATALOGO_HABITACIONES, buscarHabitacion, validarReserva };
}
