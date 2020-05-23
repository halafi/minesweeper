import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Row from '../../../../primitives/Row';
import media from '../../../../services/media/index';
import SelectButton from '../../../ButtonSelect';
import GAME_MODES from '../../consts/gameModes';
import { setDifficulty } from '../../services/reducer';
import type { MinesweeperActions, GameState } from '../../services/reducer';
import Modal from '../../../Modal';
import Column from '../../../../primitives/Column';

const GoBackLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding-right: 8px;
`;

const RowCentered = styled(Row)`
  align-items: center;
`;

const Center = styled(Row)`
  align-items: center;
  justify-content: center;
`;

const Root = styled(Row)`
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 12px 8px;
  font-weight: 700;
  #sign,
  #clock {
    margin-right: 8px;
  }
  #clock {
    margin-left: 32px;
  }
  font-size: 16px;
  ${media.smallMobile} {
    font-size: 20px;
  }
  ${media.tablet} {
    font-size: 24px;
    padding: 12px 0;
  }
`;

const DifficultySymbol = styled.img`
  width: 22px;
`;

const Image = styled.img`
  width: 14px;
  height: 14px;
  ${media.smallMobile} {
    width: 18px;
    height: 18px;
  }
  ${media.tablet} {
    width: 22px;
    height: 22px;
  }
`;

const LargeIcon = styled.img`
  cursor: pointer;
  display: flex;
  height: auto;
  width: 26px;
  ${media.smallMobile} {
    width: 28px;
  }
  ${media.tablet} {
    width: 32px;
  }
`;

const ModalContent = styled(Column)`
  border-radius: 5px;
  color: black;
  align-items: center;
  font-size: 18px;
`;

type ModeProps = {
  won: boolean;
  disabled: boolean;
  selected?: boolean;
};

const getColor = (won: boolean, disabled: boolean) => {
  if (won) {
    return '#4C7334';
  }
  if (disabled) {
    return 'gray';
  }
  return '#F5F5F5';
};

const getTextColor = (won: boolean, disabled: boolean) => {
  if (won) {
    return 'white';
  }
  if (disabled) {
    return 'white';
  }
  return 'black';
};

const ModeButton = styled(Row)<ModeProps>`
  cursor: pointer;
  justify-content: center;
  color: ${({ won, disabled }) => getTextColor(won, disabled)};
  background-color: ${({ won, disabled }) => getColor(won, disabled)};
  width: 120px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 8px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  text-align: center;
  align-items: center;
  border: ${({ selected }) => (selected ? '3px solid red' : 'none')};
`;

const VerticalLine = styled.div<ModeProps>`
  box-sizing: border-box;
  height: 8px;
  width: 1px;
  border: 1px solid ${({ won, disabled }) => getColor(won, disabled)};
`;

const CenterRow = styled(Column)`
  align-items: center;
`;

const Name = styled.span`
  margin-bottom: 4px;
`;

const BestTime = styled.span`
  color: white;
`;

type Props = {
  difficulty: number;
  mineCount: number;
  time: number;
  gameState: GameState;
  dispatch: React.Dispatch<MinesweeperActions>;
  restart: () => void;
};

const Menu = ({ difficulty, mineCount, time, gameState, dispatch, restart }: Props) => {
  const [open, setOpen] = useState(false);

  const setDiff = (diff: number) => {
    localStorage.setItem('difficulty', String(diff));
    dispatch(setDifficulty(diff));
    setOpen(false);
  };

  const gameModes = GAME_MODES.map((mode, i) => {
    const storageItem = localStorage.getItem(`besttime-${i}`);
    const bestTime = storageItem === '0' || storageItem ? Number(storageItem) : null;
    return {
      ...mode,
      bestTime,
    };
  });

  return (
    <Root>
      <RowCentered>
        <GoBackLink to="/">
          <LargeIcon id="back" src="/images/back.png" alt="go back" />
        </GoBackLink>
        <SelectButton onClick={() => setOpen(true)}>{GAME_MODES[difficulty].name}</SelectButton>
      </RowCentered>
      {open && (
        <Modal onClose={() => setOpen(false)} closeOnClickOut closeButton={false}>
          <ModalContent>
            {gameModes.map((mode, i) => {
              const disabled =
                gameModes[i - 1] && !gameModes[i - 1].bestTime && gameModes[i - 1].bestTime !== 0;
              const won = Boolean(mode.bestTime || mode.bestTime === 0);
              const selected = i === difficulty;
              return (
                <CenterRow key={mode.name}>
                  <ModeButton
                    role="button"
                    tabIndex={0}
                    onClick={() => setDiff(i)}
                    won={won}
                    disabled={disabled}
                    selected={selected}
                  >
                    <Column>
                      <Name>{mode.name}</Name>
                      <BestTime>
                        {/* eslint-disable-next-line */}
                        {mode.bestTime || mode.bestTime === 0 ? (
                          <Center>
                            <DifficultySymbol src="/images/trophy.png" alt="trophy" />{' '}
                            {mode.bestTime}
                          </Center>
                        ) : (
                          <DifficultySymbol src="/images/crossed_swords.png" alt="crossed swords" />
                        )}
                      </BestTime>
                    </Column>
                  </ModeButton>
                  {i < gameModes.length - 1 && (
                    <VerticalLine
                      won={Boolean(mode.bestTime || mode.bestTime === 0)}
                      disabled={disabled}
                    />
                  )}
                </CenterRow>
              );
            })}
          </ModalContent>
        </Modal>
      )}
      <div>
        <Image id="sign" src="/images/sign.png" alt="warning sign" />
        {mineCount}
        <Image id="clock" src="/images/alarm_clock.png" alt="alarm clock" />
        {time}
      </div>
      <LargeIcon
        id="refresh"
        src="/images/arrows_counterclockwise.png"
        alt="restart"
        onClick={() => {
          if (gameState !== 'ready') {
            restart();
          }
        }}
      />
    </Root>
  );
};

export default Menu;
