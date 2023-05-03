import React from 'react';
import { TabButton } from '../design/TabButton';

type TabsProps = {
  tabs: string[];
  onChangeTab?: (tab: string) => void;
  tab?: string;
};

export function Tabs(props: TabsProps) {
  return (
    <>
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
    </>
  );
}
