---
title: Trees in Golang
date: "2019-04-08"
description: Golang implementation of a basic node tree and traversal using DFS and BFS.
---

DFS and BFS tree implementations with Golang.



## Setting up the test

Set up `trees_test.go` with the following file:

```go
package trees

import "testing"

func TestGetTreeRoot(t *testing.T) {
	n1 := Node{8, []Node{}}
	tree := Tree{}
	tree.setRoot(&n1)

	expected := &n1
	if observed := tree.getRoot(); observed != expected {
		t.Fatalf("Trees()) = %v, want %v", observed, expected)
	}
}

func TestAppendChild(t *testing.T) {
	n1 := Node{8, []Node{}}
	tree := Tree{}
	tree.setRoot(&n1)

	n2 := Node{2, []Node{}}
	n3 := Node{3, []Node{}}

	n1.append(&n2)
	n1.append(&n3)

	expected := 2
	if observed := n1.childLength(); observed != expected {
		t.Fatalf("Trees()) = %v, want %v", observed, expected)
	}
}

// This test only compares returned values, not addresses
func TestBFS(t *testing.T) {
	n1 := Node{8, []Node{}}
	tree := Tree{}
	tree.setRoot(&n1)

	n4 := Node{4, []Node{}}
	n5 := Node{5, []Node{}}

	n2 := Node{2, []Node{n4}}
	n3 := Node{3, []Node{n5}}

	n1.append(&n2)
	n1.append(&n3)

	expected := []int{n1.data, n2.data, n3.data, n4.data, n5.data}
	observed := tree.bfs()

	for i := range observed {
		if observed[i] != expected[i] {
			t.Fatalf("Failed: bfs => %d, want %d", observed[i], expected[i])
		}
		t.Logf("Success: bfs => %d, want %d", observed[i], expected[i])
	}
}

func TestDFS(t *testing.T) {
	n1 := Node{8, []Node{}}
	tree := Tree{}
	tree.setRoot(&n1)

	n4 := Node{4, []Node{}}
	n5 := Node{5, []Node{}}
	n6 := Node{6, []Node{}}

	n2 := Node{2, []Node{n4, n6}}
	n3 := Node{3, []Node{n5}}

	n1.append(&n2)
	n1.append(&n3)

	expected := []int{n1.data, n2.data, n4.data, n6.data, n3.data, n5.data}
	observed := tree.dfs()

	for i := range observed {
		if observed[i] != expected[i] {
			t.Fatalf("Failed: bfs => %d, want %d", observed[i], expected[i])
		}
		t.Logf("Success: bfs => %d, want %d", observed[i], expected[i])
	}
}
```



## Trees implementation

```go
package trees

// Tree is a basic tree structure
type Tree struct {
	root *Node
}

// Node represents a graph vertex with a data point and children
type Node struct {
	data     int
	children []Node
}

// Trees should have a comment documenting it.
func (t *Tree) setRoot(n *Node) {
	t.root = n
}

func (t *Tree) getRoot() *Node {
	return t.root
}

func (n *Node) append(c *Node) {
	n.children = append(n.children, *c)
}

func (n *Node) childLength() int {
	return len(n.children)
}

func (t *Tree) bfs() []int {
	n := t.getRoot()
	if n == nil {
		return []int{}
	}

	arr := []Node{*n}
	res := []int{}

	// Iterate through, if children, push to end of array
	for len(arr) > 0 {
		x := arr[0]
		arr = arr[1:]
		res = append(res, x.data)
		arr = append(arr, x.children...)
	}

	return res
}

func (t *Tree) dfs() []int {
	n := t.getRoot()
	if n == nil {
		return []int{}
	}

	arr := []Node{*n}
	res := []int{}

	// Iterate through, if children, push to end of array
	for len(arr) > 0 {
		x := arr[0]
		arr = arr[1:]
		res = append(res, x.data)
		arr = append(x.children, arr...)
	}

	return res
}
```



## Running Tests

In the directory, run `go test`.
