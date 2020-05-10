import React from 'react';
import { Flex } from 'rebass/styled-components';
import styled from 'styled-components';

type Props = {
  isRevealed: boolean;
  isMine: boolean;
  isFlagged: boolean;
  neighbour: number;
  onClick: () => void;
};

const Root = styled(Flex)`
  cursor: pointer;
  border: 1px solid black;
`;

const Cell = ({ isRevealed, isMine, isFlagged, neighbour, onClick }: Props) => {
  let content = `${neighbour}`;
  if (!isRevealed) {
    content = isFlagged ? '🚩' : '';
  } else if (isMine) {
    content = '💣';
  } else if (neighbour === 0) {
    return '';
  }
  return (
    <Root width={1} p={1} onClick={onClick}>
      {content}
    </Root>
  );
};

export default Cell;
