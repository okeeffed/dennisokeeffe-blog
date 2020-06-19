
---
title: Autocomplete With Rxjs
date: "2019-10-22"
description: TODO
---

# Hello Autocomplete with RxJS

This is a short looking at subscribing to a particular `keyup` event using RxJS to determine when we should generate a basic autocomplete function (using JQuery - not exactly my recommendation in 2019).

## The RxJS Way

```javascript
import $ from "jquery"
import Rx from "rxjs/Rx"

const $title = $("#title")
const $results = $("#results")

Rx.Observable.fromEvent($title, "keyup")
  .map(e => e.target.value)
  .distinctUntilChanged()
  .debounceTime(500)
  .switchMap(getItems)
  .subscribe(items => {
    $results.empty()
    $results.append(items.map(r => $(`<li />`).text(r)))
  })
```

- All the Rx has no external state, whereas the other code does.
- Rx doesn't have to wait for us to tell it when to do it.

## Comparision

There are many bad ways this can be implemented in vanilla:

- generally `if last query == currentTitle return`
- using setTimeout to reduce number of queries
- Race condition still happening, but bad attempts may be increasing the timeout - Could also use a current id compared to next query id and then returning before the callback occurs
- A lot of state across the module being changed

However, that being said, the main race condition in vanilla can also be prevented by implementing a debounce function as well before calling an event handler. Note that the above Rx note still stands that in this particular application, we still need to "tell" the program when to call the event handler.

