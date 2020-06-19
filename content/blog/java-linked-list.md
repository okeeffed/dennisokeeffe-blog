---
title: Java Linked List
date: "2019-4-5"
description: Java implementation of a basic unidirectional Linked List.
---

# Linked Lists in Java

Basic unidirectional linked list in Java.

## Gradle setup

In `gradle.build`:

```java
apply plugin: "java"
apply plugin: "eclipse"
apply plugin: "idea"

repositories {
    mavenCentral()
}

dependencies {
    testCompile "junit:junit:4.12"
}
test {
    testLogging {
        exceptionFormat = 'full'
        events = ["passed", "failed", "skipped"]
    }
}
```

## Writing the tests

In `src/test/jav/LinkedListTest.java`:

```java
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import main.java.Node;

public class LinkedListTest {
    @Test
    public void testGetFirst() {
        Node n1 = new Node(2);
        LinkedList ll = new LinkedList(n1);
        assertEquals(ll.getFirst(), n1);
        assertEquals(Double.valueOf(ll.getSize()), Double.valueOf(1));
    }

    @Test
    public void testInsertFirst() {
        Node n1 = new Node(2);
        Node n2 = new Node(3);
        LinkedList ll = new LinkedList(n1);
        ll.insertFirst(n2);
        assertEquals(ll.getFirst(), n2);
        assertEquals(Double.valueOf(ll.getSize()), Double.valueOf(2));
    }

    @Test
    public void testRemoveFirst() {
        Node n1 = new Node(2);
        Node n2 = new Node(3);
        LinkedList ll = new LinkedList(n1);
        ll.insertFirst(n2);
        ll.removeFirst();
        assertEquals(ll.getFirst(), n1);
        assertEquals(Double.valueOf(ll.getSize()), Double.valueOf(1));
    }

    @Test
    public void testClearList() {
        Node n1 = new Node(2);
        Node n2 = new Node(3);
        LinkedList ll = new LinkedList(n1);
        ll.insertFirst(n2);
        ll.clear();
        assertEquals(ll.getFirst(), null);
        assertEquals(Double.valueOf(ll.getSize()), Double.valueOf(0));
    }

    @Test
    public void testInsertLast() {
        Node n1 = new Node(2);
        Node n2 = new Node(3);
        Node n3 = new Node(10);
        LinkedList ll = new LinkedList(n1);
        ll.insertFirst(n2);
        ll.insertLast(n3);
        assertEquals(ll.getLast(), n3);
        assertEquals(Double.valueOf(ll.getSize()), Double.valueOf(3));
        assertEquals(Double.valueOf(ll.getLast().getData()), Double.valueOf(10));
    }

    @Test
    public void testRemoveLast() {
        Node n1 = new Node(2);
        Node n2 = new Node(3);
        Node n3 = new Node(10);
        LinkedList ll = new LinkedList(n1);
        ll.insertFirst(n2);
        ll.insertLast(n3);
        assertEquals(ll.getLast(), n3);
        assertEquals(Double.valueOf(ll.getSize()), Double.valueOf(3));
        ll.removeLast();
        assertEquals(ll.getLast(), n1);
        assertEquals(Double.valueOf(ll.getSize()), Double.valueOf(2));
    }

    @Test
    public void testGetAt() {
        Node n1 = new Node(2);
        Node n2 = new Node(3);
        Node n3 = new Node(10);
        Node n4 = new Node(12);
        LinkedList ll = new LinkedList(n1);
        ll.insertLast(n2);
        ll.insertLast(n3);
        ll.insertLast(n4);
        assertEquals(Double.valueOf(ll.getSize()), Double.valueOf(4));
        assertEquals(ll.getAt(2), n3);
    }

    @Test
    public void testInsertAt() {
        Node n1 = new Node(2);
        Node n2 = new Node(3);
        Node n3 = new Node(10);
        Node n4 = new Node(12);
        LinkedList ll = new LinkedList(n1);
        ll.insertFirst(n2);
        ll.insertLast(n3);
        assertEquals(Double.valueOf(ll.getSize()), Double.valueOf(3));
        ll.insertAt(2, n4);
        assertEquals(Double.valueOf(ll.getSize()), Double.valueOf(4));
        assertEquals(ll.getAt(2), n4);
    }
}
```

## Implementing the Linked List

### Writing the Node class

In `src/main/java/Node.java`:

```java
package main.java;

public class Node {
    private Integer data;
    private Node next;

    public Node(Integer data) {
        this.data = data;
        this.next = null;
    }

    public Node(Integer data, Node next) {
        this.data = data;
        this.next = next;
    }

    public void setNext(Node next) {
        this.next = next;
    }

    public Node getNext() {
        return this.next;
    }

    public void setData(Integer data) {
        this.data = data;
    }

    public Integer getData() {
        return this.data;
    }
}
```

### Writing the Linked List class

In `src/main/java/LinkedList.java`:

```java
import main.java.Node;

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

class LinkedList {
    Integer size;
    Node head;

    public LinkedList() {
        this.size = 0;
        this.head = null;
    }

    public LinkedList(Node head) {
        this.size = 1;
        this.head = head;
    }

    public Integer getSize() {
        return this.size;
    }

    public Node getFirst() {
        return this.head;
    }

    public void insertFirst(Node n) {
        if (this.head != null) {
            Node tmp = this.head;
            this.head = n;
            n.setNext(tmp);
        } else {
            this.head = n;
        }

        this.size++;
    }

    public Node getLast() {
        if (this.head == null) {
            throw new NullPointerException("No items in the list");
        }

        Node n = this.head;
        while (n.getNext() != null) {
            n = n.getNext();
        }

        return n;
    }

    public void removeFirst() {
        if (this.head == null) {
            return;
        } else if (this.head != null && this.head.getNext() == null) {
            this.head = null;
            this.size--;
        } else {
            this.head = this.head.getNext();
            this.size--;
        }
    }

    public void clear() {
        this.head = null;
        this.size = 0;
    }

    public void insertLast(Node n) {
        Node traversal = this.head;

        while (traversal.getNext() != null) {
            traversal = traversal.getNext();
        }

        traversal.setNext(n);
        this.size++;
    }

    public void removeLast() {
        if (this.head == null) {
            return;
        } else if (this.head.getNext() == null) {
            this.head = null;
            this.size--;
            return;
        }

        Node n = this.head;
        while (n.getNext().getNext() != null) {
            n = n.getNext();
        }

        n.setNext(null);
        this.size--;
    }

    public void insertAt(Integer i, Node n) {
        if (i == 0) {
            if (this.head != null) {
                Node tmp = this.head;
                this.head = n;
                n.setNext(tmp);
                this.size++;
                return;
            } else {
                this.head = n;
                this.size++;
                return;
            }
        }

        Integer count = 0;
        Node trav = this.head;

        while (count != i - 1) {
            if (trav.getNext() == null) {
                throw new NullPointerException("List out of bounds");
            }

            trav = trav.getNext();
            count++;
        }

        if (trav.getNext() != null) {
            Node tmp = trav.getNext();
            trav.setNext(n);
            n.setNext(tmp);
        } else {
            trav.setNext(n);
        }

        this.size++;
    }

    public Node getAt(Integer i) {
        if (this.head == null) {
            throw new NullPointerException("No items in list");
        }

        if (i == 0) {
            return this.head;
        }

        Node n = this.head;
        Integer count = 0;

        while (count != i) {
            if (n.getNext() == null) {
                throw new NullPointerException("No items left in list");
            }

            n = n.getNext();
            count++;
        }
        return n;
    }
}
```
