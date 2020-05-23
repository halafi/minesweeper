import {
  getRandomNumber,
  revealBoard,
  initBoardData,
  plantMines,
  traverseBoard,
  computeNeighbours,
  revealEmpty,
} from './utils';

const dataHelper = (
  x: number,
  y: number,
  isMine: boolean = false,
  isRevealed: boolean = false,
) => ({
  x,
  y,
  isMine,
  isRevealed,
  isEmpty: false,
  isFlagged: false,
  neighbour: 0,
});

const plantMinesInput = [
  [dataHelper(0, 0), dataHelper(1, 0), dataHelper(2, 0), dataHelper(3, 0)],
  [dataHelper(0, 1), dataHelper(1, 1), dataHelper(2, 1), dataHelper(3, 1)],
  [dataHelper(0, 2), dataHelper(1, 2), dataHelper(2, 2), dataHelper(3, 2)],
  [dataHelper(0, 3), dataHelper(1, 3), dataHelper(2, 3), dataHelper(3, 3)],
];

// GRID
// x . . .
// . . . .
// x . . .
// . . x x
const minefieldInput = [
  [
    dataHelper(0, 0, true),
    dataHelper(1, 0, false),
    dataHelper(2, 0, false),
    dataHelper(3, 0, false),
  ],
  [
    dataHelper(0, 1, false),
    dataHelper(1, 1, false),
    dataHelper(2, 1, false),
    dataHelper(3, 1, false),
  ],
  [
    dataHelper(0, 2, true),
    dataHelper(1, 2, false),
    dataHelper(2, 2, false),
    dataHelper(3, 2, false),
  ],
  [
    dataHelper(0, 3, false),
    dataHelper(1, 3, false),
    dataHelper(2, 3, true),
    dataHelper(3, 3, true),
  ],
];

describe('#utils', () => {
  // beforeEach(() => {
  //   jest.clearAllMocks();
  // });
  test('getRandomNumber', () => {
    expect(getRandomNumber(0)).toEqual(0);
    expect(getRandomNumber(1)).toBeLessThan(1);
    expect(getRandomNumber(1)).toBeGreaterThanOrEqual(0);
    expect(getRandomNumber(2)).toBeLessThan(2);
    expect(getRandomNumber(2)).toBeGreaterThanOrEqual(0);
    expect(getRandomNumber(50)).toBeLessThan(50);
  });
  test('revealBoard', () => {
    const input = [[{ isRevealed: false }, { isRevealed: true }], [{ isRevealed: false }]];
    const output = [
      [
        { isRevealed: true, isFlagged: false },
        { isRevealed: true, isFlagged: false },
      ],
      [{ isRevealed: true, isFlagged: false }],
    ];
    // @ts-ignore
    expect(revealBoard(input)).toEqual(output);
  });
  test('initBoardData', () => {
    const output = [
      [dataHelper(0, 0), dataHelper(1, 0), dataHelper(2, 0), dataHelper(3, 0)],
      [dataHelper(0, 1), dataHelper(1, 1), dataHelper(2, 1), dataHelper(3, 1)],
      [dataHelper(0, 2), dataHelper(1, 2), dataHelper(2, 2), dataHelper(3, 2)],
      [dataHelper(0, 3), dataHelper(1, 3), dataHelper(2, 3), dataHelper(3, 3)],
    ];
    // @ts-ignore
    expect(initBoardData(4, 4)).toEqual(output);
  });
  test('plantMines', () => {
    const output = [
      [
        dataHelper(0, 0, false, true),
        dataHelper(1, 0, false),
        dataHelper(2, 0, true),
        dataHelper(3, 0, true),
      ],
      [
        dataHelper(0, 1, false),
        dataHelper(1, 1, false),
        dataHelper(2, 1, false),
        dataHelper(3, 1, false),
      ],
      [
        dataHelper(0, 2, false),
        dataHelper(1, 2, false),
        dataHelper(2, 2, true),
        dataHelper(3, 2, false),
      ],
      [
        dataHelper(0, 3, false),
        dataHelper(1, 3, false),
        dataHelper(2, 3, false),
        dataHelper(3, 3, true),
      ],
    ];
    const randomizerMockFn = jest
      .fn(() => 0)
      // [1, 0] => cant plant
      .mockImplementationOnce(() => 1)
      .mockImplementationOnce(() => 0)
      // [2, 0] => can plant
      .mockImplementationOnce(() => 2)
      .mockImplementationOnce(() => 0)
      // [3, 0] => can plant
      .mockImplementationOnce(() => 3)
      .mockImplementationOnce(() => 0)
      // [0, 1] => cant plant
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 1)
      // [1, 1] => cant plant
      .mockImplementationOnce(() => 1)
      .mockImplementationOnce(() => 1)
      // [2, 2] => can plant
      .mockImplementationOnce(() => 2)
      .mockImplementationOnce(() => 2)
      // [3, 3] => can plant
      .mockImplementationOnce(() => 3)
      .mockImplementationOnce(() => 3);
    expect(plantMines(plantMinesInput, randomizerMockFn, 4, 4, 4, 0, 0)).toEqual(output);
  });
  test('plantMines maximum mines', () => {
    const output = [
      [
        dataHelper(0, 0, false, true),
        dataHelper(1, 0, false),
        dataHelper(2, 0, true),
        dataHelper(3, 0, true),
      ],
      [
        dataHelper(0, 1, false),
        dataHelper(1, 1, false),
        dataHelper(2, 1, true),
        dataHelper(3, 1, true),
      ],
      [
        dataHelper(0, 2, true),
        dataHelper(1, 2, true),
        dataHelper(2, 2, true),
        dataHelper(3, 2, true),
      ],
      [
        dataHelper(0, 3, true),
        dataHelper(1, 3, true),
        dataHelper(2, 3, true),
        dataHelper(3, 3, true),
      ],
    ];
    // will plant only 4 * 4 - 4 mines (initial click radius) = 12 mines
    expect(plantMines(plantMinesInput, getRandomNumber, 4, 4, 15, 0, 0)).toEqual(output);
  });
  test('traverseBoard', () => {
    // note: careful about order
    expect(traverseBoard(0, 0, minefieldInput, 4, 4)).toEqual([
      minefieldInput[1][0],
      minefieldInput[0][1],
      minefieldInput[1][1],
    ]);
    expect(traverseBoard(2, 2, minefieldInput, 4, 4)).toEqual([
      minefieldInput[1][2], // top
      minefieldInput[3][2], // bottom
      minefieldInput[2][1], // left
      minefieldInput[2][3], // right
      minefieldInput[1][1], // top left
      minefieldInput[1][3], // top right
      minefieldInput[3][3], // bottom right
      minefieldInput[3][1], // bottom left
    ]);
  });
  test('computeNeighbours', () => {
    // note: careful about order
    expect(computeNeighbours(minefieldInput, 4, 4).map((x) => x.map((y) => y.neighbour))).toEqual([
      [0, 1, 0, 0],
      [2, 2, 0, 0],
      [0, 2, 2, 2],
      [1, 2, 0, 0],
    ]);
  });
  // x . o O
  // . . o o
  // x . . .
  // . . x x
  test('revealEmpty', () => {
    // reveals only in 1st recursion because of hardcoded isEmpty: false
    expect(revealEmpty(minefieldInput, 4, 4, 3, 0).map((x) => x.map((y) => y.isRevealed))).toEqual([
      [false, false, true, false],
      [false, false, true, true],
      [false, false, false, false],
      [false, false, false, false],
    ]);
  });
});
