export function eliminarReservaPorId(reservas, id) {
  return reservas.filter((reserva) => reserva.id !== id);
}
