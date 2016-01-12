var RSVP     = require('rsvp');
var AWS      = require('aws-sdk');

// reference: https://github.com/tomdale/lambda-packager/blob/master/lib/aws/cloud-formation.js
var CloudFormationPoller = function(stackID) {
  return new RSVP.Promise(function(resolve, reject) {
    var cloudFormation = new AWS.CloudFormation({cloudformation: '2010-05-15'});
    var timer = setInterval(function() {
      var params = {
        StackName: stackID
      };

      cloudFormation.describeStacks(params, function(err, data) {
        if (err) {
          clearTimer();
          reject(err);
          return;
        }

        var status = data.Stacks[0].StackStatus;
        switch(status) {
          case 'CREATE_IN_PROGRESS':
            process.stdout.write('.');
            break;
          case 'CREATE_COMPLETE':
            clearTimer();
            process.stdout.write("\nStack created");
            resolve(mapOutputs(data.Stacks[0].Outputs));
            break;
          default:
            clearTimer();
            reject(data);
        }
      });
    }, 2000);

    function clearTimer() {
      clearInterval(timer);
    }

    function mapOutputs(outputs) {
      var mapped = {};

      outputs.forEach(function(item) {
        mapped[item.OutputKey] = item.OutputValue;
      });

      return mapped;
    }

  });
};

module.exports = CloudFormationPoller;
