//@ts-check
require('dotenv').config()
const { detectSentiment } = require('./sentiment.service')


async function main(){
    const sentences = [
        "this is good",
        "this is bad",
        "this is average",
        "this is neutral"
    ]
    for(const sentence of sentences){
        const sentiment = await detectSentiment(sentence);
        console.log(sentence + ": " + sentiment)
    }
}
main().catch(console.log)