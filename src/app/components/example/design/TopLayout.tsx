import React from "react";
import styled from "styled-components";
import { TextButton } from "./TextButton";

type StyledProps<T> = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<T>, T>,
  "children" | "ref"
> & {
  ref?: React.Ref<T>;
};

export type TopLayoutProps = {
  textButtonProps?: Parameters<typeof TextButton>[0];
  children?: React.ReactNode;
  styledRightProps?: StyledProps<HTMLDivElement>;
  styledFrame30Props?: StyledProps<HTMLDivElement>;
  styledTopLayoutProps?: StyledProps<HTMLDivElement>;
};

export function TopLayout(props: TopLayoutProps) {
  return (
    <StyledTopLayout {...props.styledTopLayoutProps}>
      <StyledFrame30 {...props.styledFrame30Props}>
        <TextButton {...props.textButtonProps} />
        <StyledRight {...props.styledRightProps}>{props.children}</StyledRight>
      </StyledFrame30>
    </StyledTopLayout>
  );
}

const StyledRight = styled.div`
  display: flex;
  position: relative;
  overflow: hidden;
`;

const StyledFrame30 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

const StyledTopLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;