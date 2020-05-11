import React, { useState } from 'react';
import { Box, Flex } from 'rebass/styled-components';
import styled from 'styled-components';
import { hot } from 'react-hot-loader';
import Minesweeper from '../components/Minesweeper';

const Container = styled(Flex)`
  height: 100vh;
  color: ${({ theme }) => theme.colors.text};
`;

const Header = styled(Flex)`
  border-bottom: 1px solid black;
`;

const Menu = styled(Flex)`
  label {
    font-size: 18px;
  }
  input {
    margin: 0 12px 0 8px;
    width: 40px;
  }
`;

const Root = () => {
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(20);
  const [mines, setMines] = useState(4);
  const [gameCount, setGameCount] = useState(1);

  return (
    <Container flexDirection="column" alignItems="center">
      <Header as="header" alignItems="center" width={1} px={4}>
        <h1>Minesweeper</h1>
      </Header>
      <main>
        <Menu mt={4}>
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
        <Box mt={4}>
          <Minesweeper width={width} height={height} mines={mines} gameCount={gameCount} />
        </Box>
      </main>
    </Container>
  );
};

export default hot(module)(Root);
