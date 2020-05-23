import * as React from 'react';
import styled from 'styled-components';
import Row from '../../primitives/Row';
import media from '../../services/media';

type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

const Select = styled(Row)`
  position: relative;
  min-width: 90px;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  user-select: none;
  cursor: pointer;
  background-color: white;
  color: black;
  border 1px solid black;
  border-radius: 5px;
  padding: 4px 8px;
  ${media.mobile} {
    min-width: 110px;
    align-items: center;
    font-size: 16px;
  }
`;

const Icon = styled.img`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
`;

const SelectButton = ({ children, onClick }: Props) => (
  <Row>
    <Select onClick={onClick}>
      {children}
      <Icon src="/images/arrow_up_down.png" alt="arrow up-down" />
    </Select>
  </Row>
);

export default SelectButton;
