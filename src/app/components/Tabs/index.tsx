import React, { ReactNode } from 'react';
import { Tab } from './internal/Tab';

export function Tabs(props: {
  items: { children: ReactNode; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="tabs">
      {props.items.map((item) => {
        return (
          <Tab key={item.value} selected={item.value === props.value} onClick={() => props.onChange(item.value)}>
            {item.children}
          </Tab>
        );
      })}
    </div>
  );
}
