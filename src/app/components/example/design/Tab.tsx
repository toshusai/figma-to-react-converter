import React from 'react';
import styled from 'styled-components';

type StyledProps<T> = Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, 'children' | 'ref'> & {
  ref?: React.Ref<T>;
};

export type TabButtonProps = {
  text?: string;
  selected?: string;
  styledTextProps?: StyledProps<HTMLDivElement>;
  styledTabButtonProps?: StyledProps<HTMLButtonElement>;
};

export function TabButton(props: TabButtonProps) {
  return (
    <StyledTabButton {...props.styledTabButtonProps} $selected={props.selected}>
      <StyledText {...props.styledTextProps}>{props.text}</StyledText>
    </StyledTabButton>
  );
}

const StyledText = styled.div`
  position: relative;
  color: #000000ff;
  line-height: 19px;
  margin: 8px 16px;
  font-size: 16px;
`;

const StyledTabButton = styled.button<{ $selected?: string }>`
  display: flex;
  flex-direction: row;
  position: relative;
  border-radius: 0px;
  overflow: hidden;
  border-top: #000000ff 0px solid;
  border-right: #000000ff 0px solid;
  border-bottom: ${(props) => {
    return props.$selected === 'true'
      ? '#000000ff 3px solid'
      : props.$selected === 'false'
      ? '#000000ff 1px solid'
      : undefined;
  }};
  border-left: #000000ff 0px solid;
  align-items: flex-start;
  justify-content: flex-start;
`;
