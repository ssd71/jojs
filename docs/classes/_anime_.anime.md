**[jojs](../README.md)**

[Globals](../globals.md) › ["Anime"](../modules/_anime_.md) › [Anime](_anime_.anime.md)

# Class: Anime

Used to process and store Anime objects

## Hierarchy

* **Anime**

## Index

### Constructors

* [constructor](_anime_.anime.md#constructor)

### Properties

* [animeRaw](_anime_.anime.md#animeraw)
* [props](_anime_.anime.md#props)

### Methods

* [get](_anime_.anime.md#get)

## Constructors

###  constructor

\+ **new Anime**(`animeRaw`: Array‹string›): *[Anime](_anime_.anime.md)*

*Defined in [Anime.ts:7](https://github.com/ssd71/jojs/blob/19c480d/src/Anime.ts#L7)*

Instantiates an Anime Object using an array of attributes

**Parameters:**

Name | Type |
------ | ------ |
`animeRaw` | Array‹string› |

**Returns:** *[Anime](_anime_.anime.md)*

## Properties

###  animeRaw

• **animeRaw**: *Array‹string›*

*Defined in [Anime.ts:12](https://github.com/ssd71/jojs/blob/19c480d/src/Anime.ts#L12)*

___

###  props

• **props**: *object*

*Defined in [Anime.ts:5](https://github.com/ssd71/jojs/blob/19c480d/src/Anime.ts#L5)*

#### Type declaration:

* \[ **key**: *string*\]: any

## Methods

###  get

▸ **get**(`key`: string): *string | number*

*Defined in [Anime.ts:47](https://github.com/ssd71/jojs/blob/19c480d/src/Anime.ts#L47)*

A getter for all the props for tidying purposes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | The property to get |

**Returns:** *string | number*

The property itself