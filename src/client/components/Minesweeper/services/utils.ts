import * as R from 'ramda';
import { CellData } from '../records/CellData';

// returns number in inteval <0, dimension -1>
export const getRandomNumber = (dimension: number): number =>
  dimension === 0 ? 0 : Math.floor(Math.random() * 1000 + 1) % dimension;

export const revealBoard = (data: CellData[][]): CellData[][] =>
  data.map((row) => row.map((item) => ({ ...item, isRevealed: true })));

// do this on first click, avoid planting at initial location
export const plantMines = (
  data: CellData[][],
  randomizer: (dimension: number) => number,
  width: number,
  height: number,
  mines: number,
  startX: number,
  startY: number,
): CellData[][] => {
  let minesPlanted = 0;
  const output = R.clone(data);
  output[startY][startX].isRevealed = true;

  while (minesPlanted < mines) {
    const randomx = randomizer(width);
    const randomy = randomizer(height);
    if (!output[randomy][randomx].isMine && !output[randomy][randomx].isRevealed) {
      output[randomy][randomx].isMine = true;
      minesPlanted += 1;
    }
  }
  return output;
};

// looks for neighbouring cells and returns them
export const traverseBoard = (
  x: number,
  y: number,
  data: CellData[][],
  width: number,
  height: number,
): CellData[] => {
  const el = [];
  // top
  if (y > 0) {
    el.push(data[y - 1][x]);
  }
  // bottom
  if (y < height - 1) {
    el.push(data[y + 1][x]);
  }
  // left
  if (x > 0) {
    el.push(data[y][x - 1]);
  }
  // right
  if (x < width - 1) {
    el.push(data[y][x + 1]);
  }
  // top left
  if (x > 0 && y > 0) {
    el.push(data[y - 1][x - 1]);
  }
  // top right
  if (y > 0 && x < width - 1) {
    el.push(data[y - 1][x + 1]);
  }
  // bottom right
  if (y < height - 1 && x < width - 1) {
    el.push(data[y + 1][x + 1]);
  }
  // bottom left
  if (y < height - 1 && x > 0) {
    el.push(data[y + 1][x - 1]);
  }
  return el;
};

export const computeNeighbours = (data: CellData[][], width: number, height: number) => {
  const updatedData = R.clone(data);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const current = updatedData[y][x];
      if (current.isMine !== true) {
        const area = traverseBoard(current.x, current.y, updatedData, width, height);
        const mines = area.reduce((acc, value) => (value.isMine ? acc + 1 : acc), 0);
        if (mines === 0) {
          current.isEmpty = true;
        }
        current.neighbour = mines;
      }
    }
  }

  return updatedData;
};

export const initBoardData = (width: number, height: number): CellData[][] => {
  const boardData: CellData[][] = [];
  for (let y = 0; y < height; y += 1) {
    boardData.push([]);
    for (let x = 0; x < width; x += 1) {
      boardData[y][x] = {
        x,
        y,
        isMine: false,
        neighbour: 0,
        isRevealed: false,
        isEmpty: false,
        isFlagged: false,
      };
    }
  }
  return boardData;
};

// mutates
const reveal = (data: CellData[][], width: number, height: number, x: number, y: number) => {
  const area = traverseBoard(x, y, data, width, height);
  area.forEach((el) => {
    if (!el.isRevealed && (el.isEmpty || !el.isMine)) {
      // eslint-disable-next-line no-param-reassign
      data[el.y][el.x].isRevealed = true;
      // eslint-disable-next-line no-param-reassign
      data[el.y][el.x].isFlagged = false;
      if (el.isEmpty) {
        reveal(data, width, height, el.x, el.y);
      }
    }
  });
  return data;
};

export const revealEmpty = (
  data: CellData[][],
  width: number,
  height: number,
  x: number,
  y: number,
): CellData[][] => {
  const newData = R.clone(data);
  return reveal(newData, width, height, x, y);
};

export const getHidden = (data: CellData[][]) =>
  data.reduce((acc, row) => acc.concat(row.filter((item) => !item.isRevealed)), []);

export const getFlags = (data: CellData[][]) =>
  data.reduce((acc, row) => acc.concat(row.filter((item) => item.isFlagged)), []);

export const getMines = (data: CellData[][]) =>
  data.reduce((acc, row) => acc.concat(row.filter((item) => item.isMine)), []);
