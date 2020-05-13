import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';
import Cell from './components/Cell';
import { CellData } from '../../records/CellData';
import media from '../../../../services/media';
import ActionMenu from './components/ActionMenu';
import Column from '../../../../primitives/Column';

const Root = styled.div`
  display: flex;
  position: relative;
  flex-wrap: wrap;
  height: 500px;
  user-select: none;
  overflow: hidden;
  padding-bottom: 80px;
  ${media.tablet} {
    height: 600px;
  }
`;

type CellWrapperProps = {
  boardWidth: number;
  boardHeight: number;
  selected: boolean;
};

// height: ${({ boardHeight }) => `${500 / boardHeight}px`};
const CellWrapper = styled.div<CellWrapperProps>`
  display: flex;
  box-sizing: border-box;
  width: ${({ boardWidth }) => `${(1 / boardWidth) * 100}%`};
  height: ${({ boardHeight }) => `${500 / boardHeight}px`};
  font-size: ${({ boardWidth }) => `${300 / boardWidth}px`};
  border: ${({ selected }) => (selected ? '2px solid red' : 'none')};
  ${media.tablet} {
    height: ${({ boardHeight }) => `${600 / boardHeight}px`};
  }
`;

type Props = {
  boardData: CellData[][];
  width: number;
  height: number;
  selectedX: number | null;
  selectedY: number | null;
  onCellClick: (x: number, y: number) => void;
  onContextMenu: (ev: any, x: number, y: number) => void;
  onDeselect: () => void;
  onReveal: (x: number, y: number) => void;
};

const Board = ({
  boardData,
  width,
  height,
  onCellClick,
  onContextMenu,
  onDeselect,
  onReveal,
  selectedX,
  selectedY,
}: Props) => {
  const enabled = Boolean((selectedX || selectedX === 0) && (selectedY || selectedY === 0));
  const onDig = () => {
    onReveal(selectedX as number, selectedY as number);
    onDeselect();
  };
  const onFlag = (ev: SyntheticEvent) => {
    onContextMenu(ev, selectedX as number, selectedY as number);
    onDeselect();
  };
  return (
    <>
      <Root>
        {boardData.map((row) =>
          row.map((item) => (
            <CellWrapper
              key={item.x + item.y * row.length}
              boardWidth={width}
              boardHeight={height}
              selected={selectedX === item.x && selectedY === item.y}
            >
              <Cell
                width={width}
                isMine={item.isMine}
                isRevealed={item.isRevealed}
                isFlagged={item.isFlagged}
                exploded={item.exploded || false}
                wrongFlag={item.wrongFlag || false}
                neighbour={item.neighbour}
                onClick={() => onCellClick(item.x, item.y)}
                onContextMenu={(ev: SyntheticEvent) => onContextMenu(ev, item.x, item.y)}
              />
            </CellWrapper>
          )),
        )}
      </Root>
      <ActionMenu enabled={enabled} onDig={onDig} onFlag={onFlag} />
    </>
  );
};

export default React.memo(Board);
