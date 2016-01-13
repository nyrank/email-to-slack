var dotenv = require('dotenv');
dotenv.load();
var url = require('url');
var https = require('https');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var slackWebhookProtocol = 'https:';
var slackWebhookPath;
var slackWebhookPathKmsEncrypted = process.env.EMAIL_TO_SLACK_WEBHOOK_PATH_ENCRYPTED;

var encryptedBuf = new Buffer(slackWebhookPathKmsEncrypted, 'base64');
var cipherText = { CiphertextBlob: encryptedBuf };

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

var bucketName = process.env.EMAIL_TO_SLACK_S3_BUCKET_NAME;

exports.handler = function(event, context) {
  console.log('context: ', context);
  console.log('event: ', event);
  console.log('Process email');

  var sesNotification = event.Records[0].ses;
  console.log('SES Notification:\n', JSON.stringify(sesNotification, null, 2));

  var kms = new AWS.KMS();
  kms.decrypt(cipherText, function (err, data) {
    if (err) {
      context.fail(err);
      console.log('Decrypt error: ' + err);
      context.fail(err);
    } else {
      slackWebhookPath = data.Plaintext.toString('ascii');
      console.log('slackWebhookPath: ', slackWebhookPath);

      var slackWebhookUrl = slackWebhookProtocol + slackWebhookPath;
      slackRequestOptions = url.parse(slackWebhookUrl);
      slackRequestOptions.method = 'POST';
      slackRequestOptions.headers = {
        'Content-Type': 'application/json'
      };

      s3.getObject({
          Bucket: bucketName,
          Key: sesNotification.mail.messageId
        }, function(err/*, data*/) {
          if (err) {
            console.log(err, err.stack);
            context.fail();
          } else {
            var rawEmailUrl = 'http://' + bucketName + '.s3.amazonaws.com/' + sesNotification.mail.messageId;
            var message = 'The newer rawest of email: ' + rawEmailUrl;

            postSlackMessage(context, message);
          }
        });
    }
  });

};
