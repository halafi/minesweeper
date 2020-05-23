import React from 'react';
import styled from 'styled-components';
import Column from '../../../../primitives/Column';
import media from '../../../../services/media';
import type { GameState } from '../../services/reducer';

const ModalContent = styled(Column)`
  color: white;
  padding: 8px;
  align-items: center;
  font-size: 18px;
`;

const CoverImage = styled.img`
  width: 300px;
  min-height: 200px;
  ${media.tablet} {
    width: 350px;
  }
`;

const ModalText = styled.span`
  white-space: nowrap;
  text-align: center;
  margin: 12px 0;
`;

const LargeIcon = styled.img`
  cursor: pointer;
  width: 32px;
`;

const Image = styled.img`
  width: 22px;
`;

type Props = {
  difficulty: number;
  gameState: GameState;
  restart: () => void;
};

const FailScreen = ({ difficulty, restart, gameState }: Props) => (
  <ModalContent>
    <CoverImage src="/images/elmosion.jpg" alt="explosion" />
    <ModalText>
      <Image id="clock" src="/images/trophy.png" alt="trophy" /> Personal Best:{' '}
      {localStorage.getItem(`besttime-${difficulty}`) || '---'}
    </ModalText>
    <LargeIcon
      src="/images/arrows_counterclockwise.png"
      alt="restart"
      onClick={() => {
        if (gameState !== 'ready') {
          restart();
        }
      }}
    />
  </ModalContent>
);

export default FailScreen;
