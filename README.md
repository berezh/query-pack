# qzip

<a href="https://www.npmjs.com/package/qzip">
    <img src="https://nodei.co/npm/qzip.png?mini=true">
</a>

---

## Zips-Unzips Query Parameter

- [Usage](#usage)
- [Options](#options)
- [Philosophy](#philosophy)
- [Base](#base)
- [Primitive Strategies](#primitive-strategies)
- [Complex Strategies](#complex-strategies)

## Usage

Intallation:

```js
npm install qzip
```

### String example

Zips string value:

```ts
import  { zip } from 'qzip';
...
const qParam = zip('Hey, how are you?')
const url = `https://mydomain.com?q=${qParam}`;
console.log(url);
// =>  https://mydomain.com?q=UheyCWhowWareWyouQ
```

Unzips string value:

```ts
import  { unzip } from 'qzip';
...
let params = (new URL(document.location)).searchParams;
let qParam = params.get("q");
const value = unzip(qParam);
console.log(value);
// =>  Hey, how are you?
```

### Object example

Zips object value:

```ts
import  { zip } from 'qzip';
...
const qParam = zip({
  id: 1,
  name: "Team 1",
  captain: "zak",
})
const url = `https://mydomain.com?q=${qParam}`;
console.log(url);
// =>  https://mydomain.com?q=1XidN1YnameSUteamW1YcaptainSzak
```

Unzips object value:

```ts
import  { unzip } from 'qzip';
...
let params = (new URL(document.location)).searchParams;
let qParam = params.get("q");
const value = unzip(qParam);
console.log(value);
// =>  {
//   id: 1,
//   name: "Team 1",
//   captain: "zak",
// }
```

## Options

Options is a zipping settigns passed as a second parameter to the `zip` or `unzip` functions. Has `ZipOptions` type.

| Name                     | Description                                                                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fields                   | Replaces the names of the object's fields into numbers in order to make zipped result shorter. [Example of using fields optimization](#fields-optimization)                  |
| values                   | Replaces the values of the object's field into numbers or short strings in order to make zipped result shorter. [Example of using values optimization](#values-optimization) |
| includeUndefinedProperty | Indicates if property of object with `undefined` value must be included into zipped result. Default value is `false`                                            |

### Fields Optimization

Here we have a team object. Its field's names are replaced with numbers (`id`=> 1, ...). Since numbers are shorter and as result we will have shorter zipped result. 

```ts
import  { zip, unzip, ZipOptions } from 'qzip';
...
const zipOptions: ZipOptions = {
    fields:{
        id: 1,
        name: 2,
        capitan: 3
    }
}
...
const qParam = zip({
    id: 1,
    name: "Team 1",
    captain: "zak",
}, options);

console.log(qParam);
// =>  1X1N1Y2SUteamW1YcaptainSzak

const team = unzip(qParam, options);
console.log(team);
// =>  {
//   id: 1,
//   name: "Team 1",
//   captain: "zak",
// }

```

### Values Optimization

Here we have a player object with `level` field. Possible values for it are strings: `unknown`, `notbad`, `normal`, `good`, `star`. We replacing them with numbers. In our case the player object has `good` level value. So while zipping it would receive value of `4`. This makes zipped result shorter.

```ts
import  { zip, unzip, ZipOptions } from 'qzip';
...
const zipOptions: ZipOptions = {
    values:{
        level: {
            unknown: 1,
            notbad: 2,
            normal: 3,
            good: 4,
            star: 5,
        },
    }
}
...
const qParam = zip({
    name: "zak",
    level: "good",
}, options);

console.log(qParam);
// =>  1XnameSzakYlevelS4

const team = unzip(qParam, options);
console.log(team);
// =>  {
//   name: "zak",
//   level: "good",
// }

```

## Philosophy

The maximum length of URL is 2048 characters. This is enough space for encoding data for small or medium page.
What's more, in this case you don't need to have database or API.

There is and example of using `qzip`. This is the tournament team constructor witch generates the tournament data into URL's query parameter. That's it, no API or database the tournament data is stored into the URL. [This link](https://varp.com/p/?d=1X5ScY1SEY2S19K30Y3S90Y4S2YuseUcolorB0Y7B0Y8AYaAY9AYbAXOOOOXN4N3N2N1XAXAAAAAAX1N1Y2SviktorY3SviktorY4AX1N2Y2SodysseyY3SodysseyY4AX1N3Y2SolegWoldY3SolegWoldY4AX1N4Y2SdavidY3SdavidY4AXSdavidSyaraXN4N1N1N2XN3N2N3N2XN4N2N3N0XN1N3N3N1XN4N3N3N5XN2N1N2N4XOOOOOOXOOOOOOXOOOOOOXOOOOOOX1SviktorX1SandreiX1SiliaX1SalanX1SandreiWianX1SalexisX1SodysseyX1SrezoX1SmaxWhX1SalexX1SalexanderWdX1SmikaX1SolegWoldX1SnikolayX1SsergioX1SsergX1SigorX1SantonWtX1SdavidX1SantonX1SiskanderX1SyaraX1SmikhailX1SantonWa) has 512 chars and this is enough for encoding information about 4 teams and 24 players, games between teams, scheduel and results.

## Base

`qzip` zips `string`, `number`, `boolean`, `array`, `object` values into a string for using it in URL's query paramter.

This is kind of alternative of using `encodeURIComponent` and `decodeURIComponent`, but with differences. The primitive types like `string`, `number`, and `boolean` `qzip` makes shorter in coparances to `encodeURIComponent` function with the [Primitive Strategies](#primitive-strategies). Also, the `qzip` can encode complex types like `object` or `array` with the [Complex Strategies](#complex-strategies) where the `encodeURIComponent` does not support compolex types.

## Primitive Strategies

### Upper Case

In URL encoding there are not replacing chars: numbers, upper and lower case English letters, `-`, `_`, `.`, `~`. All other has encodes with extra chars, for instance `@` encodes as `%40`. `zqip` replace upper case chars on the text with `U` + `upper case char` or `U{X}` + `X upper case chars`.

| Text  | Zipped   |
| ----- | -------- |
| Hello | `U`hello |
| HTML  | `U5`html |

This helps to release all other upper case English letters for further encoding strategies.

### String

Most used chars are replaced with upper case chars.

| Char    | URL Encoding | qzip |
| ------- | ------------ | ---- |
| `space` | %20          | W    |
| '       | %27          | H    |
| (       | %28          | G    |
| )       | %29          | R    |
| ;       | %3B          | T    |
| :       | %3A          | K    |
| @       | %40          | M    |
| =       | %3D          | J    |
| +       | %2B          | P    |
| ,       | %2C          | C    |
| ?       | %3F          | Q    |
| "       | %22          | H    |

|        | String            | URL Encoding                | qzip               |
| ------ | ----------------- | --------------------------- | ------------------ |
| Text   | Hey, how are you? | Hey%2C%20how%20are%20you%3F | UheyCWhowWareWyouQ |
| Length | 17                | 27                          | 18                 |

### Number

Decimal numbers replaces with based32 numbers.

|        | Number     | qzip    |
| ------ | ---------- | ------- |
| Value  | 123456.789 | 3oi0.ol |
| Length | 10         | 7       |

### Boolean

Replaces with `0` and `1`.

| Boolean | qzip |
| ------- | ---- |
| `false` | 0    |
| `true`  | 1    |

## Complex Strategies

Complex strategy provides the way of converting into a string the object with properties or array of items. To list values need to split them somehow and indicate their type. The below table contains type indicators:

| Type        | `qzip` type indicator |
| ----------- | --------------------- |
| `string`    | S                     |
| `number`    | N                     |
| `boolean`   | B                     |
| `object`    | O                     |
| `array`     | A                     |
| `null`      | L                     |
| `undefined` | F                     |

Next table contains splitters:

| `qzip` splitter | Description |
| --------------- | ----------- |
| `Y`             | Property    |
| `X`             | Object      |

### Array

| Type                    | Array                   | `zqip`         |
| ----------------------- | ----------------------- | -------------- |
| Number                  | [12, 34, 56]            | NcN12N1o       |
| String                  | ["cat", "dog", "mouse"] | ScatSdogSmouse |
| Number, String, Boolean | [12, "dog", true]       | NcSdogB1       |

### Object

Let's imaging we have the team object:

```js
{
  id: 1,
  name: "Team 1",
  captain: "zak",
}
```

After zipping into a string:

```text
idN1YnameSUteamW1YcaptainSzak
```
