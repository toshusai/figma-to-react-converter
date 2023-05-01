import React, { useEffect, useState } from 'react';
import '../styles/ui.css';
import 'highlight.js/styles/vs2015.css';

import type prettier from 'prettier';
import { Dom, MessageType } from '../../plugin/types';
import { Code } from './Code';
import { Header } from './example/view/Header';
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
  const [dom, setDom] = useState<Dom | null>(null);
  const [type, setType] = useState<'css' | 'html' | 'react' | 'preview'>('preview');

  useEffect(() => {
    const clean = addEventListener('convert-component' as any, (msg: any) => {
      console.log(msg);
      const src = prettier.format(msg.src, {
        parser: 'typescript',
        plugins: prettierPlugins,
      });
      setReactSrc(src);
      setDom({
        attrs: {},
        children: [],
        tag: 'div',
        styles: {},
      });
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
      {!dom && (
        <>
          <button
            style={{
              margin: 'auto',
            }}
            className="button"
            onClick={onCreate}
          >
            Create
          </button>
        </>
      )}
      {dom && (
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
                setDom(null);
              }}
            />
          </div>
          <div style={{ display: 'flex', height: 'calc(100% - 32px)', overflow: 'auto' }}>
            {type === 'react' && <Code lang="typescript">{reactSrc}</Code>}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
