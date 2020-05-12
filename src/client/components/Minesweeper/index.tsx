import React, { useState, useEffect, SyntheticEvent } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { useStopwatch } from 'react-timer-hook';
import { CellData } from './records/CellData';
import {
  initBoardData,
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

type GameState = 'ready' | 'started' | 'won' | 'lost';

const grassSound = new Audio('/sounds/grass.wav');
const explosionSound = new Audio('/sounds/explosion.wav');
const yuppieSound = new Audio('/sounds/yuppie.wav');

const MINES = [10, 30, 80, 140];
const WIDTHS = [10, 14, 18, 22];
const HEIGHTS = [10, 14, 18, 22];

const Minesweeper = () => {
  const [difficulty, setDifficulty] = useState(
    localStorage.getItem('difficulty') ? Number(localStorage.getItem('difficulty')) : 1,
  );
  const width = WIDTHS[difficulty];
  const height = HEIGHTS[difficulty];
  const mines = MINES[difficulty];
  const [gameCount, setGameCount] = useState(1);
  const [boardData, setBoardData] = useState<CellData[][]>([[]]);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [mineCount, setMineCount] = useState<number>(mines);
  const { seconds, minutes, hours, start, pause, reset } = useStopwatch({
    autoStart: false,
  });

  useEffect(() => {
    setBoardData(initBoardData(width, height));
    setGameState('ready');
    setMineCount(mines);
    reset();
  }, [gameCount, difficulty]);

  const handleCellClick = (x: number, y: number) => {
    if (boardData[y][x].isRevealed || boardData[y][x].isFlagged) return;
    if (gameState === 'ready') {
      // populate board with mines and avoid spawning one on first cell clicked
      start();
      grassSound.play();
      setGameState('started');
      const initialData = computeNeighbours(
        plantMines(boardData, getRandomNumber, width, height, mines, x, y),
        width,
        height,
      );
      const revealedData = initialData[y][x].isEmpty
        ? revealEmpty(initialData, width, height, x, y)
        : initialData;
      if (getHidden(revealedData).length === mines) {
        pause();
        yuppieSound.play().then(() => {
          setGameState('won');
          setBoardData(revealBoard(revealedData));
          setTimeout(() => alert('You Win'), 10);
        });
      } else {
        setBoardData(revealedData);
      }
      return;
    }
    if (boardData[y][x].isMine) {
      pause();
      explosionSound.play().then(() => {
        setBoardData(revealBoard(boardData));
        setGameState('lost');
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
      setGameState('won');
      setBoardData(revealBoard(updatedData));
      setTimeout(() => alert('You Win'), 10);
    } else {
      setBoardData(updatedData);
    }
    setMineCount(mines - getFlags(updatedData).length);
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
        setGameState('won');
        setBoardData(revealBoard(updatedData));
        setTimeout(() => alert('You Win'), 10);
        setMineCount(mines - getFlags(updatedData).length);
        return;
      }
    }
    setBoardData(updatedData);
    setMineCount(mines - getFlags(updatedData).length);
  };

  const time = seconds + minutes * 60 + hours * 3600;

  return (
    <Column>
      <Menu>
        <select
          value={difficulty}
          onChange={(e) => {
            localStorage.setItem('difficulty', e.target.value);
            setDifficulty(Number(e.target.value));
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
          onClick={() => setGameCount(gameCount + 1)}
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
