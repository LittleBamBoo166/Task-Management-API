import { ArgumentNotProvideException } from '../exception/argument-not-provide.exception';

export type Primitives = string | number | boolean;
export interface DomainPrimitive<T extends Primitives | Date> {
  value: T;
}
type ValueObjectProps<T> = T extends Primitives | Date ? DomainPrimitive<T> : T;
export abstract class ValueObject<T> {
  protected props: ValueObjectProps<T>;
  constructor(props: ValueObjectProps<T>) {
    this.checkIfEmpty(props);
    this.validate(props);
    this.props = props;
  }

  protected abstract validate(props: ValueObjectProps<T>): void;

  private checkIfEmpty(props: ValueObjectProps<T>): void {
    if (!props) {
      throw new ArgumentNotProvideException();
    }
  }
}
