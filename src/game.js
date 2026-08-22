export const SIZE = 4;
export const WIN_VALUE = 2048;

export const DIRECTIONS = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3 };

const VECTORS = {
  0: { row: -1, col: 0 },
  1: { row: 0, col: 1 },
  2: { row: 1, col: 0 },
  3: { row: 0, col: -1 },
};

let nextTileId = 1;

export class Tile {
  constructor(position, value) {
    this.id = nextTileId++;
    this.row = position.row;
    this.col = position.col;
    this.value = value;
    this.previousPosition = null;
    this.mergedFrom = null;
    this.isNew = true;
  }

  savePosition() {
    this.previousPosition = { row: this.row, col: this.col };
  }
}

export class Grid {
  constructor(size = SIZE) {
    this.size = size;
    this.cells = this.empty();
  }

  empty() {
    const cells = [];
    for (let r = 0; r < this.size; r++) cells.push(new Array(this.size).fill(null));
    return cells;
  }

  availableCells() {
    const cells = [];
    for (let r = 0; r < this.size; r++)
      for (let c = 0; c < this.size; c++)
        if (!this.cells[r][c]) cells.push({ row: r, col: c });
    return cells;
  }

  randomAvailableCell() {
    const cells = this.availableCells();
    if (cells.length) return cells[Math.floor(Math.random() * cells.length)];
    return null;
  }

  withinBounds(cell) {
    return (
      cell.row >= 0 && cell.row < this.size && cell.col >= 0 && cell.col < this.size
    );
  }

  cellContent(cell) {
    if (!this.withinBounds(cell)) return null;
    return this.cells[cell.row][cell.col];
  }

  insertTile(tile) {
    this.cells[tile.row][tile.col] = tile;
  }

  removeTile(tile) {
    this.cells[tile.row][tile.col] = null;
  }

  isFull() {
    return this.availableCells().length === 0;
  }

  tilesAvailable() {
    return !this.isFull();
  }
}

export class Game {
  constructor(size = SIZE) {
    this.size = size;
    this.startTiles = 2;
    this.reset();
  }

  reset() {
    this.grid = new Grid(this.size);
    this.score = 0;
    this.over = false;
    this.won = false;
    this.keepPlaying = false;
  }

  addStartTiles() {
    for (let i = 0; i < this.startTiles; i++) this.addRandomTile();
  }

  addRandomTile() {
    const cell = this.grid.randomAvailableCell();
    if (cell) {
      const value = Math.random() < 0.9 ? 2 : 4;
      this.grid.insertTile(new Tile(cell, value));
    }
  }

  prepareTiles() {
    for (let r = 0; r < this.size; r++)
      for (let c = 0; c < this.size; c++) {
        const tile = this.grid.cells[r][c];
        if (tile) {
          tile.mergedFrom = null;
          tile.isNew = false;
          tile.savePosition();
        }
      }
  }

  moveTile(tile, cell) {
    this.grid.cells[tile.row][tile.col] = null;
    this.grid.cells[cell.row][cell.col] = tile;
    tile.row = cell.row;
    tile.col = cell.col;
  }

  move(direction) {
    if (this.isGameTerminated()) return false;
    const vector = VECTORS[direction];
    if (!vector) return false;

    const traversals = this.buildTraversals(vector);
    let moved = false;
    this.prepareTiles();

    for (const row of traversals.rows) {
      for (const col of traversals.cols) {
        const tile = this.grid.cells[row][col];
        if (!tile) continue;

        const positions = this.findFarthestPosition({ row, col }, vector);
        const next = this.grid.cellContent(positions.next);

        if (next && next.value === tile.value && !next.mergedFrom) {
          const merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          this.grid.insertTile(merged);
          this.grid.removeTile(tile);
          tile.row = positions.next.row;
          tile.col = positions.next.col;

          this.score += merged.value;
          if (merged.value === WIN_VALUE) this.won = true;
        } else {
          this.moveTile(tile, positions.farthest);
        }

        if (!this.positionsEqual({ row, col }, tile)) moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      if (!this.movesAvailable()) this.over = true;
    }
    return moved;
  }

  buildTraversals(vector) {
    const rows = [];
    const cols = [];
    for (let i = 0; i < this.size; i++) {
      rows.push(i);
      cols.push(i);
    }
    if (vector.row === 1) rows.reverse();
    if (vector.col === 1) cols.reverse();
    return { rows, cols };
  }

  findFarthestPosition(cell, vector) {
    let previous;
    let current = { row: cell.row, col: cell.col };
    do {
      previous = current;
      current = { row: previous.row + vector.row, col: previous.col + vector.col };
    } while (this.grid.withinBounds(current) && !this.grid.cellContent(current));
    return { farthest: previous, next: current };
  }

  isGameTerminated() {
    return this.over || (this.won && !this.keepPlaying);
  }

  movesAvailable() {
    return this.grid.tilesAvailable() || this.tileMatchesAvailable();
  }

  tileMatchesAvailable() {
    for (let r = 0; r < this.size; r++)
      for (let c = 0; c < this.size; c++) {
        const tile = this.grid.cells[r][c];
        if (!tile) continue;
        for (const key of [0, 1, 2, 3]) {
          const vector = VECTORS[key];
          const next = this.grid.cellContent({ row: r + vector.row, col: c + vector.col });
          if (next && next.value === tile.value) return true;
        }
      }
    return false;
  }

  positionsEqual(a, b) {
    return a.row === b.row && a.col === b.col;
  }

  checkEndState() {
    if (!this.movesAvailable()) this.over = true;
  }

  cheatFillGaps() {
    for (const cell of this.grid.availableCells()) {
      const value = Math.random() < 0.9 ? 2 : 4;
      this.grid.insertTile(new Tile(cell, value));
    }
    this.checkEndState();
  }

  cheatDuplicate() {
    for (let r = 0; r < this.size; r++)
      for (let c = 0; c < this.size; c++) {
        const tile = this.grid.cells[r][c];
        if (tile) {
          tile.value *= 2;
          tile.isNew = true;
          if (tile.value === WIN_VALUE) this.won = true;
        }
      }
    this.checkEndState();
  }

  cheatRandomize() {
    const filled = [];
    for (let r = 0; r < this.size; r++)
      for (let c = 0; c < this.size; c++) {
        const tile = this.grid.cells[r][c];
        if (tile) filled.push(tile);
      }
    const values = filled.map((t) => t.value);
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    filled.forEach((t, i) => {
      t.value = values[i];
      t.isNew = true;
    });
    this.checkEndState();
  }
}
