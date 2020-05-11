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
  border-top: ${({ isRevealed }) => (isRevealed ? '1px solid #9B9B9B' : '3px solid #F7F7F7')};
  border-right: ${({ isRevealed }) => (isRevealed ? '1px solid #989898' : '3px solid #818181')};
  border-bottom: ${({ isRevealed }) => (isRevealed ? '1px solid #989898' : '3px solid #818181')};
  border-left: ${({ isRevealed }) => (isRevealed ? '1px solid #989898' : '3px solid #F7F7F7')};
  background-color: #c0c0c0;
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
      <Text fontSize={4} fontWeight={700} color={getColor(neighbour)}>
        {content}
      </Text>
    </Root>
  );
};

export default Cell;
