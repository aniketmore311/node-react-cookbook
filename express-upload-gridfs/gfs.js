//@ts-check
const mongodb = require("mongodb");
const { client } = require("./client");

/**
 *
 * @param {import("stream").Readable} stream
 * @param {string} filename
 */
async function storeFile(stream, filename) {
  return new Promise((resolve, reject) => {
    const db = client.db("files");
    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "uploads_bucket",
    });
    stream
      .pipe(bucket.openUploadStream(filename))
      .on("error", (err) => {
        reject(err);
      })
      .on("finish", () => {
        resolve(true);
      });
  });
}

/**
 * @param {string} filename
 * @returns {import('mongodb').GridFSBucketReadStream}
 */
function getFile(filename) {
  const db = client.db("files");
  const bucket = new mongodb.GridFSBucket(db, {
    bucketName: "uploads_bucket",
  });
  return bucket.openDownloadStreamByName(filename);
}

module.exports = {
  storeFile,
  getFile,
};
