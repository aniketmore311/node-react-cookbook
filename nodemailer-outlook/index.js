//@ts-check
require("dotenv").config();
const nodemailer = require("nodemailer");

/**
 * @param {string} key
 * @returns {string}
 */
function getEnv(key) {
  const val = process.env[key];
  if (!val) {
    throw new Error(`${key} env var not found`);
  }
  return val;
}

const OUTLOOK_EMAIL = getEnv("OUTLOOK_EMAIL");
const OUTLOOK_PASSWORD = getEnv("OUTLOOK_PASSWORD");
const SEND_TO_EMAIL = getEnv("SEND_TO_EMAIL");

async function sendEmail({ fromEmail, to, subject, text, html }) {
  const from = `project name <${fromEmail}>`;
  return transport.sendMail({ from, to, subject, text, html });
}

const transport = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: OUTLOOK_EMAIL,
    pass: OUTLOOK_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

module.exports = transport;

async function main() {
  const resp = await sendEmail({
    fromEmail: OUTLOOK_EMAIL,
    to: SEND_TO_EMAIL,
    html: "<h1>hello from nodemailer</h1>",
    text: "hello from nodemailer",
    subject: "test subject",
  });
  console.log(resp);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
