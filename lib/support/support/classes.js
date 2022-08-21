"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Equatable = void 0;
class Equatable {
    constructor(propNames) {
        this._props = new Map();
        this._setProps(propNames);
    }
    _setProps(propNames) {
        this._props.clear();
        this._addProps(propNames);
    }
    _addProps(propNames) {
        for (let propName of propNames) {
            this._props.set(propName, true);
        }
    }
    get props() {
        let properties = new Map();
        for (let property in this._props) {
            properties.set(property, this[property]);
        }
        return properties;
    }
    _equals(other) {
        let thisProps = this.props;
        let otherProps = other.props;
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
exports.Equatable = Equatable;
//# sourceMappingURL=classes.js.map