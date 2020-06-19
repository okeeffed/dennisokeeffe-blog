---
title: Python Binary Search Trees
date: "2019-3-22"
description: Python implementation of a Binary Search Tree.
---

# Python Binary Search Trees

## Test file

Create file `binary_search_trees_test.py`:

```python
import unittest
import binary_search_trees
from binary_search_trees import Node


class BinarySearchTreeTest(unittest.TestCase):
    def test_bst_insert(self):
        root = Node(5)
        root.insert(8)
        root.insert(1)
        root.insert(3)

        self.assertEqual(root.data, 5)
        self.assertEqual(root.right.data, 8)
        self.assertEqual(root.left.data, 1)
        self.assertEqual(root.left.right.data, 3)
        self.assertEqual(root.left.left, None)

    def test_bst_contains(self):
        root = Node(5)
        root.insert(8)
        root.insert(1)
        root.insert(3)

        self.assertEqual(root.contains(5), root)
        self.assertEqual(root.contains(8), root.right)
        self.assertEqual(root.contains(1), root.left)
        self.assertEqual(root.contains(3), root.left.right)
        self.assertEqual(root.contains(13), None)

    def test_bst_validate(self):
        root = Node(5)
        root.insert(8)
        root.insert(1)
        root.insert(3)

        self.assertEqual(root.validate(), True)

        root = Node(5)
        root.right = Node(3)
        root.left = Node(10)

        self.assertEqual(root.validate(), False)


if __name__ == '__main__':
    unittest.main()
```

## Trees

Create file `binary_search_trees.py`.

```python
"""
Basic Binary Search Tree using a Node class
"""


class Node:
    def __init__(self, data, left=None, right=None):
        self.data = data
        self.left = None
        self.right = None

    def insert(self, data):
        """
        Takes data => integer value
        """
        if data < self.data and self.left:
            self.left.insert(data)
        elif data < self.data:
            self.left = Node(data)
        elif data > self.data and self.right:
            self.right.insert(data)
        elif data > self.data:
            self.right = Node(data)

    def contains(self, data):
        """
        Check if BST contains a certain data point and return Node
        """
        if self.data == data:
            return self
        elif data < self.data and self.left != None:
            return self.left.contains(data)
        elif data > self.data and self.right != None:
            return self.right.contains(data)
        return None

    def isValid(self, node, min=None, max=None):
        if min != None and node.data < min:
            return False
        elif max != None and node.data > max:
            return False
        elif node.left and not self.isValid(node.left, min, node.data):
            return False
        elif node.right and not self.isValid(node.right, node.data, max):
            return False
        return True

    def validate(self):
        return self.isValid(self)
```

## Running tests

Change into directory and run `python3 -m pytest -v binary_search_trees_test.py`.
