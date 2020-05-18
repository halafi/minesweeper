import React, { useState } from 'react';
import styled from 'styled-components';
import Column from '../../../../primitives/Column';
import GAME_MODES from '../../consts/gameModes';
import type { GameState } from '../../services/reducer';
import Row from '../../../../primitives/Row';

const API = 'https://us-central1-minesweeper-f0d1f.cloudfunctions.net/submitScore';

const ModalContent = styled(Column)`
  color: white;
  padding: 8px;
  align-items: center;
  font-size: 18px;
`;

const ModalText = styled.span`
  white-space: nowrap;
  text-align: center;
  margin: 12px 0;
`;

const SubmitText = styled.div`
  color: white;
  padding-bottom: 8px;
`;

const Restart = styled.span`
  font-size: 28px;
  cursor: pointer;
`;

const CenterRow = styled(Row)`
  margin: 8px 0;
  justify-content: center;
`;

const AlignEndColumn = styled(Column)`
  align-items: flex-end;
`;

const Input = styled.input`
  width: 150px;
`;

const Button = styled.button`
  cursor: pointer;
  background-color: ${({ disabled }) => (disabled ? 'gray' : '#fff')};
  color: black;
  padding: 4px;
  border: 1px solid black;
  border-radius: 5px;
`;

type Props = {
  difficulty: number;
  time: number;
  gameState: GameState;
  restart: () => void;
};

const WinScreen = ({ difficulty, time, gameState, restart }: Props) => {
  const [scoreName, setScoreName] = useState(localStorage.getItem('scoreName') || '');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitScore = (name: string, diff: number, seconds: number) => {
    setSubmitting(true);
    localStorage.setItem('scoreName', name);
    fetch(API, {
      method: 'POST',
      body: JSON.stringify({
        user: name,
        difficulty: diff,
        score: seconds,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        setSubmitted(true);
        setSubmitting(false);
      })
      .catch(() => {
        setSubmitted(false);
        setSubmitting(false);
      });
  };

  return (
    <ModalContent>
      {/* <CoverImage src="/images/win.jpg" alt="win" /> */}
      <h2>You Won</h2>
      <ModalText>
        <span role="img" aria-label="trophy">
          🏆
        </span>{' '}
        Best time ({GAME_MODES[difficulty].name}):{' '}
        {localStorage.getItem(`besttime-${difficulty}`) || '---'}
      </ModalText>
      <ModalText>
        <span role="img" aria-label="time">
          ⏰
        </span>
        Current run: {time}
      </ModalText>
      {!submitted && (
        <ModalText>
          <SubmitText>Submit to global leaderboard?</SubmitText>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (scoreName.length >= 3) {
                submitScore(scoreName, difficulty, time);
              }
            }}
          >
            <AlignEndColumn>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="name">
                Name:{' '}
                <Input
                  id="name"
                  value={scoreName}
                  onChange={(e) => setScoreName(e.target.value)}
                  type="text"
                  placeholder="Jon Doe"
                  maxLength={10}
                />
              </label>
            </AlignEndColumn>
            <CenterRow>
              <Button type="submit" disabled={submitting}>
                Confirm
              </Button>
              <Button type="button" disabled={submitting} onClick={() => setSubmitted(true)}>
                Cancel
              </Button>
            </CenterRow>
          </form>
        </ModalText>
      )}
      {/* eslint-disable-next-line */}
      <Restart
        role="img"
        aria-label="refresh"
        onClick={() => {
          if (gameState !== 'ready') {
            restart();
          }
        }}
        tabIndex={0}
      >
        🔄
      </Restart>
    </ModalContent>
  );
};

export default WinScreen;
