---
title: Intro To Elasticsearch
date: "2019-06-08"
description: A look at ElasticSearch and setting up a multi-node cluster using Docker compose and create a JavaScript client for insertions.
---

# Intro to ElasticSearch

## Why ElasticSearch?

- Open-source
- Boardly distributable
- Readily scalable
- Enterprise-grade
- Multi-tenancy (can separate user documents)

ElasticSearch is Java-based and designed to operate in real-time. ElasticSearch has the capability to search and index document files in a variety of formats.

ElasticSearch achieves incredible performance as it searches for indexes instead of text directly. A comparison of this can be made to searching keywords.

A typical setup with extend search capabilities through the use of APIs and query DSLs and there are a bunch of ready-to-go clients.

## Pulling ElasticSearch with Docker

To install version 6.7.1 of ElasticSearch:

```shell
> docker pull docker.elastic.co/elasticsearch/elasticsearch:6.7.1
```

To then start the image for development or testing:

```shell
> docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.7.1
```

If you want to start a cluster with two ElasticSearch nodes, use the `docker-compose.yml` file [given from the main website](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-prod-cluster-composefile) - also copied below:

```yaml
version: "2.2"
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:6.7.1
    container_name: elasticsearch
    environment:
      - cluster.name=docker-cluster
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - esdata1:/usr/share/elasticsearch/data
    ports:
      - 9200:9200
    networks:
      - esnet
  elasticsearch2:
    image: docker.elastic.co/elasticsearch/elasticsearch:6.7.1
    container_name: elasticsearch2
    environment:
      - cluster.name=docker-cluster
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - "discovery.zen.ping.unicast.hosts=elasticsearch"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - esdata2:/usr/share/elasticsearch/data
    networks:
      - esnet

volumes:
  esdata1:
    driver: local
  esdata2:
    driver: local

networks: esnet:
```

Run `docker-compose up` to run the cluster and `docker-compose down` to tear down. Use `docker-compose down -v` to also destroy the data volumes, otherwise the cluster data volumes persist.

## Testing cluster health

Simply run `curl http://127.0.0.1:9200/_cat/health`

## Interacting with the ElasticSearch Cluster

In this case, we will use the `NodeJS` client to run a few commands to interact with the local cluster.

The official repo for this client [can be found here](https://github.com/elastic/elasticsearch-js).

## Setting up the client

```shell
> mkdir hello-elasticsearch
> cd hello-elasticsearch
> yarn init -y
> yarn add @elastic/elasticsearch@7
```

## Basic doc creation

```javascript
const { Client } = require("@elastic/elasticsearch")
const client = new Client({ node: "http://localhost:9200" })

// promise API
const result = await client.create({
  index: "my-index",
  body: { foo: "bar" },
})

// callback API
client.create(
  {
    index: "my-index",
    body: { foo: "bar" },
  },
  (err, result) => {
    if (err) console.log(err)
  }
)
```

## Basic search

```javascript
const { Client } = require("@elastic/elasticsearch")
const client = new Client({ node: "http://localhost:9200" })

// promise API
const result = await client.search({
  index: "my-index",
  body: { foo: "bar" },
})

// callback API
client.search(
  {
    index: "my-index",
    body: { foo: "bar" },
  },
  (err, result) => {
    if (err) console.log(err)
  }
)
```

For more examples using `CURL` and the options available, TutorialsPoint have a basic intro for more info [found here](https://www.tutorialspoint.com/elasticsearch/elasticsearch_index_apis.htm)
