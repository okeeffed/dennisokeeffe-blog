---
title: Generating Types From JSON Schema With QuickType
description: Generate strongly-typed models and serializers from JSON, JSON Schema
date: "2020-09-20"
tags: json,yml,api,nodejs
---

Building on from previous posts on a spike on JSON Schema, we will continue in this one by looking at an alternative library to the `json-schema-to-typescript` library previously explored.



## Setting Up

```s
# From a yarn initialised project
yarn add quicktype-core
# setting up the files
touch index.js book.json
```

For `book.json`, add the following. It will follow a similar JSON schema we've used previously with the Book but a few changes, so be sure to copy-paste it across.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "author": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "preferredName": { "type": "string" },
        "age": { "type": "number" },
        "gender": { "enum": ["male", "female", "other"] }
      },
      "required": ["name", "preferredName", "age", "gender"]
    },
    "title": { "type": "string" },
    "publisher": { "type": "string" }
  },
  "required": ["author", "title", "publisher"]
}
```



## Writing out the script

`index.js` will look like the following:

```js
const {
  quicktype,
  InputData,
  JSONSchemaInput,
  JSONSchemaStore,
} = require("quicktype-core")
const path = require("path")
const fs = require("fs")

async function quicktypeJSONSchema(targetLanguage, typeName, jsonSchemaString) {
  const schemaInput = new JSONSchemaInput(new JSONSchemaStore())

  // We could add multiple schemas for multiple types,
  // but here we're just making one type from JSON schema.
  await schemaInput.addSource({ name: typeName, schema: jsonSchemaString })

  const inputData = new InputData()
  inputData.addInput(schemaInput)

  return await quicktype({
    inputData,
    lang: targetLanguage,
  })
}

async function main() {
  // read the schema details
  const schemaFilepath = path.join(__dirname, "bookWithoutUser.json")
  const bookSchema = fs.readFileSync(schemaFilepath, "utf-8")

  const { lines: tsPerson } = await quicktypeJSONSchema(
    "typescript",
    "Book",
    bookSchema
  )
  console.log(tsPerson.join("\n"))

  const { lines: pythonPerson } = await quicktypeJSONSchema(
    "python",
    "Book",
    bookSchema
  )
  console.log(pythonPerson.join("\n"))
}

main()
```

In the above script, we are going to generate `TypeScript` and `Python` output for the sake of demonstration.



## Running the generator

Run `node index.js` and you will get the following output for TypeScript and Python respectively:

```ts
// To parse this data:
//
//   import { Convert, Book } from "./file";
//
//   const book = Convert.toBook(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Book {
  author: Author
  publisher: string
  title: string
}

export interface Author {
  age: number
  gender: Gender
  name: string
  preferredName: string
}

export enum Gender {
  Female = "female",
  Male = "male",
  Other = "other",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toBook(json: string): Book {
    return cast(JSON.parse(json), r("Book"))
  }

  public static bookToJson(value: Book): string {
    return JSON.stringify(uncast(value, r("Book")), null, 2)
  }
}

function invalidValue(typ: any, val: any, key: any = ""): never {
  if (key) {
    throw Error(
      `Invalid value for key "${key}". Expected type ${JSON.stringify(
        typ
      )} but got ${JSON.stringify(val)}`
    )
  }
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`
  )
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {}
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }))
    typ.jsonToJS = map
  }
  return typ.jsonToJS
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {}
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }))
    typ.jsToJSON = map
  }
  return typ.jsToJSON
}

function transform(val: any, typ: any, getProps: any, key: any = ""): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val
    return invalidValue(typ, val, key)
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length
    for (let i = 0; i < l; i++) {
      const typ = typs[i]
      try {
        return transform(val, typ, getProps)
      } catch (_) {}
    }
    return invalidValue(typs, val)
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val
    return invalidValue(cases, val)
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue("array", val)
    return val.map(el => transform(el, typ, getProps))
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null
    }
    const d = new Date(val)
    if (isNaN(d.valueOf())) {
      return invalidValue("Date", val)
    }
    return d
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue("object", val)
    }
    const result: any = {}
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key]
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined
      result[prop.key] = transform(v, prop.typ, getProps, prop.key)
    })
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key)
      }
    })
    return result
  }

  if (typ === "any") return val
  if (typ === null) {
    if (val === null) return val
    return invalidValue(typ, val)
  }
  if (typ === false) return invalidValue(typ, val)
  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref]
  }
  if (Array.isArray(typ)) return transformEnum(typ, val)
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty("props")
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val)
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val)
  return transformPrimitive(typ, val)
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps)
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps)
}

function a(typ: any) {
  return { arrayItems: typ }
}

function u(...typs: any[]) {
  return { unionMembers: typs }
}

function o(props: any[], additional: any) {
  return { props, additional }
}

function m(additional: any) {
  return { props: [], additional }
}

function r(name: string) {
  return { ref: name }
}

const typeMap: any = {
  Book: o(
    [
      { json: "author", js: "author", typ: r("Author") },
      { json: "publisher", js: "publisher", typ: "" },
      { json: "title", js: "title", typ: "" },
    ],
    "any"
  ),
  Author: o(
    [
      { json: "age", js: "age", typ: 3.14 },
      { json: "gender", js: "gender", typ: r("Gender") },
      { json: "name", js: "name", typ: "" },
      { json: "preferredName", js: "preferredName", typ: "" },
    ],
    "any"
  ),
  Gender: ["female", "male", "other"],
}
```

The Python output:

```py
# To use this code, make sure you
#
#     import json
#
# and then, to convert JSON from a string, do
#
#     result = book_from_dict(json.loads(json_string))

from enum import Enum
from typing import Any, TypeVar, Type, cast


T = TypeVar("T")
EnumT = TypeVar("EnumT", bound=Enum)


def from_float(x: Any) -> float:
    assert isinstance(x, (float, int)) and not isinstance(x, bool)
    return float(x)


def from_str(x: Any) -> str:
    assert isinstance(x, str)
    return x


def to_float(x: Any) -> float:
    assert isinstance(x, float)
    return x


def to_enum(c: Type[EnumT], x: Any) -> EnumT:
    assert isinstance(x, c)
    return x.value


def to_class(c: Type[T], x: Any) -> dict:
    assert isinstance(x, c)
    return cast(Any, x).to_dict()


class Gender(Enum):
    FEMALE = "female"
    MALE = "male"
    OTHER = "other"


class Author:
    age: float
    gender: Gender
    name: str
    preferred_name: str

    def __init__(self, age: float, gender: Gender, name: str, preferred_name: str) -> None:
        self.age = age
        self.gender = gender
        self.name = name
        self.preferred_name = preferred_name

    @staticmethod
    def from_dict(obj: Any) -> 'Author':
        assert isinstance(obj, dict)
        age = from_float(obj.get("age"))
        gender = Gender(obj.get("gender"))
        name = from_str(obj.get("name"))
        preferred_name = from_str(obj.get("preferredName"))
        return Author(age, gender, name, preferred_name)

    def to_dict(self) -> dict:
        result: dict = {}
        result["age"] = to_float(self.age)
        result["gender"] = to_enum(Gender, self.gender)
        result["name"] = from_str(self.name)
        result["preferredName"] = from_str(self.preferred_name)
        return result


class Book:
    author: Author
    publisher: str
    title: str

    def __init__(self, author: Author, publisher: str, title: str) -> None:
        self.author = author
        self.publisher = publisher
        self.title = title

    @staticmethod
    def from_dict(obj: Any) -> 'Book':
        assert isinstance(obj, dict)
        author = Author.from_dict(obj.get("author"))
        publisher = from_str(obj.get("publisher"))
        title = from_str(obj.get("title"))
        return Book(author, publisher, title)

    def to_dict(self) -> dict:
        result: dict = {}
        result["author"] = to_class(Author, self.author)
        result["publisher"] = from_str(self.publisher)
        result["title"] = from_str(self.title)
        return result


def book_from_dict(s: Any) -> Book:
    return Book.from_dict(s)


def book_to_dict(x: Book) -> Any:
    return to_class(Book, x)
```

Hooray! We can cut a lot of fluff with these helpers.



## Resources And Further Reading

1. [QuickType](https://github.com/quicktype/quicktype)

_Image credit: [Alessio Rinella](https://unsplash.com/@rinhello)_