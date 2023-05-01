import React from 'react';
import styled from 'styled-components';

type StyledProps<T> = Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, 'children' | 'ref'> & {
  ref?: React.Ref<T>;
};

type Props = {
  text: string;
  styledTextProps?: StyledProps<HTMLDivElement>;
  styledTextButtonProps?: StyledProps<HTMLButtonElement>;
};

export function TextButton(props: Props) {
  return (
    <StyledTextButton {...props.styledTextButtonProps}>
      <StyledText {...props.styledTextProps}>{props.text}</StyledText>
    </StyledTextButton>
  );
}

export const StyledText = styled.div`
  position: relative;
  color: #000000ff;
  line-height: 19px;
  margin: 8px 16px;
  font-size: 16px;
`;

export const StyledTextButton = styled.button`
  display: flex;
  flex-direction: row;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: #000000ff 1px solid;
  align-items: flex-start;
  justify-content: flex-start;
`;
