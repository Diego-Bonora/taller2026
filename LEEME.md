# Paso 07 — Jeremias — HU-10: Sección de galería de fotos

## Qué agrega
- `index.html`: bloque `#galeria` dentro de `#inicio` (6 imágenes), tab
  "Galería" en el nav.
- `styles.css`: grid básico de 2 columnas para la galería.
- `src/app.js` / `src/core/reservas.js`: sin cambios (es HTML/CSS puro).

## Cómo subirlo (segundo commit de Jeremias, sin pushear todavía)

```bash
cd /ruta/a/taller2026
cp /Users/diegobonora/ORT/entrega-incremental-gaviotas/pasos/07-jeremias-hu10-galeria/index.html .
cp /Users/diegobonora/ORT/entrega-incremental-gaviotas/pasos/07-jeremias-hu10-galeria/styles.css .
cp /Users/diegobonora/ORT/entrega-incremental-gaviotas/pasos/07-jeremias-hu10-galeria/src/app.js src/app.js
cp /Users/diegobonora/ORT/entrega-incremental-gaviotas/pasos/07-jeremias-hu10-galeria/src/core/reservas.js src/core/reservas.js

git status
git add index.html styles.css src/app.js src/core/reservas.js
git commit -m "HU-10: Sección de galería de fotos"
```

Seguí con el paso 08 y recién ahí hacé `git push`.
