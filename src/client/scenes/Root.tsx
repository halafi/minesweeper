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
  background-color: black;
`;

const Main = styled.main`
  width: 100%;
  max-width: 500px;
`;

const Menu = styled(Row)`
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  margin-top: 16px;
  button {
    width: 100;
    border-radius: 5px;
  }
`;

const Restart = styled.span`
  font-size: 28px;
  cursor: pointer;
`;

const MINES = [10, 20, 40, 99, 200];
const WIDTHS = [10, 12, 16, 24, 24];
const HEIGHTS = [10, 12, 16, 24, 24];

const Root = () => {
  const [difficulty, setDifficulty] = useState(1);
  const [gameCount, setGameCount] = useState(1);

  const width = WIDTHS[difficulty];
  const height = HEIGHTS[difficulty];
  const mines = MINES[difficulty];

  return (
    <Container>
      <Main>
        <Menu>
          <select value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))}>
            <option value="0">Easy</option>
            <option value="1">Normal</option>
            <option value="2">Hard</option>
            <option value="3">Very Hard</option>
            <option value="4">Nightmare</option>
          </select>
          {/* eslint-disable-next-line */}
          <Restart
            role="img"
            aria-label="refersh"
            onClick={() => setGameCount(gameCount + 1)}
            tabIndex={0}
          >
            🔄
          </Restart>
        </Menu>
        <Minesweeper width={width} height={height} mines={mines} gameCount={gameCount} />
      </Main>
    </Container>
  );
};

export default hot(module)(Root);
