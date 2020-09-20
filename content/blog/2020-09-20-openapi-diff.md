---
title: Prevent Breaking API Changes With OpenAPI And openapi-diff
description: Prevent Breaking API Changes With OpenAPI And openapi-diff
date: "2020-09-20"
tags: json,yml,api,nodejs
---

This is the next post in a short series of spikes I am doing to better understand JSON Schema and OpenAPI v3.

In the previous two posts, we looked at validating and converting JSON schema to TypeScript, then validating the OpenAPI schema itself. In this post, we are going to go one step further and test for breaking changes.

```s
# in a project directory with yarn setup
yarn add openapi-diff
# preparing the files
touch books.json openapi.json
```

## Setting up the required files

We are going to continue on with our values that we had from the previous posts which will model a book and expect `/books` to have a 200 response that returns an array of books.

For `books.json`:

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

For `openapi.json`:

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

## Running the validation

```js
const openApiDiff = require("openapi-diff")
const util = require("util")

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

  // define a copy that we will make breaking changes to
  const openApiSchemaNew = Object.assign({}, openApiSchema)

  // add in the component
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

  // mimic the above behaviour
  openApiSchemaNew.components = {
    schemas: {
      User: bookSchema.definitions.user,
      Book: {
        type: bookSchema.type,
        properties: {
          title: { type: "string" },
        },
        required: bookSchema.required,
      },
    },
  }

  // openApiDiff
  const result = await openApiDiff.diffSpecs({
    sourceSpec: {
      content: JSON.stringify(openApiSchema),
      location: "old",
      format: "openapi3",
    },
    destinationSpec: {
      content: JSON.stringify(openApiSchemaNew),
      location: "new",
      format: "openapi3",
    },
  })

  if (result.breakingDifferencesFound) {
    console.log("Breaking change found!")
    console.log(util.inspect(result, { depth: null }))
  }
}

main()
```

In the above script, we are adding a breaking change by removing two of the expected properties.

If we run `node index.js`, our breaking change will show!

```s
Breaking change found!
{
  breakingDifferences: [
    {
      type: 'breaking',
      action: 'add',
      code: 'response.body.scope.add',
      destinationSpecEntityDetails: [
        {
          location: 'paths./books.get.responses.200.content.application/json.schema',
          value: {
            type: 'array',
            items: {
              type: 'object',
              properties: { title: { type: 'string' } },
              required: [ 'author', 'title', 'publisher' ]
            }
          }
        }
      ],
      entity: 'response.body.scope',
      source: 'json-schema-diff',
      sourceSpecEntityDetails: [
        {
          location: 'paths./books.get.responses.200.content.application/json.schema',
          value: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                author: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    preferredName: { type: 'string' },
                    age: { type: 'number' },
                    gender: { enum: [ 'male', 'female', 'other' ] }
                  },
                  required: [ 'name', 'preferredName', 'age', 'gender' ]
                },
                title: { type: 'string' },
                publisher: { type: 'string' }
              },
              required: [ 'author', 'title', 'publisher' ]
            }
          }
        }
      ],
      details: {
        differenceSchema: {
          type: 'array',
          items: {
            type: 'object',
            properties: { title: { type: 'string' } },
            required: [ 'author', 'title', 'publisher' ]
          },
          not: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                author: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    preferredName: { type: 'string' },
                    age: { type: 'number' },
                    gender: true
                  },
                  required: [ 'name', 'preferredName', 'age', 'gender' ]
                },
                publisher: { type: 'string' },
                title: { type: 'string' }
              },
              required: [ 'author', 'publisher', 'title' ]
            }
          }
        }
      }
    }
  ],
  breakingDifferencesFound: true,
  nonBreakingDifferences: [],
  unclassifiedDifferences: []
}
```

Amazing! Since we are exiting with a non-zero code, we can start pulling things like this short script into our CI tools.

## Resources And Further Reading

1. [OpenAPI diff](https://bitbucket.org/atlassian/openapi-diff)

_Image credit: [Laura Chouette](https://unsplash.com/@laurachouette)_