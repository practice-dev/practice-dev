import React from 'react';
import { BaseButton } from './BaseButton';
import styled from 'styled-components';
import { Modal } from './Modal';
import { Highlight } from './Highlight';

interface IsolatedHtmlProps {
  html: string;
  css: string;
  height: number;
  scripts?: string[];
  addToggle?: boolean;
}

const Buttons = styled.div`
  text-align: right;
  margin-top: 15px;
  margin-bottom: 10px;
  & > button + button {
    margin-left: 10px;
  }
`;

const IframeWrapper = styled.div`
  width: 100%;
  overflow: auto;
`;

export function IsolatedHtml(props: IsolatedHtmlProps) {
  const [isHTMLVisible, setIsHTMLVisible] = React.useState(false);
  const [isCSSVisible, setIsCSSVisible] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const { html, css, height } = props;

  const scripts = React.useMemo(() => {
    const ret = props.scripts || [];
    if (props.addToggle) {
      ret.push('https://practice.dev/assets/toggle-layer.js');
    }
    return ret;
  }, [props.scripts, props.addToggle]);

  React.useLayoutEffect(() => {
    const document = iframeRef.current!.contentDocument!;
    document.body.innerHTML = html;
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.innerHTML = css;
    head.appendChild(style);
    (scripts || []).forEach((src) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      document.body.appendChild(script);
    });
    document.body.addEventListener('click', (e) => {
      e.preventDefault();
    });
  }, [html, css, scripts ? scripts.join() : null]);

  return (
    <>
      <Modal
        transparent
        isOpen={isCSSVisible}
        close={() => setIsCSSVisible(false)}
      >
        <Highlight code={css} lang="css" />
      </Modal>
      <Modal
        transparent
        isOpen={isHTMLVisible}
        close={() => setIsHTMLVisible(false)}
      >
        <Highlight code={html} lang="html" />
      </Modal>
      <IframeWrapper>
        <iframe
          style={{
            border: '1px dashed #ccc',
            overflow: 'auto',
            width: '100%',
            minWidth: 600,
            height,
          }}
          ref={iframeRef}
        />
      </IframeWrapper>
      <Buttons>
        <BaseButton type="secondary" onClick={() => setIsHTMLVisible(true)}>
          Show HTML
        </BaseButton>
        <BaseButton type="secondary" onClick={() => setIsCSSVisible(true)}>
          Show CSS
        </BaseButton>
      </Buttons>
    </>
  );
}
