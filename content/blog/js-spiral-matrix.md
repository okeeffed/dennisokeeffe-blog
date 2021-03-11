---
title: Spiral Matrices in JavaScript
date: "2019-03-18"
description: JavaScript Spiral Matrices with unit testing.
---

This blog assumes a global install of `mocha`, although that can also be installed locally. `chai` is also required as the assertion library - install as a dev dependency.



## Writing tests

Create `sm.mocha.js`.

```javascript
const lib = require("./index")
const chai = require("chai")
const { expect } = chai

describe("spiral matrix", function() {
  it("should return correct for 2", function() {
    let target = [[1, 2], [4, 3]]
    const res = lib.matrix(2)

    expect(res).to.deep.equal(target)
  })

  it("should return correct for 3", function() {
    let target = [[1, 2, 3], [8, 9, 4], [7, 6, 5]]
    const res = lib.matrix(3)

    expect(res).to.deep.equal(target)
  })

  it("should return correct for 0", function() {
    let target = []
    const res = lib.matrix(0)

    expect(res).to.deep.equal(target)
  })
})
```



## Main js file

Create `index.js`:

```javascript
/**
 * Build a 2D matrix based on size n and return
 * integers spiralling down from n*n
 *
 * @param {*} n Matrix size
 */
let matrix = n => {
  const mat = []
  for (let i = 0; i < n; i++) {
    mat.push([])
  }

  let count = 1
  let startCol = 0
  let endCol = n - 1
  let startRow = 0
  let endRow = n - 1

  while (startRow <= endRow && startCol <= endCol) {
    // top row
    for (let i = startCol; i <= endCol; i++) {
      mat[startRow][i] = count
      count++
    }
    startRow++

    // right col down
    for (let i = startRow; i <= endRow; i++) {
      mat[i][endCol] = count
      count++
    }
    endCol--

    // bottow row rtl
    for (let i = endCol; i >= startCol; i--) {
      mat[endRow][i] = count
      count++
    }
    endRow--

    // start col btt
    for (let i = endRow; i >= startRow; i--) {
      mat[i][startCol] = count
      count++
    }
    startCol++
  }
  return mat
}

module.exports = {
  matrix,
}
```



## Testing

Change into directory and run `mocha sm.mocha.js`.
