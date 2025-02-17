import React, { useReducer, useEffect, SyntheticEvent, Reducer } from 'react';
import { useStopwatch } from 'react-timer-hook';
import {
  computeNeighbours,
  plantMines,
  revealBoard,
  revealEmpty,
  getRandomNumber,
  getHidden,
  getFlags,
  getMines,
  flag,
  revealMine,
  explode,
} from './services/utils';
import Board from './components/Board/index';
import Column from '../../primitives/Column';
import minesweeperReducer, {
  resetGame,
  setBoardData,
  setMineCount,
  closeModal,
  selectCell,
  setSafety,
  setMenuOrder,
} from './services/reducer';
import type { State, MinesweeperActions } from './services/reducer';
import GAME_MODES from './consts/gameModes';
import Modal from '../Modal';
import { getWindowType } from '../../services/window';
import Menu from './components/Menu';
import WinScreen from './components/WinScreen/index';
import FailScreen from './components/FailScreen/index';

const grassSound = new Audio('/sounds/grass.wav');
const explosionSound = new Audio('/sounds/explosion.wav');
const yuppieSound = new Audio('/sounds/yuppie.wav');

const windowType = getWindowType();

const Minesweeper = () => {
  const [state, dispatch] = useReducer<Reducer<State, MinesweeperActions>>(minesweeperReducer, {
    difficulty: localStorage.getItem('difficulty') ? Number(localStorage.getItem('difficulty')) : 0,
    boardData: [],
    leftHandedMenu: false,
    safety: true,
    gameState: 'ready',
    mineCount: 0,
    x: null,
    y: null,
  });
  const { seconds, minutes, hours, start, pause, reset } = useStopwatch({
    autoStart: false,
  });
  const { difficulty, boardData, gameState, mineCount, x, y, safety, leftHandedMenu } = state;
  const width =
    windowType === 'mobile' ? GAME_MODES[difficulty].width : GAME_MODES[difficulty].widthDesktop;
  const height =
    windowType === 'mobile' ? GAME_MODES[difficulty].height : GAME_MODES[difficulty].heightDesktop;
  const mines =
    windowType === 'mobile' ? GAME_MODES[difficulty].mines : GAME_MODES[difficulty].minesDesktop;

  const restart = () => {
    dispatch(resetGame(width, height, windowType));
    reset();
  };

  useEffect(restart, [difficulty]);

  const time = seconds + minutes * 60 + hours * 3600;

  const updateStorage = () => {
    const item = `besttime-${difficulty}`;
    const storageItem = localStorage.getItem(item);
    if ((!storageItem && storageItem !== '0') || (storageItem && time < Number(storageItem))) {
      localStorage.setItem(item, String(time));
    }
  };

  const handleCellClick = (cx: number, cy: number) => {
    if (boardData[cy][cx].isRevealed) return;
    if (gameState === 'ready') {
      // populate board with mines and avoid spawning a mine on first cell clicked
      start(); // timer
      grassSound.play();
      const initialData = computeNeighbours(
        plantMines(boardData, getRandomNumber, width, height, mines, cx, cy),
        width,
        height,
      );
      const revealedData = initialData[cy][cx].isEmpty
        ? revealEmpty(initialData, width, height, cx, cy)
        : initialData;
      if (getHidden(revealedData).length === mines) {
        // insta win
        pause(); // stop timer
        yuppieSound.play();
        updateStorage();
        dispatch(setBoardData(revealBoard(revealedData), 'won'));
      } else {
        dispatch(setBoardData(revealedData, 'started'));
      }
    } else {
      dispatch(selectCell(cx, cy));
    }
  };

  const handleReveal = (cx: number, cy: number) => {
    if (boardData[cy][cx].isRevealed || boardData[cy][cx].isFlagged) return;
    if (boardData[cy][cx].isMine) {
      pause();
      explosionSound.play();
      // game over
      dispatch(setBoardData(explode(revealBoard(boardData), cx, cy), 'lost'));
      return;
    }
    grassSound.load();
    grassSound.play();
    let updatedData = revealMine(boardData, cx, cy);
    if (updatedData[cy][cx].isEmpty) {
      updatedData = revealEmpty(updatedData, width, height, cx, cy);
    }
    if (getHidden(updatedData).length === mines) {
      pause();
      yuppieSound.play();
      updateStorage();
      dispatch(setBoardData(revealBoard(updatedData), 'won'));
    } else {
      dispatch(setBoardData(updatedData));
    }
    dispatch(setMineCount(mines - getFlags(updatedData).length));
  };

  const handleContextMenu = (ev: SyntheticEvent, cx: number, cy: number) => {
    ev.preventDefault();
    if (
      (mineCount === 0 && !boardData[cy][cx].isFlagged) ||
      boardData[cy][cx].isRevealed ||
      gameState === 'ready'
    ) {
      return;
    }
    const updatedData = flag(boardData, cx, cy);
    const flags = getFlags(updatedData);
    const newMineCount = mines - flags.length;
    if (newMineCount === 0) {
      if (JSON.stringify(getMines(updatedData)) === JSON.stringify(flags)) {
        pause();
        yuppieSound.play();
        updateStorage();
        dispatch(
          setBoardData(revealBoard(updatedData), 'won', mines - getFlags(updatedData).length),
        );
        return;
      }
    }
    dispatch(setBoardData(updatedData, undefined, mines - getFlags(updatedData).length));
  };

  return (
    <Column>
      <Menu
        gameState={gameState}
        dispatch={dispatch}
        mineCount={mineCount}
        time={time}
        difficulty={difficulty}
        restart={restart}
      />
      {gameState === 'lost' && (
        <Modal onClose={() => dispatch(closeModal())}>
          <FailScreen gameState={gameState} difficulty={difficulty} restart={restart} />
        </Modal>
      )}
      {gameState === 'won' && (
        <Modal onClose={() => dispatch(closeModal())}>
          <WinScreen time={time} gameState={gameState} difficulty={difficulty} restart={restart} />
        </Modal>
      )}
      <Board
        boardData={boardData}
        width={width}
        height={height}
        onCellClick={
          gameState === 'ready' || (windowType !== 'desktop' && safety)
            ? handleCellClick
            : handleReveal
        }
        showActionMenu={windowType !== 'desktop' && safety}
        disableSafety={() => dispatch(setSafety(false))}
        toggleMenuOrder={() => dispatch(setMenuOrder(!leftHandedMenu))}
        leftHandedMenu={leftHandedMenu}
        onContextMenu={handleContextMenu}
        selectedX={x}
        selectedY={y}
        onDeselect={() => dispatch(selectCell(null, null))}
        onReveal={handleReveal}
      />
    </Column>
  );
};

export default Minesweeper;
