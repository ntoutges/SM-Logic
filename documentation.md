# SM Logic Builder Documentation
A living guide containing the syntax and purpose of each component

> # Support Classes

## Colors
* **Color**
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

* **HexColor**
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

* **RGBColor**
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
* **Operation**
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

* **Connections**
  * ```typescript
    class Connections(connections?: Id | Id[])
    ```
    * `connections`
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
* **MultiConnections**
  * ```typescript
    class MultiConnections(
      connections: MultiConnectionsType | MultiConnectionsType[]
    )
    ```
    * `MultiConnectionsType`:
      ```json
        {
          "conn": Connections | MultiConnections,
          "id": Identifier
        }
      ```
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

* **BitMask**
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

* **RawBitMask**
  * ```typescript
    class RawBitMask(mask: number, length?: number) extends BitMask
    ```
    * `length`
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

* **VBitMask**
  * ```typescript
    class VBitMask(mask: string, offCharacter: string) extends BitMask
    ```
    * `offCharacter`
      * Optional Parameter
      * The characters in `mask` to be treated as `false` values
      * Default value: `" "` (space)
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

* **Delay**
  * Syntax:
    ```typescript
    class Delay({
      delay: number,
      unit?: Time
    })
    ```
    * `unit`
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

* **NoDelay**
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

* **Delays**
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

* **ScaleableDelays**
  * Syntax:
    ```typescript
    class ScaleableDelays({
      delay?: Delay,
      amount?: number
    }) extends Delays
    ```
    * `delay`
      * Optional Parameter
      * The base abount of delay this class will store
      * Default value: `new Delay({ delay: 0, unit: Time.Tick })`
    * `amount`
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

* **Pos**
  * Syntax:
    ```typescript
    class Pos({
      x?: number,
      y?: number,
      z?: number
    })
    ```
    * `x`
      * Optional parameter
      * Indicates the *x* position of a block
      * Default value: `0`
    * `y`
      * Optional parameter
      * Indicates the *y* position of a block
      * Default value: `0`
    * `z`
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

* **Pos2d**
  * Syntax:
    ```typescript
    class Pos2d({
      x?: number,
      y?: number
    }) extends Pos
    ```
    * `x`
      * Optional parameter
      * Indicates the *x* position of a block
      * Default value: `0`
    * `y`
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

* **RelativePos**
  * Syntax:
    ```typescript
    class Pos2d({
      x?: number,
      y?: number,
      z?: number,
      pos: Pos
    }) extends Pos
    ```
    * `x`
      * Optional parameter
      * Indicates the *x* position of a block
      * Default value: `0`
    * `y`
      * Optional parameter
      * Indicates the *y* position of a block
      * Default value: `0`
    * `z`
      * Optional parameter
      * Indicates the *z* position of a block
      * Default value: `0`
  * Description:
    Stores the position of an object in **3d** space, relative to another `Pos`
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

* **Bounds**
  * Syntax:
    ```typescript
      class Bounds({
        x?: number,
        y?: number,
        z?: number
      }) extends Pos
    ```
    * `x`
      * Optional parameter
      * Indicates the *x* (width) bound of a block
      * Default value: `1`
    * `y`
      * Optional parameter
      * Indicates the *y* (depth) bound of a block
      * Default value: `1`
    * `z`
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

* **Bounds2d**
  * Syntax:
    ```typescript
    class Bounds2d({
      x?: number,
      y?: number
    }) extends Bounds
    ```
    * `x`
      * Optional parameter
      * Indicates the *x* (width) bound of a block
      * Default value: `1`
    * `y`
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

* **Rotate**
  * Syntax:
    ```typescript
    class Rotate({
      direction?: Direction,
      orientation?: Orientation
    })
    ```
    * `direction`
      * The direction which the `Rotate` is pointing towards
    * `orientation`
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

* **Offset**
  * Syntax:
    ```typescript
    class Offset({
      pos?: Pos,
      rotate?: Rotate
    })
    ```
    * `Pos`
      * Optional parameter
      * A position value to offset an object by
      * Default value: `new Pos({})`
    * `Rotate`
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

