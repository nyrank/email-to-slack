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

## Deploying

Hacky, manual approach for zipping code, uploading to S3, and refreshing Lambda function.

- `EMAIL_TO_SLACK_S3_BUCKET_NAME="email-to-slack" ; EMAIL_TO_SLACK_TIMESTAMP=$(date +"%Y-%m-%d-%H-%M-%S") ; EMAIL_TO_SLACK_ZIP="email-to-slack_$EMAIL_TO_SLACK_TIMESTAMP.zip" ; zip -r "$EMAIL_TO_SLACK_ZIP" . ; aws s3 cp "$EMAIL_TO_SLACK_ZIP" "s3://$EMAIL_TO_SLACK_S3_BUCKET_NAME" ; rm "$EMAIL_TO_SLACK_ZIP"`
- Navigate to Lambda function in AWS web console, choose 'Upload a .ZIP from Amazon S3', and select the latest zip we just uploaded.
