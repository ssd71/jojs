**[jojs](../README.md)**

[Globals](../globals.md) › ["AniDB"](../modules/_anidb_.md) › [AniDB](_anidb_.anidb.md)

# Class: AniDB

A class for interacting with the UDP API of AniDB

## Hierarchy

* **AniDB**

## Index

### Constructors

* [constructor](_anidb_.anidb.md#constructor)

### Properties

* [jobber](_anidb_.anidb.md#jobber)
* [jobs](_anidb_.anidb.md#jobs)
* [opt](_anidb_.anidb.md#opt)
* [reqSock](_anidb_.anidb.md#reqsock)
* [sid](_anidb_.anidb.md#sid)
* [up](_anidb_.anidb.md#up)

### Methods

* [getAnime](_anidb_.anidb.md#getanime)
* [logout](_anidb_.anidb.md#logout)
* [makeReq](_anidb_.anidb.md#makereq)

## Constructors

###  constructor

\+ **new AniDB**(`auth`: [Auth](../interfaces/_anidb_.auth.md), `opt?`: [connOpts](../interfaces/_anidb_.connopts.md)): *[AniDB](_anidb_.anidb.md)*

*Defined in [AniDB.ts:74](https://github.com/ssd71/jojs/blob/68be524/src/AniDB.ts#L74)*

Create a new AniDB Object and auth to the API

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`auth` | [Auth](../interfaces/_anidb_.auth.md) | Auth object containing AniDB credentials: ``` //-- All fields are required -- username: String; password: String; protover: number; // Specify version of API to use client: String; // Specify name of your client as registered on AniDB clientver: String; // Specify version of client ``` |
`opt?` | [connOpts](../interfaces/_anidb_.connopts.md) | Optional connections parameters: ``` url: String; // API Endpoint, defaults to api.anidb.net port: number; // AniDB API port, defaults to 9000 ``` Example ``` const instance = new AniDB({  username: 'kazumadesu',  password: 'meguminbestgirl',  protover: 3  client: 'perfectlyreasonableclientname',  clientver: 1, }); ```  |

**Returns:** *[AniDB](_anidb_.anidb.md)*

## Properties

###  jobber

• **jobber**: *ScheduledTask*

*Defined in [AniDB.ts:70](https://github.com/ssd71/jojs/blob/68be524/src/AniDB.ts#L70)*

A `node-cron` task that executes requests from `jobs` periodically

___

###  jobs

• **jobs**: *Array‹object›* =  []

*Defined in [AniDB.ts:62](https://github.com/ssd71/jojs/blob/68be524/src/AniDB.ts#L62)*

Queue of pending requests

Example job:
```
const job = { req: 'PING', callback: (data) => console.log(data) }
```

___

###  opt

• **opt**: *[connOpts](../interfaces/_anidb_.connopts.md)*

*Defined in [AniDB.ts:74](https://github.com/ssd71/jojs/blob/68be524/src/AniDB.ts#L74)*

Optional connection parameters; see constructor

___

###  reqSock

• **reqSock**: *Socket*

*Defined in [AniDB.ts:66](https://github.com/ssd71/jojs/blob/68be524/src/AniDB.ts#L66)*

The socket used to make requests and receive data from AniDB

___

###  sid

• **sid**: *string* = ""

*Defined in [AniDB.ts:49](https://github.com/ssd71/jojs/blob/68be524/src/AniDB.ts#L49)*

AniDB session id retrieved from server on login

___

###  up

• **up**: *Promise‹boolean›*

*Defined in [AniDB.ts:53](https://github.com/ssd71/jojs/blob/68be524/src/AniDB.ts#L53)*

Promise that resolves to `true` on successful login

## Methods

###  getAnime

▸ **getAnime**(`aid`: number): *Promise‹[Anime](_anime_.anime.md)›*

*Defined in [AniDB.ts:178](https://github.com/ssd71/jojs/blob/68be524/src/AniDB.ts#L178)*

Gets an anime from AniDB

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`aid` | number | AniDB Anime ID of the anime to get |

**Returns:** *Promise‹[Anime](_anime_.anime.md)›*

The retrieved anime object

___

###  logout

▸ **logout**(): *Promise‹any›*

*Defined in [AniDB.ts:199](https://github.com/ssd71/jojs/blob/68be524/src/AniDB.ts#L199)*

Logs out the current session

**Returns:** *Promise‹any›*

Promise object fulfilled on logout

___

###  makeReq

▸ **makeReq**(`req`: string, `callback`: Function): *void*

*Defined in [AniDB.ts:159](https://github.com/ssd71/jojs/blob/68be524/src/AniDB.ts#L159)*

Function to make requests to the AniDB API

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`req` | string | The request to make |
`callback` | Function | Callback function, called with response as arg  |

**Returns:** *void*