import styled from 'styled-components';
import React from 'react';
import Clipboard from 'clipboard';

const Wrapper = styled.button`
  position: absolute;
  top: 4px;
  right: 20px;
  z-index: 4;
  cursor: pointer;
  border: 1px solid transparent;
  padding: 0;
  color: #fff;
  background-color: transparent;
  height: 30px;
  transition: all 0.25s ease-out;
  display: inline-flex;
  align-items: center;
`;

interface CopyButtonProps {
  content: string;
}

const Label = styled.strong`
  font-size: 11px;
  font-weight: 600;
`;

export function CopyButton(props: CopyButtonProps) {
  const rootRef = React.useRef<HTMLButtonElement>(null);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const { content } = props;

  React.useEffect(() => {
    const clip = new Clipboard(rootRef.current!, {
      text() {
        return content;
      },
    });

    function setText(text: string) {
      if (labelRef.current) {
        labelRef.current.innerText = text;
      }
    }

    function resetText() {
      setTimeout(() => {
        setText('Copy');
      }, 5000);
    }

    clip.on('success', () => {
      setText('Copied!');

      resetText();
    });
    clip.on('error', () => {
      setText('Press Ctrl+C to copy');

      resetText();
    });
    return () => {
      clip.destroy();
    };
  }, [content]);

  return (
    <Wrapper ref={rootRef as any}>
      <svg width="12" height="12" viewBox="340 364 14 15">
        <path
          fill="currentColor"
          d="M342 375.974h4v.998h-4v-.998zm5-5.987h-5v.998h5v-.998zm2 2.994v-1.995l-3 2.993 3 2.994v-1.996h5v-1.995h-5zm-4.5-.997H342v.998h2.5v-.997zm-2.5 2.993h2.5v-.998H342v.998zm9 .998h1v1.996c-.016.28-.11.514-.297.702-.187.187-.422.28-.703.296h-10c-.547 0-1-.452-1-.998v-10.976c0-.546.453-.998 1-.998h3c0-1.107.89-1.996 2-1.996 1.11 0 2 .89 2 1.996h3c.547 0 1 .452 1 .998v4.99h-1v-2.995h-10v8.98h10v-1.996zm-9-7.983h8c0-.544-.453-.996-1-.996h-1c-.547 0-1-.453-1-.998 0-.546-.453-.998-1-.998-.547 0-1 .452-1 .998 0 .545-.453.998-1 .998h-1c-.547 0-1 .452-1 .997z"
          fillRule="evenodd"
        />
      </svg>{' '}
      <Label ref={labelRef as any}>Copy</Label>
    </Wrapper>
  );
}
