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

const Root = styled(Flex)`
  cursor: pointer;
  border: 1px solid black;
`;

const Cell = ({ isRevealed, isMine, isFlagged, neighbour, onClick, onContextMenu }: Props) => {
  let content = `${neighbour}`;
  if (!isRevealed) {
    content = isFlagged ? '🚩' : '';
  } else if (isMine) {
    content = '💣';
  } else if (neighbour === 0) {
    return '';
  }
  return (
    <Root
      width={1}
      onClick={onClick}
      onContextMenu={onContextMenu}
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize={4} fontWeight={700} color={neighbour >= 3 ? 'red' : 'initial'}>
        {content}
      </Text>
    </Root>
  );
};

export default Cell;
