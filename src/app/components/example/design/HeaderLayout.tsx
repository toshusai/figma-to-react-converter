import React from 'react';
import { TextButton } from './TextButton';

type DesignProps = {
  textButtonProps: Parameters<typeof TextButton>[0];
  children?: React.ReactNode;
};

export function HeaderLayout(props: DesignProps) {
  return (
    <div className="wrap">
      <TextButton {...props.textButtonProps}></TextButton>
      {props.children}
    </div>
  );
}
