---
title: Creating and using AWS Secrets from the CDK and CLI
description: A quick overview of adding/retrieving secrets for AWS
date: "2020-08-15"
tags: aws,security,typescript,javascript
---

Secrets such as environment variables are a **must** when working with applications using tools such as the CDK. When generating our CloudFormation templates, the last thing you want is to have environment variables leaking through your Git history.

This short overview will create/retrieve a secret from the AWS Secrets Manager and show how you can then require it within a CDK stack.

## The secrets manager from the CLI

Ensure that you have the [aws-cli](https://aws.amazon.com/cli/) installed.

We're going to add values for `example/secretKey` and `example/secretToken`. For us to reference later in the example CDK usage.

Creating our first example two secrets:

```s
aws secretsmanager create-secret --name example/secretKey
          --description "Example Secret Key" --secret-string "super-secret-key"
aws secretsmanager create-secret --name example/secretToken
          --description "Example Secret Token" --secret-string "super-secret-token"
```

The response from each will give you an ARN value - make sure you note these down.

If you do not note it down, you can always refetch the secret using `describe-secret` from the CLI:

```s
# Example to get "example/secretKey" info back
aws secretsmanager describe-secret --secret-id example/secretKey
```

## CDK Example

Let's pretend we're going to deploy a Lambda function that requires particular environment variables.

This tutorial won't go into the depths of the AWS CDK, but just know it requires `@aws-cdk/aws-secretsmanager` to be installed for the secret manager part.

The following code can be updated with the appropriate ARNs that we explored above.

```ts
import events = require("@aws-cdk/aws-events")
import targets = require("@aws-cdk/aws-events-targets")
import lambda = require("@aws-cdk/aws-lambda")
import cdk = require("@aws-cdk/core")
import assets = require("@aws-cdk/aws-s3-assets")
import secretsManager = require("@aws-cdk/aws-secretsmanager")

/**
 * Update the LambdaAsset, functions path
 * and handler
 */
export class LambdaCronStack extends cdk.Stack {
  constructor(app: cdk.App, id: string, props: cdk.StackProps) {
    super(app, id)

    // The following JavaScript example defines an directory
    // asset which is archived as a .zip file and uploaded to
    // S3 during deployment.
    // See https://docs.aws.amazon.com/cdk/api/latest/docs/aws-s3-assets-readme.html
    const myLambdaAsset = new assets.Asset(
      // @ts-ignore - this expects Construct not cdk.Construct :thinking:
      this,
      `ExampleAssetsZip`,
      {
        path: fn.relativeFunctionPath,
      }
    )

    // This creates a lambda function that
    // sets secrets for the Lambda environment variables.
    const lambdaFn = new lambda.Function(this, `ExampleLambdaAssetFn`, {
      code: lambda.Code.fromBucket(
        // @ts-ignore
        myLambdaAsset.bucket,
        myLambdaAsset.s3ObjectKey
      ),
      timeout: cdk.Duration.seconds(300),
      runtime: lambda.Runtime.NODEJS_12_X,
      // Here is the example part
      environment: {
        EXAMPLE_SECRET_KEY: `${
          secretsManager.Secret.fromSecretAttributes(this, "ExampleSecretKey", {
            // replace with actual ARN for the secret key
            secretArn:
              "arn:aws:secretsmanager:<region>:<account-id-number>:secret:<secret-name>-<random-6-characters>",
          }).secretValue
        }`,
        EXAMPLE_SECRET_TOKEN: secretsManager.Secret.fromSecretAttributes(
          this,
          "ExampleSecretToken",
          {
            // replace with actual ARN for the secret token
            secretArn:
              "arn:aws:secretsmanager:<region>:<account-id-number>:secret:<secret-name>-<random-6-characters>",
          }
        ).secretValue,
      },
      handler: "index.handler",
    })
  }
}
```

## Resources and Further Reading

1. [AWS Secrets User Guide](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)
2. [AWS CDK Get Secret example](https://docs.aws.amazon.com/cdk/latest/guide/get_secrets_manager_value.html)
3. [AWS CDK Docs](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-secretsmanager-readme.html#create-a-new-secret-in-a-stack)
4. [AWS CLI](https://aws.amazon.com/cli/)
