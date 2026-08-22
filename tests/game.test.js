import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  Game,
  Grid,
  Tile,
  DIRECTIONS,
  SIZE,
  WIN_VALUE,
} from '../src/game.js';

const setRow = (game, row, values) => {
  for (let c = 0; c < SIZE; c++) {
    game.grid.cells[row][c] = null;
    if (values[c]) {
      const tile = new Tile({ row, col: c }, values[c]);
      tile.isNew = false;
      game.grid.cells[row][c] = tile;
    }
  }
};

const setCol = (game, col, values) => {
  for (let r = 0; r < SIZE; r++) {
    game.grid.cells[r][col] = null;
    if (values[r]) {
      const tile = new Tile({ row: r, col }, values[r]);
      tile.isNew = false;
      game.grid.cells[r][col] = tile;
    }
  }
};

const rowValues = (game, row) =>
  game.grid.cells[row].map((t) => (t ? t.value : 0));

const countTiles = (game) =>
  game.grid.cells.flat().filter(Boolean).length;

describe('Grid', () => {
  it('starts empty', () => {
    const grid = new Grid();
    expect(grid.availableCells().length).toBe(SIZE * SIZE);
    expect(grid.isFull()).toBe(false);
  });

  it('inserts and removes tiles', () => {
    const grid = new Grid();
    const tile = new Tile({ row: 0, col: 0 }, 2);
    grid.insertTile(tile);
    expect(grid.cellContent({ row: 0, col: 0 })).toBe(tile);
    grid.removeTile(tile);
    expect(grid.cellContent({ row: 0, col: 0 })).toBeNull();
  });

  it('respects bounds', () => {
    const grid = new Grid();
    expect(grid.withinBounds({ row: 0, col: 0 })).toBe(true);
    expect(grid.withinBounds({ row: SIZE, col: 0 })).toBe(false);
    expect(grid.withinBounds({ row: 0, col: -1 })).toBe(false);
  });
});

describe('Game.move (left)', () => {
  let spy;
  beforeEach(() => {
    spy = vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => spy.mockRestore());

  it('merges two equal tiles and updates the score', () => {
    const game = new Game();
    setRow(game, 0, [2, 2, 0, 0]);
    expect(game.move(DIRECTIONS.LEFT)).toBe(true);
    expect(game.grid.cells[0][0].value).toBe(4);
    expect(game.score).toBe(4);
  });

  it('does not double-merge in a single move', () => {
    const game = new Game();
    setRow(game, 0, [2, 2, 2, 2]);
    game.move(DIRECTIONS.LEFT);
    expect(rowValues(game, 0)).toEqual([4, 4, 2, 0]);
    expect(game.score).toBe(8);
  });

  it('does not merge different values', () => {
    const game = new Game();
    setRow(game, 0, [2, 4, 0, 0]);
    game.move(DIRECTIONS.LEFT);
    expect(game.grid.cells[0][0].value).toBe(2);
    expect(game.grid.cells[0][1].value).toBe(4);
  });

  it('returns false and adds no tile when nothing moves', () => {
    const game = new Game();
    setRow(game, 0, [2, 4, 8, 16]);
    expect(game.move(DIRECTIONS.LEFT)).toBe(false);
    expect(countTiles(game)).toBe(4);
  });
});

describe('Game.move (right, up, down)', () => {
  let spy;
  beforeEach(() => {
    spy = vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => spy.mockRestore());

  it('merges towards the right edge', () => {
    const game = new Game();
    setRow(game, 0, [2, 2, 0, 0]);
    game.move(DIRECTIONS.RIGHT);
    expect(game.grid.cells[0][3].value).toBe(4);
    expect(game.score).toBe(4);
  });

  it('merges upwards', () => {
    const game = new Game();
    setCol(game, 0, [2, 2, 0, 0]);
    game.move(DIRECTIONS.UP);
    expect(game.grid.cells[0][0].value).toBe(4);
    expect(game.score).toBe(4);
  });

  it('merges downwards', () => {
    const game = new Game();
    setCol(game, 0, [2, 2, 0, 0]);
    game.move(DIRECTIONS.DOWN);
    expect(game.grid.cells[3][0].value).toBe(4);
    expect(game.score).toBe(4);
  });
});

describe('Game.addRandomTile', () => {
  it('places one tile in an empty cell', () => {
    const game = new Game();
    game.addRandomTile();
    const filled = game.grid.cells.flat().filter(Boolean);
    expect(filled.length).toBe(1);
    expect([2, 4]).toContain(filled[0].value);
  });

  it('does nothing when the grid is full', () => {
    const game = new Game();
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        game.grid.insertTile(new Tile({ row: r, col: c }, 2));
    game.addRandomTile();
    expect(countTiles(game)).toBe(SIZE * SIZE);
  });
});

describe('Game win / over', () => {
  let spy;
  beforeEach(() => {
    spy = vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => spy.mockRestore());

  it('detects a win when 2048 is reached', () => {
    const game = new Game();
    setRow(game, 0, [1024, 1024, 0, 0]);
    game.move(DIRECTIONS.LEFT);
    expect(game.won).toBe(true);
  });

  it('reports no moves available on a full board without merges', () => {
    const game = new Game();
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) {
        const value = (r + c) % 2 === 0 ? 2 : 4;
        game.grid.insertTile(new Tile({ row: r, col: c }, value));
      }
    expect(game.movesAvailable()).toBe(false);
  });

  it('checkEndState flags game over when no moves remain', () => {
    const game = new Game();
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) {
        const value = (r + c) % 2 === 0 ? 2 : 4;
        game.grid.insertTile(new Tile({ row: r, col: c }, value));
      }
    game.checkEndState();
    expect(game.over).toBe(true);
  });

  it('isGameTerminated is true on win until keepPlaying is set', () => {
    const game = new Game();
    game.won = true;
    expect(game.isGameTerminated()).toBe(true);
    game.keepPlaying = true;
    expect(game.isGameTerminated()).toBe(false);
  });
});

describe('Game cheats', () => {
  let spy;
  beforeEach(() => {
    spy = vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => spy.mockRestore());

  it('cheatFillGaps fills every empty cell', () => {
    const game = new Game();
    setRow(game, 0, [2, 0, 0, 0]);
    game.cheatFillGaps();
    expect(game.grid.availableCells().length).toBe(0);
  });

  it('cheatDuplicate doubles every tile', () => {
    const game = new Game();
    setRow(game, 0, [2, 4, 8, 0]);
    game.cheatDuplicate();
    expect(rowValues(game, 0)).toEqual([4, 8, 16, 0]);
  });

  it('cheatRandomize preserves the multiset of values', () => {
    const game = new Game();
    setRow(game, 0, [2, 4, 8, 16]);
    game.cheatRandomize();
    expect(rowValues(game, 0).slice().sort((a, b) => a - b)).toEqual([2, 4, 8, 16]);
  });

  it('cheatDuplicate detects a win at 2048', () => {
    const game = new Game();
    setRow(game, 0, [1024, 0, 0, 0]);
    game.cheatDuplicate();
    expect(game.won).toBe(true);
  });
});

describe('Game helpers', () => {
  it('positionsEqual compares row and col', () => {
    const game = new Game();
    expect(game.positionsEqual({ row: 1, col: 2 }, { row: 1, col: 2 })).toBe(true);
    expect(game.positionsEqual({ row: 1, col: 2 }, { row: 1, col: 3 })).toBe(false);
  });

  it('buildTraversals reverses rows/cols for down/right', () => {
    const game = new Game();
    expect(game.buildTraversals({ row: 1, col: 0 }).rows).toEqual([3, 2, 1, 0]);
    expect(game.buildTraversals({ row: 0, col: 1 }).cols).toEqual([3, 2, 1, 0]);
    expect(game.buildTraversals({ row: -1, col: 0 }).rows).toEqual([0, 1, 2, 3]);
  });

  it('WIN_VALUE is 2048', () => {
    expect(WIN_VALUE).toBe(2048);
  });
});
