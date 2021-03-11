---
title: Python Linked List
date: "2018-08-12"
description: Python implementation of a basic unidirectional Linked List.
---



## Test file

Create file `linked_list_test.py`:

```python
import unittest
import linked_list


class LinkedListTest(unittest.TestCase):
    def test_insert_node_at_head(self):
        base = linked_list.Node(2)
        assess = [
            {
                "init": linked_list.LinkedList(),
                "input": linked_list.Node(8),
                "expectedLen": 1,
                "expectedData": 8,
                "expectedNext": None,
            },
            {
                "init": linked_list.LinkedList(base),
                "input": linked_list.Node(8),
                "expectedLen": 2,
                "expectedData": 8,
                "expectedNext": base,
            },
        ]
        for test in assess:
            test["init"].insertFirst(test["input"])
            # assert expected length
            self.assertEqual(test["init"].size, test["expectedLen"])
            # assert first el is the input Node
            self.assertEqual(test["init"].head, test["input"])
            # Assert data at head == Node data
            self.assertEqual(test["init"].head.data, test["expectedData"])
            # Assert head next == Node next
            self.assertEqual(test["init"].head.next, test["expectedNext"])

    def test_get_node_size(self):
        l = linked_list.LinkedList()
        self.assertEqual(l.getSize(), 0)

        n1 = linked_list.Node(2)
        l.insertFirst(n1)
        self.assertEqual(l.getSize(), 1)

        n2 = linked_list.Node(10)
        l.insertFirst(n2)
        self.assertEqual(l.getSize(), 2)

    def test_get_first(self):
        l = linked_list.LinkedList()
        self.assertEqual(l.getSize(), 0)

        n1 = linked_list.Node(2)
        l.insertFirst(n1)
        self.assertEqual(l.getFirst(), n1)

        n2 = linked_list.Node(10)
        l.insertFirst(n2)
        self.assertEqual(l.getFirst(), n2)

    def test_get_last(self):
        l = linked_list.LinkedList()
        self.assertEqual(l.getSize(), 0)

        n1 = linked_list.Node(2)
        l.insertFirst(n1)
        self.assertEqual(l.getLast(), n1)

        n2 = linked_list.Node(10)
        l.insertLast(n2)
        self.assertEqual(l.getLast(), n2)

    def test_insert_last(self):
        l = linked_list.LinkedList()

        n1 = linked_list.Node(2)
        l.insertLast(n1)
        self.assertEqual(l.getLast(), n1)

        n2 = linked_list.Node(10)
        l.insertLast(n2)
        self.assertEqual(l.getLast(), n2)

    def test_clear(self):
        l = linked_list.LinkedList()
        n1 = linked_list.Node(2)
        n2 = linked_list.Node(10)
        l.insertLast(n1)
        l.insertLast(n2)
        self.assertEqual(l.getSize(), 2)
        l.clear()
        self.assertEqual(l.getSize(), 0)

    def test_remove_first(self):
        l = linked_list.LinkedList()
        n1 = linked_list.Node(2)
        n2 = linked_list.Node(10)
        l.insertLast(n1)
        l.insertFirst(n2)
        self.assertEqual(l.getSize(), 2)
        l.removeFirst()
        self.assertEqual(l.getFirst(), n1)

    def test_remove_last(self):
        l = linked_list.LinkedList()
        n1 = linked_list.Node(2)
        n2 = linked_list.Node(10)
        n3 = linked_list.Node(11)
        n4 = linked_list.Node(29)
        l.insertLast(n1)
        l.insertLast(n2)
        l.insertLast(n3)
        l.insertLast(n4)
        self.assertEqual(l.getSize(), 4)
        l.removeLast()
        self.assertEqual(l.getLast(), n3)
        l.removeLast()
        self.assertEqual(l.getLast(), n2)

    def test_remove_last(self):
        l = linked_list.LinkedList()
        n1 = linked_list.Node(2)
        n2 = linked_list.Node(10)
        n3 = linked_list.Node(11)
        n4 = linked_list.Node(29)
        l.insertLast(n1)
        l.insertLast(n2)
        l.insertLast(n3)
        l.insertLast(n4)
        self.assertEqual(l.getSize(), 4)
        l.removeLast()
        self.assertEqual(l.getLast(), n3)
        l.removeLast()
        self.assertEqual(l.getLast(), n2)

    def test_get_at(self):
        l = linked_list.LinkedList()
        n1 = linked_list.Node(2)
        n2 = linked_list.Node(10)
        n3 = linked_list.Node(11)
        n4 = linked_list.Node(29)
        l.insertLast(n1)
        l.insertLast(n2)
        l.insertLast(n3)
        l.insertLast(n4)
        self.assertEqual(l.getAt(1), n2)
        self.assertEqual(l.getAt(2), n3)
        self.assertEqual(l.getAt(3), n4)

    def test_insert_at(self):
        l = linked_list.LinkedList()
        n1 = linked_list.Node(2)
        n2 = linked_list.Node(10)
        n3 = linked_list.Node(11)
        n4 = linked_list.Node(29)
        n5 = linked_list.Node(31)
        l.insertFirst(n1)
        l.insertFirst(n2)
        l.insertAt(1, n3)
        l.insertAt(2, n4)
        l.insertAt(4, n5)
        self.assertEqual(l.getAt(1), n3)
        self.assertEqual(l.getAt(2), n4)
        self.assertEqual(l.getAt(4), n5)


if __name__ == '__main__':
    unittest.main()
```



## Linked Lists

Create file `trees.py`.

```python
"""
Methods:

1. insertFirst: Insert at the head of list
2. size: Fetch size
3. getFirst: Fetch the first node
4. getLast: Fetch the last node
5. clear: Remove all node
6. removeFirst: Remove head of list
7. removeLast: Remove last node
8. insertLast: Insert at end of list
9. getAt: Fetch node at index
10. removeAt: Remove node at index
11. insertAt: Insert at index
12. forEach: Iterate through list and run function on list
"""


class Node:
    def __init__(self, data, next=None):
        self.data = data
        self.next = next


class LinkedList:
    def __init__(self, head=None):
        self.head = head
        if head:
            self.size = 1
        else:
            self.size = 0

    def insertFirst(self, node):
        if self.head:
            tmp = self.head
            self.head = node
            node.next = tmp
        else:
            self.head = node
        self.size += 1

    def getSize(self):
        return self.size

    def getFirst(self):
        return self.head

    def getLast(self):
        # check if head
        if self.head == None:
            raise Exception("No head of list")

        node = self.head
        # if head, iterate until node next is None
        while node.next != None:
            node = node.next
        return node

    def insertLast(self, node):
        if self.head == None:
            self.head = node
            self.size += 1
            return

        n = self.head
        while n.next != None:
            n = n.next
        n.next = node
        self.size += 1

    def clear(self):
        self.head = None
        self.size = 0

    def removeFirst(self):
        if self.head == None:
            raise Exception("No head of list")

        tmp = self.head.next
        self.head = tmp
        self.size -= 1

    def removeLast(self):
        if self.head == None:
            raise Exception("No list length")

        if self.head.next == None:
            self.head = None
            self.size -= 1
            return

        n = self.head
        while n.next.next:
            n = n.next
        n.next = None
        self.size -= 1

    def getAt(self, index):
        count = 0
        if self.head == None:
            raise Exception("No items in list")

        n = self.head
        while count != index:
            if n.next == None:
                raise Exception("Out of bounds")
            n = n.next
            count += 1

        return n

    def insertAt(self, index, node):
        count = 0

        if self.head == None and index > 0:
            raise Exception("Out of bounds")
        elif self.head == None and index == 0:
            self.head = node
            self.size += 1
            return
        elif self.head != None and index == 0:
            tmp = self.head
            self.head = node
            node.next = tmp
            self.size += 1
            return

        prev = self.head
        n = self.head.next
        while count != index - 1:
            if prev.next == None:
                raise Exception("Out of bounds")
            prev = n
            n = n.next
            count += 1
        prev.next = node
        node.next = n
        self.size += 1
```



## Running tests

Change into directory and run `python3 -m pytest -v linked_list_test.py`.
