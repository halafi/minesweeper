import React, { ReactNode } from 'react';
import styled from 'styled-components';

import Portal from './Portal';
import media from '../../services/media';

type Props = {
  children: ReactNode;
  onClose?: () => void;
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.6);
`;

const Container = styled.div`
  position: absolute;
  top: 100px;
  left: calc(50% - 125px);
  width: 250px;
  z-index: 3;
  border-radius: 5px;
  box-sizing: border-box;
  ${media.tablet} {
    left: calc(50% - 175px);
    width: 350px;
  }
`;

const Modal = ({ onClose, children }: Props) => (
  <Portal>
    <Overlay onClick={onClose} />
    <Container>{children}</Container>
  </Portal>
);

export default Modal;
