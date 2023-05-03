// This code is generated.

import React from 'react';
import styled from 'styled-components';
import { TextButton } from './TextButton';

export type HeaderLayoutProps = {
  property1?: string;
  textButtonProps?: Parameters<typeof TextButton>[0];
  children?: React.ReactNode;
  styledRightProps?: StyledProps<HTMLDivElement>;
  styledHeaderLayoutProps?: StyledProps<HTMLDivElement>;
};

export function HeaderLayout(props: HeaderLayoutProps) {
  return (
    <StyledHeaderLayout {...props.styledHeaderLayoutProps}>
      <TextButton {...props.textButtonProps} />
      <StyledRight {...props.styledRightProps}>{props.children}</StyledRight>
    </StyledHeaderLayout>
  );
}

const StyledRight = styled.div`
  display: flex;
  position: relative;
  overflow: hidden;
`;

const StyledHeaderLayout = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  padding: 8px 0px;
  position: relative;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

type StyledProps<T> = Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, 'children' | 'ref'> & {
  ref?: React.Ref<T>;
};
