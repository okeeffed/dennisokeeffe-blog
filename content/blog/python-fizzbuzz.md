---
title: Python Fizzbuzz
date: "2018-07-15"
description: The classic FizzBuzz implementation in Python with Unit Testing.
---

<Ad />

## Test file

Create file `fizz_buzz_test.py`:

```python
import unittest
import fizz_buzz


class FizzBuzzTest(unittest.TestCase):
    def test_capitalise_sentence(self):
        assess = [
            {
                "input": 2,
                "expectation": 2
            },
            {
                "input": 3,
                "expectation": "Fizz"
            },
            {
                "input": 5,
                "expectation": "Buzz"
            },
            {
                "input": 15,
                "expectation": "FizzBuzz"
            },
        ]
        for test in assess:
            self.assertEqual(fizz_buzz.run(
                test["input"]), test["expectation"])


if __name__ == '__main__':
    unittest.main()
```

<Ad />

## FizzBuzz

Create file `fizz_buzz.py`.

```python
def run(arg):
    if arg % 5 == 0 and arg % 3 == 0:
        return "FizzBuzz"
    elif arg % 3 == 0:
        return "Fizz"
    elif arg % 5 == 0:
        return "Buzz"
    else:
        return arg
```

<Ad />

## Running tests

Change into directory and run `python3 -m pytest -v fizz_buzz_test.py`.
