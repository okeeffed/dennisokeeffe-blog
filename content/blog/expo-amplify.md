---
title: Expo Amplify
date: "2018-10-22"
description: Example of adding in Amplify
---

# Expo with Amplify

## Links

- https://docs.aws.amazon.com/aws-mobile/latest/developerguide/mobile-hub-web-access-databases.html
- https://medium.com/@jameshamann/serverless-react-web-app-with-aws-amplify-part-two-d740ee8e7456

```bash
npm install --global awsmobile-cli
awsmobile configure # follow configure prompts
yarn add aws-amplify aws-amplify-react-native

awsmobile init
awsmobile user-signin enable
# might be
awsmobile user-signin enable --prompt

# to open console
awsmobile console
```

## Get

```
# Create
awsmobile cloud-api invoke ServerlessExampleCRUD POST /ServerlessExample '{"body": {"ID": "1", "ItemDescription": "Description", "ItemName": "Item One", "ItemPrice": 99}}'

# Another create
awsmobile cloud-api invoke ServerlessExampleCRUD POST /ServerlessExample '{"body": {"ID": "2", "ItemDescription": "Description", "ItemName": "Item Two", "ItemPrice": 99, "userId": "dennisokeeffe"}}'

# Get
awsmobile cloud-api invoke ServerlessExampleCRUD GET /ServerlessExample/object/1

{ ItemPrice: 99,
  ItemName: 'Item One',
  ID: '1',
  ItemDescription: 'Description',
  userId: 'UNAUTH' }
```

## In code

This code will also ensure that only the user can see the info

```javascript
// Create something only the user can see if user only on
let create = await API.post("ServerlessExampleCRUD", "/ServerlessExample", {
  body: {
    ID: "3",
    ItemDescription: "Description",
    ItemName: "Item Three",
    ItemPrice: 99,
  },
})
console.log(create)

// Fetch if only user can fetch
let counter = await API.get(
  "ServerlessExampleCRUD",
  "/ServerlessExample/object/3",
  {}
)
console.log("> CounterOne.counter", counter)
```
