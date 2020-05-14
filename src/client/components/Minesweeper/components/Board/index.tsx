import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';
import Cell from './components/Cell';
import { CellData } from '../../records/CellData';
import ActionMenu from './components/ActionMenu';
import Column from '../../../../primitives/Column';
import Row from '../../../../primitives/Row';

const Root = styled(Column)`
  position: relative;
  user-select: none;
  overflow: hidden;
  padding-bottom: 80px;
`;

const BoardRow = styled(Row)`
  justify-content: center;
`;

type CellWrapperProps = {
  boardWidth: number;
  boardHeight: number;
  selected: boolean;
};

const CellWrapper = styled.div<CellWrapperProps>`
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: ${({ boardWidth }) => `${(1 / boardWidth) * 100}%`};
  max-width: 48px;
  font-size: ${({ boardWidth }) => `min(${300 / boardWidth}px, 28px)`};
  border: ${({ selected }) => (selected ? '2px solid red' : 'none')};
  ::after {
    content: '';
    display: block;
    padding-top: min(100%, 48px);
  }
`;

type Props = {
  boardData: CellData[][];
  width: number;
  height: number;
  selectedX: number | null;
  selectedY: number | null;
  showActionMenu: boolean;
  onCellClick: (x: number, y: number) => void;
  onContextMenu: (ev: any, x: number, y: number) => void;
  onDeselect: () => void;
  onReveal: (x: number, y: number) => void;
};

const Board = ({
  boardData,
  width,
  height,
  showActionMenu,
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
        {boardData.map((row, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <BoardRow key={i}>
            {row.map((item) => (
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
            ))}
          </BoardRow>
        ))}
      </Root>
      {showActionMenu && <ActionMenu enabled={enabled} onDig={onDig} onFlag={onFlag} />}
    </>
  );
};

export default React.memo(Board);
