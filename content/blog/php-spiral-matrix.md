---
title: PHP Spiral Matrix
date: "2018-07-15"
description: PHP Spiral Matrices with unit testing.
---

# Spiral Matrix in PHP

This expects an installation on the system of `phpunit`.

## Test File

Create `php-spiral-matrix_test.php`:

```php
<?php

require "php-spiral-matrix.php";

class PhpSpiralMatrixTest extends PHPUnit\Framework\TestCase
{
    public function testTwoByTwoSprialMatrix()
    {
        $size = 2;

        $expected = array(
            array(1, 2),
            array(4, 3)
        );

        $this->assertEquals($expected, sprialMatrix($size));
    }

    public function testThreeByThreeSprialMatrix()
    {
        $size = 3;
        $expected = array(
            array(1, 2, 3),
            array(8, 9, 4),
            array(7, 6, 5)
        );
        $this->assertEquals($expected, sprialMatrix($size));
    }
}
```

## Spiral Matrix

Create `binary-search-tree.php`:

```php
<?php

function sprialMatrix($size)
{
    $base = array_fill(0, $size, 0);
    $mat = array_fill(0, $size, $base);

    $count = 1;
    $startCol = 0;
    $endCol = $size - 1;
    $startRow = 0;
    $endRow = $size - 1;

    while ($startCol <= $endCol && $startRow <= $endRow) {
        // top row
        for ($i = $startCol; $i <= $endCol; $i++) {
            $mat[$startRow][$i] = $count;
            $count++;
        }
        $startRow++;

        // right col
        for ($i = $startRow; $i <= $endRow; $i++) {
            $mat[$i][$endCol] = $count;
            $count++;
        }
        $endCol--;

        // bottom row
        for ($i = $endCol; $i >= $startCol; $i--) {
            $mat[$endRow][$i] = $count;
            $count++;
        }
        $endRow--;

        // left col
        for ($i = $endRow; $i >= $startRow; $i--) {
            $mat[$i][$startCol] = $count;
            $count++;
        }
        $startCol++;
    }

    return $mat;
}

```

## Running Tests

Change into directory and run `phpunit.phar php-spiral-matrix_test.php`.
