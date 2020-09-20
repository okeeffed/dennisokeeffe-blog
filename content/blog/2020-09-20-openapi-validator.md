---
title: Validate Your APIs With OpenAPI Schema Validator
description: Validate Your APIs With OpenAPI Schema Validator, YML and JSON
date: "2020-09-20"
tags: json,yml,api,nodejs
---

In the previous post, I went on a small spike to explore generating TypeScript types from valid JSON schemas. Now, I want to look a little deeper at OpenAPI Schema validation.

This example will build a little more on top of the previous post, however it is not required reading.

## Getting Started

In a Yarn or NPM project directory, install the following:

```s
yarn add openapi-schema-validator
```

We are also going to add in a few of the pieces I wrote for the Book schema in the previous post, so create `book.json` and add the following:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "id": "#/components/schemas/Book",
  "definitions": {
    "user": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "preferredName": { "type": "string" },
        "age": { "type": "number" },
        "gender": { "enum": ["male", "female", "other"] }
      },
      "required": ["name", "preferredName", "age", "gender"]
    }
  },
  "type": "object",
  "properties": {
    "author": { "$ref": "#/components/schemas/User" },
    "title": { "type": "string" },
    "publisher": { "type": "string" }
  },
  "required": ["author", "title", "publisher"]
}
```

The above is actually a little different to what I had in the previous blog posts, so make sure you do copy it across.

We are going to import this in and using it for our values for a component.

## Creating the Open Specification

I am awaiting the release of the OpenAPI 3.1 spec as it is the culmination of a huge effort to align the latest JSON Schema draft and the OpenAPI specification, but for now we will run with 3.0.3.

OpenAPI can be written in YAML or JSON, so for now we will keep things as JSON.

Basically I just copied across the example they gave for using components and transformed it from YAML to JSON. Then I made some adjustments to check for a path `/books` where the GET request expects back an array of type Books.

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "Sample API",
    "description": "Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.",
    "version": "0.1.0"
  },
  "paths": {
    "/books": {
      "get": {
        "summary": "Get all books",
        "responses": {
          "200": {
            "description": "A list of books",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Book"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Setting Up The Validator

Add the following to `index.js`:

```js
const OpenAPISchemaValidator = require("openapi-schema-validator").default
const openAPIValidator = new OpenAPISchemaValidator({
  version: 3,
})

const fs = require("fs")
const path = require("path")

const main = async () => {
  // read the schema details
  const schemaFilepath = path.join(__dirname, "book.json")
  const bookSchema = JSON.parse(fs.readFileSync(schemaFilepath, "utf-8"))

  // Validating the OpenAPI
  const openApiJsonFilepath = path.join(__dirname, "openapi.json")
  const openApiSchema = JSON.parse(
    fs.readFileSync(openApiJsonFilepath, "utf-8")
  )

  // Adjust the openApiSchema to use the definitions from `book.json`.
  openApiSchema.components = {
    schemas: {
      User: bookSchema.definitions.user,
      Book: {
        type: bookSchema.type,
        properties: bookSchema.properties,
        required: bookSchema.required,
      },
    },
  }

  const res = openAPIValidator.validate(openApiSchema)
  if (res.errors.length) {
    console.error(res.errors)
    process.exit(1)
  }
}

main()
```

The most confusing part here may be where I am adjusting the Open API Schema to use the definitions from `book.json`. I am doing this is keep in line with what I was doing with combining the other JSON files. I am thinking in my own work that I may follow the precedent of splitting up component definitions and combining when required.

## Running The Validator

Run `node index.js`. If nothing happens, then perfect!

If you want to test the validity is doing what it needs, adjust a value in `openapi.json` and see what happens.

I changed `"description": "A list of books",` to `"descriptions": "A list of books",`. Running the file again will give us the following logged out:

```s
> node index.js
[
  {
    keyword: 'additionalProperties',
    dataPath: ".paths['/books'].get.responses['200']",
    schemaPath: '#/additionalProperties',
    params: { additionalProperty: 'descriptions' },
    message: 'should NOT have additional properties'
  },
  {
    keyword: 'required',
    dataPath: ".paths['/books'].get.responses['200']",
    schemaPath: '#/required',
    params: { missingProperty: 'description' },
    message: "should have required property 'description'"
  },
  {
    keyword: 'additionalProperties',
    dataPath: ".paths['/books'].get.responses['200']",
    schemaPath: '#/additionalProperties',
    params: { additionalProperty: 'descriptions' },
    message: 'should NOT have additional properties'
  },
  {
    keyword: 'additionalProperties',
    dataPath: ".paths['/books'].get.responses['200']",
    schemaPath: '#/additionalProperties',
    params: { additionalProperty: 'content' },
    message: 'should NOT have additional properties'
  },
  {
    keyword: 'required',
    dataPath: ".paths['/books'].get.responses['200']",
    schemaPath: '#/required',
    params: { missingProperty: '$ref' },
    message: "should have required property '$ref'"
  },
  {
    keyword: 'oneOf',
    dataPath: ".paths['/books'].get.responses['200']",
    schemaPath: '#/oneOf',
    params: { passingSchemas: null },
    message: 'should match exactly one schema in oneOf'
  }
]
```

Success! Now we have a way to validate our OpenAPI schema.

## Resources and Further Reading

1. [OpenAPI Validator](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-schema-validator)
