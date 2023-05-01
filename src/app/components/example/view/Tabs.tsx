import React from 'react';
import { Tab } from '../design/Tab';

type TabsProps = {
  tabs: string[];
  onChangeTab?: (tab: string) => void;
  tab?: string;
};

export function Tabs(props: TabsProps) {
  return (
    <div className="tabs">
      {props.tabs.map((item) => (
        <Tab
          key={item}
          buttonProps={{
            onClick: () => props.onChangeTab?.(item),
          }}
          selected={item === props.tab}
        >
          {item}
        </Tab>
      ))}
    </div>
  );
}
