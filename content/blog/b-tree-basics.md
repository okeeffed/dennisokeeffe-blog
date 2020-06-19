---
title: B Tree Basics
date: "2019-4-19"
description: A short look into B-Tree structures, what defines them and some technologies that use them.
---

# B-Tree Basics

## What is it?

A self-balancing tree that is a generalisation of a `binary search tree` in that it can have more than two child nodes.

It maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time.

A B-Tree is great to use for read and write operations dealing with large amounts of data and as such is used readily with databases and file systems and normally outside of main memory.

The height of a B-Tree is kept low by keeping the maximum possible number of keys in a node of the tree.

## Properties of B-Trees

1. All leaves are at the same levels
2. B-Tree has minimum degree `t`
3. Every node bar root must contain `t-1` keys
4. Root key contains minimum `1` key
5. Children of a node equals number of keys + 1
6. All nodes must contain at most `t2 - 1` keys
7. All keys are sorted in increasing order - the child between `k1` and `k2` must contain all keys between those values
8. B-Trees grow and shrink from the root
9. Time complexity for search, insert and delete is `O(log(N))`

## Usage

B-Trees in practice are used by technologies such as `MySQL`, `PostgreSQL`, `MongoDB` and more.

Alternative database options with a different data structure include `LSM-Trees` for log structured append-only storage and is used by alternative technologies such as `Cassandra`, `RocksDB`, `LevelDB`, but that's another topic.
