
---
title: Basics On Programming Paradigms
date: "2019-10-22"
description: TODO
---

# A Brief Recap of Programming Paradigms

## Procedural Program

- The ideas that programs are a sense of functions
- Goes from top to bottom
- Relies heavily on global state, but any line can change the global state
- C being a procedural language
- "Imperative" execution
- Easy to write, difficult to maintain
- Prone to difficult bugs

## Object Oriented

- Based around a Primitive: object
- Objects have well defined interfaces
- Localised behaviour
- Objects control state
- Composition
- Code is still imperative - pro AND con! - Still telling the computer EXACTLY what to do.
- Can be more verbose

## Declarative

- Describing what you want to happen, but not telling the computer how to do it
- Eg. SQL, Regex, HTML
- Data is self-describing
- As powerful as the interpreter allows
- As limiting as the interpreter allows - You want build a game in SQL etc.

## Functional

- What we want to happen but not how
- Little state
- Few side effects
- Easy to reason about
- Composition
- Expressive
- Works great with OO
- Basis in higher math
- Cons to think differently
- Not always the best choice
- No loops, no control logic - Just telling it what we want to happen

## Reactive

- Primitive: Observable
- Instead of describing data in terms of other data, we describe it in terms of streams of events - From this, we create a pipeline such that we certain data changes, a lot is processed and changed - Example: spreadsheets!
- Composition
- Expressive
- Data flows unidirectionally
- Tough to think differently
- Subscriptions help change the data

```javascript
const cellC2$ = cellA2$
  .combineLatest(cellB2$)
  .map((cells) => cells[0] + cells[1]);

cellC2$.subscribe((value) => {
  console.log(value);
});
```

