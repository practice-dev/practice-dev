import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { CSSTransition } from 'react-transition-group';

interface ModalProps {
  title?: string;
  transparent?: boolean;
  isOpen: boolean;
  close: () => void;
  children: React.ReactNode;
  size?: 'lg' | 'md';
  maxHeight?: string;
}

const GlobalStyle = createGlobalStyle`
.modal-enter {
  opacity: 0.01;
}

.modal-enter.modal-enter-active {
  opacity: 1;
  transition: opacity 150ms ease-in-out;
}
 
.modal-exit {
  opacity: 1;
}

.modal-exit.modal-exit-active {
  opacity: 0.01;
  transition: opacity 150ms ease-in-out;
}

.modal-open {
  overflow: hidden
}

`;

const ModalContent = styled.div`
  width: 80vw;
  background: white;
  border-radius: 4px;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const ModalBody = styled.div`
  max-height: 80vh;
  overflow: auto;
  transition: max-height 0.2s ease-in-out;
  pre[class*='language-'] {
    margin: 0;
    max-height: 80vh;
    overflow: auto;
  }
`;
const ModalTitle = styled.h5`
  margin-bottom: 0;
  line-height: 1.5;
`;

const Close = styled.button`
  padding: 16px;
  margin: -16px -16px -16px auto;
  background-color: transparent;
  border: 0;
  appearance: none;
  float: right;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.5;

  &:hover {
    opacity: 0.75;
    cursor: pointer;
  }
`;

const AbsoluteClose = styled(Close)`
  position: absolute;
  right: -20px;
  top: -20px;
  z-index: 10;
  opacity: 1;
  color: white;
  text-shadow: 0 1px 0 #000;
`;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

export function Modal(props: ModalProps) {
  const {
    isOpen,
    close,
    children,
    title,
    transparent,
    size,
    maxHeight,
  } = props;
  React.useEffect(() => {
    if (!isOpen) {
      return () => {
        //
      };
    }
    const alreadyOpen = document.body.classList.contains('modal-open');
    if (!alreadyOpen) {
      document.body.classList.add('modal-open');
    }
    const onKeyPress = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keyup', onKeyPress);
    return () => {
      if (!alreadyOpen) {
        document.body.classList.remove('modal-open');
      }
      window.removeEventListener('keyup', onKeyPress);
    };
  }, [isOpen]);
  return (
    <>
      <GlobalStyle />

      <CSSTransition
        in={isOpen}
        classNames="modal"
        timeout={150}
        unmountOnExit
        mountOnEnter
      >
        <Wrapper
          data-modal-wrapper
          data-focus-root
          onClick={e => {
            const target = e.target as HTMLDivElement;
            if (target.hasAttribute('data-modal-wrapper')) {
              close();
            }
          }}
        >
          <ModalContent
            style={{
              background: transparent ? 'transparent' : 'white',
              maxWidth: size === 'md' ? 800 : undefined,
            }}
          >
            {title ? (
              <ModalHeader>
                {<ModalTitle>{title}</ModalTitle>}
                <Close onClick={close}>×</Close>
              </ModalHeader>
            ) : (
              <AbsoluteClose onClick={close}>×</AbsoluteClose>
            )}
            <ModalBody
              style={{
                maxHeight,
              }}
            >
              {children}
            </ModalBody>
          </ModalContent>
        </Wrapper>
      </CSSTransition>
    </>
  );
}
