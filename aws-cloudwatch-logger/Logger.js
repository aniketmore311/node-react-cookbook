//@ts-check
const {
  CloudWatchLogsClient,
  PutLogEventsCommand,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
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
    this.logGroupCreated = false;
    this.logStreamCreated = false;
  }

  /**
   * @param {string} logGroupName
   * @param {string} logStreamName
   */
  async createLogStream(logGroupName, logStreamName) {
    try {
      const command = new CreateLogStreamCommand({
        logGroupName: logGroupName,
        logStreamName: logStreamName,
      });
      await this.cloudWatchLogsClient.send(command);
      this.logStreamCreated = true;
    } catch (err) {
      if (err.name === "ResourceAlreadyExistsException") {
        this.logStreamCreated = true;
      } else {
        throw err;
      }
    }
  }

  /**
   * @param {string} logGroupName
   */
  async createLogGroup(logGroupName) {
    try {
      const command = new CreateLogGroupCommand({
        logGroupName: logGroupName,
      });
      await this.cloudWatchLogsClient.send(command);
      this.logGroupCreated = true;
    } catch (err) {
      if (err.name === "ResourceAlreadyExistsException") {
        this.logGroupCreated = true;
      } else {
        throw err;
      }
    }
  }

  /**
   * @param {string} message
   */
  async log(message) {
    if (!this.logGroupCreated) {
      await this.createLogGroup(this.logGroupName);
    }
    if (!this.logStreamCreated) {
      await this.createLogStream(this.logGroupName, this.logStreamName);
    }
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
