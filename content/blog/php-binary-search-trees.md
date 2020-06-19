
---
title: Php Binary Search Trees
date: "2019-10-22"
description: TODO
---

# Binary Search Trees in PHP

This expects an installation on the system of `phpunit`.

## Test File

Create `binary-search-tree_test.php`:

```php
<?php

require "binary-search-tree.php";

class BinarySearchTreeTest extends PHPUnit\Framework\TestCase
{
    public function testInsert()
    {
        $n1 = new Node(5);
        $n1->insert(1);
        $n1->insert(3);
        $n1->insert(8);
        $this->assertEquals(1, $n1->left->data);
        $this->assertEquals(8, $n1->right->data);
        $this->assertEquals(3, $n1->left->right->data);
    }

    public function testContains()
    {
        $n1 = new Node(5);
        $n1->insert(1);
        $n1->insert(3);
        $n1->insert(8);
        $res = $n1->contains(8);
        $res2 = $n1->contains(10);
        $this->assertEquals(false, $res == null);
        $this->assertEquals(true, $res2 == null);
    }

    public function validate($node, $min=null, $max=null) {
        if ($max != null && $node->data > $max) {
            return false;
        } else if ($min != null && $node->data < $min) {
            return false;
        }

        if ($node->left != null && !$this->validate($node->left, $min, $node->data)) {
            return false;
        }

        if ($node->right != null && !$this->validate($node->right, $node->data, $max)) {
            return false;
        }

        return true;
    }

    public function testValidate()
    {
        $n1 = new Node(5);
        $n1->insert(1);
        $n1->insert(3);
        $n1->insert(8);
        $res = $this->validate($n1);
        $this->assertEquals(true, $res);
    }
}
```

## Trees

Create `binary-search-tree.php`:

```php
<?php

class Node {
    function __construct($data, $left=null, $right=null) {
        $this->data = $data;
        $this->left = $left;
        $this->right = $right;
    }

    public function insert($data) {
        if ($data < $this->data && $this->left) {
            return $this->left->insert($data);
        } else if ($data < $this->data && !$this->left) {
            return $this->left = new Node($data);
        } else if ($data > $this->data && $this->right) {
            return $this->right->insert($data);
        } else if ($data > $this->data && !$this->right) {
            return $this->right = new Node($data);
        }
    }

    public function contains($data) {
        if ($data == $this->data) {
            return $this;
        } else if ($data < $this->data && $this->left) {
            return $this->left->contains($data);
        } else if ($data > $this->data && $this->right) {
            return $this->right->contains($data);
        }
    }
}
```

## Running Tests

Change into directory and run `phpunit.phar binary-search-tree_test.php`.

