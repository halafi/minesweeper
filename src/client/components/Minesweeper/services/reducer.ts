import { CellData } from '../records/CellData';
import { initBoardData } from './utils';
import GAME_MODES from '../consts/gameModes';

type GameState = 'ready' | 'started' | 'won' | 'lost';

// const SET_GAME_STATE = 'SET_GAME_STATE';
const SET_MINE_COUNT = 'SET_MINE_COUNT';
const SET_DIFFICULTY = 'SET_DIFFICULTY';
const RESET_GAME = 'RESET_GAME';
const START_GAME = 'START_GAME';
const SET_BOARD_DATA = 'SET_BOARD_DATA';

// type SetGameStateAction = {
//   type: typeof SET_GAME_STATE;
//   payload: {
//     gameState: GameState;
//   };
// };

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
  };
};

type StartGameAction = {
  type: typeof START_GAME;
  payload: {
    boardData: CellData[][];
  };
};

type SetBoardDataAction = {
  type: typeof SET_BOARD_DATA;
  payload: {
    boardData: CellData[][];
    gameState?: GameState;
    mineCount?: number;
  };
};

export const resetGame = (width: number, height: number): ResetGameAction => ({
  type: RESET_GAME,
  payload: { boardData: initBoardData(width, height) },
});

export const setMineCount = (mineCount: number): SetMineCountAction => ({
  type: SET_MINE_COUNT,
  payload: { mineCount },
});

export const setDifficulty = (difficulty: number): SetDifficultyAction => ({
  type: SET_DIFFICULTY,
  payload: { difficulty },
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
  // | SetGameStateAction
  SetMineCountAction | SetDifficultyAction | StartGameAction | ResetGameAction | SetBoardDataAction;

export type State = {
  difficulty: number;
  boardData: CellData[][];
  gameState: GameState;
  mineCount: number;
};

const minesweeperReducer = (oldState: State, action: MinesweeperActions): State => {
  switch (action.type) {
    // case SET_GAME_STATE:
    //   return { ...oldState, gameState: action.payload.gameState };
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
        mineCount: action.payload.mineCount || oldState.mineCount,
      };
    case RESET_GAME:
      return {
        ...oldState,
        gameState: 'ready',
        mineCount: GAME_MODES[oldState.difficulty].mines,
        boardData: action.payload.boardData,
      };
    default:
      throw new Error();
  }
};

export default minesweeperReducer;
