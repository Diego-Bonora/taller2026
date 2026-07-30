function eliminarReservaPorId(reservas, id) {
  return reservas.filter((reserva) => reserva.id !== id);
}

if (typeof module !== "undefined") {
  module.exports = { eliminarReservaPorId };
}
