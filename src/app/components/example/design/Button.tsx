import React from 'react';
import { WrapType } from '.';
import styled from 'styled-components';

export type ButtonProps = {
  buttonProps?: WrapType<HTMLButtonElement>;
  children?: React.ReactNode;
};

export function Button(props: ButtonProps) {
  return (
    <StyledButton {...props.buttonProps}>
      <StyledTextDiv>{props.children}</StyledTextDiv>
    </StyledButton>
  );
}

const StyledButton = styled.button`
  display: flex;
  flex-direction: row;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: #000000ff 1px solid;
  align-items: flex-start;
  justify-content: flex-start;
`;

const StyledTextDiv = styled.div`
  position: relative;
  color: #000000ff;
  line-height: 19px;
  margin: 8px 16px;
  font-size: 16px;
`;
