---
title: PHP Linked List
date: "2019-01-17"
description: PHP implementation of a basic unidirectional Linked List.
---

This expects an installation on the system of `phpunit`.



## Test File

Create `linked_list_test.php`:

```php
<?php

require "linked-list.php";

class LinkedListTest extends PHPUnit\Framework\TestCase
{
    public function testInsertFirst()
    {
        $n1 = new Node(1);
        $n2 = new Node(2);
        $ll = new LinkedList($n1);
        $ll->insertFirst($n2);
        $this->assertEquals($ll->size, 2);
    }

    public function testGetFirst()
    {
        $n1 = new Node(1);
        $n2 = new Node(2);
        $ll = new LinkedList($n1);
        $ll->insertFirst($n2);
        $this->assertEquals($ll->size, 2);
        $this->assertEquals($ll->getFirst(), $n2);
    }
}
```



## Linked List

Create `linked_list.php`:

```php
<?php

class LinkedList {
    public $size = 0;
    public $head;

    function __construct($head = null) {
        $this->head = $head;

        if ($head != null) {
            $this->size = 1;
        } else {
            $this->size = 0;
        }
    }

    public function insertFirst($n) {
        if ($this->head != null) {
            $tmp = $this->head;
            $this->head = $n;
            $n->setNext($tmp);
        } else {
            $this->head = $n;
        }
        $this->size++;
    }

    public function getFirst() {
        return $this->head;
    }
}

class Node {
    private $data;
    private $next;

    function __construct($data = null) {
        $this->data = $data;
    }

    public function getData() {
        return $this->data;
    }

    public function setData($data) {
        $this->data = $data;
    }

    public function getNext() {
        return $this->next;
    }

    public function setNext($next) {
        $this->next = $next;
    }
}
```



## Running Tests

Change into directory and run `phpunit.phar linked_list_test.php`.
