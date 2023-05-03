# Figma to React Converter

figma to React Converter は figma で作られたコンポーネントを React コンポーネントへ変換するプラグインです。

## 注意

このプロジェクトは開発中で実験的なものです。機能の不足やバグなどが存在します。
本番での使用は推奨しません。

## サポートしている機能

- HTML, CSS への変換
- React コンポーネントへの変換
- テキスト(string)プロパティの作成
- children(ReactNode)プロパティの作成

## 使い方

- figma で変換したいComponentSet要素を選択し、Create ボタンを押してください。
- テキストプロパティを使用したい場合はコンポーネントにテキストプロパティを追加してください。
- ReactNode を子要素にしたい場合はノードの名前を`/^props\.[a-zA-Z0-9]*[0-9]*(c|C)hildren)$/`の正規表現満たす名前にしてください（例：`props.chidlren`, `props.headerChildren`）

## サポートされてない主な機能

- div 以外へのタグへの変換
- variant の適用
- property の継承

## 制限

figma で作られた全てのコンポーネントに対応しているわけではありません。
変換可能にするために figma 側にも幾つかのルールが存在します。

- 常に AutoLayout を使用すること。
- コンポーネント内では、Frame, Rectangle, Text のみを使用すること。
- テキスト要素に兄弟要素がある時、親要素に padding を持たないこと。

## ライセンス

MIT
