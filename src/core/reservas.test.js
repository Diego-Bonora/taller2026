const { validarReserva } = require("./reservas.js");

function formatFecha(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

function sumarDias(base, dias) {
  const fecha = new Date(base);
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}

const hoy = new Date();
const maniana = sumarDias(hoy, 1);
const ayer = sumarDias(hoy, -1);

function datosValidos(overrides = {}) {
  return {
    nombre: "Ana",
    apellido: "Pérez",
    telefono: "099123456",
    email: "ana@example.com",
    tipoHabitacion: "standard",
    cantidadHuespedes: 2,
    fechaEntrada: formatFecha(maniana),
    fechaSalida: formatFecha(sumarDias(maniana, 2)),
    ...overrides,
  };
}

describe("validarReserva - caso base", () => {
  test("una reserva con todos los datos correctos es válida", () => {
    const resultado = validarReserva(datosValidos());
    expect(resultado.valido).toBe(true);
    expect(resultado.errores).toEqual([]);
  });

  test("sin datos, se reportan todos los campos obligatorios", () => {
    const resultado = validarReserva({});
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toEqual(
      expect.arrayContaining([
        "El nombre es obligatorio.",
        "El apellido es obligatorio.",
        "El teléfono es obligatorio.",
        "El e-mail es obligatorio.",
        "El tipo de habitación es obligatorio.",
        "La cantidad de huéspedes es obligatoria.",
        "La fecha de entrada es obligatoria.",
        "La fecha de salida es obligatoria.",
      ])
    );
  });
});

describe("validarReserva - formato de contacto", () => {
  test("rechaza un teléfono con formato inválido", () => {
    const resultado = validarReserva(datosValidos({ telefono: "abc" }));
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain(
      "El teléfono debe ser un celular uruguayo válido (ej: 099123456)."
    );
  });

  test.each([
    "099123456",
    "99123456",
    "099 123 456",
  ])("acepta el celular uruguayo válido %s", (telefono) => {
    const resultado = validarReserva(datosValidos({ telefono }));
    expect(resultado.valido).toBe(true);
  });

  test.each([
    "26001234",
    "022345678",
    "0991234",
    "0991234567",
    "+59899123456",
    "+541112345678",
  ])("rechaza el teléfono inválido para Uruguay %s", (telefono) => {
    const resultado = validarReserva(datosValidos({ telefono }));
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain(
      "El teléfono debe ser un celular uruguayo válido (ej: 099123456)."
    );
  });

  test("rechaza un e-mail sin arroba", () => {
    const resultado = validarReserva(datosValidos({ email: "sinarroba.com" }));
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain(
      "El e-mail no tiene un formato válido."
    );
  });
});

describe("validarReserva - fechas", () => {
  test("rechaza cuando la fecha de salida es anterior a la de entrada", () => {
    const resultado = validarReserva(
      datosValidos({
        fechaEntrada: formatFecha(sumarDias(maniana, 2)),
        fechaSalida: formatFecha(maniana),
      })
    );
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain(
      "La fecha de entrada no puede ser posterior o igual a la fecha de salida."
    );
  });

  test("rechaza cuando la fecha de entrada es igual a la de salida", () => {
    const resultado = validarReserva(
      datosValidos({
        fechaEntrada: formatFecha(maniana),
        fechaSalida: formatFecha(maniana),
      })
    );
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain(
      "La fecha de entrada no puede ser posterior o igual a la fecha de salida."
    );
  });

  test("rechaza una fecha de entrada anterior a hoy", () => {
    const resultado = validarReserva(
      datosValidos({
        fechaEntrada: formatFecha(ayer),
        fechaSalida: formatFecha(maniana),
      })
    );
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain(
      "La fecha de entrada no puede ser anterior a la fecha actual."
    );
  });

  test("rechaza una reserva de más de 31 días", () => {
    const resultado = validarReserva(
      datosValidos({
        fechaEntrada: formatFecha(maniana),
        fechaSalida: formatFecha(sumarDias(maniana, 32)),
      })
    );
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain(
      "La cantidad máxima de días de reserva no puede superar un mes."
    );
  });
});
