import React, { ReactNode, useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import styled from 'styled-components';

export function Code(props: { lang: string; children: ReactNode }): JSX.Element {
  useEffect(() => {
    hljs.highlightAll();
  }, []);
  const codeRef = useRef<HTMLElement>(null);
  const copy = () => {
    if (!props.children) return;
    const codeTag = codeRef.current;
    if (!codeTag) return;
    const range = document.createRange();
    range.selectNode(codeTag);
    window.getSelection()?.addRange(range);
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
  };

  return (
    <pre
      style={{
        position: 'relative',
      }}
    >
      <CopyButton onClick={copy}>Copy</CopyButton>
      <code ref={codeRef} className={`language-${props.lang}`}>
        {props.children}
      </code>
    </pre>
  );
}

const CopyButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  background: none;
  color: white;
  border: 1px solid white;
  font-size: 16px;
  padding: 8px;
  cursor: pointer;
`;
