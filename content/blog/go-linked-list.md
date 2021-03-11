---
title: Go Linked List
date: "2019-03-30"
description: Go implementation of a basic unidirectional Linked List.
---

Basic unidirectional linked lists with Golang.



## Setting up the test

Set up `linked_list_test.go` with the following file:

```go
package linkedlist

import (
	"testing"
)

func TestInsertFirst(t *testing.T) {
	for _, tt := range insertFirstTestCases {
		t.Log(tt.description)
		l := List{}
		l.insertFirst(&tt.input)

		if tt.expectedLen != l.size {
			t.Errorf("FAIL: Return value expected %d but got %d", tt.expectedLen, l.size)
			return
		}

		if tt.expectedData != l.head.data {
			t.Errorf("FAIL: Return value expected %d but got %d", tt.expectedData, l.head.data)
			return
		}

		hasNext := l.head.next != nil
		if tt.expectedNext != hasNext {
			t.Errorf("FAIL: Return value expected %d but got %d", tt.expectedData, l.head.data)
			return
		}

		t.Logf("PASS: Expected length %d and got %d", tt.expectedLen, l.size)
		t.Logf("PASS: Expected data %d and got %d", tt.expectedData, l.head.data)
		t.Logf("PASS: Expected data %t and got %t", tt.expectedNext, hasNext)
	}
}

func TestInsertFirstFromArray(t *testing.T) {
	l := List{}
	n1 := Node{data: 12}
	n2 := Node{data: 2}
	n3 := Node{data: 8}

	l.insertFirst(&n1)
	l.insertFirst(&n2)
	l.insertFirst(&n3)

	if &n3 != l.head {
		t.Errorf("FAIL: First list value expected %+v but got %+v", &n3, l.head)
		return
	}

	t.Logf("PASS: First list value expected %+v but got %+v", &n3, l.head)
}

func TestInsertLastFromArray(t *testing.T) {
	l := List{}
	n1 := Node{data: 12}
	n2 := Node{data: 2}
	n3 := Node{data: 8}

	l.insertLast(&n1)
	l.insertLast(&n2)
	l.insertLast(&n3)

	last := l.getLast()

	if &n3 != last {
		t.Errorf("FAIL: Last list value expected %+v but got %+v", &n3, l.head)
		return
	}

	t.Logf("PASS: Last list value expected %+v but got %+v", &n3, l.head)
}

func TestGetFirst(t *testing.T) {
	for _, tt := range getFirstTestCases {
		t.Log(tt.description)
		l := List{}
		l.insertFirst(&tt.input)

		firstNode := l.getFirst()

		if firstNode != &tt.input {
			t.Errorf("FAIL: Return value expected %+v but got %+v", &tt.input, firstNode)
			return
		}

		t.Logf("PASS: Expected %+v and got %+v", &tt.input, firstNode)
	}
}

func TestClearList(t *testing.T) {
	l := List{}
	n1 := Node{data: 12}
	n2 := Node{data: 2}
	n3 := Node{data: 8}

	l.insertLast(&n1)
	l.insertLast(&n2)
	l.insertLast(&n3)

	l.clear()

	if l.head != nil {
		t.Errorf("FAIL: Last list value expected nil but got %+v", l.head)
		return
	}

	t.Logf("PASS: Last list value expected nil and got %+v", l.head)
}

func TestGetNodeAtIndexOfList(t *testing.T) {
	l := List{}
	n1 := Node{data: 12}
	n2 := Node{data: 2}
	n3 := Node{data: 8}

	l.insertLast(&n1)
	l.insertLast(&n2)
	l.insertLast(&n3)

	res, err := l.getAt(1)

	if err != nil {
		t.Errorf("FAIL: Return error from GetNodeAtIndex")
		return
	}

	if &n2 != res {
		t.Errorf("FAIL: Get list value expected %+v but got %+v", &n2, res)
		return
	}

	t.Logf("PASS: Get list value expected %+v and got %+v", &n2, res)
}

func TestRemoveNodeAtIndexOfList(t *testing.T) {
	l := List{}
	n1 := Node{data: 12}
	n2 := Node{data: 2}
	n3 := Node{data: 8}

	l.insertLast(&n1)
	l.insertLast(&n2)
	l.insertLast(&n3)

	err := l.removeAt(1)

	res, getErr := l.getAt(1)

	if err != nil {
		t.Errorf("FAIL: Return error from GetNodeAtIndex")
		return
	}

	if getErr != nil {
		t.Errorf("FAIL: Return error from GetNodeAtIndex")
		return
	}

	if &n3 != res {
		t.Errorf("FAIL: Post-removed list value expected %+v but got %+v", &n3, res)
		return
	}

	t.Logf("PASS: Post-removed list value expected %+v and got %+v", &n3, res)
}

func TestInsertNodeAtIndexOfList(t *testing.T) {
	l := List{}
	n1 := Node{data: 12}
	n2 := Node{data: 2}
	n3 := Node{data: 8}
	n4 := Node{data: 123}

	l.insertLast(&n1)
	l.insertLast(&n2)
	l.insertLast(&n3)

	err := l.insertAt(1, &n4)

	if err != nil {
		t.Errorf("FAIL: Return error from GetNodeAtIndex")
		return
	}

	res, getErr := l.getAt(1)

	if getErr != nil {
		t.Errorf("FAIL: Return error from GetNodeAtIndex")
		return
	}

	if &n4 != res {
		t.Errorf("FAIL: Insert list value expected %+v but got %+v", &n4, res)
		return
	}

	t.Logf("PASS: Insert list value expected %+v and got %+v", &n4, res)
}
```



## Trees implementation

```go
/*
@author Dennis O'Keeffe

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
*/

package linkedlist

import (
	"errors"
	"sync"
)

// Node - Setup base node type for linked list
type Node struct {
	data int
	next *Node
}

// List - Basic singularly linked list
type List struct {
	head *Node
	size int
	lock sync.Mutex
}

func (l *List) insertFirst(n *Node) {
	l.lock.Lock()
	if l.head != nil {
		tmp := l.head
		l.head = n
		n.next = tmp
	} else {
		l.head = n
	}
	l.size++
	l.lock.Unlock()
}

func (l *List) insertLast(n *Node) {
	l.lock.Lock()
	if l.head == nil {
		l.head = n
	} else {
		last := l.head
		for {
			if last.next == nil {
				break
			}
			last = last.next
		}
		last.next = n
	}

	l.size++
	l.lock.Unlock()
}

func (l *List) getFirst() *Node {
	return l.head
}

func (l *List) getLast() *Node {
	l.lock.Lock()
	n := l.head

	for {
		if n.next == nil {
			break
		}
		n = n.next
	}

	l.lock.Unlock()
	return n
}

func (l *List) clear() {
	l.lock.Lock()
	l.head = nil
	l.lock.Unlock()
}

func (l *List) getAt(index int) (*Node, error) {
	if l.head == nil {
		return nil, errors.New("No elements in list")
	}

	l.lock.Lock()
	i := 0
	n := l.head

	for {
		if i == index {
			break
		}

		if n.next == nil {
			return nil, errors.New("No elements in list")
		}
		i++
		n = n.next
	}

	l.lock.Unlock()
	return n, nil
}

func (l *List) removeAt(index int) error {
	if l.head == nil {
		return errors.New("No elements at index found in list")
	}

	l.lock.Lock()
	n := l.head
	i := 0

	for {
		if i == index-1 {
			tmp := n.next.next
			n.next = tmp
			break
		}

		if n.next == nil {
			return errors.New("Out of range")
		}

		n = n.next
	}

	l.lock.Unlock()
	return nil
}

func (l *List) insertAt(index int, node *Node) error {
	if l.head == nil {
		return errors.New("No elements at index found in list")
	}

	l.lock.Lock()
	n := l.head
	i := 0

	for {
		if i == index-1 {
			tmp := n.next.next
			n.next = node
			node.next = tmp
			break
		}

		if n.next == nil {
			return errors.New("Out of range")
		}

		n = n.next
	}

	l.lock.Unlock()
	return nil
}
```



## Running Tests

In the directory, run `go test`.
