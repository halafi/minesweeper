import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { Flex } from 'rebass/styled-components';
import Cell from './components/Cell';
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
} from './services/utils';

type Props = {
  height: number;
  width: number;
  mines: number;
  gameCount: number;
};

const Root = styled(Flex)`
  width: 100%;
  max-width: 500px;
  height: 100%;
  height: 500px;
`;

type GameState = 'ready' | 'started' | 'won' | 'lost';

const Minesweeper = ({ width, height, mines, gameCount }: Props) => {
  const [boardData, setBoardData] = useState<CellData[][]>([[]]);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [mineCount, setMineCount] = useState<number>(mines);

  useEffect(() => {
    setBoardData(initBoardData(height, width));
    setGameState('ready');
    setMineCount(mines);
  }, [width, height, mines, gameCount]);

  const handleCellClick = (x: number, y: number) => {
    if (boardData[y][x].isRevealed) {
      return;
    }
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

  console.log(boardData);

  return (
    <Flex flexDirection="column">
      Mines: {mineCount}
      <Root flexWrap="wrap">
        {boardData.map((row) =>
          row.map((item) => (
            <Flex width={1 / width} key={item.x + item.y * row.length}>
              <Cell
                isMine={item.isMine}
                isRevealed={item.isRevealed}
                isFlagged={item.isFlagged}
                neighbour={item.neighbour}
                onClick={() => handleCellClick(item.x, item.y)}
              />
            </Flex>
          )),
        )}
      </Root>
    </Flex>
  );
};

export default Minesweeper;
