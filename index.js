var request = require('request');
var config  = require('config');
var jsonfile = require('jsonfile');

exports.handler = function(event, context) {

  var subject;
  event.Records[0].ses.mail.headers.filter(function(obj) {
    if (obj.name === "Subject") {
      subject = obj.value;
      return;
    }
  });

  var rawEmailUrl = ['https://',
                     jsonfile.readFileSync(config.get('stack.outputsFile'))['S3Bucket'],
                     '.s3.amazonaws.com/',
                     event.Records[0].ses.mail.messageId].join('');

  var payload = {
    "text": "New message: *" + subject + "*\n" + rawEmailUrl,
    "channel": config.get("slack.channel"),
    "username": config.get("slack.username"),
    "icon_emoji": config.get("slack.icon_emoji")
  };

  var requestOptions = {
    url: config.get('slack.webhookUrl'),
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };

  request.post(requestOptions, function(error, response, body) {
    if (error) {
      console.log(err, err.stack);
      context.fail();
    } else {
      context.succeed('Completed successfully');
    }
  });

};
