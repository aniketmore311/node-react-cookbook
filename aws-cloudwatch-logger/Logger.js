//@ts-check
const {
  CloudWatchLogsClient,
  PutLogEventsCommand,
} = require("@aws-sdk/client-cloudwatch-logs");
const { fromEnv } = require("@aws-sdk/credential-providers");

class Logger {
  /**
   * @param {string} logGroupName
   * @param {string} logStreamName
   */
  constructor(logGroupName, logStreamName) {
    const regionKey = "AWS_DEFAULT_REGION";
    const region = process.env[regionKey];
    if (!region) {
      throw new Error(`env variable ${regionKey} not found`);
    }
    this.cloudWatchLogsClient = new CloudWatchLogsClient({
      region: region,
      credentials: fromEnv(),
    });
    this.logGroupName = logGroupName;
    this.logStreamName = logStreamName;
  }

  /**
   * @param {string} message
   */
  async log(message) {
    const timestamp = new Date().getTime();

    const logEvent = {
      message: message,
      timestamp: timestamp,
    };

    const params = {
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
      logEvents: [logEvent],
    };

    const command = new PutLogEventsCommand(params);

    try {
      const response = await this.cloudWatchLogsClient.send(command);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  Logger,
};
