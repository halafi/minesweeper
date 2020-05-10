import { getRandomNumber, revealBoard, initBoardData, plantMines } from './utils';

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
    const output = [[{ isRevealed: true }, { isRevealed: true }], [{ isRevealed: true }]];
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
        dataHelper(1, 0, true),
        dataHelper(2, 0, true),
        dataHelper(3, 0, true),
      ],
      [
        dataHelper(0, 1, true),
        dataHelper(1, 1, true),
        dataHelper(2, 1, false),
        dataHelper(3, 1, false),
      ],
      [
        dataHelper(0, 2, false),
        dataHelper(1, 2, false),
        dataHelper(2, 2, false),
        dataHelper(3, 2, false),
      ],
      [
        dataHelper(0, 3, false),
        dataHelper(1, 3, false),
        dataHelper(2, 3, false),
        dataHelper(3, 3, false),
      ],
    ];
    const randomizerMockFn = jest
      .fn(() => 0)
      .mockImplementationOnce(() => 1)
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 2)
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 3)
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 1)
      .mockImplementationOnce(() => 1)
      .mockImplementationOnce(() => 1);
    // @ts-ignore
    expect(plantMines(plantMinesInput, randomizerMockFn, 4, 4, 5, 0, 0)).toEqual(output);
  });
  test('plantMines maximum mines', () => {
    const output = [
      [
        dataHelper(0, 0, false, true),
        dataHelper(1, 0, true),
        dataHelper(2, 0, true),
        dataHelper(3, 0, true),
      ],
      [
        dataHelper(0, 1, true),
        dataHelper(1, 1, true),
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
    // @ts-ignore
    expect(plantMines(plantMinesInput, getRandomNumber, 4, 4, 15, 0, 0)).toEqual(output);
  });
});
