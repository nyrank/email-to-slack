/* jshint node:true */
/* global require */
var url = require('url');
var https = require('https');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var slackWebhookProtocol = 'https:';
var slackWebhookPath;
var slackWebhookPathKmsEncrypted = 'CiDfe7hu0Jq2ZqXaT7aenoRus8BwDlZQ+AL/Q09tR9ez4BLSAQEBAgB433u4btCatmal2k+2np6EbrPAcA5WUPgC/0NPbUfXs+AAAACpMIGmBgkqhkiG9w0BBwaggZgwgZUCAQAwgY8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMIf6eThC9EHLTkVfqAgEQgGIKfe8YYSkBUIep5j+mRPiG8U0764cxwGB3nktDpAihHPcV/qrrpsShQ2QYeA8uwYTeYF0jNrzh6EC4RceQxQc//ozq3glJhqeLKMhhK3h6eDE/+Sf4qhXVBC++XI+oKU7gXA==';

var encryptedBuf = new Buffer(slackWebhookPathKmsEncrypted, 'base64');
var cipherText = { CiphertextBlob: encryptedBuf };

var slackRequestOptions;

var postSlackMessage = function(context, message) {
  var req = https.request(slackRequestOptions, function(res) {
    if (res.statusCode === 200) {
      context.done();
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

var bucketName = 'email-to-slack';

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
        }, function(err, data) {
          if (err) {
            console.log(err, err.stack);
            context.fail();
          } else {
            console.log('Raw email:\n' + data.Body);
            var rawEmailUrl = 'http://' + bucketName + '.s3.amazonaws.com/' + sesNotification.mail.messageId;
            var message = 'Raw email: ' + rawEmailUrl;

            postSlackMessage(context, message);
          }
        });
    }
  });

};