---
title: Go Binary Search Trees
date: "2019-05-20"
description: Go implementation of a Binary Search Tree.
---

Binary Search Tree implementation with Golang.

<Ad />

## Setting up the test

Set up `binary_search_trees_test.go` with the following file to test inserts, retrievals and validations:

```go
package binarysearchtree

import "testing"

func TestBinarySearchTreeInsert(t *testing.T) {
	n := &Node{data: 5}
	b := BST{root: n}

	b.root.lock.Lock()
	b.root.insert(1)
	b.root.lock.Unlock()

	b.root.lock.Lock()
	b.root.insert(8)
	b.root.lock.Unlock()

	b.root.lock.Lock()
	b.root.insert(3)
	b.root.lock.Unlock()

	expected := b.root.left.data
	observed := 1
	if expected != observed {
		t.Fatalf("BinarySearchTree()) = %d, want %d", observed, expected)
	}

	expected = b.root.right.data
	observed = 8
	if expected != observed {
		t.Fatalf("BinarySearchTree()) = %d, want %d", observed, expected)
	}

	expected = b.root.left.right.data
	observed = 3
	if expected != observed {
		t.Fatalf("BinarySearchTree()) = %d, want %d", observed, expected)
	}
}

func TestBinarySearchTreeContains(t *testing.T) {
	n := &Node{data: 5}
	b := BST{root: n}

	b.root.lock.Lock()
	b.root.insert(1)
	b.root.lock.Unlock()

	b.root.lock.Lock()
	b.root.insert(8)
	b.root.lock.Unlock()

	b.root.lock.Lock()
	b.root.insert(3)
	b.root.lock.Unlock()

	expected := b.root.contains(1)
	observed := b.root.left
	if expected != observed {
		t.Fatalf("BinarySearchTree()) = %d, want %d", observed, expected)
	}

	expected = b.root.contains(8)
	observed = b.root.right
	if expected != observed {
		t.Fatalf("BinarySearchTree()) = %d, want %d", observed, expected)
	}

	expected = b.root.contains(3)
	observed = b.root.left.right
	if expected != observed {
		t.Fatalf("BinarySearchTree()) = %d, want %d", observed, expected)
	}

	expected = b.root.contains(13)
	observed = nil
	if expected != observed {
		t.Fatalf("BinarySearchTree()) = %d, want %d", observed, expected)
	}
}

func TestBSTValidate(t *testing.T) {
	n := &Node{data: 5}
	b := BST{root: n}

	b.root.lock.Lock()
	b.root.insert(1)
	b.root.lock.Unlock()

	b.root.lock.Lock()
	b.root.insert(8)
	b.root.lock.Unlock()

	b.root.lock.Lock()
	b.root.insert(3)
	b.root.lock.Unlock()

	observed := b.root.validate(nil, nil)
	expected := true
	if expected != observed {
		t.Fatalf("BinarySearchTree()) = %t, want %t", observed, expected)
	}
}
```

<Ad />

## Binary Search Tree implementation

```go
package binarysearchtree

import (
	"sync"
)

// Node defines a tree node hosting data
type Node struct {
	data  int
	left  *Node
	right *Node
	lock  sync.Mutex
}

// BST Binary Search Tree
type BST struct {
	root *Node
}

func (n *Node) insert(data int) {
	if data < (*n).data && (*n).left != nil {
		(*n).left.insert(data)
	} else if data < (*n).data {
		node := &Node{}
		node.data = data
		(*n).left = node
	} else if data > (*n).data && (*n).right != nil {
		(*n).right.insert(data)
	} else if data > (*n).data {
		node := &Node{}
		node.data = data
		(*n).right = node
	}
}

func (n *Node) contains(data int) *Node {
	if n.data == data {
		return n
	} else if data < n.data && n.left != nil {
		return n.left.contains(data)
	} else if data > n.data && n.right != nil {
		return n.right.contains(data)
	}

	return nil
}

func (n *Node) validate(min *int, max *int) bool {
	if min != nil && n.data < *min {
		return false
	} else if max != nil && n.data > *max {
		return false
	} else if n.left != nil && !n.left.validate(min, &n.data) {
		return false
	} else if n.right != nil && !n.right.validate(&n.data, max) {
		return false
	}

	return true
}
```

<Ad />

## Running Tests

In the directory, run `go test`.
