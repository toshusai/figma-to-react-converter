import { getAlignItems } from '../src/plugin/converter/CSSProperties';

test('align-items: center', () => {
  const node: Partial<FrameNode> = {
    type: 'FRAME',
    layoutMode: 'HORIZONTAL',
    counterAxisAlignItems: 'CENTER',
  };

  const cssProps = getAlignItems(node as FrameNode);
  expect(cssProps).toEqual({
    alignItems: 'center',
  });
});

test('align-items: flex-end', () => {
  const node: Partial<FrameNode> = {
    type: 'FRAME',
    layoutMode: 'HORIZONTAL',
    counterAxisAlignItems: 'MAX',
  };

  const cssProps = getAlignItems(node as FrameNode);
  expect(cssProps).toStrictEqual({
    alignItems: 'flex-end',
  });
});
