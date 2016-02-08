# email-to-slack

An AWS Lambda function for processing SES emails and posting the results to Slack

## Installing

... to do ...

- `npm install -g grunt-cli`
- `npm install`

## Use linked `grunt-aws-cloudformation`

    npm link grunt-aws-cloudformation

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
    "webhookUrl": "https://hooks.slack.com/services/SECRET_URL",
    "channel": "#notifications",
    "username": "mailbot",
    "icon_emoji": ":mailbox:"
  },
  "stack": {
    "stackName": "your-stack-name",
    "stackBodyFile": "cloudformation/lambda-stack.json",
    "outputsFile": "state/lambda-stack-outputs.json"
  }
}
```

### Create the cloudformation stack
`grunt provision_stack`

### Deploy the code to lambda
`grunt deploy_function`
