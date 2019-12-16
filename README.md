# Parakeet Mapper

[![npm](https://img.shields.io/npm/v/parakeet-mapper.svg?style=flat-square)](https://www.npmjs.com/package/parakeet-mapper) 
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/minzip/parakeet-mapper.svg?style=flat-square)]() [![dependencies (minified)](https://img.shields.io/badge/dependencies-none-yellow.svg?style=flat-square)]()

> Simple data conversion library

<br/>

```bash
npm install --save parakeet-mapper
```
For more options see [installation](#installation)

- [Parakeet Mapper](#parakeet-mapper)
  - [What is this?](#what-is-this)
  - [Installation](#installation)
    - [Install as dependency](#install-as-dependency)
    - [Import and use](#import-and-use)
  - [API](#api)
    - [TypeMap](#typemap)
      - [Examples](#examples)
      - [object/array shorthand with the same key](#objectarray-shorthand-with-the-same-key)
    - [mapFactory](#mapfactory)
      - [Overloads](#overloads)
    - [mapTypes](#maptypes)
      - [Overloads](#overloads-1)
    - [Wait](#wait)
    - [flattenPromises](#flattenpromises)
    - [Convertable](#convertable)
    - [Convertable class](#convertable-class)
      - [constructor](#constructor)
      - [toInput](#toinput)
      - [Convertable.createConverter](#convertablecreateconverter)
      - [Convertable.reverseConverter](#convertablereverseconverter)

---

## What is this?

It's a small collection of utility functions and types that help with mapping (transforming) data.

You can find it useful if:
- You work with **complex data objects** and tired of it
- You need to **quickly** and **efficiently transform objects** or tuples regularly
- Your **data models need additional functionality**
- You need a **type-safe** way of **initializing a class from an object**
- You need to **convert data types back and forth** multiple times
- You don't like your backend's API and `GraphQL` is not an option 😁

---

## Installation

### Install as dependency

```bash
npm install --save parakeet-mapper
# or
yarn add parakeet-mapper
```

### Import and use

**ES**

```js
import { mapTypes, mapFactory } from 'parakeet-mapper'
```

**CommonJS**

```js
const { mapTypes, mapFactory } = require('parakeet-mapper');
```

**Script tag**

```html
<script src="https://unpkg.com/parakeet-mapper"></script>

...

<script>
  // global variable parakeetMapper

  const { mapTypes, mapFactory } = parakeetMapper;
</script>
```

## API

`parakeet-mapper` exposes several helpers to deal with type conversions.\
All of them use the [**TypeMap**](#TypeMap) interface to communicate.

name | overloads | description
-----|-----------|-----------------------------------
[mapFactory](#mapFactory) |  3  | Accepts a [**TypeMap**](#TypeMap). Returns a function that accepts one input and returns an output converted using rules defined in the [**TypeMap**](#TypeMap).
[mapTypes](#mapTypes) | 3 | Same as [mapFactory](#mapFactory), but instead of returning a function, accepts input as its first argument and returns an output right away.
[Convertable](#Convertable) | 2 | Class mixin. Allows creation of convertable classes.

### TypeMap
> `object`

It is a set of rules that define how the output type is made from the input type.\

The rules are simple:\
- Each key corresponds to a key in the output.
- Each value tells what to assign to that key from the input.
  - `true` = the value is assigned from the same key in the input.
  - A string = the value is assigned from this string key in the input.
  - An object = the value is assigned from this object's first key in the input **and** is processed using the value as converter.
  - An array of a single element = the first element in the array is used as converter for the input value by the output key.
  - A function = the value is mapped using this function from the input.

#### Examples

```ts
const input = {
  transferred: 'foo',
  renamed: 'bar',
  converted: '42',
  mapped: [1, 1, 2],
  omitted: 'won\'t transfer to output'
};

const TypeMap = {
  // Transferred straight to the output
  transferred: true,

  // Renamed from `renamed` into `outputRenamed`
  outputRenamed: 'renamed',

  // Renamed from `converted` into `convertedNumber`
  // and converted from string to number
  convertedNumber: { converted: Number },

  // Mapped using a function and also renamed.
  mappedSum: input => input.mapped.reduce((a, b) => a + b),

  // Output object is also accessible in the function
  // This allows to re-use operations for already converted values
  // (like mappedSum, in this example)
  mappedPlusConverted: (input, output) => output.mappedSum + Number(input.converted)
};

/* output */ {
  transferred: 'foo',
  outputRenamed: 'bar',
  convertedNumber: 42, // Number('42')
  mappedSum: 4,
  mappedPlusConverted: 46 // 4 + 42
  // notice the absence of `ommited` property
}
```

#### object/array shorthand with the same key
> **new** in `v2.1.2`

It's not necessary to specify the correct key in the conversion object:
```ts
const input = {
  number: '42',
};

const TypeMap = {
  // Simply converts from string to number using the `Number` function
  number: { Number },
};

/* output */ {
  number: 42, // Number('42')
  // Notice that the property name stayed the same,
  // even though we used a `{ Number: Number }` shorthand.
}
```

It only works if the input has the same property key as the output.

Can also be written using the array (tuple) syntax:
```ts
const input = {
  number: '42',
};

const TypeMap = {
  // Simply converts from string to number using the `Number` function
  number: [Number],
};

/* output */ {
  number: 42, // Number('42')
  // Notice that the property name stayed the same,
  // even though we used a `{ Number: Number }` shorthand.
}
```

### mapFactory
> `function`

A factory function that produces a [**converter**](#converter) from a [TypeMap](#TypeMap):

```ts
import { mapFactory } from 'parakeet-mapper';

const inputToOutput = mapFactory(TypeMap);

const output = inputToOutput(input); /* {
  transferred: 'foo',
  outputRenamed: 'bar',
  convertedNumber: 42, // Number('42')
  mappedSum: 4,
  mappedPlusConverted: 46 // 4 + 42
  // notice the absence of `ommited` property
} */
```

#### Overloads

This function has 3 overloads, all of which are needed for type safety and type inference (TypeScript).

There are basically 3 typed use-cases of using this function (hence 3 overloads):
1. Input and output types are known, and TypeMap needs to convert them precisely.
   ```ts
   declare const input: InputType;
   const inputConverter = mapFactory<InputType, OutputType>(TypeMap);
   // output is OutputType now
   ```
2. Input type is known, output needs to be inferred from the TypeMap.\
   The first call without arguments is a noop. Reasons: [first](https://github.com/microsoft/TypeScript/issues/20122), [second](https://github.com/microsoft/TypeScript/issues/14400#issuecomment-507638537).
   ```ts
   declare const input: InputType; // The empty braces are here due to TS issues.
   const inputConverter = mapFactory<InputType>()(TypeMap);
   ```
3. Input and output types are known, but the output type needs to be modified slightly.\
   The first call without arguments is a noop. Reasons: [first](https://github.com/microsoft/TypeScript/issues/20122), [second](https://github.com/microsoft/TypeScript/issues/14400#issuecomment-507638537).
   ```ts
   declare const input: InputType; // The empty braces are here due to TS issues.
   const inputConverter = mapFactory<InputType, OutputType>()(TypeMap);
   ```

### mapTypes
> `function`

Basically, a [mapFactory](#mapFactory), called in-place.

First Argument   | Second Argument
-----------------|-------------------------------
The input object | Corresponding [TypeMap](#TypeMap)

```ts
import { mapTypes } from 'parakeet-mapper';

const output = mapTypes(input, TypeMap); /* {
  transferred: 'foo',
  outputRenamed: 'bar',
  convertedNumber: 42, // Number('42')
  mappedSum: 4,
  mappedPlusConverted: 46 // 4 + 42
  // notice the absence of `ommited` property
} */

// Same as
// const output = mapFactory(TypeMap)(input);
```

#### Overloads

There are 3. All are semantically the same as the overloads of [mapFactory](#Overloads), including the noop call:

```ts
/* 1 */ mapTypes<InputType, OutputType>(input, TypeMap);
/* 2 */ mapTypes<InputType>()(input, TypeMap);
/* 3 */ mapTypes<InputType, OutputType>()(input, TypeMap);
```

### Wait
> `function`\
> **new** in `v2.1`

A complementary function to `mapFactory` that helps to flatten out promises

It produces a converter that *returns a flat promise* from a converter that returns an object *with promises*.

In a typical situation, when some convertations are asyncronous, you'd end up with this:
```ts
import { mapTypes } from 'parakeet-mapper';

// Imagine that this is requesting something from an API and returns a promise
const requestFromApi = (value) => Promise.resolve(value);

const input = {
  a: ['a'],
  b: 42,
  c: 'c'
};

const getAandBfromAPI = mapFactory({
  b: true,
  a: { a: requestFromApi },
  c: { c: requestFromApi }
});

const output = getAandBfromAPI(input);
// Result:
/* {
  a: Promise<['a']>,
  b: 42,
  c: Promise<'b'>
} */
// Not very comfortable to await every single value after this
```

Now with `wait`:
```ts
import { wait } from 'parakeet-mapper';

const waitForAandB = wait(getAandBfromAPI);


const output = getAandBfromAPI(input);
// Result:
/* Promise<{
  a: ['a'],
  b: 42,
  c: 'b'
}> */
// Much more useful now
```

### flattenPromises
> `function`\
> **new** in `v2.1`

Internally used in [`wait`](#wait), flattens top-level promises in an object:
```ts
import { flattenPromises } from 'parakeet-mapper';

const objWithPromises = {
  a: [Promise.resolve('a')],
  b: 42,
  c: Promise.resolve('b')
};

const flat = flattenPromises(objWithPromises);
// Result
/* Promise<{
  a: ['a'],
  b: 42,
  c: 'b'
}> */
```

### Convertable
> `function`\
> **new** in `v2.0`

Allows to create classes from converters.\
This makes possible adding extra functionality, including reverse convertations.

```ts
import { Convertable, mapFactory } from 'parakeet-mapper';

const inputConverter = () => mapFactory(mapTypes);

class Output extends Convertable(inputConverter) {}

const output = new Output(input);

console.log(output); /*
> Output {
    transferred: 'foo',
    outputRenamed: 'bar',
    convertedNumber: 42,
    mappedSum: 4,
    mappedPlusConverted: 46
  }
*/
```

Accepts a function that returns a converter as its only argument.\
Returns a [Convertable class](#Convertable-class) with all the required functionality.

Can also infer arguments from its converter factory:

```ts
import { Convertable, mapFactory } from 'parakeet-mapper';

const input: InputType = {
  foo: 'foo',
  bar: 'bar'
}

const inputConverter = (convertFoo?: boolean) => mapFactory<InputType>()({
  zoo: convertFoo,
  zar: convertFoo ? 'bar' : 'foo'
});

class Output extends Convertable(inputConverter) {}

const outputWithFoo = new Output(input, /* convertFoo? */ true);
console.log(outputWithFoo); /*
> Output {
    zoo: 'foo',
    zar: 'bar'
  }
*/

const outputWithoutFoo = new Output(input, /* convertFoo? */ false);
console.log(outputWithoutFoo); /*
> Output {
    zar: 'foo'
  }
*/
```

And accept a reverse converter:

```ts
import { Convertable, mapFactory } from 'parakeet-mapper';

const input: InputType = {
  foo: 'foo',
  bar: 'bar'
}

const inputConverter = (convertFoo?: boolean) => mapFactory<InputType>()({
  zoo: convertFoo,
  zar: convertFoo ? 'bar' : 'foo'
});

const outputConverter = (convertZoo?: boolean) => mapFactory<OutputType>()({
  foo: convertZoo,
  bar: convertZoo ? 'zar' : 'zoo'
});

class Output extends Convertable(inputConverter, outputConverter) {}

const output = new Output(input, /* convertFoo? */ true);
console.log(output); /*
> Output {
    zoo: 'foo',
    zar: 'bar'
  }
*/

// Convert back to input type
const newInput = output.toInput(/* convertZoo? */ true);
console.log(newInput); /*
> {
    foo: 'foo',
    bar: 'bar'
  }
*/
```

### Convertable class

#### `constructor`
Accepts an input as its first argument and converter factory parameters as other spread arguments.

#### `toInput`
Available only if reverse converter was passed into the [Convertable](#Convertable).

Accepts a spread of reverse converter arguments

#### `Convertable.createConverter`
> static

A converter factory, passed to the [Convertable](#Convertable).

#### `Convertable.reverseConverter`
> static

A reverse converter factory, passed to the [Convertable](#Convertable).
