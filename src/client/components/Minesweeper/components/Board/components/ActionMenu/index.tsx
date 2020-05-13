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
  background-color: #4b7430;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.5);
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
  margin: 0 20px;
`;

const Image = styled.img`
  width: 32px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  padding: 12px;
`;

type Props = {
  enabled: boolean;
  onDig: () => void;
  onFlag: (ev: SyntheticEvent) => void;
};

const ActionMenu = ({ onDig, onFlag, enabled }: Props) => (
  <Root>
    {enabled && (
      <>
        <MenuItem>
          <ButtonWrapper onClick={onFlag}>
            <Image src="/images/sign.png" alt="warning sign" />
          </ButtonWrapper>
        </MenuItem>
        <MenuItem>
          <ButtonWrapper onClick={onDig}>
            <Image src="/images/shovel.png" alt="dig" />
          </ButtonWrapper>
        </MenuItem>
      </>
    )}
  </Root>
);

export default React.memo(ActionMenu);
