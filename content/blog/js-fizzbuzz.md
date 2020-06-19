
---
title: Js Fizzbuzz
date: "2019-10-22"
description: TODO
---

# FizzBuzz in JavaScript

This blog assumes a global install of `mocha`, although that can also be installed locally. `chai` is also required as the assertion library - install as a dev dependency.

## Writing tests

Create `fizzbuzz.mocha.js`.

```javascript
const lib = require('./index');
const chai = require('chai');
const { expect } = chai;
describe('check basic function', function() {
  it('should return when not part of fizz buzz', function() {
    const res = lib.run(2);
    expect(res).to.equal(2);
  });

  it('should return fizz', function() {
    const res = lib.run(3);
    expect(res).to.equal('Fizz');
  });

  it('should return buzz', function() {
    const res = lib.run(5);
    expect(res).to.equal('Buzz');
  });

  it('should return fizzbuzz', function() {
    const res = lib.run(15);
    expect(res).to.equal('FizzBuzz');
  });
});
```

## Main js file

Create `index.js`:

```javascript
const run = (arg) => {
  switch (true) {
    case arg % 15 === 0:
      return 'FizzBuzz';
    case arg % 3 === 0:
      return 'Fizz';
    case arg % 5 === 0:
      return 'Buzz';
    default:
      return arg;
  }
};

module.exports = {
  run
};
```

## Testing

Change into directory and run `mocha fizzbuzz.mocha.js`.

