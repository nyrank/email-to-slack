# email-to-slack

An AWS Lambda function for processing SES emails and posting the results to Slack

## Installing

... to do ...

- `npm install -g grunt-cli`
- `npm install`

### Configuring Local Environment

Create a .env file at the repository root with the following contents:

    EMAIL_TO_SLACK_WEBHOOK_PATH_ENCRYPTED="<YOUR ENCRYPTED SLACK WEBHOOK URL>"
    EMAIL_TO_SLACK_S3_BUCKET_NAME="<YOUR S3 BUCKET NAME>"

This file is ignored by git and is used to hydrate your Lambda function instance configuration settings. Since this file will be packaged in a .zip file stored on S3, it is important to encrypt sensitive content using a KMS key.

## Encrypting Slack Incoming Webhook URL with KMS

... to do ...

## Developing

... to do ...

- `grunt watch`

## Running locally

NOTE: Must have correct profile specified in the shell, as `lambda_invoke` does not respect the AWS profile configured in aws.json. This is due to a faulty assumption in the `grunt-aws-lambda` library that assumes that deploying is the only task that requires AWS context.

`grunt lambda_invoke`

## Deploying

### Configure

In `config/default.json`:

```json
{
  "slack": {
    "webhookUrl": "https://hooks.slack.com/services/SECRET_URL"
  },
  "stack": {
    "name": "your-stack-name",
    "templateFile": "cloudformation/lambda-stack.json",
    "outputsFile": "state/lambda-stack-outputs.json"
  }
}
```

### Create the cloudformation stack
`grunt create_stack`

### Obtain the stack outputs
`grunt describe_stack`

### Deploy the code to lambda
Edit the `lambda_deploy.default.arn` in `Gruntfile.js` (TODO: pull this from `state/lambda-stack-outputs.json`).
`grunt deploy`
