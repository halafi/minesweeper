import React from 'react';
import styled from 'styled-components';
import Minesweeper from '../components/Minesweeper';
import Column from '../primitives/Column';
import media from '../services/media/index';

const Container = styled(Column)`
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
`;

const Main = styled.main`
  width: 100%;
  max-width: 500px;
  ${media.tablet} {
    max-width: 600px;
  }
`;

const Singleplayer = () => {
  return (
    <Container>
      <Main>
        <Minesweeper />
      </Main>
    </Container>
  );
};

export default Singleplayer;
