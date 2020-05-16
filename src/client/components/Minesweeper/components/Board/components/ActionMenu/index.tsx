import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';
import media from '../../../../../../services/media/index';

const Root = styled.div`
  position: fixed;
  bottom: 0;
  margin: 0 auto;
  left: 0;
  right: 0;
  z-index: 2;
  width: 100%;
  background-color: rgba(75, 116, 48, 0.8);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0 -3px 3px 0 rgba(0, 0, 0, 0.5);
  max-width: 500px;
  ${media.tablet} {
    max-width: 600px;
  }
`;

const MenuItem = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  :first-child {
    margin: 0 10px;
  }
  :last-child {
    margin: 0 20px 0 10px;
  }
`;

const Image = styled.img`
  width: 32px;
`;

type ButtonWrapperProps = {
  disabled: boolean;
};
const ButtonWrapper = styled.div<ButtonWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  background: ${({ disabled }) => (disabled ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.7)')};
  padding: 12px;
`;

type Props = {
  enabled: boolean;
  onDig: () => void;
  onFlag: (ev: SyntheticEvent) => void;
};

const ActionMenu = ({ onDig, onFlag, enabled }: Props) => (
  <Root>
    <MenuItem>
      <ButtonWrapper onClick={enabled ? onFlag : undefined} disabled={!enabled}>
        <Image src="/images/sign.png" alt="warning sign" />
      </ButtonWrapper>
    </MenuItem>
    <MenuItem>
      <ButtonWrapper onClick={enabled ? onDig : undefined} disabled={!enabled}>
        <Image src="/images/shovel.png" alt="dig" />
      </ButtonWrapper>
    </MenuItem>
  </Root>
);

export default React.memo(ActionMenu);
