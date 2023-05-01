import React from 'react';
import styled from 'styled-components';
import { TextButton } from './TextButton';

type StyledProps<T> = Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, 'children' | 'ref'> & {
  ref?: React.Ref<T>;
};

export type HeaderLayoutProps = {
  property1: string;
  textButtonProps: Parameters<typeof TextButton>[0];
  children: React.ReactNode;
  styledRootProps: StyledProps<HTMLDivElement>;
};

export function HeaderLayout(props: HeaderLayoutProps) {
  return (
    <StyledRoot {...props.styledRootProps}>
      <TextButton {...props.textButtonProps} text="Back" />
      {props.children}
    </StyledRoot>
  );
}

const StyledRoot = styled.div`
  background-color: #ffffffff;
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
