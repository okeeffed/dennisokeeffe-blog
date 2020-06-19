
---
title: Java Spiral Matrix
date: "2019-10-22"
description: TODO
---

# Java - Spiral Matrix

## Writing the tests

```java
// src/test/java/SpiralMatrixTest.java
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertArrayEquals;

public class SpiralMatrixTest {
    @Test
    public void testTwoByTwo() {
        int[][] expected = { { 1, 2 }, { 4, 3 } };
        assertArrayEquals(new SpiralMatrix().gen(2), expected);
    }

    @Test
    public void testThreeByThree() {
        int[][] expected = { { 1, 2, 3 }, { 8, 9, 4 }, { 7, 6, 5 } };
        assertArrayEquals(new SpiralMatrix().gen(3), expected);
    }
}
```

## Writing the solution

```java
// src/main/java/SpiralMatrix.java
import java.util.Arrays;

class SpiralMatrix {
    int[][] gen(int size) {
        int[][] expected = new int[size][size];

        int count = 1;
        int colStart = 0;
        int colEnd = size - 1;
        int rowStart = 0;
        int rowEnd = size - 1;

        while (colStart <= colEnd && rowStart <= rowEnd) {
            // top row
            for (int i = colStart; i <= colEnd; i++) {
                expected[rowStart][i] = count;
                count++;
            }
            rowStart++;

            // far column
            for (int i = rowStart; i <= rowEnd; i++) {
                expected[i][colEnd] = count;
                count++;
            }
            colEnd--;

            // bottom row
            for (int i = colEnd; i >= colStart; i--) {
                expected[rowEnd][i] = count;
                count++;
            }
            rowEnd--;

            // start col
            for (int i = rowEnd; i >= rowStart; i--) {
                expected[i][colStart] = count;
                count++;
            }
            colStart++;
        }

        for (int i = 0; i < size; i++) {
            System.out.println(Arrays.toString(expected[i]));
        }
        return expected;
    }
}
```

