export type Context = {
  props: Props[];
  styled: string[];
  imports: string[];
};
type Props = {
  name: string;
  type: string;
};
