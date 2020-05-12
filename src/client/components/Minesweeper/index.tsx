import React, { useReducer, useEffect, SyntheticEvent, Reducer } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
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
} from './services/utils';
import Board from './components/Board/index';
import Column from '../../primitives/Column';
import Row from '../../primitives/Row';
import media from '../../services/media/index';
import minesweeperReducer, {
  resetGame,
  setGameState,
  setBoardData,
  setMineCount,
  setDifficulty,
} from './services/reducer';
import type { State, MinesweeperActions } from './services/reducer';
import GAME_MODES from './consts/gameModes';

const Restart = styled.span`
  font-size: 28px;
  cursor: pointer;
`;
const Image = styled.img`
  width: 22px;
  height: 22px;
`;

const Menu = styled(Row)`
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 12px 8px;
  font-size: 24px;
  font-weight: 700;
  select {
    font-size: 18px;
  }
  #sign,
  #clock {
    margin-right: 8px;
  }
  #clock {
    margin-left: 32px;
  }
  ${media.tablet} {
    padding: 12px 0;
  }
`;

const grassSound = new Audio('/sounds/grass.wav');
const explosionSound = new Audio('/sounds/explosion.wav');
const yuppieSound = new Audio('/sounds/yuppie.wav');

const Minesweeper = () => {
  const [state, dispatch] = useReducer<Reducer<State, MinesweeperActions>>(minesweeperReducer, {
    difficulty: localStorage.getItem('difficulty') ? Number(localStorage.getItem('difficulty')) : 1,
    boardData: [],
    gameState: 'ready',
    mineCount: 0,
  });
  const { seconds, minutes, hours, start, pause, reset } = useStopwatch({
    autoStart: false,
  });
  const { difficulty, boardData, gameState, mineCount } = state;
  const { width, height, mines } = GAME_MODES[difficulty];

  const restart = () => {
    dispatch(resetGame(width, height));
    reset();
  };

  useEffect(restart, [difficulty]);

  const handleCellClick = (x: number, y: number) => {
    if (boardData[y][x].isRevealed || boardData[y][x].isFlagged) return;
    if (gameState === 'ready') {
      // populate board with mines and avoid spawning a mine on first cell clicked
      start(); // timer
      grassSound.play();
      const initialData = computeNeighbours(
        plantMines(boardData, getRandomNumber, width, height, mines, x, y),
        width,
        height,
      );
      const revealedData = initialData[y][x].isEmpty
        ? revealEmpty(initialData, width, height, x, y)
        : initialData;
      if (getHidden(revealedData).length === mines) {
        // insta win
        pause(); // stop timer
        yuppieSound.play().then(() => {
          dispatch(setBoardData(revealBoard(revealedData), 'won'));
          setTimeout(() => alert('You Win'), 10);
        });
      } else {
        dispatch(setBoardData(revealedData, 'started'));
      }
      return;
    }
    if (boardData[y][x].isMine) {
      pause();
      explosionSound.play().then(() => {
        dispatch(setBoardData(revealBoard(boardData), 'lost'));
        alert('Game Over');
      });
      return;
    }
    grassSound.load();
    grassSound.play();
    let updatedData = R.clone(boardData);
    updatedData[y][x].isFlagged = false;
    updatedData[y][x].isRevealed = true;
    if (updatedData[y][x].isEmpty) {
      updatedData = revealEmpty(updatedData, width, height, x, y);
    }
    if (getHidden(updatedData).length === mines) {
      pause();
      yuppieSound.play();
      dispatch(setBoardData(revealBoard(updatedData), 'won'));
      setTimeout(() => alert('You Win'), 10);
    } else {
      dispatch(setBoardData(updatedData));
    }
    dispatch(setMineCount(mines - getFlags(updatedData).length));
  };

  const handleContextMenu = (ev: SyntheticEvent, x: number, y: number) => {
    ev.preventDefault();
    if (mineCount === 0 || boardData[y][x].isRevealed || gameState === 'ready') return;
    const updatedData = R.clone(boardData);

    if (updatedData[y][x].isFlagged) {
      updatedData[y][x].isFlagged = false;
    } else {
      updatedData[y][x].isFlagged = true;
    }

    const flags = getFlags(updatedData);
    const newMineCount = mines - flags.length;

    if (newMineCount === 0) {
      if (JSON.stringify(getMines(updatedData)) === JSON.stringify(flags)) {
        pause();
        yuppieSound.play();
        dispatch(setGameState('won'));
        dispatch(setBoardData(revealBoard(updatedData)));
        setTimeout(() => alert('You Win'), 10);
        dispatch(setMineCount(mines - getFlags(updatedData).length));
        return;
      }
    }
    dispatch(setBoardData(updatedData));
    dispatch(setMineCount(mines - getFlags(updatedData).length));
  };

  const time = seconds + minutes * 60 + hours * 3600;

  return (
    <Column>
      <Menu>
        <select
          value={difficulty}
          onChange={(e) => {
            localStorage.setItem('difficulty', e.target.value);
            dispatch(setDifficulty(Number(e.target.value)));
          }}
        >
          <option value="0">Easy</option>
          <option value="1">Normal</option>
          <option value="2">Hard</option>
          <option value="3">Very Hard</option>
        </select>
        <div>
          <Image id="sign" src="/images/sign.png" alt="warning sign" />
          {mineCount}
          <span id="clock" role="img" aria-label="clock">
            ⏰
          </span>
          {time}
        </div>
        {/* eslint-disable-next-line */}
        <Restart
          role="img"
          aria-label="refresh"
          onClick={() => {
            if (gameState !== 'ready') {
              restart();
            }
          }}
          tabIndex={0}
        >
          🔄
        </Restart>
      </Menu>
      <Board
        boardData={boardData}
        width={width}
        height={height}
        onCellClick={handleCellClick}
        onContextMenu={handleContextMenu}
      />
    </Column>
  );
};

export default Minesweeper;
