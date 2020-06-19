---
title: JavaScript Naming Conventions
date: "2018-10-22"
description: Suggestions and guides for naming in JavaScript.
---

# JavaScript Function Naming Guidelines

```bash
[verb = required][verb = null][noun = null][preposition = null][noun = null]
```

## Verb examples

- get
- save
- fetch
- throw
- remove

## First noun examples

- user
- image
- data
- item

## Prepositions

- from
- to

## Second noun examples

- database
- table
- copy

## In usage

The `[noun][preoposition][noun]` may not always need to be used and simplicity is the goal if possible.

```javascript
// high specificity examples [verb][noun][preposition][noun]
getUserFromDatabase()
saveUserToDatabase()
saveImageToTable()
fetchRestaurantFromCopy()

// omitting the preposition and second noun [verb][noun]
removeItem()
getResult()

// omitting all except verb [verb]
signIn()
signOut()
signUp()

// using the first verb [verb][verb]
confirmSignIn()
confirmSignUp()
```
