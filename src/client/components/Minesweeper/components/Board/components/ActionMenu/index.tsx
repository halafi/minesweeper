import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;
  background-color: #4b7430;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 300px;
  display: flex;
`;

const MenuItem = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  padding: 4px 0;
`;

const Shovel = styled.img`
  width: 24px;
`;

const PlaceSign = styled.img`
  width: 24px;
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
      <Content>
        <MenuItem>
          <ButtonWrapper onClick={onFlag}>
            <PlaceSign src="/images/sign.png" alt="warning sign" />
          </ButtonWrapper>
        </MenuItem>
        <MenuItem>
          <ButtonWrapper onClick={onDig}>
            <Shovel src="/images/shovel.png" alt="dig" />
          </ButtonWrapper>
        </MenuItem>
      </Content>
    )}
  </Root>
);

export default React.memo(ActionMenu);
