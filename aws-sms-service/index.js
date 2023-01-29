//@ts-check
require("dotenv").config();
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

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
const phoneNumber = process.env.PHONE_NUMBER;
console.log(opts);
console.log(phoneNumber);

const sns = new SNSClient(opts);

async function main() {
  const resp = await sns.send(
    new PublishCommand({
      Message: "hello from node 2",
      PhoneNumber: phoneNumber,
    })
  );
  console.log(resp);
}
main().catch((err) => {
  console.log(err);
  //@ts-expect-error
  process.exit(1);
});
