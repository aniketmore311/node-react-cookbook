//@ts-check
const fs = require("fs");

const badwords = fs.readFileSync("bad_words.txt", "utf-8").split("\r\n");

const badwordsSet = new Set(badwords);

/**
 *
 * @param {string} sentence
 * @returns {boolean}
 *
 */
function hasBadWords(sentence) {
  const words = sentence.split(" ");
  for (const word of words) {
    if (badwordsSet.has(word)) {
      return true;
    }
  }
  return false;
}

function main() {
  const sentences = [
    "this is good",
    "this is a bad sentence",
    "you bitch shut the fuck up",
    "asshole",
    "this is normal sentence",
  ];
  for (const sentence of sentences) {
    const result = hasBadWords(sentence);
    console.log(sentence + ": " + result);
  }
}
main();
