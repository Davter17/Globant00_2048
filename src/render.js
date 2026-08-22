const BEST_KEY = 'best-2048';

export class Renderer {
  constructor(root, game) {
    this.game = game;
    this.size = game.size;

    this.gridEl = root.querySelector('.grid-container');
    this.tileLayer = root.querySelector('.tile-layer');
    this.scoreEl = root.querySelector('#score');
    this.bestEl = root.querySelector('#best');

    this.bgCells = {};
    this.tileElements = new Map();

    this.cellSize = 0;
    this.gap = 0;
    this.padding = 0;

    this._cacheBgCells();
    this.measure();

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(() => {
        this.measure();
        this.render();
      }).observe(this.gridEl);
    }
  }

  _cacheBgCells() {
    for (let r = 0; r < this.size; r++)
      for (let c = 0; c < this.size; c++)
        this.bgCells[`${r}-${c}`] = document.getElementById(`cell-${r}-${c}`);
  }

  measure() {
    const style = getComputedStyle(this.gridEl);
    this.padding = parseFloat(style.paddingLeft) || 0;
    this.gap = parseFloat(style.columnGap) || parseFloat(style.gap) || 0;
    const innerWidth = this.gridEl.clientWidth - 2 * this.padding;
    this.cellSize = (innerWidth - (this.size - 1) * this.gap) / this.size;
  }

  _point(row, col) {
    return {
      x: this.padding + col * (this.cellSize + this.gap),
      y: this.padding + row * (this.cellSize + this.gap),
    };
  }

  getBest() {
    try {
      return parseInt(localStorage.getItem(BEST_KEY), 10) || 0;
    } catch {
      return 0;
    }
  }

  setBest(value) {
    try {
      localStorage.setItem(BEST_KEY, String(value));
    } catch {
      /* ignore */
    }
  }

  render() {
    const g = this.game;

    this.scoreEl.textContent = g.score;
    const best = Math.max(g.score, this.getBest());
    if (best > this.getBest()) this.setBest(best);
    this.bestEl.textContent = best;

    const renderable = [];
    for (let r = 0; r < this.size; r++)
      for (let c = 0; c < this.size; c++) {
        const tile = g.grid.cells[r][c];
        if (tile) renderable.push(tile);
        const bg = this.bgCells[`${r}-${c}`];
        if (bg) bg.setAttribute('aria-label', tile ? `Tile ${tile.value}` : 'Empty');
      }

    for (const tile of renderable) {
      if (tile.mergedFrom) renderable.push(tile.mergedFrom[0], tile.mergedFrom[1]);
    }

    const ids = new Set(renderable.map((t) => t.id));
    for (const [id, el] of this.tileElements) {
      if (!ids.has(id)) {
        el.remove();
        this.tileElements.delete(id);
      }
    }

    for (const tile of renderable) {
      let el = this.tileElements.get(tile.id);
      if (!el) {
        el = document.createElement('div');
        el.className = 'tile';
        const inner = document.createElement('div');
        inner.className = 'tile-inner';
        el.appendChild(inner);
        this.tileLayer.appendChild(el);
        this.tileElements.set(tile.id, el);
      }

      const inner = el.firstChild;
      inner.textContent = tile.value;
      inner.dataset.value = tile.value;
      inner.classList.remove('tile-new', 'tile-merged');

      el.style.width = this.cellSize + 'px';
      el.style.height = this.cellSize + 'px';

      const start = tile.previousPosition || { row: tile.row, col: tile.col };
      const from = this._point(start.row, start.col);
      const to = this._point(tile.row, tile.col);

      el.style.transition = 'none';
      el.style.transform = `translate(${from.x}px, ${from.y}px)`;
      void el.offsetWidth; // force reflow so the start position applies
      el.style.transition = '';
      el.style.transform = `translate(${to.x}px, ${to.y}px)`;

      if (tile.mergedFrom) inner.classList.add('tile-merged');
      else if (tile.isNew) inner.classList.add('tile-new');
    }
  }

  clearTiles() {
    for (const [, el] of this.tileElements) el.remove();
    this.tileElements.clear();
  }
}
