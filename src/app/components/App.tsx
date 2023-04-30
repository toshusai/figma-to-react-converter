import React, { useEffect, useState } from 'react';
import '../styles/ui.css';
import 'highlight.js/styles/vs2015.css';

import type prettier from 'prettier';
import { CreateHTMLResponse } from '../../plugin/types/CreateHTMLResponse';
import { Dom, MessageType } from '../../plugin/types';
import { cssPropertiesToCSSString, walkDom } from '../../plugin/utils';
import { domToString } from '../../plugin/converter/domToString';
import { nodeToReactCode } from '../../plugin/converter/nodeToReactCode';
import { Preview } from './Preview';
import { Code } from './Code';
import { bytesToUrl } from '../utils/bytesToUrl';
import { Tabs } from './Tabs';
declare const prettierPlugins: any;

function send(type: MessageType, message: any) {
  parent.postMessage({ pluginMessage: { type, message } }, '*');
}

function addEventListener(type: MessageType, callback: (message: any) => void) {
  window.addEventListener('message', (event) => {
    const { type: t, message } = event.data.pluginMessage;
    if (type === t) {
      callback(message);
    }
  });
}

function App() {
  const onCreate = () => {
    send(MessageType.CREATE_RECTANGLES, 'Hello World!');
  };

  const [css, setCss] = useState('');
  const [html, setHtml] = useState('');
  const [reactSrc, setReactSrc] = useState('');
  const [dom, setDom] = useState<Dom | null>(null);
  const [type, setType] = useState<'css' | 'html' | 'react' | 'preview'>('preview');

  useEffect(() => {
    addEventListener(MessageType.CREATE_RECTANGLES, async (message: CreateHTMLResponse) => {
      const dom = message.root;
      setDom(dom);

      let css = '';
      walkDom(dom, (node) => {
        if (node.styles) {
          if (node.attrs['class']) {
            css += cssPropertiesToCSSString(node.attrs['class'], node.styles);
          }
        }
      });

      css = prettier.format(css, {
        parser: 'css',
        plugins: prettierPlugins,
      });

      Object.keys(message.imageHashBytesList).forEach((key) => {
        const url = bytesToUrl(message.imageHashBytesList[key]);
        css = css.replace(new RegExp(key, 'g'), url);
      });

      setCss(css);

      let html = prettier.format(domToString(dom), {
        parser: 'html',
        plugins: prettierPlugins,
      });

      setHtml(html);

      const src = prettier.format(nodeToReactCode(dom), {
        parser: 'typescript',
        plugins: prettierPlugins,
      });

      setReactSrc(src);
    });
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
            <button
              className="button"
              onClick={() => {
                setDom(null);
              }}
            >
              Back
            </button>
            <Tabs
              items={[
                { children: 'Preview', value: 'preview' },
                { children: 'CSS', value: 'css' },
                { children: 'HTML', value: 'html' },
                { children: 'React', value: 'react' },
              ]}
              value={type}
              onChange={(v) => changeType(v as any)}
            />
          </div>
          <div style={{ display: 'flex', height: 'calc(100% - 32px)', overflow: 'auto', backgroundColor: '#1e1e1e' }}>
            {type === 'preview' && <Preview html={html} css={css} />}
            {type === 'css' && <Code lang="css">{css}</Code>}
            {type === 'html' && <Code lang="html">{html}</Code>}
            {type === 'react' && <Code lang="typescript">{reactSrc}</Code>}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
