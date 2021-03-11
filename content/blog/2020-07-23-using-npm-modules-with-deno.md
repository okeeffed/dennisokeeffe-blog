---
title: How To Use NPM ES Modules With Deno
description: Discover how the Skypack CDN can help use your favourite modules with Deno
date: "2020-07-23"
tags: deno, beginner, tutorial, codenewbie
---

[Deno](https://deno.land/) has the ability to consume ES modules. Thanks to this, we can utilise Pika's [Skypack CDN](https://www.skypack.dev/) to install and run any of our favourite NPM packages on the CDN that support ES modules!



## Installing a module

In our example, we are going to install and run a short `XState` example in Deno. I will write more on XState in future posts, but for now we are using this as an example of "picking an ESM module from Skypack CDN and getting it going".

First, head to the [Skypack CDN](https://www.skypack.dev/) website and search for your favourite NPM package to see if the corresponding ES module is available.

![Searching XState on the Skypack CDN website](../assets/2020-07-23-skypack-dev.png)



## Running an example

In a new directory, create a new file `touch index.ts` and add the following to the file:

```ts
import { Machine, interpret } from "https://cdn.skypack.dev/xstate"

type State = {
  value: string
}

// Stateless machine definition
// machine.transition(...) is a pure function used by the interpreter.
const toggleMachine = Machine({
  id: "toggle",
  initial: "inactive",
  states: {
    inactive: { on: { TOGGLE: "active" } },
    active: { on: { TOGGLE: "inactive" } },
  },
})

// Machine instance with internal state
const toggleService = interpret(toggleMachine)
  .onTransition((state: State) => console.log(state.value))
  .start()
// => 'inactive'

toggleService.send("TOGGLE")
// => 'active'

toggleService.send("TOGGLE")
// => 'inactive'
```

The code above it the example "Hello, World!" code found on the XState website with a minor type `State` added and used on the `onTransition` function.

From here, we can simply run the code with `deno run index.ts` and voilà! We have a working XState package!

```s
> deno run index.ts
Compile file:///Users/dennis.okeeffe/Project-Imposter/blog-repos/deno-xstate/index.ts
inactive
active
inactive
```

Rinse and repeat for any ESM packages you can find on the Skypack CDN. Happy coding!

P.S. this is easily my shortest post to date. If you prefer these quick tips, let me know and I will do more as I go along through my work day.

_Image credit: [Brian McGowan](https://unsplash.com/@sushioutlaw)_
