import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';

type Props = {
  width: number;
  exploded: boolean;
  wrongFlag: boolean;
  isRevealed: boolean;
  isMine: boolean;
  isFlagged: boolean;
  neighbour: number;
  onClick: () => void;
  onContextMenu: (ev: SyntheticEvent) => void;
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

type ImageProps = {
  boardWidth: number;
  wrongFlag?: boolean;
};

const Image = styled.img<ImageProps>`
  width: ${({ boardWidth }) => 250 / boardWidth}px;
`;

const getContent = (
  width: number,
  isRevealed: boolean,
  isFlagged: boolean,
  isMine: boolean,
  neighbour: number,
  exploded: boolean,
  wrongFlag: boolean,
): React.ReactNode => {
  if (!isRevealed) {
    if (isFlagged) {
      return <Image boardWidth={width} src="/images/sign.png" alt="warning sign" />;
    }
    return '';
  }
  if (wrongFlag) {
    // if wrong flag it was either cell with 0 or n neighbours
    return <Image boardWidth={width} src="/images/thumb_down.png" alt="thumb down" />;
  }
  if (isMine) {
    if (exploded) {
      return <Image boardWidth={width} alt="exploded mine" src="/images/boom.png" />;
    }
    return <Image boardWidth={width} src="/images/tnt.png" alt="bomb" />;
  }
  if (neighbour === 0) {
    return '';
  }
  return neighbour;
};

type RootProps = {
  isRevealed: boolean;
};

const Root = styled.div<RootProps>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;
  box-sizing: border-box;
  box-shadow: inset 0px 0 2px 1px rgba(0, 0, 0, 0.5);
  background: ${({ isRevealed }) =>
    isRevealed ? `url('/images/ground.png')` : `url('/images/grass.png')`};
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
`;

type LabelProps = {
  neighbour: number;
  isMine: boolean;
  isFlagged: boolean;
  wrongFlag: boolean;
};

const Label = styled.div<LabelProps>`
  position: absolute;
  padding: 4px;
  font-size: 1em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  background-color: ${({ isMine, isFlagged, wrongFlag }) =>
    isMine || isFlagged || wrongFlag ? 'none' : 'rgba(0, 0, 0, 0.65)'};
  color: ${({ neighbour }) => getColor(neighbour)};
`;

const Cell = ({
  width,
  isRevealed,
  isMine,
  isFlagged,
  exploded,
  wrongFlag,
  neighbour,
  onClick,
  onContextMenu,
}: Props) => {
  const content = getContent(width, isRevealed, isFlagged, isMine, neighbour, exploded, wrongFlag);
  return (
    <Root onClick={onClick} onContextMenu={onContextMenu} isRevealed={isRevealed}>
      {content && (
        <Label neighbour={neighbour} isMine={isMine} isFlagged={isFlagged} wrongFlag={wrongFlag}>
          {content}
        </Label>
      )}
    </Root>
  );
};

export default React.memo(Cell);
