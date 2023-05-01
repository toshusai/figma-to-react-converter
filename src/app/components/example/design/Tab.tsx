import React from 'react';
import { WrapType } from '.';

export function Tab(props: {
  selected?: boolean;
  children?: React.ReactNode;
  buttonProps?: WrapType<HTMLButtonElement>;
}) {
  return (
    <button className="tab" {...props.buttonProps}>
      {props.children}
    </button>
  );
}
