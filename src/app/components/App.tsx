import React from 'react';
import '../styles/ui.css';

import type prettier from 'prettier';
import { CreateHTMLResponse } from '../../plugin/types/CreateHTMLResponse';
import { MessageType } from '../../plugin/types';
import { cssPropertiesToCSSString, walkDom } from '../../plugin/utils';
import { domToString } from '../../plugin/converter/domToString';
import { nodeToReactCode } from '../../plugin/converter/nodeToReactCode';
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

  const [css, setCss] = React.useState('');
  const [html, setHtml] = React.useState('');
  const [reactSrc, setReactSrc] = React.useState('');

  React.useEffect(() => {
    addEventListener(MessageType.CREATE_RECTANGLES, async (message: CreateHTMLResponse) => {
      const dom = message.root;

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
        parser: 'typescript',
        plugins: prettierPlugins,
      });

      setHtml(html);

      const src = prettier.format(nodeToReactCode(dom), {
        parser: 'typescript',
        plugins: prettierPlugins,
      });

      setReactSrc(src);

      document.getElementById('box')!.innerHTML = `<style>${css}</style>${html.replace(';', '')}`;
    });
  }, []);

  const [type, setType] = React.useState<'css' | 'html' | 'react' | 'preview'>('preview');

  function changeType(type: 'css' | 'html' | 'react' | 'preview') {
    setType(type);
  }
  const handleChangeType = (type: string) => {
    return () => changeType(type as any);
  };

  return (
    <div>
      <div>
        <button id="create" onClick={onCreate}>
          Create
        </button>

        <button onClick={handleChangeType('preview')}>Preview</button>
        <button onClick={handleChangeType('css')}>CSS</button>
        <button onClick={handleChangeType('html')}>HTML</button>
        <button onClick={handleChangeType('react')}>React</button>
      </div>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            display: type === 'preview' ? 'block' : 'none',
            margin: 'auto',
          }}
          id="box"
        ></div>
      </div>
      {type === 'css' && (
        <pre>
          <code>{css}</code>
        </pre>
      )}
      {type === 'html' && (
        <pre>
          <code>{html}</code>
        </pre>
      )}
      {type === 'react' && (
        <pre>
          <code>{reactSrc}</code>
        </pre>
      )}
    </div>
  );
}

function bytesToUrl(bytes: Uint8Array) {
  const blob = new Blob([Uint8Array.from(bytes)]);
  const url = URL.createObjectURL(blob);
  return url;
}

export default App;
