import React from 'react';
import { Flex, Text } from 'rebass/styled-components';
import styled from 'styled-components';

type Props = {
  isRevealed: boolean;
  isMine: boolean;
  isFlagged: boolean;
  neighbour: number;
  onClick: () => void;
  onContextMenu: () => void;
};

type RootProps = {
  isRevealed: boolean;
};

const getColor = (neighbour: number) => {
  if (neighbour === 5) {
    return '#FD8F25';
  }
  if (neighbour === 4) {
    return '#7A27A0';
  }
  if (neighbour === 3) {
    return '#D13135';
  }
  if (neighbour === 2) {
    return '#54954E';
  }
  return '#2278CF';
};

const Root = styled(Flex)<RootProps>`
  cursor: pointer;
  box-sizing: border-box;
  box-shadow: inset 0px 0 5px 1px rgba(0, 0, 0, 0.5);
  background: ${({ isRevealed }) =>
    isRevealed ? `url('/images/ground.png')` : `url('/images/grass.png')`};
  background-repeat: no-repeat;
  background-size: cover;
`;

const Cell = ({ isRevealed, isMine, isFlagged, neighbour, onClick, onContextMenu }: Props) => {
  let content = `${neighbour}`;
  if (!isRevealed) {
    content = isFlagged ? '🚩' : '';
  } else if (isMine) {
    content = '💣';
  } else if (neighbour === 0) {
    content = '';
  }
  return (
    <Root
      width={1}
      onClick={onClick}
      onContextMenu={onContextMenu}
      alignItems="center"
      justifyContent="center"
      isRevealed={isRevealed}
    >
      <Text fontSize={4} fontWeight={700} color={getColor(neighbour)} bg="black">
        {content}
      </Text>
    </Root>
  );
};

export default Cell;
