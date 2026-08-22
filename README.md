[ Español](README.es.md) | **English**

# 2048 Game

Web implementation of the classic 2048 game. A puzzle game where you combine numbers to achieve the highest score.

## 🚀 How to launch the project

To start the Docker container, use the following command in the terminal: docker-compose up -d
Once the container is running, open your browser and navigate to: http://localhost:4243

> Note: because the project uses ES modules, `index.html` must be served over HTTP (Docker/nginx or any static server). Opening the file via `file://` won't work.

## 🧪 Tests

The game logic (`src/game.js`) is covered by Vitest tests:

```bash
npm install
npm test
```

## 🏗️ Architecture

- `src/game.js` — pure data model and logic (2D board, moves, merges, cheats). DOM-free, fully testable.
- `src/render.js` — DOM renderer with slide/merge/appear animations and `localStorage` best score.
- `src/main.js` — event wiring: keyboard (arrows + WASD), touch swipe, cheats and modals.
- `tests/game.test.js` — unit tests for the logic.

## 🎮 How to play

Use the arrow keys (or WASD) to move the tiles. On mobile, swipe with your finger.
When two tiles with the same number touch, they merge into one.
Try to reach 2048!
