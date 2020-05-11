import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { Flex, Text } from 'rebass/styled-components';
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
  getMines,
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

  const handleContextMenu = (ev: any, x: number, y: number) => {
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
    <Flex flexDirection="column">
      <Text my={2} fontSize={4} fontWeight={700}>
        <span role="img" aria-label="flags">
          🚩
        </span>
        {mineCount}
      </Text>
      <Root flexWrap="wrap">
        {boardData.map((row) =>
          row.map((item) => (
            <Flex key={item.x + item.y * row.length} width={1 / width} height={`${500 / height}px`}>
              <Cell
                isMine={item.isMine}
                isRevealed={item.isRevealed}
                isFlagged={item.isFlagged}
                neighbour={item.neighbour}
                onClick={() => handleCellClick(item.x, item.y)}
                onContextMenu={(ev) => handleContextMenu(ev, item.x, item.y)}
              />
            </Flex>
          )),
        )}
      </Root>
    </Flex>
  );
};

export default Minesweeper;
