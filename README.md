# Parakeet Mapper

[![npm](https://img.shields.io/npm/v/parakeet-mapper.svg?style=flat-square)](https://www.npmjs.com/package/parakeet-mapper) 
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/minzip/parakeet-mapper.svg?style=flat-square)]() [![dependencies (minified)](https://img.shields.io/badge/dependencies-none-yellow.svg?style=flat-square)]()

> Simple data converter

<br/>

```bash
npm install --save parakeet-mapper
```
For more options see [installation](#installation)

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Simple example](#simple-example)
- [API](#api)

---

## Features

The main feature is a possibility to specify a set of rules to convert one structure to another.

Additional features:

* It just works

---

## Installation

### Install as dependency

```bash
npm install --save parakeet-mapper
# or
yarn add parakeet-mapper
```

### Import and use

There is only one method `mapTypes` and you can use it!

**ES**

```js
import { mapTypes } from 'parakeet-mapper'
```

**CommonJS**

```js
const { mapTypes } = require('parakeet-mapper');
```

**Script tag**

```html
<script src="https://unpkg.com/parakeet-mapper"></script>

...

<script>
  // global variable parakeetMapper

  const { mapTypes } = parakeetMapper;
</script>
```

---

## Simple example

### Let's say you got some object from API:

```js
const podguznikFromServer = {
  title: 'Podguznik',
  productId: 54213,
  url: '/podguznik-54213',
  image: 'tygjhjkqw89786dtsugyh',
  compressedImage: 'bjghftryutyiguhkjhgjh',
  isFavorite: true,
  rating: 4.5,
  ordersQuantity: 83,
  fullPrice: 1500,
  sellPrice: 1300
};
```

and you want to make it suitable for your needs. It is very simple, just describe some rules and you are ready to go! (NO WAY!)

```js
let result = mapTypes(podguznikFromServer, {
  title: true,
  url: true,
  isFavorite: true,
  fullPrice: true,
  purchasePrice: 'sellPrice',
  id: 'productId',
  images: v => [v.image],
  ratingInfo: v => ({
    ordersQuantity: v.ordersQuantity,
    rating: String(v.rating)
  })
});
```

### Resulted object will be:

```js 
{
  fullPrice: 1500,
  id: 54213,
  images: ["tygjhjkqw89786dtsugyh"],
  isFavorite: true,
  purchasePrice: 1300,
  ratingInfo: [object Object] {
    ordersQuantity: 83,
    rating: "4.5"
  },
  title: "Podguznik",
  url: "/podguznik-54213"
}
```

### Now let's take apart this example.

Set of rules are represented as an object, where keys - are resulted keys, and values - well, the RULES themselves.

Rules can be one of the following types: `boolean`, `string`, `function`.

`boolean` rule tells the mapper to just forward this field to the resulted object. Can be only `true`, because `false` is equals to not specifying this field at all and it will be skipped.

`string` rule tells the mapper to use different name for this field. Would be very handy if you just need to rename some fields in object.

And last, but not least - `function` rule. The most advanced and technologically progressive rule of all time (it's realy not). It does only one thing - returns a field value.

## API

### mapTypes params

argument     | type          | description
-------------|---------------|--------------
input        | Object        | Input object to modify
FieldMap     | Object        | Set of rules for a mapper

### function rule params

argument     | type          | description
-------------|---------------|--------------
inputObject  | Object        | Input object

## Factory mode

> **new** in v1.1.0

It's also possible to create mappers using `mapFactory`:
```ts
import { mapFactory } from 'parakeet-mapper';

const productMapper = mapFactory({
  title: true,
  url: true,
  isFavorite: true,
  fullPrice: true,
  purchasePrice: 'sellPrice',
  id: 'productId',
  images: v => [v.image],
  ratingInfo: v => ({
    ordersQuantity: v.ordersQuantity,
    rating: String(v.rating)
  })
});
```

```ts
const result = productMapper(podguznikFromServer);

// results in:
{
  fullPrice: 1500,
  id: 54213,
  images: ["tygjhjkqw89786dtsugyh"],
  isFavorite: true,
  purchasePrice: 1300,
  ratingInfo: [object Object] {
    ordersQuantity: 83,
    rating: "4.5"
  },
  title: "Podguznik",
  url: "/podguznik-54213"
}
```
