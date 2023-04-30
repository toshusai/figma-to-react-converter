import React, { ReactNode } from 'react';

export function Tab(props: { children: ReactNode; onClick?: () => void; selected?: boolean }) {
  return (
    <button onClick={props.onClick} className={`tab ${props.selected ? 'tab-selected' : ''}`}>
      {props.children}
    </button>
  );
}
