var url      = require('url');
var https    = require('https');
var config   = require('config');
var jsonfile = require('jsonfile');
var AWS      = require('aws-sdk');
var s3       = new AWS.S3();

var slackRequestOptions;

var postSlackMessage = function(context, message) {
  var req = https.request(slackRequestOptions, function(res) {
    if (res.statusCode === 200) {
      context.succeed('posted to Slack');
    } else {
      context.fail('slack status code: ' + res.statusCode);
    }
  });

  req.on('error', function(e) {
    console.log('slack problem with request: ' + e.message);
    context.fail(e.message);
  });

  var params = {
    attachments: [{
      fallback: message,
      pretext: message,
      color: '#D00000'
    }]
  };
  req.write(JSON.stringify(params));
  req.end();
};

var bucketName = jsonfile.readFileSync(config.get('stack.outputs'))['S3Bucket'];

exports.handler = function(event, context) {
  console.log('context: ', context);
  console.log('event: ', event);
  console.log('Process email');
  var sesNotification = event.Records[0].ses;
  console.log('SES Notification:\n', JSON.stringify(sesNotification, null, 2));

  var slackWebhookUrl = config.get('slack.webhookUrl');
  slackRequestOptions = url.parse(slackWebhookUrl);
  slackRequestOptions.method = 'POST';
  slackRequestOptions.headers = {
    'Content-Type': 'application/json'
  };

  s3.getObject({Bucket: bucketName, Key: sesNotification.mail.messageId }, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      context.fail();
    } else {
      var rawEmailUrl = 'https://' + bucketName + '.s3.amazonaws.com/' + sesNotification.mail.messageId;
      var message = 'The newer raw email: ' + rawEmailUrl;
      postSlackMessage(context, message);
    }
  });

};
