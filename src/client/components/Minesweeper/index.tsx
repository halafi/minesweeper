import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Flex } from 'rebass/styled-components';
import Cell from './components/Cell';
import { CellData } from './records/CellData';
import {
  initBoardData,
  computeNeighbours,
  plantMines,
  revealBoard,
  getRandomNumber,
} from './services/utils';

type Props = {
  height: number;
  width: number;
  mines: number;
};

const Root = styled(Flex)`
  width: 100%;
  max-width: 500px;
  height: 100%;
  height: 500px;
`;

type GameState = 'ready' | 'started' | 'won' | 'lost';

const Minesweeper = ({ width, height, mines }: Props) => {
  const [boardData, setBoardData] = useState<CellData[][]>([[]]);
  const [gameState, setGameState] = useState<GameState>('ready');

  useEffect(() => {
    setBoardData(initBoardData(height, width));
  }, [width, height, mines]);

  const handleCellClick = (x: number, y: number) => {
    if (boardData[y][x].isRevealed) {
      return null;
    }
    // let win = false;

    if (gameState === 'ready') {
      // populate board with mines and avoid spawning one on first cell clicked
      setGameState('started');
      setBoardData(
        computeNeighbours(
          plantMines(boardData, getRandomNumber, width, height, mines, x, y),
          width,
          height,
        ),
      );
    }

    // setBoardData([]);

    console.log(x, 'x');
    console.log(y, 'y');

    if (boardData[y][x].isMine) {
      setBoardData(revealBoard(boardData));
      setGameState('lost');
      alert('game over');
    }

    // TODO: fp
    const updatedData = revealBoard([...boardData]);
    updatedData[y][x].isFlagged = false;
    updatedData[y][x].isRevealed = true;

    if (updatedData[y][x].isEmpty) {
      // TODO: reveal empty
      // updatedData = this.revealEmpty(x, y, updatedData);
    }

    // TODO: getHidden + win
    // if (this.getHidden(updatedData).length === mines) {
    // win = true;
    // this.revealBoard();
    //   alert('You Win');
    // }

    setBoardData(updatedData);
    // setMineCount(mines - this.getFlags(updatedData).length);
    // setWon(win);
  };

  console.log(boardData);

  return (
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
  );
};

export default Minesweeper;
