import React from 'react';
import styled from 'styled-components';
import { TextButton } from './TextButton';

type StyledProps<T> = Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, 'children' | 'ref'> & {
  ref?: React.Ref<T>;
};

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
  flex-direction: row;
  padding: 0px;
  position: relative;
  border-radius: 0px;
  overflow: hidden;
  align-items: flex-start;
  justify-content: flex-start;
`;

const StyledHeaderLayout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding: 4px 16px;
  position: relative;
  border-radius: 0px;
  overflow: hidden;
  align-items: center;
  justify-content: flex-start;
`;
