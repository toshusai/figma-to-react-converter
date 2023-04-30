import React, { ReactNode, useEffect } from 'react';
import hljs from 'highlight.js';

export function Code(props: { lang: string; children: ReactNode }): JSX.Element {
  useEffect(() => {
    hljs.highlightAll();
  }, []);
  return (
    <pre>
      <code className={`language-${props.lang}`}>{props.children}</code>
    </pre>
  );
}
