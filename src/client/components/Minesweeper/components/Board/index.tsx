import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';
import Cell from './components/Cell';
import { CellData } from '../../records/CellData';
import media from '../../../../services/media';

const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 500px;
  border: 1px solid gray;
  ${media.tablet} {
    height: 600px;
  }
`;

type CellWrapperProps = {
  boardWidth: number;
  boardHeight: number;
};

// height: ${({ boardHeight }) => `${500 / boardHeight}px`};
const CellWrapper = styled.div<CellWrapperProps>`
  display: flex;
  width: ${({ boardWidth }) => `${(1 / boardWidth) * 100}%`};
  font-size: ${({ boardWidth }) => `${300 / boardWidth}px`};
`;

type Props = {
  boardData: CellData[][];
  width: number;
  height: number;
  onCellClick: (x: number, y: number) => void;
  onContextMenu: (ev: any, x: number, y: number) => void;
};

const Board = ({ boardData, width, height, onCellClick, onContextMenu }: Props) => {
  return (
    <Root>
      {boardData.map((row) =>
        row.map((item) => (
          <CellWrapper key={item.x + item.y * row.length} boardWidth={width} boardHeight={height}>
            <Cell
              width={width}
              isMine={item.isMine}
              isRevealed={item.isRevealed}
              isFlagged={item.isFlagged}
              neighbour={item.neighbour}
              onClick={() => onCellClick(item.x, item.y)}
              onContextMenu={(ev: SyntheticEvent) => onContextMenu(ev, item.x, item.y)}
            />
          </CellWrapper>
        )),
      )}
    </Root>
  );
};

export default React.memo(Board);
