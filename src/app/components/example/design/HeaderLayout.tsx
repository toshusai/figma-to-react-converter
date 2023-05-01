import React from 'react';
import { ButtonProps, Button } from './Button';

type DesignProps = {
  buttonAttrs?: ButtonProps['buttonProps'];
  children?: React.ReactNode;
};

export function HeaderLayout(props: DesignProps) {
  return (
    <div className="wrap">
      <Button buttonProps={props.buttonAttrs}>Create</Button>
      {props.children}
    </div>
  );
}
