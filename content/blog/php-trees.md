---
title: PHP Trees
date: "2018-08-12"
description: PHP implementation of a basic node tree and traversal using DFS and BFS.
---

This expects an installation on the system of `phpunit`.

## Test File

Create `tree_test.php`:

```php
<?php

require "tree.php";

class TreeTest extends PHPUnit\Framework\TestCase
{
    public function testBFS()
    {
        $n4 = new Node(4);
        $n5 = new Node(5);

        $n2 = new Node(2, [$n4]);
        $n3 = new Node(3, [$n5]);

        $n1 = new Node(1, [$n2,$n3]);
        $t = new Tree($n1);
        $expected = [1,2,3,4,5];
        $this->assertEquals($expected, $t->bfs());
    }

    public function testDFS()
    {
        $n4 = new Node(4);
        $n5 = new Node(5);

        $n2 = new Node(2, [$n4]);
        $n3 = new Node(3, [$n5]);

        $n1 = new Node(1, [$n2,$n3]);
        $t = new Tree($n1);
        $expected = [1,2,4,3,5];
        $this->assertEquals($expected, $t->dfs());
    }
}
```

## Trees

Create `tree.php`:

```php
<?php

class Tree {
    function __construct($root = null) {
        $this->root = $root;
    }

    public function bfs() {
        // 1. shift val
        // 2. if children, append to arr
        // 3. append data to array to compare
        if ($this->root == null) {
            throw new Error("No tree root");
        }

        $arr = array($this->root);
        $res = [];

        while (count($arr) > 0) {
            $x = array_shift($arr);
            if ($x->children != null) {
                $arr = array_merge($arr, $x->children);
            }

            array_push($res, $x->data);
        }
        return $res;
    }

    public function dfs() {
        // shift from arr
        // if children exist, unshift array
        // add data to res array

        $res = [];
        $arr = array($this->root);

        while (count($arr) > 0) {
            $x = array_shift($arr);
            if ($x->children != null) {
                $arr = array_merge($x->children, $arr);
            }

            array_push($res, $x->data);
        }

        return $res;
    }
}

class Node {
    function __construct($data = null, $children = null) {
        $this->data = $data;
        $this->children = $children;
    }
}
```

## Running Tests

Change into directory and run `phpunit.phar tree_test.php`.
