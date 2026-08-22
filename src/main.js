import { Game, DIRECTIONS, SIZE } from './game.js';
import { Renderer } from './render.js';

const root = document.querySelector('.game-container');
const game = new Game(SIZE);
const renderer = new Renderer(root, game);

const message = document.getElementById('game-message');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const continueBtn = document.getElementById('continue-btn');
const restartMessageBtn = document.getElementById('restart-message-btn');
const restartBtn = document.getElementById('restart-btn');
const randomMovesBtn = document.getElementById('random-moves-btn');
const fillBtn = document.getElementById('fill-gaps-btn');
const duplicateBtn = document.getElementById('duplicate-tiles-btn');
const randomizeBtn = document.getElementById('randomize-tiles-btn');

const KEY_MAP = {
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowRight: DIRECTIONS.RIGHT,
  w: DIRECTIONS.UP,
  s: DIRECTIONS.DOWN,
  a: DIRECTIONS.LEFT,
  d: DIRECTIONS.RIGHT,
  W: DIRECTIONS.UP,
  S: DIRECTIONS.DOWN,
  A: DIRECTIONS.LEFT,
  D: DIRECTIONS.RIGHT,
};

function showMessage(title, text, isWin) {
  messageTitle.textContent = title;
  messageText.textContent = text;
  continueBtn.style.display = isWin ? 'inline-block' : 'none';
  message.classList.remove('hidden');
  message.classList.add('show');
}

function hideMessage() {
  message.classList.remove('show');
  message.classList.add('hidden');
}

function afterAction() {
  renderer.render();
  if (game.won && !game.keepPlaying) {
    showMessage('You win!', 'You reached 2048!', true);
  } else if (game.over) {
    showMessage('Game over!', 'No more moves possible.', false);
  }
}

function startGame() {
  game.reset();
  game.addStartTiles();
  renderer.clearTiles();
  hideMessage();
  renderer.render();
}

document.addEventListener('keydown', (e) => {
  if (game.isGameTerminated()) return;
  const dir = KEY_MAP[e.key];
  if (dir === undefined) return;
  e.preventDefault();
  game.move(dir);
  afterAction();
});

restartBtn.addEventListener('click', startGame);
restartMessageBtn.addEventListener('click', startGame);
continueBtn.addEventListener('click', () => {
  game.keepPlaying = true;
  game.over = false;
  hideMessage();
});

fillBtn.addEventListener('click', () => {
  if (game.isGameTerminated()) return;
  game.cheatFillGaps();
  afterAction();
});

duplicateBtn.addEventListener('click', () => {
  if (game.isGameTerminated()) return;
  game.cheatDuplicate();
  afterAction();
});

randomizeBtn.addEventListener('click', () => {
  if (game.isGameTerminated()) return;
  game.cheatRandomize();
  afterAction();
});

randomMovesBtn.addEventListener('click', () => {
  if (game.isGameTerminated()) return;
  randomMovesBtn.disabled = true;
  const dirs = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT];
  let count = 0;
  const id = setInterval(() => {
    if (count >= 10 || game.isGameTerminated()) {
      clearInterval(id);
      randomMovesBtn.disabled = false;
      afterAction();
      return;
    }
    game.move(dirs[Math.floor(Math.random() * dirs.length)]);
    afterAction();
    count++;
  }, 250);
});

// Touch / swipe support
let touchStart = null;
const gridEl = document.querySelector('.grid-container');

gridEl.addEventListener(
  'touchstart',
  (e) => {
    if (e.touches.length !== 1) return;
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  },
  { passive: true },
);

gridEl.addEventListener(
  'touchend',
  (e) => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    touchStart = null;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) < 24) return;
    let dir;
    if (absX > absY) dir = dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
    else dir = dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
    if (game.isGameTerminated()) return;
    game.move(dir);
    afterAction();
  },
  { passive: true },
);

startGame();
