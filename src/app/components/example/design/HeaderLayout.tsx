import React from 'react';
import styled from 'styled-components';
// custom code
import { TextButton } from './TextButton';

type StyledProps<T> = Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, 'children' | 'ref'> & {
  ref?: React.Ref<T>;
};

export type HeaderLayoutProps = {
  children: React.ReactNode;
  styledHeaderLayoutProps?: StyledProps<HTMLDivElement>;
  // custom code
  textButtonProps?: Parameters<typeof TextButton>[0];
};

export function HeaderLayout(props: HeaderLayoutProps) {
  return (
    <StyledHeaderLayout {...props.styledHeaderLayoutProps}>
      <TextButton
        {...props.textButtonProps}
        // custom code
        text="Back"
      />
      {props.children}
    </StyledHeaderLayout>
  );
}

export const StyledHeaderLayout = styled.div`
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
