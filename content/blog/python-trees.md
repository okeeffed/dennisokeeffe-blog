---
title: Python Trees
date: "2019-3-11"
description: Python implementation of a basic node tree and traversal using DFS and BFS.
---

# Python Trees

## Test file

Create file `trees_test.py`:

```python
import unittest
import trees


class TreesTest(unittest.TestCase):
    def test_bfs(self):
        n4 = trees.Node(4)
        n5 = trees.Node(5)
        n2 = trees.Node(2, [n4])
        n3 = trees.Node(3, [n5])
        n1 = trees.Node(1, [n2, n3])

        t = trees.Tree(n1)

        expectation = [1, 2, 3, 4, 5]
        res = t.bfs()

        self.assertEqual(res, expectation)

    def test_dfs(self):
        n4 = trees.Node(4)
        n5 = trees.Node(5)
        n2 = trees.Node(2, [n4])
        n3 = trees.Node(3, [n5])
        n1 = trees.Node(1, [n2, n3])

        t = trees.Tree(n1)

        expectation = [1, 2, 4, 3, 5]
        res = t.dfs()

        self.assertEqual(res, expectation)


if __name__ == '__main__':
    unittest.main()
```

## Trees

Create file `trees.py`.

```python
"""
Basic Tree implementation with nodes
"""


class Tree:
    def __init__(self, root=None):
        self.root = root

    def bfs(self):
        """
        While node has children, shift front and push children to arr. Return int array of data from Nodes.
        """
        if self.root == None:
            raise Exception("No root Node")

        res = []
        arr = [self.root]
        while len(arr) > 0:
            x, arr = arr[0], arr[1:]
            if x.children != None:
                arr = arr + x.children
            res.append(x.data)
        print(res)
        return res

    def dfs(self):
        """
        While node has children, shift front and unshift children to arr. Return int array of data from Nodes.
        """
        if self.root == None:
            raise Exception("No elements in range")
        res = []
        arr = [self.root]
        while len(arr) > 0:
            # shift array
            x, arr = arr[0], arr[1:]
            if x.children != None:
                arr = x.children + arr
            res.append(x.data)
        return res


class Node:
    def __init__(self, data, children=None):
        self.data = data
        self.children = children
```

## Running tests

Change into directory and run `python3 -m pytest -v trees_test.py`.
