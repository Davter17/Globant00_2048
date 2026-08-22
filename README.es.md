**Español** | [English](README.md)

# 2048 Game

Implementación web del clásico juego 2048. Un juego de puzzle donde combinas números para alcanzar la puntuación más alta.

## 🚀 Cómo lanzar el proyecto

Para iniciar el contenedor Docker, usa el siguiente comando en la terminal:  docker-compose up -d
Una vez iniciado el contenedor, abre tu navegador y navega a: http://localhost:4243

> Nota: al usar ES modules, `index.html` debe servirse vía HTTP (Docker/nginx o cualquier servidor estático). Abrir el archivo con `file://` no funcionará.

## 🧪 Tests

La lógica del juego (`src/game.js`) está cubierta por tests con Vitest:

```bash
npm install
npm test
```

## 🏗️ Arquitectura

- `src/game.js` — modelo de datos y lógica pura (tablero 2D, movimientos, merges, cheats). Sin dependencias del DOM, 100% testeable.
- `src/render.js` — renderer DOM con animaciones de slide/merge/appear y `localStorage` para el best score.
- `src/main.js` — cableado de eventos: teclado (flechas + WASD), swipe táctil, cheats y modales.
- `tests/game.test.js` — tests unitarios de la lógica.

## 🎮 Cómo jugar

Usa las flechas del teclado (o WASD) para mover las fichas. En móvil, desliza con el dedo.
Cuando dos fichas con el mismo número se tocan, se fusionan en una.
¡Intenta llegar a 2048!
