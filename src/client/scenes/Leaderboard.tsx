import React, { useEffect, useState } from 'react';
import * as R from 'ramda';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import styled from 'styled-components';
import Column from '../primitives/Column';
import media from '../services/media/index';
import Row from '../primitives/Row';
import GAME_MODES from '../components/Minesweeper/consts/gameModes';

const API = 'https://us-central1-minesweeper-f0d1f.cloudfunctions.net/getScores';

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

const CenteredRow = styled(Row)`
  align-items: center;
`;

const FullWidthColumn = styled(Column)`
  box-sizing: border-box;
  padding: 0 12px;
  width: 100%;
`;

const FooterMenu = styled(CenteredColumn)`
  padding: 20px 4px;
`;

const MenuLink = styled(Link)`
  text-transform: uppercase;
  padding: 20px 4px;
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
    font-size: 24px;
  }
`;

const H1 = styled.h2`
  margin: 0;
  margin-block-start: 60px;
  margin-block-end: 40px;
  margin-inline-start: 0;
  margin-inline-end: 0;
  font-size: 22px;
  ${media.smallMobile} {
    font-size: 24px;
  }
  ${media.mobile} {
    font-size: 28px;
  }
  ${media.tablet} {
    font-size: 48px;
  }
`;

const NumberDiv = styled.div`
  font-size: 10px;
  color: gray;
  text-align: left;
  width: 40px;
  ${media.smallMobile} {
    font-size: 12px;
  }
  ${media.tablet} {
    font-size: 14px;
    width: 50px;
  }
`;

const DateDiv = styled.div`
  text-align: left;
  color: gray;
  font-size: 7px;
  padding: 4px 0;
  ${media.smallMobile} {
    font-size: 8px;
  }
  ${media.tablet} {
    font-size: 10px;
  }
`;

const Name = styled.div`
  text-align: left;
  font-size: 11px;
  margin-right: 8px;
  ${media.smallMobile} {
    font-size: 12px;
  }
  ${media.tablet} {
    font-size: 14px;
  }
`;

const ScoreDiv = styled.div`
  font-size: 10px;
  ${media.smallMobile} {
    font-size: 12px;
  }
  ${media.tablet} {
    font-size: 14px;
  }
`;

const getColor = (difficulty: number): string => {
  if (difficulty === 0) {
    return 'limegreen';
  }
  if (difficulty === 1) {
    return 'lightblue';
  }
  if (difficulty === 2) {
    return 'darkblue';
  }
  if (difficulty === 3) {
    return 'red';
  }
  if (difficulty === 4) {
    return 'darkred';
  }
  return 'gold';
};

const SpaceBetween = styled(Row)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

type DiffProps = {
  difficulty: number;
};

const Diff = styled.div<DiffProps>`
  font-size: 16px;
  text-align: left;
  padding: 20px 0;
  color: ${({ difficulty }) => getColor(difficulty)};
  ${media.smallMobile} {
    font-size: 22px;
  }
`;

type Score = {
  id: string;
  difficulty: number;
  score: number;
  user: string;
  createdAt: Date;
};

// @ts-ignore
const groupByDifficulty = R.groupBy(R.prop('difficulty'));

// @ts-ignore
const sortByScore = R.sortBy(R.prop('score'));

const Leaderboard = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    async function getScores() {
      fetch(API)
        .then((res) => res.json())
        .then((json) => {
          // eslint-disable-next-line no-underscore-dangle
          setScores(json);
        });
    }
    getScores();
  }, []);

  const groupedScores = groupByDifficulty(scores);

  return (
    <Container>
      <Main>
        <CenteredColumn>
          <H1>Leaderboard</H1>
          <FullWidthColumn>
            {!scores.length && 'Loading...'}
            {Object.keys(groupedScores)
              .sort()
              .reverse()
              .map((diff: string) => (
                <Column key={diff}>
                  <Diff difficulty={Number(diff)}>{GAME_MODES[Number(diff)].name}</Diff>
                  {/*
                    // @ts-ignore */}
                  {sortByScore(groupedScores[diff]).map((score: Score, i: number) => (
                    <CenteredRow key={score.id}>
                      <NumberDiv>{i + 1}.</NumberDiv>
                      <SpaceBetween>
                        <Column>
                          <DateDiv>{format(new Date(score.createdAt), 'MMM d, yyyy')}</DateDiv>
                          <Name>{score.user}</Name>
                        </Column>
                        <ScoreDiv>{score.score}</ScoreDiv>
                      </SpaceBetween>
                    </CenteredRow>
                  ))}
                </Column>
              ))}
          </FullWidthColumn>
        </CenteredColumn>
        <FooterMenu>
          <MenuLink to="/">Go back</MenuLink>
        </FooterMenu>
      </Main>
    </Container>
  );
};

export default Leaderboard;
