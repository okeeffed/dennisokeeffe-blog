
---
title: Write Ahead Log
date: "2019-10-22"
description: TODO
---

# What is the Write Ahead Log (WAL)?

In database systems, the write ahead log is used a technique to provide the atomicity and durability of ACID principles.

The WAL is used to log any changes we wish to make to a database prior to making the actual change is made.

## How does this help?

For the case of `b-tree` databases like MySQL, PostgreSQL etc, the modification is first appended to the WAL before the change is made. This ensures that a consistent state can be restored after a crash.

In the case of `lsm-tree` databases such as Cassandra, this log itself IS the main place for storage. The log segments are compacted and garbage-collected in the background.

## How it works

The WAL is an append-only sequence of bytes containing all writes to the database.

This log itself can be copied to another node to build a replica. The WAL not only writes the log to disk but the leader also sends it across the network to its followers.

The followers then take this log and rebuild the exact same data structures that can also be found on the leader.

## Disadvantages

Everything on the WAL is described at low-level. It contains details of which bytes were change on particular disk blocks, meaning that replication itself is tightly coupled with the storage engine.

What this means in practise is that if a database changes its storage format from one version to another, it is typically not possible to run different versions of the database software on the leader and followers.

The implication here is that if the replication protocol allows a follower to use a newer version than the leader, you can perform a zero-downtime upgrade of the database software by first upgrading the followers and then performing a failover on the leader to ensure an upgraded follower is elected.

Often, the replication protocol does not allow this version mismatch and therefore requires downtime.

## Critical Performance

The WAL is required in the critical path before mutation operations since we must log prior to mutation. Because of OS caches, our data is not guaranteed to be on disk as a `write` call returns.

For example, on Linux where it generally operates in `write-back` mode, the `buffer cache` is flushed periodically. This means that a power loss could result in data lose. We need to ensure a sequential write to force data to disk. This slows down the mutation operation which in turn reduces our queries per second (QPS).

It is not uncommon with HDD to use a dedicated drive for the WAL to reduce seek time.

For the sake of examples, `LevelDB` defaults to not syncing while `Cassandra` defaults to a 10 second periodic sync.

## Decoupling the replication and storage engine

We can use a replication log known as a `logical log` to decouple the storage engine internals from the replication log. This log is decouple from the storage engine's physical data representation.

For relational databases, a logical log is usually a sequences of records describing writes to database tables at the granularity of a row.

1. For inserted row, log includes new values of all columns
2. For deleted row, log contains enough info to uniquely identify that which was deleted (generally primary key)
3. For updated row, contains enough info to uniquely identify row + all new values (or at least updated values)

A multi-row transactions includes several such log records. This is followed by a record indicating it was commited. The `MySQL` binlog uses this approach.

Given the decoupling nature of the `logical log`, it can more easily maintain backwards compatibility and allow leaders and followers to run different versions of the database software (possibly even different storage engines).

