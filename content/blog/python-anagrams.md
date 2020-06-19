---
title: Python Anagrams
date: "2019-04-25"
description: Python implementation of comparing two strings to check if they are anagrams.
---

# Python Anagrams

## Test file

Create file `anagrams_test.py`:

```python
import unittest
import anagrams


class AnagramsTest(unittest.TestCase):
    def test_anagrams(self):
        assess = [
            {
                "inputA": "toyko",
                "inputB": "kyoto",
                "expectation": True
            },
            {
                "inputA": "toyko",
                "inputB": "kyotoooo",
                "expectation": False
            },
            {
                "inputA": "t!!o.9    yko",
                "inputB": "kyoto",
                "expectation": True
            },
            {
                "inputA": "racecar",
                "inputB": "carrace",
                "expectation": True
            },
            {
                "inputA": "TOKYO",
                "inputB": "kyoto",
                "expectation": True
            }
        ]
        for test in assess:
            self.assertEqual(anagrams.isAnagram(
                test["inputA"], test["inputB"]), test["expectation"])


if __name__ == '__main__':
    unittest.main()
```

## Anagrams

Create file `anagrams.py`.

```python
import re


def isAnagram(strA, strB):
    reStrA = re.sub("[^a-zA-Z]", "", strA).strip().lower()
    reStrB = re.sub("[^a-zA-Z]", "", strB).strip().lower()

    print(reStrA)
    print(reStrB)

    dictA = {}
    for c in reStrA:
        if c in dictA.keys():
            dictA[c] = dictA[c] + 1
        else:
            dictA[c] = 1

    dictB = {}
    for c in reStrB:
        if c in dictB.keys():
            dictB[c] = dictB[c] + 1
        else:
            dictB[c] = 1

    if len(dictA) != len(dictB):
        return False

    for c in dictA:
        if dictB[c] == None:
            return False
        if dictA[c] != dictB[c]:
            return False
    return True
```

## Running tests

Change into directory and run `python3 -m pytest -v anagrams_test.py`.
