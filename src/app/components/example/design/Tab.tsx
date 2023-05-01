import React from 'react';
import styled from 'styled-components';

type StyledProps<T> = Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, 'children' | 'ref'> & {
  ref?: React.Ref<T>;
};

export type TabProps = {
  text: string;
  styledTextProps?: StyledProps<HTMLDivElement>;
  styledButtonProps?: StyledProps<HTMLButtonElement>;
};

export function Tab(props: TabProps) {
  return (
    <StyledButton {...props.styledButtonProps}>
      <StyledText {...props.styledTextProps}>{props.text}</StyledText>
    </StyledButton>
  );
}

const StyledText = styled.div`
  position: relative;
  color: #000000ff;
  line-height: 19px;
  margin: 8px 16px;
  font-size: 16px;
`;

const StyledButton = styled.button`
  display: flex;
  flex-direction: row;
  position: relative;
  border-radius: 0px;
  overflow: hidden;
  border-top: #000000ff 0px solid;
  border-right: #000000ff 0px solid;
  border-bottom: #000000ff 1px solid;
  border-left: #000000ff 0px solid;
  align-items: flex-start;
  justify-content: flex-start;
`;
