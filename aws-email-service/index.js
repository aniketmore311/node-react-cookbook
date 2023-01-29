//@ts-check
require("dotenv").config();
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const opts = {
  credentials: {
    //@ts-expect-error
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //@ts-expect-error
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  //@ts-expect-error
  region: process.env.AWS_DEFAULT_REGION,
};
//@ts-expect-error
const sendTo = process.env.SEND_TO;
//@ts-expect-error
const sendFrom = process.env.SEND_FROM;
console.log(opts);
console.log({
  sendFrom,
  sendTo,
});

const client = new SESClient(opts);

async function main() {
  const resp = await client.send(
    new SendEmailCommand({
      Destination: {
        ToAddresses: [sendTo],
      },
      Message: {
        Body: {
          Text: {
            Data: "hello from node",
          },
          Html: {
            Data: "<h1>hello from node</h1>",
          },
        },
        Subject: {
          Data: "this is test subject",
        },
      },
      Source: sendFrom,
    })
  );
  console.log(resp);
}
main().catch((err) => {
  console.log(err);
  //@ts-expect-error
  process.exit(1);
});
