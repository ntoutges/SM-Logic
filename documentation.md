# SM Logic Builder Documentation

A living guide containing the syntax and purpose of each component

[Support Classes](#support-classes)\
[Container Classes](#container-classes)
[Block Classes](#block-classes)\
[Prebuilts](#prebuilts)\

> # Support Classes
> ## Support Sections
> * [Colors](#colors)
> * [Logic](#logic)
> * [Spatial](#spatial)
> * [Graphics](#graphics)
> * [Frames](#frames)
> * [Layers](#layers)

## Colors 

> ### [Color](#color-1)
> ### [HexColor](#hexcolor-1)
> ### [RGBColor](#rgbcolor-1)

* #### **Color**
  * ```typescript
    class Color(color: Colors)
    ```
  * Description:
    * The basic color class
    * Used to give blocks a specific color
  * Methods:
    * `get rgb(): RGB`
      * This returns an RGB representation of the current color
    * `get hex(): string`
      * This returns a hexidecimal representation of the current color
      * eg: white -> "FFFFFF"
    * get color
  * Properties:
    * `color: Colors`
    * The current color stored in the Color class
    * Stored in hexidecimal

* #### **HexColor**
  * ```typescript
    class HexColor(rgb: String) extends Color
    ```
  * Description:
    * Lets you make your own color based on a hex-code
  * Methods:
    * `get rgb(): RGB`
      * This returns an RGB representation of the current color
    * `get hex(): string`
      * This returns a hexidecimal representation of the current color
      * eg: white -> "FFFFFF"
    * get color
  * Properties:
    * `color: Colors`
    * The current color stored in the Color class
    * Stored in hexidecimal

* #### **RGBColor**
  * ```typescript
      class RGBColor({
        rgb: RGB,
        map?: {
          r: [min,max],
          g: [min,max],
          g: [min,max]
        }
      }) extends Color
      ```
    * `map`
      * Optional parameter
      * Defines the minimum and maximum expected values for each color component
      * min,max are inclusive (default 0,255)
  * Description:
    * Lets you make your own color based on a hex-code
  * Methods:
    * `get rgb(): RGB`
      * This returns an RGB representation of the current color
    * `get hex(): string`
      * This returns a hexidecimal representation of the current color
      * eg: white -> "FFFFFF"
    * get color
  * Properties:
    * `color: Colors`
    * The current color stored in the Color class
    * Stored in hexidecimal

## Logic

> ### [Operation](#operation-1)
> ### [Connections](#connections-1)
> ### [MultiConnections](#multiconnections-1)
> ### [BitMask](#bitmask-1)
> ### [RawBitMask](#rawbitmask-1)
> ### [VBitMask](#vbitmask-1)
> ### [Delay](#delay-1)
> ### [NoDelay](#nodelay-1)
> ### [Delays](#delays-1)
> ### [ScaleableDelays](#scaleabledelays-1)

* #### **Operation**
  * ```typescript
    class Operation(operation: LogicalOperation)
    ```
  * Description:
    * Stores the type of operation a Logic block will perform
  * Methods:
    * `get type(): LogicalType`
      * Reduces LogicalOperations into their core LogicalTypes
      * Logical Operations contain implied data about how they will be used (Input/Screen/Buffer)
      * LogicalTypes are the actual type of operation performed (And/Or/Nor)
    * `operate(...values: boolean[])`
      * Perform operation that the resultant Logic block would perform, using the values array as inputs
  * Properties:
    * `operation: LogicalOperation`
      * The operation (and implied function) of a Logic block

* #### **Connections**
  * ```typescript
    class Connections(connections?: Id | Id[])
    ```
    * `connections: Id[]`
      * Optional Parameter
      * All the other Logic block Ids that this logic block should connect to
      * Default value: `[]` (connecting to nothing)
  * Description:
    * Stores all the connections of any part that interfaces with logic
    * Stores the Ids of logic blocks that this logic block passes its signal *TO*
  * Methods:
    * `addConnection(id: Id): void`
      * Adds another Id that this logic block will be connected to
    * `build(): {"id": number}[]`
      * Creates a Scrap Mechanic parseable list of logic block Ids

* #### **MultiConnections**
  * ```typescript
    class MultiConnections(
      connections: MultiConnectionsType | MultiConnectionsType[]
    )
    ```
    * `connections: ...`
      * `{ conn: Connections | MultiConnections, id: Identifier }`
  * Description:
    * Stores connections for individual logic blocks within larger constructs
    * the Identifier references to which part of the construct a connection is assigned to, and the Connections contains the actual data as to what that construct is connected to
  * Methods:
    * `addConnection(conn: Connections | MultiConnections, ids: Identifier): void`
      * Adds another connection to this MultiConnection
    * `getConnection(id: Identifier | string): Connections`
      * Compiles all connection associations with the identifier `id` and returns them as a `Connections`
    * `getMetaConnection(id: Identifier | string): MultiConnections`
      * Compile all connections whose parent is the construct of identifier `id`, and return them as a `MultiConnections`, with the id of the construct underneath the one just searched for
    * `get conns(): Map<string,Connections>`
      * Returns all the connections and associations stored within this class

* #### **BitMask**
  * ```typescript
    class BitMask(mask: boolean[])
    ```
  * Description:
    * Stores a sequence of bits
  * Methods:
    * `get length(): number`
      * Returns the number of bits stored in this BitMask
    * `add(other: BitMask): BitMask`
      * Returns a new BitMask whose values are now the result of an `or` operation between this BitMask, and the `other` BitMask 
    * `invert(): BitMask`
      * Returns a BitMask where all the bits of this BitMask have been flipped
      * All `true` value become `false`, and all `false` values become `true`
    * `extend({newLength: number, fallback?: boolean}): BitMask`
      * newLength: the size to make a new BitMask
      * fallback: The value of bit to be added if newLength is greater than the current BitMask length
        * Default value: `false`
    * `reverse(): BitMask`
      * Return a new BitMask where the last bit has become the first bit, the second to last bit become the second bit, etc.
    * `shift(count: number): BitMask`
      * Return a new BitMask where all bits have been shifted to the right by `count` bits
      * Any bits at the end are moved back to the start, so the overall length of the new BitMask is unchanged
    * `hexDump(): string`
      * Returns the hexidecimal representation of this BitMask
    * `binDump(): string
      * Returns the binary representation of this BitMask

* #### **RawBitMask**
  * ```typescript
    class RawBitMask(mask: number, length?: number) extends BitMask
    ```
    * `length: number`
    * Optional parameter
    * The length of the BitMask
    * If `mask` does not use all these bits, extra `false` bits will be added to the left until the length is correct
  * Description:
    * Stores a sequence of bits
  * Methods:
    * `get length(): number`
      * Returns the number of bits stored in this BitMask
    * `add(other: BitMask): BitMask`
      * Returns a new BitMask whose values are now the result of an `or` operation between this BitMask, and the `other` BitMask 
    * `invert(): BitMask`
      * Returns a BitMask where all the bits of this BitMask have been flipped
      * All `true` value become `false`, and all `false` values become `true`
    * `extend({newLength: number, fallback?: boolean}): BitMask`
      * newLength: the size to make a new BitMask
      * fallback: The value of bit to be added if newLength is greater than the current BitMask length
        * Default value: `false`
    * `reverse(): BitMask`
      * Return a new BitMask where the last bit has become the first bit, the second to last bit become the second bit, etc.
    * `shift(count: number): BitMask`
      * Return a new BitMask where all bits have been shifted to the right by `count` bits
      * Any bits at the end are moved back to the start, so the overall length of the new BitMask is unchanged
    * `hexDump(): string`
      * Returns the hexidecimal representation of this BitMask
    * `binDump(): string
      * Returns the binary representation of this BitMask

* #### **VBitMask**
  * ```typescript
    class VBitMask(mask: string, offCharacter: string) extends BitMask
    ```
    * `offCharacter: string`
      * Optional Parameter
      * The characters in `mask` to be treated as `false` values
      * Default value: `" "` (space)
  * Description:
    * Stores a sequence of bits
    * Stands for (V)isual BitMask
  * Methods:
    * `get length(): number`
      * Returns the number of bits stored in this BitMask
    * `add(other: BitMask): BitMask`
      * Returns a new BitMask whose values are now the result of an `or` operation between this BitMask, and the `other` BitMask 
    * `invert(): BitMask`
      * Returns a BitMask where all the bits of this BitMask have been flipped
      * All `true` value become `false`, and all `false` values become `true`
    * `extend({newLength: number, fallback?: boolean}): BitMask`
      * newLength: the size to make a new BitMask
      * fallback: The value of bit to be added if newLength is greater than the current BitMask length
        * Default value: `false`
    * `reverse(): BitMask`
      * Return a new BitMask where the last bit has become the first bit, the second to last bit become the second bit, etc.
    * `shift(count: number): BitMask`
      * Return a new BitMask where all bits have been shifted to the right by `count` bits
      * Any bits at the end are moved back to the start, so the overall length of the new BitMask is unchanged
    * `hexDump(): string`
      * Returns the hexidecimal representation of this BitMask
    * `binDump(): string
      * Returns the binary representation of this BitMask

* #### **Delay**
  * Syntax:
    ```typescript
    class Delay({
      delay: number,
      unit?: Time
    })
    ```
    * `unit: Time`
      * Optional parameter
      * The type of time that `delay` is measured in
      * Default value: `Time.Tick`
  * Description:
    * Stores the amount of logic delay an operation takes, or that a timer will wait for
  * Methods:
    * `getDelay(unit?: Time): number`
      * Returns the amount of units the delay lasts for
      * Default `unit` value: Time.Tick
    * `add(delay: Delay): Delay`
      * Returns a new `Delay` whose delay is the sum of this Delay and the other Delay
    * `build(): {"seconds": number, "ticks": ticks}`
      * Return a value in a format that Scrap Mechanic can understand
      * This value is put into a `Timer` block
      * Seconds has a maximum value of 59, ticks has a maximum value of 40 (1 second)

* #### **NoDelay**
  * Syntax:
    ```typescript
      class NoDelay() extends Delay
    ```
  * Description:
    * A placeholder delay, which does not wait for any time
  * Methods:
    * `add(delay: Delay): Delay`
      * Returns a new `NoDelay` (completely ignores the input delay)
    * `getDelay(unit?: Time): number`
      * Carry-over from parent
      * Will always return -1 Ticks (converted to `unit`)
    * `build(): {"seconds": 0, "ticks": -1}`
      * Cary-over from parent
      * Return a value in a format that Scrap Mechanic can understand
      * This value is put into a `Timer` block
      * Seconds will always be `0`, while ticks will always be `-1`

* #### **Delays**
  * Syntax:
    ```typescript
    class Delays(delays: Delay[])
    ```
  * Description:
    * Stores a set of delays
  * Methods:
    * `get length(): number`
      * Returns the amount of delays stored in this class
    * `get validDelays(): Delay[]`
      * Returns all delays that are not `NoDelay` instances
    * `add(delay: Delay): void`
      * Add another delay to this set of delays
    * `concat(delays: Delay[]): void`
      * Add many delays to this set of delays
  * Properties:
    * `delays: Delay[]`
      * The array of all delays stored in this class

* #### **ScaleableDelays**
  * Syntax:
    ```typescript
    class ScaleableDelays({
      delay?: Delay,
      amount?: number
    }) extends Delays
    ```
    * `delay: Delay`
      * Optional Parameter
      * The base abount of delay this class will store
      * Default value: `new Delay({ delay: 0, unit: Time.Tick })`
    * `amount: number`
      * Optional parameter
      * The amount of the base delay to create by default
      * Default value: `1`
  * Description:
    * Creates many equal length delays
    * Extremely useful when creating video displays
  * Methods:
    * `extend(amount: number)`
      * Adds `amount` of the last delay to this instance
    * `get length(): number`
      * Returns the amount of delays stored in this class
    * `get validDelays(): Delay[]`
      * Returns all delays that are not `NoDelay` instances
    * `add(delay: Delay): void`
      * Add another delay to this set of delays
    * `concat(delays: Delay[]): void`
      * Add many delays to this set of delays
  * Properties:
    * `delays: Delay[]`
      * The array of all delays stored in this class

## Spatial

> ### [Pos](#pos-1)
> ### [Pos2d](#pos2d-1)
> ### [RelativePos](#relativepos-1)
> ### [Bounds](#bounds)
> ### [Bounds2d](#bounds2d-1)
> ### [Rotate](#rotate-1)
> ### [Offset](#offset-1)

* #### **Pos**
  * Syntax:
    ```typescript
    class Pos({
      x?: number,
      y?: number,
      z?: number
    })
    ```
    * `x: number`
      * Optional parameter
      * Indicates the *x* position of a block
      * Default value: `0`
    * `y: number`
      * Optional parameter
      * Indicates the *y* position of a block
      * Default value: `0`
    * `z: number`
      * Optional parameter
      * Indicates the *z* position of a block
      * Default value: `0`
  * Description:
    * Stores the position of an object in **3d** space
  * Methods:
    * `get x(): number`
      * Returns the `x` component of this position
    * `get y(): number`
      * Returns the `y` component of this position
    * `get z(): number`
      * Returns the `z` component of this position
    * `add(other: Pos): Pos`
      * Returns a new `Pos` whose `x`,`y`, and `z` components are the sum of those properties of this `Pos` and the other `Pos`
    * `sub(other: Pos): Pos`
      * Returns a new `Pos` whose `x`,`y`, and `z` components are the difference between those properties of this `Pos` and the other `Pos`
    * `rotate(other: Rotate): Pos`
      * Return a new `Pos` whose position hase been modified to coincide with a rotation
      * A rotation of 90 degrees will swap `x`/`y`, and negate `y`
    * `build(): {"x": number, "y": number, "z": number}`
      * Return a value in a format that Scrap Mechanic can understand

* #### **Pos2d**
  * Syntax:
    ```typescript
    class Pos2d({
      x?: number,
      y?: number
    }) extends Pos
    ```
    * `x: number`
      * Optional parameter
      * Indicates the *x* position of a block
      * Default value: `0`
    * `y: number`
      * Optional parameter
      * Indicates the *y* position of a block
      * Default value: `0`
  * Description:
    * Stores the position of an object in **2d** space
  * Methods:
    * `get x(): number`
      * Returns the `x` component of this position
    * `get y(): number`
      * Returns the `y` component of this position
    * `get z(): 1`
      * Carry-over from parent
      * `z` component is never set, so it is always at its default (1)
    * `add(other: Pos): Pos`
      * Returns a new `Pos` whose `x`,`y`, and `z` components are the sum of those properties of this `Pos2d` and the other `Pos`
    * `sub(other: Pos): Pos`
      * Returns a new `Pos` whose `x`,`y`, and `z` components are the difference between those properties of this `Pos2d` and the other `Pos`
    * `rotate(other: Rotate): Pos`
      * Return a new `Pos` whose position hase been modified to coincide with a rotation
      * A rotation of 90 degrees will swap `x`/`y`, and negate `y`
    * `build(): {"x": number, "y": number, "z": number}`
      * Return a value in a format that Scrap Mechanic can understand

* #### **RelativePos**
  * Syntax:
    ```typescript
    class RelativePos({
      x?: number,
      y?: number,
      z?: number,
      pos: Pos
    }) extends Pos
    ```
    * `x: number`
      * Optional parameter
      * Indicates the *x* position of a block
      * Default value: `0`
    * `y: number`
      * Optional parameter
      * Indicates the *y* position of a block
      * Default value: `0`
    * `z: number`
      * Optional parameter
      * Indicates the *z* position of a block
      * Default value: `0`
    * `pos: Pos`
      * The `Pos` instance that this class sets its position relative to
  * Description:
    * Stores the position of an object in **3d** space, relative to another `Pos`
  * Methods:
    * `get x(): number`
      * Returns the `x` component of this position, plus the `x` component of the stored relative `Pos`
    * `get y(): number`
      * Returns the `y` component of this position, plus the `y` component of the stored relative `Pos`
    * `get z(): number`
      * Returns the `z` component of this position, plus the `z` component of the stored relative `Pos`
    * `add(other: Pos): Pos`
      * Returns a new `Pos` whose `x`,`y`, and `z` components are the sum of those properties of this `Pos` (including the stored relative `Pos`) and the other `Pos`
    * `sub(other: Pos): Pos`
      * Returns a new `Pos` whose `x`,`y`, and `z` components are the difference between those properties of this `Pos` (including the stored relative `Pos`) and the other `Pos`
    * `rotate(other: Rotate): Pos`
      * Return a new `Pos` whose position hase been modified to coincide with a rotation
      * A rotation of 90 degrees will swap `x`/`y`, and negate `y`
    * `build(): {"x": number, "y": number, "z": number}`
      * Return a value in a format that Scrap Mechanic can understand

* #### **Bounds**
  * Syntax:
    ```typescript
      class Bounds({
        x?: number,
        y?: number,
        z?: number
      }) extends Pos
    ```
    * `x: number`
      * Optional parameter
      * Indicates the *x* (width) bound of a block
      * Default value: `1`
    * `y: number`
      * Optional parameter
      * Indicates the *y* (depth) bound of a block
      * Default value: `1`
    * `z: number`
      * Optional parameter
      * Indicates the *z* (height) bound of a block
      * Default value: `1`
  * Description:
    * Stores the space an object (such as a `Draggable` like `Wood`) will take up
  * Methods:
    * `get x(): number`
      * Returns the `x` component of this bound
    * `get y(): number`
      * Returns the `y` component of this bound
    * `get z(): number`
      * Returns the `z` component of this bound
    * `build(): {"x": number, "y": number, "z": number}`
      * Return a value in a format that Scrap Mechanic can understand

* #### **Bounds2d**
  * Syntax:
    ```typescript
    class Bounds2d({
      x?: number,
      y?: number
    }) extends Bounds
    ```
    * `x: number`
      * Optional parameter
      * Indicates the *x* (width) bound of a block
      * Default value: `1`
    * `y: number`
      * Optional parameter
      * Indicates the *y* (height) bound of a block
      * Default value: `1`
  * Description:
    * Stores the space an object on a 2d plane (such a a `Frame`) will take up
  * Methods:
    * `get x(): number`
      * Returns the `x` component of this bound
    * `get y(): number`
      * Returns the `y` component of this bound
    * `get z(): 1`
      * Carry-over from parent class
      * `z` component never set, so it remains at its default value (1)
      * Returns the `z` component of this bound
    * `build(): {"x": number, "y": number, "z": number}`
      * Return a value in a format that Scrap Mechanic can understand
  * Properties:
    * 

* #### **Rotate**
  * Syntax:
    ```typescript
    class Rotate({
      direction?: Direction,
      orientation?: Orientation
    })
    ```
    * `direction: Rotate`
      * The direction which the `Rotate` is pointing towards
    * `orientation: Orientation`
      * A second axis of rotation in which to align `direction`
  * Description:
    * Stores a direction for an object to be facing in
  * Methods:
    * `get direction(): Direction`
      * Returns the current direction of the object
    * `get orientation(): Orientation`
      * Returns the current alignment of the direction
    * `xAxis(): number`
      * Returns a magical value that Scrap Mechanic uses to set rotation
      * This value is returned based on a lookup table, using this `Rotate`'s direction and orientation
    * `zAxis(): number`
      * Returns a magical value that Scrap Mechanic uses to set rotation
      * This value is returned based on a lookup table, using this `Rotate`'s direction and orientation
    * `offset(): Pos`
      * Returns the amount that a block has moved due to being rotated
      * This is due to math that Scrap Mechanic does based on the `xAxis` and `zAxis` properties
      * This value is returned based on a lookup table, using this `Rotate`'s direction and orientation
    * `add(other: Rotate): Rotate`
      * Returns a new `Rotate` whose resultant rotation is the sum of this `Rotate`'s rotation, and the other `Rotate`'s rotation
      * This value is returned based on a lookup table, using this and the other `Rotate`'s direction and orientation
  * Properties:
    * `dir`: Direction
      * The current direction of the object
    * `or`: Orientation
      * The current alignment of the direction

* #### **Offset**
  * Syntax:
    ```typescript
    class Offset({
      pos?: Pos,
      rotate?: Rotate
    })
    ```
    * `pos: Pos`
      * Optional parameter
      * A position value to offset an object by
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * A rotate value to offset an object's rotation by
      * Default value: `new Rotate({})`
  * Description:
    * Holds both a `Rotate` and `Pos` object to easily pass around the amount to offset the position of another object
  * Methods:
    * `add(offset: Offset): Offset`
      * Returns a new offset whose position and rotation have been added to the position and rotation of the other offset
  * Properties:
    * `readonly pos: Pos`
      * Stores the position value to offset an object by
    * `readonly rotate: Rotate`
      * Stores the rotation value to offst an object's rotation by

## Graphics

> ### [FrameBuilder](#framebuilder-1)

* ### **FrameBuilder**
  * Syntax:
    ```typescript
    class FrameBuilder({
      size: Bounds2d,
      defaultFill?: boolean,
      builder: function
    })
    ```
    * `size: Bounds2d`
      * The height and width of the frame to be built
    * defaultFill
      * Optional parameter
      * Determines the default background color, in contrast to the default object color
      * Default value: `false` (background is `false`, objects are `true`)
    * builder
      * A function that will create the shapes that will be used for making frames
      * This does not return anything
      * The created function takes a set of parameters:
        * `frameNumber: number`
          * The frame to create
          * This number can be used to generate progressively different frames for each call of the function
        * `Circle: function`
          * The way to generate a `Circle` in a builder
          * Each `Circle` takes a set of parameters
            * `pos: Pos2d`
              * The location of the circle in the new frame
            * `fill?: boolean`
              * The representation of the circle in `BitMap` space
            * `radius: number`
              * The radius of the resultant circle
        * `Rect: function`
          * The way to generate a `Rect` in a builder
          * Each `Rect` takes a set of parameters
            * `pos: Pos2d`
              * The location of the circle in the new frame
            * `fill?: boolean`
              * The representation of the circle in `BitMap` space
            * `bounds: bounds2d`
              * The width and height of the resultant `Rect`
    * Description
      * Creates frames based on simple graphics commands, to help with simplifying the frame creation process
    * Methods
      * `Circle({ pos: Pos2d, fill: boolean, radius: number })`
        *  `pos: Pos2d`
           * The location of the circle in the new frame
        * `fill?: boolean`
          * The representation of the circle in `BitMap` space
        * `radius: number`
          * The radius of the resultant circle
        * Creates a `Circle` to be stored in the `FrameBuilder`
      * `Rect({ pos: Pos2d, fill: boolean, bounds: Bounds2d })`
        * `pos: Pos2d`
          * The location of the circle in the new frame
        * `fill?: boolean`
          * The representation of the circle in `BitMap` space
        * `bounds: bounds2d`
          * The width and height of the resultant `Rect`
        * Creates a `Rect` to be stored in the `FrameBuilder`
    * Properties
      * `size: Bounds2d`
        * The size of the frame that is to be built

# Frames

> ### [frame](#frame-1)
> ### [VFrame](#vframe-1)
> ### [FileFrame](#fileframe-1)
> ### [Framer](#framer-1)
> ### [Frames](#frames-1)
> ### [FrameSprite](#framesprite-1)
> ### [ROMFrame](#romframe-1)
> ### [MappedROMFrame](#mappedromframe-1)
> ### [RawROMFrame](#rawromframe-1)
> ### [StringROMFrame](#stringromframe-1)
> ### [PhysicalFrame](#physicalframe-1)

* #### **Frame**
  * Syntax:
    ```typescript
    class Frame({
      size: Bounds2d,
      value: BitMask[],
      fallback: boolean
    })
    ```
    * `size: Bounds2d`
      * The height and width of the Frame
    * `value: BitMask[]`
      * The specific pixel values of the frame
    * `fallback: boolean`
      * The value for unset bitmask values to be set to
  * Description
    * Stores a set of data in the form of multiple `BitMask`, with each being a set length
  * Methods
    * `add(other: Frame): Frame`
      * Returns the result of a logical *or* operation on all BitMasks of this Frame with all BitMasks of the other Frame
    * `resize(size: Bounds2d): Frame`
      * Returns a new frame whose height and width have been set to those of the Bounds2d
    * `remap(size: Bounds2d): Frame`
      * Returns a new Frame whose width and height coincide with those specified in `size`
      * Acts as if each BitMask is connected to the Previous BitMask, and changing the size of one frame moves where the BitMasks are
        * eg: `[[1,2],[3,4],[5,6]]` -> (3x3) -> `[[1,2,3],[4,5,6],[?,?,?]]`
        * (All *?s* are set to the `fallback` value)
    * `invert(): Frame`
      * Returns a new Frame whose BitMasks have all been inverted
    * `hFlip(): Frame`
      * Returns a new Frame hose BitMasks have been reversed
    * `vFlip(): Frame`
      * Returns a new Frame whose BitMask order has been reversed
      * (First BitMask becomes the last, Second BitMask becomes the second to last, etc.)
    * `hexDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the hexidecimal representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out hexidecimal data, and attempts to convert all bytes to ASCII
    * `binDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the binary representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out binary data
    * `shift(count: Pos2d): Frame`
      * Shift all BitMasks by `count.x` bits, and rearrange list of BitMasks, shifting by `count.y` bits
  * Properties
    * `fallback: boolean`
      * The value that any value of a BitMask will be set to if it needs to be extended

* #### **VFrame**
  * Syntax:
    ```typescript
    class VFrame({
      data: string[],
      offCharacter?: string,
      size?: Bounds2d
    }) extends Frame
    ```
    * `data: string[]`
      * The data to be stored
      * Each entry in the array of strings acts as a new BitMask
    * `offCharacter: string`
      * Optional parameter
      * The character in `data` to be treated as a `false`
      * Default value: `" "` (space)
    * `size: Bounds2d`
      * Optional parameter
      * The height and width of the final `Frame`
      * Default value: `null`
        * The `VFrame` will set its width to the maximum width of a generated BitMask, and its height to the amount of entries in the `data` array
  * Description
    * Another way of entering data into a Frame
    * Works particularly well when trying to design graphics
    * Stands for (V)isual Frame
  * Methods
    * `add(other: Frame): Frame`
      * Returns the result of a logical *or* operation on all BitMasks of this Frame with all BitMasks of the other Frame
    * `resize(size: Bounds2d): Frame`
      * Returns a new frame whose height and width have been set to those of the Bounds2d
    * `remap(size: Bounds2d): Frame`
      * Returns a new Frame whose width and height coincide with those specified in `size`
      * Acts as if each BitMask is connected to the Previous BitMask, and changing the size of one frame moves where the BitMasks are
        * eg: `[[1,2],[3,4],[5,6]]` -> (3x3) -> `[[1,2,3],[4,5,6],[?,?,?]]`
        * (All *?s* are set to the `fallback` value)
    * `invert(): Frame`
      * Returns a new Frame whose BitMasks have all been inverted
    * `hFlip(): Frame`
      * Returns a new Frame hose BitMasks have been reversed
    * `vFlip(): Frame`
      * Returns a new Frame whose BitMask order has been reversed
      * (First BitMask becomes the last, Second BitMask becomes the second to last, etc.)
    * `hexDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the hexidecimal representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out hexidecimal data, and attempts to convert all bytes to ASCII
    * `binDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the binary representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out binary data
    * `shift(count: Pos2d): Frame`
      * Shift all BitMasks by `count.x` bits, and rearrange list of BitMasks, shifting by `count.y` bits
  * Properties
    * `fallback: boolean`
      * The value that any value of a BitMask will be set to if it needs to be extended

* #### **FileFrame**
  * Syntax:
    ```typescript
    class FileFrame({
      imageData: any,
      activeRange?: [min,max],
      preview?: boolean
    }) extends Frame
    ```
    * `imageData: ...`
      * The raw image data returned by a Jimp.read() command
    * `activeRange: [min: number, max:number]`
      * Optional parameter
      * Stores the range of image pixel brightness values that will register as a `true`
      * Pixel brightness is calculated as `(pixel.a / 255) * (pixel.r + pixel.g + pixel.b) / 3 `
      * Default value: `[0,127]`
    * `preview: boolean`
      * Optional parameter
      * Indicates whether or not the image is printed to the console
      * Default value: `false`
  * Description
    * The basic way of importing an image file as a Frame
  * Methods
    * `add(other: Frame): Frame`
      * Returns the result of a logical *or* operation on all BitMasks of this Frame with all BitMasks of the other Frame
    * `resize(size: Bounds2d): Frame`
      * Returns a new frame whose height and width have been set to those of the Bounds2d
    * `remap(size: Bounds2d): Frame`
      * Returns a new Frame whose width and height coincide with those specified in `size`
      * Acts as if each BitMask is connected to the Previous BitMask, and changing the size of one frame moves where the BitMasks are
        * eg: `[[1,2],[3,4],[5,6]]` -> (3x3) -> `[[1,2,3],[4,5,6],[?,?,?]]`
        * (All *?s* are set to the `fallback` value)
    * `invert(): Frame`
      * Returns a new Frame whose BitMasks have all been inverted
    * `hFlip(): Frame`
      * Returns a new Frame hose BitMasks have been reversed
    * `vFlip(): Frame`
      * Returns a new Frame whose BitMask order has been reversed
      * (First BitMask becomes the last, Second BitMask becomes the second to last, etc.)
    * `hexDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the hexidecimal representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out hexidecimal data, and attempts to convert all bytes to ASCII
    * `binDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the binary representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out binary data
    * `shift(count: Pos2d): Frame`
      * Shift all BitMasks by `count.x` bits, and rearrange list of BitMasks, shifting by `count.y` bits
  * Properties
    * `fallback: boolean`
      * The value that any value of a BitMask will be set to if it needs to be extended

* #### **Framer**
  * Syntax:
    ```typescript
    class Framer({
      frames: Frame[],
      combinatorFunction?: Operation
    }) extends Frame
    ```
    * combinatorFunction
      * Optional parameter
      * Decides how all frames in `frames` will be combined
      * Default value: `new Operation(LogicalOperation.Or)`
        * By default, this will *or* all values of each Frame together
  * Description
    * Construct one composite frame from the input of multiple other frames
  * Methods
    * `add(other: Frame): Frame`
      * Returns the result of a logical *or* operation on all BitMasks of this Frame with all BitMasks of the other Frame
    * `resize(size: Bounds2d): Frame`
      * Returns a new frame whose height and width have been set to those of the Bounds2d
    * `remap(size: Bounds2d): Frame`
      * Returns a new Frame whose width and height coincide with those specified in `size`
      * Acts as if each BitMask is connected to the Previous BitMask, and changing the size of one frame moves where the BitMasks are
        * eg: `[[1,2],[3,4],[5,6]]` -> (3x3) -> `[[1,2,3],[4,5,6],[?,?,?]]`
        * (All *?s* are set to the `fallback` value)
    * `invert(): Frame`
      * Returns a new Frame whose BitMasks have all been inverted
    * `hFlip(): Frame`
      * Returns a new Frame hose BitMasks have been reversed
    * `vFlip(): Frame`
      * Returns a new Frame whose BitMask order has been reversed
      * (First BitMask becomes the last, Second BitMask becomes the second to last, etc.)
    * `hexDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the hexidecimal representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out hexidecimal data, and attempts to convert all bytes to ASCII
    * `binDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the binary representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out binary data
    * `shift(count: Pos2d): Frame`
      * Shift all BitMasks by `count.x` bits, and rearrange list of BitMasks, shifting by `count.y` bits
  * Properties
    * `fallback: boolean`
      * The value that any value of a BitMask will be set to if it needs to be extended

* #### **Frames**
  * Syntax:
    ```typescript
    class Frames({
      frames: Frame[],
      size?: Bounds2d
    })
    ```
    * `size: Bounds2d`
      * The height and width of all the frames
  * Description
    * Stores multiple frames which are garunteed to have the same bounds
  * Properties
    * `frames: Frame[]`
      * All the frames that `Frames` stores
    * `width: number`
      * The width of all the frames
    * `height: number`
      * The height of all the frames

* #### **FrameSprite**
  * Syntax:
    ```typescript
    class FrameSprite({
      frame: Frame,
      movement?: Bounds2d,
      step?: Bounds2d
    })
  ```
    * `movement: Bounds2d`
      * The range of movement that `frame` is expected to handle
    * `step: Bounds2d`
      * The amount of pixels that each unit of movement in `movement` represents
      * A step of `{x:2,y:2}` with a movement of `{x:1,y:1}` would result in 2 pixels of x/y movement with one increase in x/y sprite position
  * Description
    * Stores a many copies of the original `frame`, but offset by a certain amount to allow a simple image to move about a screen
  * Methods
    * `getPos(position: Pos2d): Frame`
      * Returns a frame offset from the original position by `position`
  * Properties
    * `frames: Frame[]`
      * All the frames that `Frames` stores
    * `width: number`
      * The width of all the frames
    * `height: number`
      * The height of all the frames

* #### **ROMFrame**
  * Syntax:
    ```typescript
    class ROMFrame({
      format: ROMFormat | ROMFormat[],
      jsonData: any | any[],
      depth?: number,
      reverseBits?: boolean,
      reverseOrder?: boolean
    }) extends Frame
    ```
    * `format: ROMFormat | ROMFormat[]`
      * Used a small amount of abstraction above the raw bits
      * Input in the format `{name: string, bits: number}`
        * `name`: The name of the section this is heading
        * `bits`: The amount of bits this section will take up
      * Multiple `format` units make up a word
    * `jsonData: ...`
      * Used a small amount of abstraction above the raw bits
      * Input in the format `{[name]: value, [name]: value, ...}`
        * `name`: The name of the section that this is heading
        * `value`: The value to set this section to
          * Must be able to fit within `bits` bits. 
          * eg: (128 is too large for 7 bits, but 127 *will* fit)
      * One `jsonData` unit makes up a word
    * `depth: number`
      * Optional parameter
      * The size of the BitMask that stores the final result of the `format`/`jsonData` data
      * Can be thought of as the size of a word in this ROM
      * Default value: `-1`
        * Signal that the depth will be set to the sum of all `format` unit section `bits` values
    * `reverseBits: boolean`
      * Optional parameter
      * If `true`: stores section of value `12` as `0b0011`
      * if `false`: stores a section of value `12` as `0b1100`
      * Default value: `false`
    * `reverseOrder: boolean`
      * Optional parameter
      * If `true`: reverses the order of format
      * Default value: `false`
  * Description
    * The easiest way to store data
  * Methods
    * `add(other: Frame): Frame`
      * Returns the result of a logical *or* operation on all BitMasks of this Frame with all BitMasks of the other Frame
    * `resize(size: Bounds2d): Frame`
      * Returns a new frame whose height and width have been set to those of the Bounds2d
    * `remap(size: Bounds2d): Frame`
      * Returns a new Frame whose width and height coincide with those specified in `size`
      * Acts as if each BitMask is connected to the Previous BitMask, and changing the size of one frame moves where the BitMasks are
        * eg: `[[1,2],[3,4],[5,6]]` -> (3x3) -> `[[1,2,3],[4,5,6],[?,?,?]]`
        * (All *?s* are set to the `fallback` value)
    * `invert(): Frame`
      * Returns a new Frame whose BitMasks have all been inverted
    * `hFlip(): Frame`
      * Returns a new Frame hose BitMasks have been reversed
    * `vFlip(): Frame`
      * Returns a new Frame whose BitMask order has been reversed
      * (First BitMask becomes the last, Second BitMask becomes the second to last, etc.)
    * `hexDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the hexidecimal representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out hexidecimal data, and attempts to convert all bytes to ASCII
    * `binDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the binary representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out binary data
    * `shift(count: Pos2d): Frame`
      * Shift all BitMasks by `count.x` bits, and rearrange list of BitMasks, shifting by `count.y` bits
  * Properties
    * `fallback: boolean`
      * The value that any value of a BitMask will be set to if it needs to be extended

* #### **MappedROMFrame**
  * Syntax:
    ```typescript
    class MappedROMFrame({
      format: MappedROMFormat | MappedROMFormat[],
      jsonData: any | any[],
      depth?: number,
      reverseBits?: boolean,
      reverseOrder?: boolean
    }) extends ROMFrame
    ```
    * `format: MappedROMFormat | MappedROMFormat[]`
      * Used a small amount of abstraction above the raw bits
      * Input in the format `{name: string, bits: number, map?: any[]}`
        * `name`: The name of the section this is heading
        * `bits`: The amount of bits this section will take up
        * `map`: Stores string values that are associated with certain numerical values
          * Input in the format `{[namedValue]: numberValue, [namedValue]: numberValue, ...}`
            * `namedValue`: The string to be replaced
            * `numberValue` The value to replace `namedValue` with
      * Multiple `format` units make up a word
    * `jsonData: ...`
      * Used a small amount of abstraction above the raw bits
      * Input in the format `{[name]: value, [name]: value, ...}`
        * `name`: The name of the section that this is heading
        * `value`: The value to set this section to
          * Must be able to fit within `bits` bits. 
          * eg: (128 is too large for 7 bits, but 127 *will* fit)
      * One `jsonData` unit makes up a word
    * `depth: number`
      * Optional parameter
      * The size of the BitMask that stores the final result of the `format`/`jsonData` data
      * Can be thought of as the size of a word in this ROM
      * Default value: `-1`
        * Signal that the depth will be set to the sum of all `format` unit section `bits` values
    * `reverseBits: boolean`
      * Optional parameter
      * If `true`: stores section of value `12` as `0b0011`
      * if `false`: stores a section of value `12` as `0b1100`
      * Default value: `false`
    * `reverseOrder: boolean`
      * Optional parameter
      * If `true`: reverses the order of format
      * Default value: `false`
  * Description
    * A way to enter in ROM data, but with a layer of abstraction to make complicated values easier to remember
  * Methods
    * `add(other: Frame): Frame`
      * Returns the result of a logical *or* operation on all BitMasks of this Frame with all BitMasks of the other Frame
    * `resize(size: Bounds2d): Frame`
      * Returns a new frame whose height and width have been set to those of the Bounds2d
    * `remap(size: Bounds2d): Frame`
      * Returns a new Frame whose width and height coincide with those specified in `size`
      * Acts as if each BitMask is connected to the Previous BitMask, and changing the size of one frame moves where the BitMasks are
        * eg: `[[1,2],[3,4],[5,6]]` -> (3x3) -> `[[1,2,3],[4,5,6],[?,?,?]]`
        * (All *?s* are set to the `fallback` value)
    * `invert(): Frame`
      * Returns a new Frame whose BitMasks have all been inverted
    * `hFlip(): Frame`
      * Returns a new Frame hose BitMasks have been reversed
    * `vFlip(): Frame`
      * Returns a new Frame whose BitMask order has been reversed
      * (First BitMask becomes the last, Second BitMask becomes the second to last, etc.)
    * `hexDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the hexidecimal representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out hexidecimal data, and attempts to convert all bytes to ASCII
    * `binDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the binary representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out binary data
    * `shift(count: Pos2d): Frame`
      * Shift all BitMasks by `count.x` bits, and rearrange list of BitMasks, shifting by `count.y` bits
  * Properties
    * `fallback: boolean`
      * The value that any value of a BitMask will be set to if it needs to be extended

* #### **RawROMFrame**
  * Syntax:
    ```typescript
    class RawROMFrame({
      data: number[],
      depth?: number
    }) extends ROMFrame
    ```
    * `depth: number`
      * Optional parameter
      * The size of the BitMask that stores the data
      * Default value: `8`
  * Description
    * A way of entering in raw ROM data
  * Methods
    * `add(other: Frame): Frame`
      * Returns the result of a logical *or* operation on all BitMasks of this Frame with all BitMasks of the other Frame
    * `resize(size: Bounds2d): Frame`
      * Returns a new frame whose height and width have been set to those of the Bounds2d
    * `remap(size: Bounds2d): Frame`
      * Returns a new Frame whose width and height coincide with those specified in `size`
      * Acts as if each BitMask is connected to the Previous BitMask, and changing the size of one frame moves where the BitMasks are
        * eg: `[[1,2],[3,4],[5,6]]` -> (3x3) -> `[[1,2,3],[4,5,6],[?,?,?]]`
        * (All *?s* are set to the `fallback` value)
    * `invert(): Frame`
      * Returns a new Frame whose BitMasks have all been inverted
    * `hFlip(): Frame`
      * Returns a new Frame hose BitMasks have been reversed
    * `vFlip(): Frame`
      * Returns a new Frame whose BitMask order has been reversed
      * (First BitMask becomes the last, Second BitMask becomes the second to last, etc.)
    * `hexDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the hexidecimal representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out hexidecimal data, and attempts to convert all bytes to ASCII
    * `binDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the binary representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out binary data
    * `shift(count: Pos2d): Frame`
      * Shift all BitMasks by `count.x` bits, and rearrange list of BitMasks, shifting by `count.y` bits
  * Properties
    * `fallback: boolean`
      * The value that any value of a BitMask will be set to if it needs to be extended

* #### **StringROMFrame**
  * Syntax:
    ```typescript
    class StringRomFrame({
      data: string
    }) extends ROMFrame
    ```
  * Description
    * A way of storing ROM data at a relatively high level of abstraction
    * Best for encoding text (can effectively encode values 32-126)
    * Stores each character in `data` as its own BitMask of depth 8 (standard ASCII encoding)
  * Methods
    * `add(other: Frame): Frame`
      * Returns the result of a logical *or* operation on all BitMasks of this Frame with all BitMasks of the other Frame
    * `resize(size: Bounds2d): Frame`
      * Returns a new frame whose height and width have been set to those of the Bounds2d
    * `remap(size: Bounds2d): Frame`
      * Returns a new Frame whose width and height coincide with those specified in `size`
      * Acts as if each BitMask is connected to the Previous BitMask, and changing the size of one frame moves where the BitMasks are
        * eg: `[[1,2],[3,4],[5,6]]` -> (3x3) -> `[[1,2,3],[4,5,6],[?,?,?]]`
        * (All *?s* are set to the `fallback` value)
    * `invert(): Frame`
      * Returns a new Frame whose BitMasks have all been inverted
    * `hFlip(): Frame`
      * Returns a new Frame hose BitMasks have been reversed
    * `vFlip(): Frame`
      * Returns a new Frame whose BitMask order has been reversed
      * (First BitMask becomes the last, Second BitMask becomes the second to last, etc.)
    * `hexDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the hexidecimal representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out hexidecimal data, and attempts to convert all bytes to ASCII
    * `binDump({ lineSize: number, chunkSize: number })`
      * Returns a list of the binary representations of each BitMask
      * If lineSize set to a greater-than-zero integer: prints out binary data
    * `shift(count: Pos2d): Frame`
      * Shift all BitMasks by `count.x` bits, and rearrange list of BitMasks, shifting by `count.y` bits
  * Properties
    * `fallback: boolean`
      * The value that any value of a BitMask will be set to if it needs to be extended

* #### **PhysicalFrame**
  * Syntax:
    ```typescript
    class PhysicalFrame({
      frame: Frame,
      id: Id
    })
    ```
    * `id: ID`
      * Contains the individual Ids to all the Logic blocks that `frame` is attached to
  * Description
    * Stores a `Frame`, along with the Logic blocks that it is connected to
  * Properties
    * `frame: Frame`
      * The `Frame` that is being stored
    * `id: Id`
      * Stores the individual Ids to all the Logic blocks that `frame` is attached to

> ## Layers
> ### [Material]
> ### [Layer]
> ### [Layers]

> # Container Classes
> ## Container Sections
> * [Basics](#basics)
> * [Bodies](#bodies)

## Basics
> ### [Unit](#unit-1)
> ### [Container](#container-1)
> ### [Grid](#grid-1)
> ### [Packager](#packager-1)

* #### **Unit**
  * Syntax
    ```typescript
    abstract class Unit({
      pos?: Pos,
      rotate?: Rotate,
      color?: Color
    })
    ```
    * `pos: Pos`
      * Optional parameter
      * Specifies the position of the `Unit`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Unit`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Unit` should be
      * Default value: `new Color()`
  * Description
    * The basic class for anything that will be directly turned into a blueprint
  * Methods
    * `get color(): Color`
      * Store what color the `Unit` should be
    * `set color(color: Color)`
      * Set what color the `Unit` should be
    * `abstract build(Offset: offset): string`
      * Returns a Scrap Mechanic compatible JSON string that represents the `Unit`
  * Properties
    * `pos: Pos`
      * Stores the position of the `Unit`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Unit`

* #### **Container**
  * Syntax
    ```typescript
    class Container({
      pos?: Pos,
      rotate?: Rotate,
      color?: Color,
      child?: Unit,
      children?: Unit[]
    }) extends Unit
    ```
    * `pos: Pos`
      * Optional parameter
      * Specifies the position of the `Container`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Container`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color all `Unit`s within the container should be. This overrides their original color
      * Default value: `new Color()`
    * `child: Unit`
      * A single `Unit` for the `Container` to envelop
    * `children: Unit[]`
      * Multiple `Unit`s for the `Container` to envelop
  * Description
    * Holds multiple `Unit`s, to allow a blueprint to be made of more than one `Unit`
  * Methods
    * `compress(): void`
      * Moves all children within this `Container` to the origin of the `Container`
    * `get color(): Color`
      * Store what color all `Unit`s in the the `Container` should be
    * `set color(color: Color)`
      * Set what color all `Unit`s in the the `Container` should be
    * `build(Offset: offset): string`
      * Returns a Scrap Mechanic compatible JSON string that represents the `Container`
  * Properties
    * `children: Unit[]`
      * A list of all `Unit`s that this `Container` is holding on to
    * `compressed: boolean`
      * Whether or not the `compress` command has been run on this `Container`
    * `pos: Pos`
      * Stores the position of the `Unit`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Unit`

* #### **Grid**
  * Syntax
    ```typescript
    class Grid({
      pos?: Pos,
      rotate?: Rotate,
      color?: Color,
      children?: Unit[],
      size: Bounds,
      spacing?: Bounds
    })
    ```
    * `pos: Pos`
      * Optional parameter
      * Specifies the position of the `Grid`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Grid`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color all `Unit`s within the container should be. This overrides their original color
      * Default value: `new Color()`
    * `children: Unit[]`
      * Multiple `Unit`s for the `Grid` to envelop
    * `size: Bounds`
      * The bounds of the `Grid`, so `Unit`s put into the grid can wrap-around properly
    * `spacing: Bounds`
    * Optional Parameter
      * The amount of space between `Unit`s in the `Grid`.
      * This does not care about the actual size of each `Unit`, just the amount of space between their origins
      * A spacing of `{x:1,y:1,z:1}` will lead to 1x1x1 blocks touching, and anything larger overlapping
      * Default value: `new Bounds({})`
  * Description
    * Takes in a set of `Units`, and attempts to lay them into a 3d grid pattern
    * This must be given the exact amount of `Unit`s specified by `size`
      * If `size` is `{x:2,y:8,z:4}`, the length of `children` must be exactly 64 (*2\*8\*4*)
    * The grid is filled up in this order
      1. Fill from `x=0` to `x=size.x`
      2. Fill from `y=0` to `y=size.y`  
         * Repeat step 1 with new `y` position
      3. Fill from `z=0` to `z=size.z`
         * Repeat step 1 with new `z` position
  * Methods
    * `getGridChild(pos: Pos): Unit`
      * Get the `Unit` that at the specified position
    * `getWidth(): number`
      * Returns amount of `Unit`s that make up the width of the `Grid`
    * `getHeight(): number`
      * Returns amount of `Unit`s that make up the height of the `Grid`
    * `getDepth(): number`
      * Returns amount of `Unit`s that make up the depth of the `Grid`
    * `compress(): void`
      * Moves all children within this `Grid` to the origin of the `Grid`
    * `get color(): Color`
      * Store what color all `Unit`s in the the `Grid` should be
    * `set color(color: Color)`
      * Set what color all `Unit`s in the the `Grid` should be
    * `build(Offset: offset): string`
      * Returns a Scrap Mechanic compatible JSON string that represents the `Grid`
  * Properties
    * `children: Unit[]`
      * A list of all `Unit`s that this `Grid` is holding on to
    * `compressed: boolean`
      * Whether or not the `compress` command has been run on this `Grid`
    * `pos: Pos`
      * Stores the position of the `Unit`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Unit`

* #### **Packager**
  * Syntax
    ```typescript
    class Packager({
      pos?: Pos,
      rotate?: Rotate,
      color?: Color,
      child?: Unit,
      children?: Unit[],
      packageA: string
    }) extends Container
    ```
    * `pos: Pos`
      * Optional parameter
      * Specifies the position of the `Packager`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Packager`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color all `Unit`s within the container should be. This overrides their original color
      * Default value: `new Color()`
    * `child: Unit`
      * A single `Unit` for the `Packager` to envelop
    * `children: Unit[]`
      * Multiple `Unit`s for the `Packager` to envelop
    * `packageA: string`
      * The Scrap Mechanic compatible blueprint file snippet containing the object to be added to
  * Description
    * Holds multiple `Unit`s, to allow a blueprint to be made of more than one `Unit`
  * Methods
    * `compress(): void`
      * Moves all children within this `Packager` to the origin of the `Packager`
    * `get color(): Color`
      * Store what color all `Unit`s in the the `Packager` should be
    * `set color(color: Color)`
      * Set what color all `Unit`s in the the `Packager` should be
    * `build(Offset: offset): string`
      * Returns a Scrap Mechanic compatible JSON string that represents the `Packager`
  * Properties
    * `package: string`
      * Stores the Scrap Mechanic compatible blueprint snippet containing the object to be added to
    * `children: Unit[]`
      * A list of all `Unit`s that this `Packager` is holding on to
    * `compressed: boolean`
      * Whether or not the `compress` command has been run on this `Packager`
    * `pos: Pos`
      * Stores the position of the `Unit`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Unit`

## Bodies

* #### **GenericBody**
  * Syntax
    ```typescript
    abstract class GenericBody({
      key?: BasicKey,
      title?: string,
      description?: string,
      debug: boolean
    })
    ```
    * `key: Key`
      * Optional parameter
      * The key that will be used for generating all other objects
      * Default value: `new BasicKey({})`
    * `title: string`
      * Optional parameter
      * The title of the blueprint that will be generated
      * Default value: `SM Logic Creation`
    * `description: string`
      * Optional parameter
      * The description of the blueprint that will be generated
      * Default value: `V2 of programmatically generating Scrap Mechanic logic-based creations`
    * `debug: boolean`
      * Optional parameter
      * If true: Adds in an [Axis](#axis-1) at the origin of the Body
      * Default value: `false`
  * Description
    * The class that initiates the process for converting all the `Unit`s into a Scrap Mechanic compatible blueprint file
    * To use this class:
      1. Create the class `Body` in `main.ts`
      2. Extend `body` by `GenericBody`
      3. Create an `async build` method that will create all `Unit` objects to be used in creating the final blueprint data
  * Methods
    * `async preBuild(): Promise<Unit>`
      * Code run before calling the `build` method of this class
      * Adds in the `Axis` if in debug mode
    * `abstract build(): Promise<Unit>`
      * Code run in this function will build all the `Unit`s to be used in the final blueprint
  * Properties
    * `readonly key: Key`
      * Stores  the key that will be used for generating all other objects

> # Block Classes
> ## Block Sections
> * [Basic Blocks](#basic-blocks)
> * [Logic Blocks](#logic-blocks)
> * [Materials](#materials)


## Basic Blocks 

> ### [Block](#block-1)
> ### [Scalable](#scalable-1)
> ### [Basic Logic](#basic-logic-1)

* #### **Block**
  * Syntax
    ```typescript
      abstract class Block({
        pos?: Pos,
        rotate?: Rotate,
        color?: Color,
        shapeId: ShapeIds
      }) extends Unit
    ```
    * `pos: Pos`
      * Optional parameter
      * Specifies the position of the `Block`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Block`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Block` should be
      * Default value: `new Color()`
    * `shapeId: ShapeIds`
      * Specifies the type of block to be built
  * Description
    * The basic class for building any blocks
  * Methods
    * `abstract build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
  * Properties
    * `pos: Pos`
      * Stores the position of the `Block`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Block`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block

* #### **Scalable**
  * Syntax
    ```typescript
      class Scalable({
        bounds: Bounds
        color?: Color,
        pos?: Pos,
        rotate?: Rotate
      },
        shapeId: ShapeIds
      ) extends Block
    ```
    * `bounds: Bounds`
      * Specifies the bounding box of this block
    * `pos: Pos`
      * Optional parameter
      * Specifies the origin of the `Scalable`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Scalable`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Scalable` should be
      * Default value: `new Color()`
    * `shapeId: ShapeIds`
      * Specifies the type of block to be built
  * Description
    * Represents blocks whose bounds can be resized, (eg: making a 32x32 platform one `Scalable` instead of 1024 `Block`s)
  * Methods
    * `build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
  * Properties
    * `pos: Pos`
      * Stores the origin of the `Scalable`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Scalable`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block
    * `bounds: Bounds`
      * Stores the bounding box of the `Scalable`

* #### **Basic Logic**
  * Syntax
    ```typescript
      class BasicLogic({
        key: Key,
        pos?: Pos,
        rotate?: Rotate,
        color?: Color,
        connections?: Connections
        shapeId: ShapeIds,
      }) extends Block
    ```
    * `key: Key`
      * Used to generate an `Id` for this Logic `Block`
    * `pos: Pos`
      * Optional parameter
      * Specifies the position of the `Unit`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Block`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Unit` should be
      * Default value: `new Color()`
    * `connections: Connections`
      * Optional parameter
      * Specifies what other Logic `Block`s this Logic `Block` is connected to
        * Default value: `new Connections({})`
    * `shapeId: ShapeIds`
      * Specifies the type of block to be built
  * Description
    * The basic class for building blocks that can interact with Scrap Mechanic logic signals
  * Methods
    * `build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
    * `get connections(): Array<Id>`
      * Returns the individual `Id`s of the other blocks this Logic `Block` is connected to
    * `get conns(): Connections`
      * Returns the `Connections` object representing the other blocks this Logic `Block` is connected to
    * `get id(): Id`
      * Returns the `Id` of this Logic `Block`
    * `abstract get controller()` 
      * Returns an `Object` that slots into the `controller` section when the `build` method is called
      * This section handles any and all logical connections and interactions
    * `connectTo(other: BasicLogic | Id)`
      * Connect the output of this Logic `Block` to the input of another Logic `Block`
  * Properties
    * `pos: Pos`
      * Stores the origin of the `Block`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Scalable`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block
    * `_conns: Connections`
      * Stores the other Logic `Block`s this Logic `Block` is connected to
    * `_id: Id`
      * Identifies this Logic `Block` as unique

## Logic Blocks
> ### [Logic](#logic-1)
> ### [Timer](#timer-1)
> ### [Button](#button-1)
> ### [Switch](#switch-1)

* #### **Logic**
  * Syntax
    ```typescript
      class Logic({
        key: Key,
        pos?: Pos,
        rotate?: Rotate,
        color?: Color,
        operation?: Operation
        connections?: Connections
      }) extends BasicLogic
    ```
    * `key: Key`
      * Used to generate an `Id` for this Logic `Block`
    * `pos: Pos`
      * Optional parameter
      * Specifies the position of the `Unit`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Block`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Unit` should be
      * Default value: `new Color()`
    * `operation: Operation`
      * Optional parameter
      * Specifies what function this `Logic` will perform
      * Default value: `new Operation()`
    * `connections: Connectinos`
      * Optional parameter
      * Specifies what other Logic `Block`s this Logic `Block` is connected to
        * Default value: `new Connections({})`
  * Description
    * A Logic Block in *Scrap Mechanic* that can perform 1 of 6 logical operations on boolean inputs:
      * `And`
      * `Or`
      * `Xor` (Exclusive Or)
      * `Nand` (Not And)
      * `Nor` (Not Or)
      * `Xnor` (Exclusive Not Or)
  * Methods
    * `build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
    * `get connections(): Array<Id>`
      * Returns the individual `Id`s of the other blocks this Logic `Block` is connected to
    * `get conns(): Connections`
      * Returns the `Connections` object representing the other blocks this Logic `Block` is connected to
    * `get id(): Id`
      * Returns the `Id` of this Logic `Block`
    * `get controller()` 
      * Returns an `Object` that slots into the `controller` section when the `build` method is called
      * This section handles any and all logical connections and interactions
    * `connectTo(other: BasicLogic | Id)`
      * Connect the output of this Logic `Block` to the input of another Logic `Block`
    * `updateTypeColor(): boolean`
      * Checks if the logic block should have a color other than the default based on its `Operation`
      * Returns if the color was updated
    * `get operation(): Operation`
      * Returns the operation this `Logic` performs
    * `set operation(operation: Operation)`
      * Sets the type of function this `Logic` will perform
    * `set color(color: Color)`
      * sets the color, and the `colorSet` flat
  * Properties
    * `pos: Pos`
      * Stores the origin of the `Block`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Scalable`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block
    * `_conns: Connections`
      * Stores the other Logic `Block`s this Logic `Block` is connected to
    * `_id: Id`
      * Identifies this Logic `Block` as unique
    * `op: Operation`
      * Stores the function the `Logic` performs
    * `colorSet: boolean`
      * Stores if the color was set explicitly (by the user) or implicitly (by the `operation` type)

* #### **Timer**
  * Syntax
    ```typescript
      class Timer({
        key: Key,
        delay?: Delay
        pos?: Pos,
        rotate?: Rotate,
        color?: Color,
        connections?: Connections
      }) extends BasicLogic
    ```
    * `key: Key`
      * Used to generate an `Id` for this Logic `Block`
    * `delay: Delay`
      * Optional parameter
      * The delay this timer adds to the circuit (excludes the 1 tick every component has)
      * Default value: `new Delay({ delay:0, unit: Time.Tick })`
    * `pos: Pos`
      * Optional parameter
      * Specifies the position of the `Unit`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Block`
      * Default value: `new Rotate({ direction: Direction.Up })`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Unit` should be
      * Default value: `new Color()`
    * `connections: Connections`
      * Optional parameter
      * Specifies what other Logic `Block`s this Logic `Block` is connected to
        * Default value: `new Connections({})`
  * Description
    * A Timer Block in *Scrap Mechanic* that can easily add delay to a circuit
  * Methods
    * `build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
    * `get connections(): Array<Id>`
      * Returns the individual `Id`s of the other blocks this Logic `Block` is connected to
    * `get conns(): Connections`
      * Returns the `Connections` object representing the other blocks this Logic `Block` is connected to
    * `get id(): Id`
      * Returns the `Id` of this Logic `Block`
    * `get controller()` 
      * Returns an `Object` that slots into the `controller` section when the `build` method is called
      * This section handles any and all logical connections and interactions
    * `connectTo(other: BasicLogic | Id)`
      * Connect the output of this Logic `Block` to the input of another Logic `Block`
  * Properties
    * `pos: Pos`
      * Stores the origin of the `Block`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Scalable`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block
    * `_conns: Connections`
      * Stores the other Logic `Block`s this Logic `Block` is connected to
    * `_id: Id`
      * Identifies this Logic `Block` as unique
    * `delay: Delay`
      * The delay this `Timer` will add to the circuit (excluding the 1 tick added to all logic blocks)

* #### **Button**
  * Syntax
    ```typescript
      class Button({
        key: Key,
        pos?: Pos,
        rotate?: Rotate,
        color?: Color,
        connections?: Connectinos
      }) extends Block
    ```
    * `key: Key`
      * Used to generate an `Id` for this Logic `Block`
    * `pos: Pos`
      * Optional parameter
      * Specifies the position of the `Unit`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Block`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Unit` should be
      * Default value: `new Color()`
    * `connections: Connections`
      * Optional parameter
      * Specifies what other Logic `Block`s this Logic `Block` is connected to
        * Default value: `new Connections({})`
  * Description
    * An input into a logic circuit--only sends out an *on* signal when held
  * Methods
    * `build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
    * `get connections(): Array<Id>`
      * Returns the individual `Id`s of the other blocks this Logic `Block` is connected to
    * `get conns(): Connections`
      * Returns the `Connections` object representing the other blocks this Logic `Block` is connected to
    * `get id(): Id`
      * Returns the `Id` of this Logic `Block`
    * `get controller()` 
      * Returns an `Object` that slots into the `controller` section when the `build` method is called
      * This section handles any and all logical connections and interactions
    * `connectTo(other: BasicLogic | Id)`
      * Connect the output of this Logic `Block` to the input of another Logic `Block`
  * Properties
    * `pos: Pos`
      * Stores the origin of the `Block`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Scalable`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block
    * `_conns: Connections`
      * Stores the other Logic `Block`s this Logic `Block` is connected to
    * `_id: Id`
      * Identifies this Logic `Block` as unique

* #### **Switch**
  * Syntax
    ```typescript
      class Switch({
        key: Key,
        pos?: Pos,
        rotate?: Rotate,
        color?: Color,
        connections?: Connectinos
      }) extends Block
    ```
    * `key: Key`
      * Used to generate an `Id` for this Logic `Block`
    * `pos: Pos`
      * Optional parameter
      * Specifies the position of the `Unit`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Block`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Unit` should be
      * Default value: `new Color()`
    * `connections: Connections`
      * Optional parameter
      * Specifies what other Logic `Block`s this Logic `Block` is connected to
        * Default value: `new Connections({})`
  * Description
    * An input into a logic circuit--toggles between an *on* and *off* signal when pressed
  * Methods
    * `build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
    * `get connections(): Array<Id>`
      * Returns the individual `Id`s of the other blocks this Logic `Block` is connected to
    * `get conns(): Connections`
      * Returns the `Connections` object representing the other blocks this Logic `Block` is connected to
    * `get id(): Id`
      * Returns the `Id` of this Logic `Block`
    * `get controller()` 
      * Returns an `Object` that slots into the `controller` section when the `build` method is called
      * This section handles any and all logical connections and interactions
    * `connectTo(other: BasicLogic | Id)`
      * Connect the output of this Logic `Block` to the input of another Logic `Block`
  * Properties
    * `pos: Pos`
      * Stores the origin of the `Block`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Scalable`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block
    * `_conns: Connections`
      * Stores the other Logic `Block`s this Logic `Block` is connected to
    * `_id: Id`
      * Identifies this Logic `Block` as unique

## Materials

> ### [Wood](#wood-1)
> ### [Glass](#glass-1)
> ### [GlassTile](#glasstile-1)
> ### [Cardboard](#cardboard-1)
> ### [Concrete](#concrete-1)
> ### [Metal](#metal-1)
> ### [Barrier/Caution](#barrier)
> ### [Bricks](#bricks-1)

* #### **Wood**
  * Syntax
    ```typescript
      class Wood({
        bounds: Bounds,
        pos?: Pos,
        color?: Color,
        rotate?: Rotate
      }) extends Scalable
    ```
    * `bounds: Bounds`
      * Specifies the bounding box of this block
    * `pos: Pos`
      * Optional parameter
      * Specifies the origin of the `Scalable`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Scalable`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Scalable` should be
      * Default value: `new Color()`
  * Description
    * A preset of `Scalable` using the *Wood* material
  * Methods
    * `build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
  * Properties
    * `pos: Pos`
      * Stores the origin of the `Scalable`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Scalable`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block
    * `bounds: Bounds`
      * Stores the bounding box of the `Scalable`

* #### **Glass**
  * Syntax
    ```typescript
      class Glass({
        bounds: Bounds,
        pos?: Pos,
        color?: Color,
        rotate?: Rotate
      }) extends Scalable
    ```
    * `bounds: Bounds`
      * Specifies the bounding box of this block
    * `pos: Pos`
      * Optional parameter
      * Specifies the origin of the `Scalable`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Scalable`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Scalable` should be
      * Default value: `new Color()`
  * Description
    * A preset of `Scalable` using the *Glass* material
  * Methods
    * `build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
  * Properties
    * `pos: Pos`
      * Stores the origin of the `Scalable`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Scalable`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block
    * `bounds: Bounds`
      * Stores the bounding box of the `Scalable`

* #### **GlassTile**
  * Syntax
    ```typescript
      class GlassTile({
        bounds: Bounds,
        pos?: Pos,
        color?: Color,
        rotate?: Rotate
      }) extends Scalable
    ```
    * `bounds: Bounds`
      * Specifies the bounding box of this block
    * `pos: Pos`
      * Optional parameter
      * Specifies the origin of the `Scalable`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Scalable`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Scalable` should be
      * Default value: `new Color()`
  * Description
    * A preset of `Scalable` using the *GlassTile* material
  * Methods
    * `build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
  * Properties
    * `pos: Pos`
      * Stores the origin of the `Scalable`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Scalable`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block
    * `bounds: Bounds`
      * Stores the bounding box of the `Scalable`

* #### **Cardboard**
  * Syntax
    ```typescript
      class Cardboard({
        bounds: Bounds,
        pos?: Pos,
        color?: Color,
        rotate?: Rotate
      }) extends Scalable
    ```
    * `bounds: Bounds`
      * Specifies the bounding box of this block
    * `pos: Pos`
      * Optional parameter
      * Specifies the origin of the `Scalable`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Scalable`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Scalable` should be
      * Default value: `new Color()`
  * Description
    * A preset of `Scalable` using the *Cardboard* material
  * Methods
    * `build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
  * Properties
    * `pos: Pos`
      * Stores the origin of the `Scalable`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Scalable`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block
    * `bounds: Bounds`
      * Stores the bounding box of the `Scalable`

* #### **Concrete**
  * Syntax
    ```typescript
      class Concrete({
        bounds: Bounds,
        pos?: Pos,
        color?: Color,
        rotate?: Rotate
      }) extends Scalable
    ```
    * `bounds: Bounds`
      * Specifies the bounding box of this block
    * `pos: Pos`
      * Optional parameter
      * Specifies the origin of the `Scalable`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Scalable`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Scalable` should be
      * Default value: `new Color()`
  * Description
    * A preset of `Scalable` using the *Concrete* material
  * Methods
    * `build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
  * Properties
    * `pos: Pos`
      * Stores the origin of the `Scalable`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Scalable`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block
    * `bounds: Bounds`
      * Stores the bounding box of the `Scalable`

* #### **Metal**
  * Syntax
    ```typescript
      class Metal({
        bounds: Bounds,
        pos?: Pos,
        color?: Color,
        rotate?: Rotate
      }) extends Scalable
    ```
    * `bounds: Bounds`
      * Specifies the bounding box of this block
    * `pos: Pos`
      * Optional parameter
      * Specifies the origin of the `Scalable`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Scalable`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Scalable` should be
      * Default value: `new Color()`
  * Description
    * A preset of `Scalable` using the *Metal* material
  * Methods
    * `build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
  * Properties
    * `pos: Pos`
      * Stores the origin of the `Scalable`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Scalable`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block
    * `bounds: Bounds`
      * Stores the bounding box of the `Scalable`

* #### **Barrier**
  * Syntax
    ```typescript
      class Barrier({
        bounds: Bounds,
        pos?: Pos,
        color?: Color,
        rotate?: Rotate
      }) extends Scalable
    ```
    * `bounds: Bounds`
      * Specifies the bounding box of this block
    * `pos: Pos`
      * Optional parameter
      * Specifies the origin of the `Scalable`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Scalable`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Scalable` should be
      * Default value: `new Color()`
  * Description
    * A preset of `Scalable` using the *Barrier* material
  * Methods
    * `build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
  * Properties
    * `pos: Pos`
      * Stores the origin of the `Scalable`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Scalable`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block
    * `bounds: Bounds`
      * Stores the bounding box of the `Scalable`

* #### **Bricks**
  * Syntax
    ```typescript
      class Bricks({
        bounds: Bounds,
        pos?: Pos,
        color?: Color,
        rotate?: Rotate
      }) extends Scalable
    ```
    * `bounds: Bounds`
      * Specifies the bounding box of this block
    * `pos: Pos`
      * Optional parameter
      * Specifies the origin of the `Scalable`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Scalable`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Scalable` should be
      * Default value: `new Color()`
  * Description
    * A preset of `Scalable` using the *Bricks* material
  * Methods
    * `build(offset: Offset)`
      * Returns a *Scrap Mechanic* compatible representation of this block as an `Object`
  * Properties
    * `pos: Pos`
      * Stores the origin of the `Scalable`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Scalable`
    * `shapeId: ShapeIds`
      * Stores the `shapeId` of this block
    * `bounds: Bounds`
      * Stores the bounding box of the `Scalable`


> # Prebuilts
> ## Support Sections
> * [Delays](#delays-2)
> * [Displays](#displays)
> * [Memory](#memory)
> * [Numbers](#numbers)
> * [SSP (**S**crap **S**erial **P**rotocol)](#ssp)
> * [Support](#support)
> * [Transcribers](#transcribers)

## Delays

> ### [DelayUnit]
> ### [SmartDelayUnit]


## Displays
> ### [FutureBitMap]
> ### [BitMap]
> ### [SimpleBitMap]
> ### [SevenSegment]
> ### [CharacterDisplay]
> ### [VideoDisplay]

## Memory
> ### [Bit](#bit-1)
> ### [OldBit]
> ### [Bits]
> ### [Nibble]
> ### [Byte]
> ### [SmallBit]
> ### [MemoryGridBloc]
> ### [MemoryRow]
> ### [AddressableMemoryRow]
> ### [MemoryGrid]
> ### [MemorySelector]
> ### [MemoryRowReader]
> ### [ROM]
> ### [ROMPackage]
> ### [CardROM]
> ### [CardRomPackage]
> ### [***D**ouble **D**ensity* CardRomPackage]

* #### **Bit**
  * Syntax
    ```typescript
      class Bit({
        key: Key,
        pos?: Pos,
        rotate?: Rotate,
        color?: Color,
        placeValue?: number,
        connections?: MultiConnections
      }) extends Container
    ```
    * `key: Key`
      * Used to generate an `Id` for this Logic `Block`
    * `pos: Pos`
      * Optional parameter
      * Specifies the position of the `Unit`
      * Default value: `new Pos({})`
    * `rotate: Rotate`
      * Optional parameter
      * Specifies the rotation and orientation of the `Block`
      * Default value: `new Rotate({})`
    * `color: Color`
      * Optional parameter
      * Specifies what color the `Unit` should be
      * Default value: `new Color()`
    * `placeValue: number`
      * Optional Parameter
      * Specifies where this bit belongs in the space of a larger object (such as a `Bits` or `Byte`)
      * Default value: `1`
    * `connections: MultiConnections`
      * Optional parameter
      * Specifies where each Logic Block within the `Bit` sends its signal to
      * Default value: `new MultiConnections({})`
  * Description
    * A construct able to hold 1 bit of information (1/0)
  * Methods
    * `compress(): void`
      * Moves all children within this `Container` to the origin of the `Container`
    * `get color(): Color`
      * Store what color all `Unit`s in the the `Container` should be
    * `set color(color: Color)`
      * Set what color all `Unit`s in the the `Container` should be
    * `build(Offset: offset): string`
      * Returns a Scrap Mechanic compatible JSON string that represents the `Container`
    * `get setId(): Id`
      * Returns the `Id` of the logic block that can be pulsed to turn the bit *on*
    * `get resetId(): Id`
      * Returns the `Id` of the logic block that can be pulsed to turn the bit *off*
    * `get readId(): Id`
      * Returns the `Id` of the third logic block (not involved in set/reset) 
    * `get read(): Logic`
      * Returns the Logic Block object of the logic block used to get the signal from the `Bit`
  * Properties
    * `children: Unit[]`
      * A list of all `Unit`s that this `Container` is holding on to
    * `compressed: boolean`
      * Whether or not the `compress` command has been run on this `Container`
    * `pos: Pos`
      * Stores the position of the `Unit`
    * `rotation: Rotate`
      * Stores the rotation and orientation of the `Unit`
    * `_io: Map<string,Key>`
      * Stores the `UniqueCustomKey`s used to identify individual `Bit`
    * `placeValue: number`
      * Stores where this bit belongs in the space of a larger object (such as a `Bits` or `Byte`)

## Numbers
> ### [Integer]
> ### [ConstantCompare]
> ### [Comparators]
> ### [EqualsConstant]

## SSP
> ### [SSP Receiver]

## Support
> ### [Axis]

## Transcribers
> ### [Custom2dShape]
> ### [Mural]


* #### **Template**
  * Syntax
    ```typescript

    ```
    * 
  * Description
  * Methods
  * Properties

