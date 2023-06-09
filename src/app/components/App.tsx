import React, { useEffect, useState } from 'react';
import 'highlight.js/styles/vs2015.css';

import { MessageType } from '../../plugin/types';
import { Code } from './Code';
import { Header } from './example/view/Header';
import { Preview } from './Preview';
import { TopLayout } from './example/design/TopLayout';
declare const prettierPlugins: any;
declare const prettier: any;

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
  const [reactSrc, setReactSrc] = useState('');
  const [htmlSrc, setHtmlSrc] = useState('');
  const [error, setError] = useState('');
  const [type, setType] = useState<'css' | 'html' | 'react' | 'preview'>('react');

  const onCreate = () => {
    try {
      send('convert-component' as any, null);
    } catch (e: any) {
      setError(e);
    }
  };

  useEffect(() => {
    const clean = addEventListener('convert-component' as any, (msg: any) => {
      try {
        const imageHashMap = msg.imageHashMap;
        const svgMap = msg.svgMap;
        let src: string = msg.src;
        let html: string = msg.html;
        Object.keys(imageHashMap).forEach((k) => {
          const v = imageHashMap[k];
          const blob = new Blob([v]);
          const url = URL.createObjectURL(blob);
          src = src.replace(new RegExp(k, 'g'), url);
          html = html.replace(new RegExp(k, 'g'), url);
        });
        Object.keys(svgMap).forEach((k) => {
          const v = svgMap[k];
          const text = new TextDecoder('utf-8').decode(v);
          src = src.replace(new RegExp(k, 'g'), text);
          html = html.replace(new RegExp(k, 'g'), text);
        });

        try {
          src = prettier.format(src, {
            parser: 'typescript',
            plugins: prettierPlugins,
          });
          html = prettier.format(html, {
            parser: 'html',
            plugins: prettierPlugins,
          });
        } catch (e) {}

        setReactSrc(src);
        setHtmlSrc(html);
      } catch (e: any) {
        console.error(e);
        setError(JSON.stringify(msg));
        setReactSrc('');
        setHtmlSrc('');
      }
    });
    const cleanError = addEventListener('error' as any, (msg: any) => {
      console.error(msg);
      setError(JSON.stringify(msg));
    });
    return () => {
      clean();
      cleanError();
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
        <TopLayout
          textButtonProps={{
            styledTextButtonProps: {
              onClick: onCreate,
            },
            text: 'Create Component',
          }}
        >
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </TopLayout>
      )}
      {reactSrc && (
        <>
          <Header
            onChangeTab={(v) => {
              changeType(v.toLowerCase() as any);
            }}
            onClickButton={() => {
              setReactSrc('');
            }}
          />
          {type === 'react' && <Code lang="typescript">{reactSrc}</Code>}
          {type === 'html' && <Preview html={htmlSrc}></Preview>}
        </>
      )}
    </div>
  );
}

export default App;
