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
  if (x > 0) {
    el.push(data[x - 1][y]);
  }
  // bottom
  if (x < height - 1) {
    el.push(data[x + 1][y]);
  }
  // left
  if (y > 0) {
    el.push(data[x][y - 1]);
  }
  // right
  if (y < width - 1) {
    el.push(data[x][y + 1]);
  }
  // top left
  if (x > 0 && y > 0) {
    el.push(data[x - 1][y - 1]);
  }
  // top right
  if (x > 0 && y < width - 1) {
    el.push(data[x - 1][y + 1]);
  }
  // bottom right
  if (x < height - 1 && y < width - 1) {
    el.push(data[x + 1][y + 1]);
  }
  // bottom left
  if (x < height - 1 && y > 0) {
    el.push(data[x + 1][y - 1]);
  }
  return el;
};

export const computeNeighbours = (data: CellData[][], width: number, height: number) => {
  const updatedData = [...data];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[y][x].isMine !== true) {
        let mine = 0;
        const area = traverseBoard(data[y][x].x, data[y][x].y, data, width, height);
        area.map((value) => {
          if (value.isMine) {
            mine += 1;
          }
        });
        if (mine === 0) {
          updatedData[y][x].isEmpty = true;
        }
        updatedData[y][x].neighbour = mine;
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
