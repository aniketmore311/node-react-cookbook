//@ts-check
const {
  ComprehendClient,
  DetectSentimentCommand,
} = require("@aws-sdk/client-comprehend");

const config = {
  aws: {
    //@ts-expect-error
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //@ts-expect-error
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //@ts-expect-error
    defaultRegion: process.env.AWS_DEFAULT_REGION,
  },
};

const client = new ComprehendClient({
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
  region: config.aws.defaultRegion,
});

/**
 * @param {string} text
 * @returns {Promise<string>}
 */
async function detectSentiment(text) {
  const command = new DetectSentimentCommand({
    LanguageCode: "en",
    Text: text,
  });
  const resp = await client.send(command);
  const sentiment = resp.Sentiment;
  if (!sentiment) {
    throw new Error("sentiment not received");
  }
  return sentiment;
}

const sentimentService = {
  detectSentiment,
};

module.exports = sentimentService;
