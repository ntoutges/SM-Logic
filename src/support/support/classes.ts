export class Equatable {
  private _props: Map<string,boolean>;
  constructor(propNames: Array<string>) {
    this._props = new Map<string,boolean>();
    this._setProps(propNames);
  }
  _setProps(propNames: Array<string>): void {
    this._props.clear();
    this._addProps(propNames);
  }
  _addProps(propNames: Array<string>): void {
    for (let propName of propNames) {
      this._props.set(propName, true);
    }
  }
  get props(): Map<string,any> {
    let properties: Map<string,any> = new Map<string,any>();
    for (let property in this._props) {
      properties.set(property, this[property]);
    }
    return properties;
  }
  _equals(other: Equatable): boolean {
    let thisProps: Map<string,any> = this.props;
    let otherProps: Map<String,any> = other.props;

    if (Object.keys(thisProps).length != Object.keys(otherProps).length)
      return false;
    for (let i in thisProps) {
      if (!(i in otherProps))
        return false;
      if (thisProps[i] instanceof Equatable) {
        if (!thisProps[i]._equals(otherProps[i]))
          return false;
      }
      else if (thisProps[i] != otherProps[i])
        return false;
    }
    return true;
  }
}
