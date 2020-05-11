import React, { useState, useEffect, SyntheticEvent } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
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

type Props = {
  height: number;
  width: number;
  mines: number;
  gameCount: number;
};

const Image = styled.img`
  width: 28px;
  height: 28px;
`;

const Text = styled.span`
  display: flex;
  align-items: center;
  margin: 4px 0;
  font-size: 28px;
  font-weight: 700;
  #sign {
    margin-right: 8px;
  }
`;

type GameState = 'ready' | 'started' | 'won' | 'lost';

const Minesweeper = ({ width, height, mines, gameCount }: Props) => {
  const [boardData, setBoardData] = useState<CellData[][]>([[]]);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [mineCount, setMineCount] = useState<number>(mines);

  useEffect(() => {
    setBoardData(initBoardData(width, height));
    setGameState('ready');
    setMineCount(mines);
  }, [width, height, mines, gameCount]);

  const handleCellClick = (x: number, y: number) => {
    if (boardData[y][x].isRevealed || boardData[y][x].isFlagged) return;
    if (gameState === 'ready') {
      // populate board with mines and avoid spawning one on first cell clicked
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
        setGameState('won');
        setBoardData(revealBoard(revealedData));
        setTimeout(() => alert('You Win'), 10);
      } else {
        setBoardData(revealedData);
      }
      return;
    }
    if (boardData[y][x].isMine) {
      setBoardData(revealBoard(boardData));
      setGameState('lost');
      alert('Game Over');
      return;
    }
    let updatedData = R.clone(boardData);
    updatedData[y][x].isFlagged = false;
    updatedData[y][x].isRevealed = true;
    if (updatedData[y][x].isEmpty) {
      updatedData = revealEmpty(updatedData, width, height, x, y);
    }
    if (getHidden(updatedData).length === mines) {
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

  return (
    <Column>
      <Text>
        <Image id="sign" src="/images/sign.png" alt="warning sign" />
        {mineCount}
      </Text>
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
