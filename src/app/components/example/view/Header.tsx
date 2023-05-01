import React from 'react';
import { HeaderLayout } from '../design/HeaderLayout';
import { Tabs } from './Tabs';

const tabs = ['Preview', 'CSS', 'HTML', 'React'];
type HeaderProps = {
  onClickButton: () => void;
  onChangeTab: (tab: string) => void;
};

export function Header(props: HeaderProps) {
  const [tab, setTab] = React.useState(tabs[0]);
  return (
    <HeaderLayout
      buttonAttrs={{
        onClick: props.onClickButton,
      }}
    >
      <Tabs
        tabs={tabs}
        onChangeTab={(tab) => {
          setTab(tab);
          props.onChangeTab(tab);
        }}
        tab={tab}
      />
    </HeaderLayout>
  );
}
