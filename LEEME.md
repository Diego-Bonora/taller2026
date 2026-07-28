# Paso 08 — Jeremias — HU-12: Footer informativo

## Qué agrega
- `index.html`: `<footer>` completo (marca, mapa del sitio con los links que ya
  existen, contacto).
- `styles.css`: estilos básicos del footer (una columna incluso en desktop —
  eso se termina de acomodar en la HU-11, el último commit).
- `src/app.js` / `src/core/reservas.js`: sin cambios.

## Cómo subirlo (tercer commit de Jeremias)

```bash
cd /ruta/a/taller2026
cp /Users/diegobonora/ORT/entrega-incremental-gaviotas/pasos/08-jeremias-hu12-footer/index.html .
cp /Users/diegobonora/ORT/entrega-incremental-gaviotas/pasos/08-jeremias-hu12-footer/styles.css .
cp /Users/diegobonora/ORT/entrega-incremental-gaviotas/pasos/08-jeremias-hu12-footer/src/app.js src/app.js
cp /Users/diegobonora/ORT/entrega-incremental-gaviotas/pasos/08-jeremias-hu12-footer/src/core/reservas.js src/core/reservas.js

git status
git add index.html styles.css src/app.js src/core/reservas.js
git commit -m "HU-12: Footer informativo"
git push
```

Con este push quedan tus 3 commits (HU-08, HU-10, HU-12). Avisale a Diego que
ya puede cerrar con el paso 09 (Diseño responsive).
