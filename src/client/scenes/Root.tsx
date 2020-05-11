import React, { useState } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader';
import Minesweeper from '../components/Minesweeper';
import Column from '../primitives/Column';
import Row from '../primitives/Row';

const Container = styled(Column)`
  align-items: center;
  height: 100vh;
  color: ${({ theme }) => theme.colors.text};
  background-color: #588939;
`;

const Main = styled.main`
  width: 100%;
  max-width: 500px;
`;

const Menu = styled(Row)`
  margin-top: 16px;
  label {
    font-size: 18px;
  }
  input {
    margin: 0 12px 0 8px;
    width: 40px;
  }
`;

const MINES = [5, 10, 20, 40, 99, 150];
const WIDTHS = [8, 10, 12, 16, 20, 24];
const HEIGHTS = [8, 10, 12, 16, 20, 24];

const Root = () => {
  const [difficulty, setDifficulty] = useState(2);
  const [gameCount, setGameCount] = useState(1);

  const width = WIDTHS[difficulty];
  const height = HEIGHTS[difficulty];
  const mines = MINES[difficulty];

  return (
    <Container>
      <Main>
        <Menu>
          <select value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))}>
            <option value="0">Very Easy</option>
            <option value="1">Easy</option>
            <option value="2">Normal</option>
            <option value="3">Hard</option>
            <option value="4">Very Hard</option>
            <option value="5">You Shall Not Pass</option>
          </select>
          <button type="button" onClick={() => setGameCount(gameCount + 1)}>
            New Game
          </button>
        </Menu>
        <Minesweeper width={width} height={height} mines={mines} gameCount={gameCount} />
      </Main>
    </Container>
  );
};

export default hot(module)(Root);
