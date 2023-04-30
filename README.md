# Figma to React Converter

Figma to React Converter is a plugin that converts components created in Figma to React components.

## Note

This project is experimental and under development. There may be missing features or bugs, and it is not recommended for use in production.

## Supported Features

- Conversion to HTML and CSS
- Conversion to React components
- Creation of text (string) property
- Creation of children (ReactNode) property
- Display and non-display branching by boolean

## How to Use

- Select the component element you want to convert in Figma and press the Create button.
- If you want to use the text property, add the text property to the component.
- If you want to use ReactNode as a child element, name the node to match the regular expression `/^props\.[a-zA-Z0-9]*[0-9]*(c|C)hildren)$/` (e.g. `props.children`, `props.headerChildren`).

## Unsupported Features

- Conversion to tags other than div
- Application of variant
- Inheritance of property

## Limitations

It does not support all components created in Figma. In order to make them convertible, there are also some rules on the Figma side.

- Always use AutoLayout.
- Use only Frame, Rectangle, and Text within components.
- When there are sibling elements to a text element, the parent element should not have padding.

## License

MIT
