const USUARIO_ADMIN = "admin";
const CONTRASENA_ADMIN = "hotel";

export const OPINIONES_INICIALES = [
  {
    nombre: "Carlos M.",
    estrellas: 5,
    comentario: "Excelente atención y la habitación impecable. Muy recomendado para ir en familia.",
  },
  {
    nombre: "Lucía R.",
    estrellas: 4,
    comentario: "Muy buen desayuno y excelente ubicación. El personal fue muy amable.",
  },
  {
    nombre: "Martín P.",
    estrellas: 5,
    comentario: "Volvería sin dudas, todo de primera. Las instalaciones están impecables.",
  },
  {
    nombre: "Sofía F.",
    estrellas: 3,
    comentario: "Buena estadía, habitación confortable y muy cerca de los puntos de interés.",
  },
];

export function validarLogin(usuario, contrasena) {
  if (!usuario || !contrasena) {
    return { valido: false, mensaje: "Ingresá usuario y contraseña." };
  }
  if (usuario === USUARIO_ADMIN && contrasena === CONTRASENA_ADMIN) {
    return { valido: true, mensaje: "Inicio de sesión exitoso." };
  }
  return { valido: false, mensaje: "Usuario o contraseña incorrectos." };
}

