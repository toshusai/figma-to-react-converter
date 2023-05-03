// This code is generated.

import React from 'react';
import styled from 'styled-components';

export type TextButtonProps = {
  text?: string;
  styledTextProps?: StyledProps<HTMLDivElement>;
  styledTextButtonProps?: StyledProps<HTMLButtonElement>;
};

export function TextButton(props: TextButtonProps) {
  return (
    <StyledTextButton {...props.styledTextButtonProps}>
      <StyledText {...props.styledTextProps}>{props.text}</StyledText>
    </StyledTextButton>
  );
}

const StyledText = styled.div`
  position: relative;
  color: #000000ff;
  line-height: 19px;
  margin: 8px 16px;
  font-size: 16px;
`;

const StyledTextButton = styled.button`
  display: flex;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: #000000ff 1px solid;
`;

type StyledProps<T> = Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, 'children' | 'ref'> & {
  ref?: React.Ref<T>;
};
