const USUARIO_ADMIN = "admin";
const CONTRASENA_ADMIN = "hotel";

function validarLogin(usuario, contrasena) {
  if (!usuario || !contrasena) {
    return { valido: false, mensaje: "Ingresá usuario y contraseña." };
  }
  if (usuario === USUARIO_ADMIN && contrasena === CONTRASENA_ADMIN) {
    return { valido: true, mensaje: "Inicio de sesión exitoso." };
  }
  return { valido: false, mensaje: "Usuario o contraseña incorrectos." };
}

if (typeof module !== "undefined") {
  module.exports = { validarLogin };
}
