
---
title: Go Spiral Matrix
date: "2019-10-22"
description: TODO
---

# Spiral Matrix in Golang

Base spiral matrix implementation.

## Setting up the test

Set up `spiral_matrix_test.go` with the following file to test inserts, retrievals and validations:

```go
package sm

import (
	"fmt"
	"testing"
)

func TestMatrix(t *testing.T) {
	for _, tt := range testCases {
		res := genSpiralMatrix(tt.input)

		fmt.Println(res)

		for i, v := range res {
			for j := range v {
				if res[i][j] != tt.expected[i][j] {
					t.Errorf("FAIL: Expected %+v but got %+v", tt.expected, res)
					return
				}
			}
		}

		t.Logf("PASS: Expected %+v and got %+v", tt.expected, res)
	}
}

```

## Spiral Matrix Implementation

```go
package caps

func genSpiralMatrix(s int) [][]int {
	m := make([][]int, s)

	for x := 0; x < s; x++ {
		m[x] = make([]int, s)
		for y := 0; y < s; y++ {
			m[x][y] = 0
		}
	}

	count := 1
	startCol := 0
	endCol := s - 1
	startRow := 0
	endRow := s - 1

	for startCol <= endCol && startRow <= endRow {
		// top row
		for i := startCol; i <= endCol; i++ {
			m[startRow][i] = count
			count++
		}
		startRow++

		// row col ttb
		for i := startRow; i <= endRow; i++ {
			m[i][endCol] = count
			count++
		}
		endCol--

		// bottom row rtl
		for i := endCol; i >= startCol; i-- {
			m[endRow][i] = count
			count++
		}
		endRow--

		// first col bottom-to-top
		for i := endRow; i >= startRow; i-- {
			m[i][startCol] = count
			count++
		}
		startCol++
	}

	return m
}
```

## Running Tests

In the directory, run `go test`.

