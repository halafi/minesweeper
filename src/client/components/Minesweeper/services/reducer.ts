import { CellData } from '../records/CellData';
import { initBoardData } from './utils';
import GAME_MODES from '../consts/gameModes';
import { WindowType } from '../../../services/window';

export type GameState = 'ready' | 'started' | 'won' | 'lost' | 'spectate';

const SET_MINE_COUNT = 'SET_MINE_COUNT';
const SET_DIFFICULTY = 'SET_DIFFICULTY';
const RESET_GAME = 'RESET_GAME';
const START_GAME = 'START_GAME';
const SET_BOARD_DATA = 'SET_BOARD_DATA';
const CLOSE_MODAL = 'CLOSE_MODAL';
const SELECT_CELL = 'SELECT_CELL';
const SET_SAFETY = 'SET_SAFETY';
const SET_MENU_ORDER = 'SET_MENU_ORDER';

type SetMineCountAction = {
  type: typeof SET_MINE_COUNT;
  payload: {
    mineCount: number;
  };
};

type SetDifficultyAction = {
  type: typeof SET_DIFFICULTY;
  payload: {
    difficulty: number;
  };
};

type ResetGameAction = {
  type: typeof RESET_GAME;
  payload: {
    boardData: CellData[][];
    windowType: WindowType;
  };
};

type StartGameAction = {
  type: typeof START_GAME;
  payload: {
    boardData: CellData[][];
  };
};

type CloseModalAction = {
  type: typeof CLOSE_MODAL;
};

type SetBoardDataAction = {
  type: typeof SET_BOARD_DATA;
  payload: {
    boardData: CellData[][];
    gameState?: GameState;
    mineCount?: number;
  };
};

type SelectCellAction = {
  type: typeof SELECT_CELL;
  payload: {
    x: number | null;
    y: number | null;
  };
};

type SetSafetyAction = {
  type: typeof SET_SAFETY;
  payload: {
    safety: boolean;
  };
};

type SetMenuOrderAction = {
  type: typeof SET_MENU_ORDER;
  payload: {
    leftHanded: boolean;
  };
};

export const resetGame = (
  width: number,
  height: number,
  windowType: WindowType,
): ResetGameAction => ({
  type: RESET_GAME,
  payload: { boardData: initBoardData(width, height), windowType },
});

export const setMineCount = (mineCount: number): SetMineCountAction => ({
  type: SET_MINE_COUNT,
  payload: { mineCount },
});

export const setDifficulty = (difficulty: number): SetDifficultyAction => ({
  type: SET_DIFFICULTY,
  payload: { difficulty },
});

export const closeModal = (): CloseModalAction => ({
  type: CLOSE_MODAL,
});

export const setSafety = (value: boolean): SetSafetyAction => ({
  type: SET_SAFETY,
  payload: {
    safety: value,
  },
});

export const setMenuOrder = (leftHanded: boolean): SetMenuOrderAction => ({
  type: SET_MENU_ORDER,
  payload: {
    leftHanded,
  },
});

export const selectCell = (x: number | null, y: number | null): SelectCellAction => ({
  type: SELECT_CELL,
  payload: {
    x,
    y,
  },
});

export const setBoardData = (
  boardData: CellData[][],
  gameState?: GameState,
  mineCount?: number,
): SetBoardDataAction => ({
  type: SET_BOARD_DATA,
  payload: { boardData, gameState, mineCount },
});

export type MinesweeperActions =
  | SetMineCountAction
  | SetDifficultyAction
  | StartGameAction
  | ResetGameAction
  | SetBoardDataAction
  | CloseModalAction
  | SelectCellAction
  | SetSafetyAction
  | SetMenuOrderAction;

export type State = {
  safety: boolean;
  leftHandedMenu: boolean;
  x: number | null;
  y: number | null;
  difficulty: number;
  boardData: CellData[][];
  gameState: GameState;
  mineCount: number;
};

const minesweeperReducer = (oldState: State, action: MinesweeperActions): State => {
  switch (action.type) {
    case SET_SAFETY:
      return { ...oldState, safety: action.payload.safety, x: null, y: null };
    case SET_MENU_ORDER:
      return { ...oldState, leftHandedMenu: action.payload.leftHanded };
    case CLOSE_MODAL:
      return { ...oldState, gameState: 'spectate' };
    case SET_MINE_COUNT:
      return { ...oldState, mineCount: action.payload.mineCount };
    case SET_DIFFICULTY:
      return {
        ...oldState,
        difficulty: action.payload.difficulty,
      };
    case SET_BOARD_DATA: // use to start & win game too
      return {
        ...oldState,
        boardData: action.payload.boardData,
        gameState: action.payload.gameState || oldState.gameState,
        mineCount:
          action.payload.mineCount || action.payload.mineCount === 0
            ? action.payload.mineCount
            : oldState.mineCount,
      };
    case RESET_GAME:
      return {
        ...oldState,
        x: null,
        y: null,
        gameState: 'ready',
        mineCount:
          action.payload.windowType === 'mobile'
            ? GAME_MODES[oldState.difficulty].mines
            : GAME_MODES[oldState.difficulty].minesDesktop,
        boardData: action.payload.boardData,
      };
    case SELECT_CELL:
      return {
        ...oldState,
        x: action.payload.x,
        y: action.payload.y,
      };
    default:
      throw new Error();
  }
};

export default minesweeperReducer;
