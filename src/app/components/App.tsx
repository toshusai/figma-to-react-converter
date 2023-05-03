import React, { useEffect, useState } from 'react';
import 'highlight.js/styles/vs2015.css';

import type prettier from 'prettier';
import { MessageType } from '../../plugin/types';
import { Code } from './Code';
import { Header } from './example/view/Header';
import { TextButton } from './example/design/TextButton';
import { Preview } from './Preview';
declare const prettierPlugins: any;

function send(type: MessageType, message: any) {
  parent.postMessage({ pluginMessage: { type, message } }, '*');
}

function addEventListener(type: MessageType, callback: (message: any) => void) {
  let f = (event) => {
    const { type: t, message } = event.data.pluginMessage;
    if (type === t) {
      callback(message);
    }
  };
  window.addEventListener('message', f);
  return () => {
    window.removeEventListener('message', f);
  };
}

function App() {
  const onCreate = () => {
    send('convert-component' as any, null);
  };

  const [reactSrc, setReactSrc] = useState('');
  const [htmlSrc, setHtmlSrc] = useState('');
  const [type, setType] = useState<'css' | 'html' | 'react' | 'preview'>('react');

  useEffect(() => {
    const clean = addEventListener('convert-component' as any, (msg: any) => {
      const src = prettier.format(msg.src, {
        parser: 'typescript',
        plugins: prettierPlugins,
      });
      setReactSrc(src);
      const html = prettier.format(msg.html, {
        parser: 'html',
        plugins: prettierPlugins,
      });
      setHtmlSrc(html);
    });
    return () => {
      clean();
    };
  }, []);

  function changeType(type: 'css' | 'html' | 'react' | 'preview') {
    setType(type);
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      {!reactSrc && (
        <>
          <TextButton
            styledTextButtonProps={{
              onClick: onCreate,
              style: {
                margin: 'auto',
              },
            }}
            text="Create Component"
          />
        </>
      )}
      {reactSrc && (
        <>
          <div
            style={{
              margin: '8px auto',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Header
              onChangeTab={(v) => {
                changeType(v.toLowerCase() as any);
              }}
              onClickButton={() => {
                setReactSrc('');
              }}
            />
          </div>
          {type === 'react' && <Code lang="typescript">{reactSrc}</Code>}
          {type === 'html' && <Preview html={htmlSrc}></Preview>}
        </>
      )}
    </div>
  );
}

export default App;
