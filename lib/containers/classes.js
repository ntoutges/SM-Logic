"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericBody = exports.Grid = exports.Contracted = exports.Container = exports.Unit = void 0;
const classes_1 = require("../support/colors/classes");
const classes_2 = require("../support/context/classes");
const classes_3 = require("../support/spatial/classes");
const classes_4 = require("../support/support/classes");
class Unit extends classes_4.Equatable {
    constructor({ pos = new classes_3.Pos({}), rotate = new classes_3.Rotate({}), color = new classes_1.Color(), }) {
        super(["_pos", "_rot", "_color"]);
        this._pos = pos;
        this._rot = rotate;
        this._color = color;
    }
    get pos() { return this._pos; }
    get rotation() { return this._rot; }
    get color() { return this._color; }
    set pos(pos) { this._pos = pos; }
    set rotation(rotation) { this._rot = rotation; }
    set color(color) { this._color = color; }
}
exports.Unit = Unit;
class Container extends Unit {
    constructor({ pos, rotate, child, color, children, key = new classes_2.Keyless(), }) {
        super({ pos, rotate, color });
        this._addProps(["_childs"]);
        this._key = key;
        if (child != null && children != null)
            throw new Error("Cannot have both [child] and [children] property in a container");
        else if (child != null)
            this._childs = [child];
        else if (children != null)
            this._childs = children;
    }
    get children() { return this._childs; }
    get key() { return this._key; }
    build(offset = new classes_3.Pos({})) {
        let childBlueprints = [];
        this._childs.forEach((child) => {
            childBlueprints.push(child.build(new classes_3.Pos({
                "x": this.pos.x,
                "y": this.pos.y,
                "z": this.pos.z
            }).add(offset)));
        });
        return childBlueprints.join(",");
    }
}
exports.Container = Container;
class Contracted extends Container {
    build(offset = new classes_3.Pos({})) {
        // set all shapes to be at the same positino
        this.children.forEach((child) => {
            child.pos = new classes_3.Pos({
                x: 0,
                y: 0,
                z: 0
            });
        });
        return super.build(offset);
    }
}
exports.Contracted = Contracted;
class Grid extends Container {
    constructor({ pos, rotate, child, children, color, key = new classes_2.Keyless(), size, spacing = new classes_3.Bounds({}) }) {
        super({ pos, rotate, child, children, color, key });
        this._size = size;
        this._spacing = spacing;
    }
    build(offset = new classes_3.Pos({})) {
        if (this.children.length != this._size.x * this._size.y * this._size.z)
            throw new Error("Amound of children does not match bounds");
        let posCounter = new classes_3.Pos({ x: 0, y: 0, z: 0 });
        let position = this.pos.add(offset);
        let childBlueprints = [];
        this.children.forEach((child) => {
            if (posCounter.x >= this._size.x) {
                posCounter = posCounter.add(new classes_3.Pos({ x: -posCounter.x, y: 1 })); // reset x // add 1 to y
                position = position.add(new classes_3.Pos({ x: -position.x, y: this._spacing.y }));
                if (posCounter.y >= this._size.y) {
                    posCounter = posCounter.add(new classes_3.Pos({ y: -posCounter.y, z: 1 })); // reset y // add 1 to z
                    position = position.add(new classes_3.Pos({ y: -position.y, z: this._spacing.z }));
                }
            }
            childBlueprints.push(child.build(position.add(offset)));
            posCounter = posCounter.add(new classes_3.Pos({ x: 1 }));
            position = position.add(new classes_3.Pos({ x: this._spacing.x }));
        });
        return childBlueprints.join(",");
    }
}
exports.Grid = Grid;
class GenericBody {
    constructor({ key = new classes_2.BasicKey({}), name = "SM Logic Creation", description = "V2 of generating scrap mechanic logic-based creations", }) {
        this._key = key;
        this._title = name;
        this._desc = description;
    }
    get key() { return this._key; }
    get description() {
        return `{
      \"description\": \"${this._desc}\",
      \"name\": \"${this._title}\",
      \"type\": \"Blueprint\",
      \"version\": 0
    }`;
    }
}
exports.GenericBody = GenericBody;
//# sourceMappingURL=classes.js.map