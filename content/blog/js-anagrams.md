---
title: Anagrams in JavaScript
date: "2019-03-31"
description: JavaScript implementation of comparing two strings to check if they are anagrams.
---

This blog assumes a global install of `mocha`, although that can also be installed locally. `chai` is also required as the assertion library - install as a dev dependency.



## Writing tests

In `anagrams.mocha.js`:

```javascript
const lib = require("./strcmpSolution")
// const mocha = require('mocha');
const chai = require("chai")
const { expect } = chai
describe("check lowercase of two strings are anagrams", function() {
  it("should handle basic anagram", function() {
    const res = lib.anagram("race car", "racrace")
    expect(res).to.equal(true)
  })

  it("should handle punctuation", function() {
    const res = lib.anagram("race car", "RACE! CAR!")
    expect(res).to.equal(true)
  })

  it("should handle non-anagrams with different lengths", function() {
    const res = lib.anagram("test", "testa")
    expect(res).to.equal(false)
  })

  it("should handle non-anagrams with same length", function() {
    const res = lib.anagram("tests", "testa")
    expect(res).to.equal(false)
  })

  it("should handle anagrams with varying char length", function() {
    const res = lib.anagram("rrracb", "abcrrrr")
    expect(res).to.equal(false)
  })
})
```



## Anagrams

In `index.js`.

```javascript
const anagram = (strA, strB) => cleanStr(strA) === cleanStr(strB)

const cleanStr = str =>
  str
    .replace(/[^\w]/g, "")
    .toLowerCase()
    .split("")
    .sort()
    .join("")

module.exports = {
  anagram,
}
```



## Testing

Change into directory and run `mocha anagrams.mocha.js`.
