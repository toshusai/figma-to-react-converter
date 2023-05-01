import React from 'react';
import { TabButton } from '../design/Tab';

type TabsProps = {
  tabs: string[];
  onChangeTab?: (tab: string) => void;
  tab?: string;
};

export function Tabs(props: TabsProps) {
  return (
    <div className="tabs">
      {props.tabs.map((item) => (
        <TabButton
          key={item}
          styledTabButtonProps={{
            onClick: () => props.onChangeTab?.(item),
          }}
          selected={props.tab?.toLocaleLowerCase() === item.toLocaleLowerCase() ? 'true' : 'false'}
          text={item}
        ></TabButton>
      ))}
    </div>
  );
}
