import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Column from '../primitives/Column';
import media from '../services/media/index';

const Container = styled(Column)`
  align-items: center;
  color: white;
  user-select: none;
`;

const Main = styled.main`
  font-family: PressStartBold;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 100%;
  max-width: 500px;
  ${media.tablet} {
    max-width: 600px;
  }
`;

const CenteredColumn = styled(Column)`
  align-items: center;
  text-align: center;
`;

const Menu = styled(Column)`
  ${media.smallMobile} {
    margin-top: 40px;
  }
  ${media.tablet} {
    margin-top: 80px;
  }
`;

const MenuLink = styled(Link)`
  text-transform: uppercase;
  padding: 8px;
  color: white;
  font-size: 16px;
  text-decoration: none;
  ${media.smallMobile} {
    font-size: 18px;
  }
  ${media.mobile} {
    font-size: 20px;
  }
  ${media.tablet} {
    font-size: 28px;
  }
`;

const H1 = styled.h1`
  margin: 0;
  margin-block-start: 60px;
  margin-block-end: 60px;
  margin-inline-start: 0;
  margin-inline-end: 0;
  font-size: 26px;
  ${media.smallMobile} {
    font-size: 30px;
  }
  ${media.mobile} {
    font-size: 32px;
  }
  ${media.tablet} {
    font-size: 64px;
  }
`;

const Copy = styled.div`
  text-transform: uppercase;
  margin: 20px 0;
  padding: 8px;
  text-align: center;
  font-size: 12px;
  ${media.tablet} {
    font-size: 18px;
  }
`;

const AuthInfo = styled.div`
  text-align: center;
  font-size: 12px;
  line-height: 1.5;
  ${media.tablet} {
    font-size: 14px;
  }
`;

const Email = styled.span`
  color: purple;
`;

const Github = styled.a`
  color: white;
  text-decoration: none;
`;

const MainMenu = () => (
  <Container>
    <Main>
      <CenteredColumn>
        <H1>Minesweeper Beta</H1>
        <Menu>
          <MenuLink to="/game">Start</MenuLink>
          <MenuLink to="/leaderboard">Leaderboard</MenuLink>
        </Menu>
      </CenteredColumn>
      <Column>
        <Copy>
          &copy; 2020{' '}
          <Github href="https://github.com/halafi" target="_blank" rel="noopener noreferrer">
            Fulup Studios
          </Github>
        </Copy>
      </Column>
    </Main>
  </Container>
);

export default MainMenu;
