---
title: Intro To Cassandra
date: "2019-06-06"
description: A small intro into how you can get started with Cassandra using Docker and basic syntax.
---

<Ad />

## Foreword

I am currently reading `Designing Data-Driven Applications` and am about to do a mini series on some technologies I come across in the book and some of the pros/cons.

<Ad />

## What is Cassandra?

Cassandra is a LSM-tree based NoSQL database that is a good choice when there is a large amount of data and consistency is not a priority. Cassandra is fully distrubuted and boasts that there is no single point of failure. It specialises in high performance and is horizontally scalable.

Thanks to its distribution model being p2p, it can easily distribute data across multiple data centers and cloud availability zones.

A hashing mechanism known as the "partitioner" is used to take a table row's primary key, compute a numerical token for it and assign it to one of the nodes in a cluster.

According to [blog over at rackspace](https://support.rackspace.com/how-to/introduction-to-cassandra/), "While Cassandra has multiple partitioners from which to choose, the default partitioner randomizes data across a cluster and ensures an even distribution of all of the data. In addition, Cassandra automatically maintains the balance of data across a cluster even when existing nodes are removed or new nodes are added to a system."

In relation to terminology, the main point of difference when compared to an Oracle Database is that a Database/Schema is referred to in Cassandra as a `Keyspace`.

Cassandra also boasts a few important features:

1. Rich data model
2. Dynamic schema
3. Typed data
4. Data locality
5. Field updates
6. Easy for programmers

<Ad />

## Cassandra Query Language

Cassandra uses the Cassandra Query Language (CQL) which runs through the Cassandra shell (cqlsh).

<Ad />

## Other points

You can actually do a hybrid deployment of a Cassandra and Oracle Database - these usually are a testament to the company needs.

Cassandra itself, given it's lack of emphasis on consistency, offers the `AID` part of `ACID` principles.

Some of the downsides to Cassandra include its lack of aggregation functionality, lack of table joins (there requiring de-normalisation pre-insertion) and search basing only on keys and indexes.

<Ad />

## Playing around with Cassandra

This requires `Docker` to be installed on your local machine.

This intro follows the initial post at https://medium.com/@michaeljpr/five-minute-guide-getting-started-with-cassandra-on-docker-4ef69c710d84 - be sure to support them.

### Pull Images

```shell
# DataStax distro of Cassandra with additional capabilies of Search Engine, Spark Analytics and Graph Components - used for quality and simplicity
docker pull datastax/dse-server:latest

# Notebook is a dev tool for data exploration, data modelling + viz and query profiling
docker pull datastax/dse-studio:latest

# Start DataStax server with Graph Model, Search Engine and Spark Analytics flags on
docker run -e DS_LICENSE=accept --memory 4g --name my-dse -d datastax/dse-server -g -s -k

# Start Studio container and link to server
docker run -e DS_LICENSE=accept --link my-dse -p 9091:9091 --memory 1g --name my-studio -d datastax/dse-studio
```

### Additional calls that are useful

A cutdown version taken from the blog post referenced above:

```shell
========== Logs ==========
#Server Logs
$> docker logs my-dse
#System Out
$> docker exec -it my-dse cat /var/log/cassandra/system.log
#Studio Logs
$> docker logs my-studio

======= Additional =======
#Contaier IPAddress
&> docker inspect my-dse | grep IPAddress
#CQL (Requires IPAddress from above)
$> docker exec -it my-dse cqlsh [IPAddress]
#Bash
$> docker exec -it my-dse bash
```

Great! We can then run a notebook to play around with Cassandra.

<Ad />

## Cassandra Basics Calls

If you log into the `cqlsh` shell, we can start playing around.

### Creating a Keyspace

The keyspace (equivalent of a database in RDBMS) can be what holds data objects and is the level where you specify options for a data partitioning and replication strategy.

```shell
# note - use the USE command to set the keyspace if you have multiple spaces
cqlsh> create keyspace example with replication = {'class':'SimpleStrategy','replication_factor':1};
```

### Create a Table, Inserting Data, Updating Data and Querying Data

```shell
# Create table
cqlsh> create table person (personid int primary key, name_first varchar, name_last varchar);
cqlsh> insert into person (personid, name_first, name_last) values (1, 'Dennis', 'The Menace');
cqlsh> update person set name_last = 'OKeeffe' where personid = 1;
cqlsh> select * from emp;
```

### Querying columns other than the primary key

In order to do this, we need to generate an index on another column:

```shell
cqlsh> create index idx_first on person(name_first);
cqlsh> select * from emp where name_first = 'Dennis';
```

This should now give you a general intro into how Cassandra basics! The Docker images will give you a quick basis to spin up containers running Cassandra to play around with, stop and remove.
