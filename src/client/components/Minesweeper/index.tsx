import React, { useReducer, useEffect, SyntheticEvent, Reducer } from 'react';
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
  flag,
  revealMine,
  explode,
} from './services/utils';
import Board from './components/Board/index';
import Column from '../../primitives/Column';
import Row from '../../primitives/Row';
import media from '../../services/media/index';
import minesweeperReducer, {
  resetGame,
  setBoardData,
  setMineCount,
  setDifficulty,
  closeModal,
  selectCell,
} from './services/reducer';
import type { State, MinesweeperActions } from './services/reducer';
import GAME_MODES from './consts/gameModes';
import Modal from '../Modal';

const Restart = styled.span`
  font-size: 28px;
  cursor: pointer;
`;
const Image = styled.img`
  width: 22px;
  height: 22px;
`;

const CoverImage = styled.img`
  width: 300px;
  min-height: 200px;
  ${media.tablet} {
    width: 350px;
  }
`;

const ModalContent = styled(Column)`
  color: white;
  padding: 8px;
  align-items: center;
  font-size: 18px;
`;

const ModalText = styled.span`
  white-space: nowrap;
  text-align: center;
  margin: 12px 0;
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
    x: null,
    y: null,
  });
  const { seconds, minutes, hours, start, pause, reset } = useStopwatch({
    autoStart: false,
  });
  const { difficulty, boardData, gameState, mineCount, x, y } = state;
  const { width, height, mines } = GAME_MODES[difficulty];

  const restart = () => {
    dispatch(resetGame(width, height));
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
        yuppieSound.play().then(() => {
          updateStorage();
          dispatch(setBoardData(revealBoard(revealedData), 'won'));
        });
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
      explosionSound.play().then(() => {
        // game over
        dispatch(setBoardData(explode(revealBoard(boardData), cx, cy), 'lost'));
      });
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
      yuppieSound.play().then(() => {
        updateStorage();
        dispatch(setBoardData(revealBoard(updatedData), 'won'));
      });
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

  const RestartNode = (
    // eslint-disable-next-line
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
  );

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
          {GAME_MODES.map((mode, i) => (
            <option key={mode.name} value={i}>
              {mode.name}
            </option>
          ))}
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
        {RestartNode}
      </Menu>
      {gameState === 'lost' && (
        <Modal onClose={() => dispatch(closeModal())}>
          <ModalContent>
            <CoverImage src="/images/elmosion.jpg" alt="explosion" />
            <ModalText>
              <span role="img" aria-label="trophy">
                🏆
              </span>{' '}
              Best time ({GAME_MODES[difficulty].name}):{' '}
              {localStorage.getItem(`besttime-${difficulty}`) || '---'}
            </ModalText>
            {RestartNode}
          </ModalContent>
        </Modal>
      )}
      {gameState === 'won' && (
        <Modal onClose={() => dispatch(closeModal())}>
          <ModalContent>
            <CoverImage src="/images/win.jpg" alt="win" />
            <ModalText>
              <span role="img" aria-label="trophy">
                🏆
              </span>{' '}
              Best time ({GAME_MODES[difficulty].name}):{' '}
              {localStorage.getItem(`besttime-${difficulty}`) || '---'}
            </ModalText>
            <ModalText>
              <span role="img" aria-label="time">
                ⏰
              </span>
              Current run: {time}
            </ModalText>
            {RestartNode}
          </ModalContent>
        </Modal>
      )}
      <Board
        boardData={boardData}
        width={width}
        height={height}
        onCellClick={handleCellClick}
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
