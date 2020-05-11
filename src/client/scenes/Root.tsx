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
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 16px;
  border-bottom: 1px solid black;
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

const Root = () => {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [mines, setMines] = useState(4);
  const [gameCount, setGameCount] = useState(1);

  return (
    <Container>
      <Header>
        <h1>Minesweeper</h1>
      </Header>
      <main>
        <Menu>
          <label htmlFor="width">
            Width:
            <input
              id="width"
              type="number"
              min={1}
              max={64}
              value={width}
              onChange={(e) =>
                e.target.validity.valid && e.target.value
                  ? setWidth(parseInt(e.target.value, 10))
                  : {}
              }
            />
          </label>
          <label htmlFor="height">
            Height:
            <input
              id="height"
              type="number"
              min={1}
              max={64}
              value={height}
              onChange={(e) =>
                e.target.validity.valid && e.target.value
                  ? setHeight(parseInt(e.target.value, 10))
                  : {}
              }
            />
          </label>
          <label htmlFor="mines">
            Mines:
            <input
              id="mines"
              min={1}
              max={width * height - 1}
              type="number"
              value={mines}
              onChange={(e) =>
                e.target.validity.valid && e.target.value
                  ? setMines(parseInt(e.target.value, 10))
                  : {}
              }
            />
          </label>
          <button type="button" onClick={() => setGameCount(gameCount + 1)}>
            New Game
          </button>
        </Menu>
        <Minesweeper width={width} height={height} mines={mines} gameCount={gameCount} />
      </main>
    </Container>
  );
};

export default hot(module)(Root);
