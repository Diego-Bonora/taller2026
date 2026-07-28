# Paso 06 — Jeremias — HU-08: Sección de Formulario de reserva

## Qué agrega
- `index.html`: sección `#reservar` con el formulario completo, tab "Reservar"
  en el nav.
- `src/core/reservas.js`: `CATALOGO_HABITACIONES` (4 tipos con precio) y
  `validarReserva()` con todas las reglas de la CA#5 (obligatorios, formato de
  teléfono/e-mail, fechas, huéspedes 1-3, disponibilidad).
- `src/app.js`: `poblarSelectHabitaciones()`, `inicializarFormularioReserva()`,
  `renderizarResumenReserva()`. De paso, `renderizarListadoReservas()` (que
  Bruno dejó mostrando el tipo de habitación "en crudo") ahora sí resuelve el
  nombre real del tipo usando el catálogo — antes no podía porque el catálogo
  no existía.
- `styles.css`: estilos básicos del formulario y del resumen de reserva.

## Antes de empezar

```bash
cd /ruta/a/taller2026
git pull
```

## Cómo subirlo

```bash
cp /Users/diegobonora/ORT/entrega-incremental-gaviotas/pasos/06-jeremias-hu08-formulario-reserva/index.html .
cp /Users/diegobonora/ORT/entrega-incremental-gaviotas/pasos/06-jeremias-hu08-formulario-reserva/styles.css .
cp /Users/diegobonora/ORT/entrega-incremental-gaviotas/pasos/06-jeremias-hu08-formulario-reserva/src/app.js src/app.js
cp /Users/diegobonora/ORT/entrega-incremental-gaviotas/pasos/06-jeremias-hu08-formulario-reserva/src/core/reservas.js src/core/reservas.js

git status
git add index.html styles.css src/app.js src/core/reservas.js
git commit -m "HU-08: Sección de Formulario de reserva"
```

No pushees todavía — seguí con los pasos 07 y 08 y recién ahí hacé `git push`.
