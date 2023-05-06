import React from 'react';

export function Preview(props: { html: string }) {
  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      <div
        style={{
          display: 'block',
          margin: 'auto',
          outline: '1px solid rgba(255, 255, 255, 0.5)',
          position: 'relative',
        }}
        dangerouslySetInnerHTML={{ __html: props.html }}
      ></div>
    </div>
  );
}
