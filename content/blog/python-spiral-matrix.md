---
title: Python Spiral Matrix
date: "2018-09-11"
description: Python Spiral Matrices with unit testing.
---

## Test file

Create file `spiral_matrix_test.py`:

```python
import unittest
import spiral_matrix


class GeneralMatrixTest(unittest.TestCase):
    def test_matrices(self):
        asserts = [
            {
                "input": 3,
                "expected": [[1, 2, 3], [8, 9, 4], [7, 6, 5]]
            }
        ]

        for test in asserts:
            res = spiral_matrix.create(test["input"])
            self.assertEqual(res, test["expected"])


if __name__ == '__main__':
    unittest.main()
```

## Spiral Matrix

Create file `spiral_matrix.py`.

```python
def create(dim):
    """
    Create a matrix of size n.

    dim: integer defining n x n matrix.
    """
    mat = []
    i = 0
    j = 0
    while i < dim:
        mat.append([])
        while j < dim:
            j = j + 1
            mat[i].append(0)
        i = i + 1
        j = 0

    count = 1
    startCol = 0
    endCol = dim - 1
    startRow = 0
    endRow = dim - 1

    while startCol <= endCol and startRow <= endRow:
        # startRow
        i = startCol
        while i <= endCol:
            mat[startRow][i] = count
            count = count + 1
            i = i + 1
        startRow = startRow + 1

        # endCol
        i = startRow
        while i <= endRow:
            mat[i][endCol] = count
            count = count + 1
            i = i + 1
        endCol = endCol - 1

        # endRow
        i = endCol
        while i >= startCol:
            mat[endRow][i] = count
            count = count + 1
            i = i - 1
        endRow = endRow - 1

        # startCol
        i = endRow
        while i >= startRow:
            mat[i][startCol] = count
            count = count + 1
            i = i - 1
        startCol = startCol + 1
    return mat
```

## Running tests

Change into directory and run `python3 -m pytest -v spiral_matrix_test.py`.
