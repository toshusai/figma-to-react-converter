import React, { ReactNode, useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import styled from 'styled-components';

export function Code(props: { lang: string; children: ReactNode }): JSX.Element {
  useEffect(() => {
    hljs.highlightAll();
  }, []);
  const codeRef = useRef<HTMLElement>(null);

  return (
    <RootDiv>
      <PreDiv>
        <pre style={{ width: '100%' }}>
          <code 
          style={{
            minWidth: "512px"
          }}
          ref={codeRef} className={`language-${props.lang}`}>
            {props.children}
          </code>
        </pre>
      </PreDiv>
      <CopyButton codeRef={codeRef} />
    </RootDiv>
  );
}
const RootDiv = styled.div`
  position: relative;
`;

const PreDiv = styled.div`
  position: relative;
  display: flex;
  width: 512px;
  height: 450px;
  overflow: auto;
`;

const CopyButton = (props: { codeRef?: React.RefObject<HTMLElement> }) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const copy = () => {
    const codeTag = props.codeRef?.current;
    if (!codeTag) return;
    const range = document.createRange();
    range.selectNode(codeTag);
    window.getSelection()?.addRange(range);
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return <StyledCopyButton onClick={copy}>{isCopied ? 'Copied' : 'Copy'}</StyledCopyButton>;
};

const StyledCopyButton = styled.button`
  position: absolute;
  top: 0;
  right: 15px; // scroll bar width
  border: none;
  background: none;
  color: white;
  border: 1px solid white;
  font-size: 16px;
  padding: 8px;
  cursor: pointer;
`;
