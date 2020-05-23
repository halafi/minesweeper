import React, { ReactNode } from 'react';
import styled from 'styled-components';
import ScrollLock from 'react-scrolllock';

import Portal from './Portal';
import media from '../../services/media';

type Props = {
  children: ReactNode;
  closeOnClickOut?: boolean;
  closeButton?: boolean;
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
  padding: 20px 0 0;
  top: 100px;
  left: calc(50% - 150px);
  width: 300px;
  z-index: 3;
  border-radius: 5px;
  box-sizing: border-box;
  ${media.tablet} {
    left: calc(50% - 175px);
    width: 350px;
  }
`;

const CloseIcon = styled.img`
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
`;

const Modal = ({ onClose, children, closeOnClickOut, closeButton }: Props) => (
  <Portal>
    <ScrollLock>
      <div>
        <Overlay onClick={onClose && closeOnClickOut ? onClose : undefined} />
        <Container>
          {onClose && closeButton && (
            <CloseIcon src="/images/x.png" alt="close" onClick={onClose} />
          )}
          {children}
        </Container>
      </div>
    </ScrollLock>
  </Portal>
);

Modal.defaultProps = {
  closeOnClickOut: false,
  closeButton: true,
};

export default Modal;
