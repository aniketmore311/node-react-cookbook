//@ts-check
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-providers");
const { config } = require("./config");

const client = new S3Client({
  credentials: fromEnv(),
  region: config.aws.region,
});

/**
 * @param {Buffer} buffer
 * @param {string} key
 */
async function putFile(buffer, key) {
  const resp = await client.send(
    new PutObjectCommand({
      Bucket: config.aws.s3.bucket,
      Key: key,
      Body: buffer,
    })
  );
  return resp;
}

/**
 * @param {string} key
 * @returns {Promise<import('stream').Readable>}
 */
async function getFile(key) {
  const resp = await client.send(
    new GetObjectCommand({
      Bucket: config.aws.s3.bucket,
      Key: key,
    })
  );
  console.log(typeof resp.Body);
  if (!resp.Body) {
    throw new Error("body not found on resp");
  }
  //@ts-expect-error
  return resp.Body;
}

/**
 * @param {string} key
 */
async function deleteFile(key) {
  const resp = await client.send(
    new DeleteObjectCommand({
      Bucket: config.aws.s3.bucket,
      Key: key,
    })
  );
  return resp;
}

const s3Service = {
  getFile,
  putFile,
  deleteFile,
};

module.exports = s3Service;
