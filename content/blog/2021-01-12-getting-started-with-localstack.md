---
title: Local AWS development with LocalStack
description: Learn how to setup LocalStack to help with local development emulating AWS products
date: "2021-01-12"
tags: aws,dynamodb,s3,beginner
---

LocalStack provides an easy-to-use test/mocking framework for developing Cloud applications. In today's post, we're going to have a quick look at setting up LocalStack locally to work with their free tier AWS emulated products.

In particular, today's post will have a quick look at emulating S3 buckets for local development.

<Ad />

## Prerequisites

Before getting started, it is required that you have the following on your machine:

- Python (both Python 2.x and 3.x supported)
- pip (python package manager)
- Docker
- AWS CLI (for interacting with LocalStack after installation)

<Ad />

## Installing LocalStack

Following the instructions on their [README](https://github.com/localstack/localstack#installing), we can use `pip` to install the package.

```s
# if you are using pip
pip install localstack
# or if using pip3
pip3 install localstack
```

In my case, I installed using `pip3`.

<Ad />

## Running LocalStack

Once installed, we can get everything up by running `localstack start`. You will get feedback in the terminal that a number of services are started and finally get the service list with the ports they are running on. By default, these services will start on port 4566. Easy peasy!

<Ad />

## Creating our first S3 bucket with LocalStack

Now that things are running, we can run some basic tests using the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html). I am not going to go into the installation process for the CLI, so follow the link above and use those installation instructions if you have not yet installed the CLI.

We will use the `aws s3api [command] --endpoint-url http://localhost:4566` pattern to interact and use the local endpoint to list and create buckets.

To show what we currently have, we can run `aws s3api list-buckets --endpoint-url http://localhost:4566` and we will get something like the following:

```json
{
  "Buckets": [],
  "Owner": {
    "DisplayName": "webfile",
    "ID": "<some-id>"
  }
}
```

This proves that we currently have no buckets in our LocalStack setup.

We can create a bucket `my-bucket` by running `aws s3api create-bucket --bucket my-bucket --endpoint-url http://localhost:4566`.

To confirm it has been made, we can run `aws s3api list-buckets --endpoint-url http://localhost:4566` once again:

```json
{
  "Buckets": [
    {
      "Name": "my-bucket",
      "CreationDate": "2021-01-12T05:46:28+00:00"
    }
  ],
  "Owner": {
    "DisplayName": "webfile",
    "ID": "bcaf1ffd86f41161ca5fb16fd081034f"
  }
}
```

Success!

<Ad />

## Adding and removing objects locally

Create a new `temp.txt` and add some content. In my case, I added `Hello, world!`.

Once this is done, we can put the file `temp.txt` into bucket `my-bucket` by running `aws s3api put-object --bucket my-bucket --key temp.txt --body temp.txt --endpoint-url http://localhost:4566`. You will have an object returned with an `ETag` value if successful.

To confirm our object is now in the bucket, run `aws s3api list-objects-v2 --bucket my-bucket --endpoint-url http://localhost:4566`.

```json
{
  "Contents": [
    {
      "Key": "temp.txt",
      "LastModified": "2021-01-12T05:51:38+00:00",
      "ETag": "\"746308829575e17c3331bbcb00c0898b\"",
      "Size": 14,
      "StorageClass": "STANDARD"
    }
  ]
}
```

If we remove our `temp.txt` file locally using `rm temp.txt`, we can retrieve the bucket version by running `aws s3api get-object --bucket my-bucket --key temp.txt --endpoint-url http://localhost:4566 temp2.txt`.

```json
{
  "AcceptRanges": "bytes",
  "LastModified": "2021-01-12T05:51:38+00:00",
  "ContentLength": 14,
  "ETag": "\"746308829575e17c3331bbcb00c0898b\"",
  "CacheControl": "no-cache",
  "ContentEncoding": "identity",
  "ContentLanguage": "en-US",
  "ContentType": "binary/octet-stream",
  "Metadata": {}
}
```

Once successful, you can run `cat temp2.txt` to see that we installed the bucket's `temp.txt` file into `temp2.txt` locally.

Now that we have proven how to develop and test the S3 service locally, we can terminate our `localstack` instance in the terminal to tear down the local infrastructure.

<Ad />

## Conclusion

In summary, we installed LocalStack to our local machine and explored one of the free-tier services in S3.

I am working locally with interacting with some AWS services through some language APIs, and the capability to do so locally with LocalStack has been a real time saver for putting together some infrastructure solutions for my personal projects.

I highly recommend giving it a go for your own infrastructure development. There may be some issues that I am yet to run into, but as far as a lightweight approach to quickly interacting with files locally and not expending costs, it has been great for introductions into some of the AWS products.

<Ad />

## Resources and further reading

1. [LocalStack - GitHub](https://github.com/localstack/localstack)
2. [AWS CLI - Install](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)

_Image credit: [REVOLT](https://unsplash.com/@revolt)_