//@ts-check
//calculate user similarity based on common attributes
const csv = require("csv-parser");
const fs = require("fs");

function getPercentageMatch(user1, user2, attrLists) {
  let matchSkills = 0;
  let matchInterests = 0;

  for (const skill of user1.skills) {
    if (user2.skills.includes(skill)) {
      matchSkills++;
    }
  }
  for (const interest of user1.interests) {
    if (user2.interests.includes(interest)) {
      matchInterests++;
    }
  }
  const totalSkills = Math.max(user1.skills.length, user2.skills.length);
  const totalInterests = Math.max(
    user1.interests.length,
    user2.interests.length
  );
  const percentage =
    ((matchSkills + matchInterests) * 100) / (totalSkills + totalInterests);
  return percentage;
}

function main() {
  const results = [];
  fs.createReadStream("users.csv")
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", () => {
      for (const user of results) {
        user.skills = user.skills.split("#");
        user.interests = user.interests.split("#");
      }
      console.log(results);
      for (const user of results) {
        for (const otherUser of results) {
          const matchingPercentage = getPercentageMatch(user, otherUser);
          console.log(
            user.name +
              " and " +
              otherUser.name +
              " = " +
              matchingPercentage +
              "%"
          );
        }
      }
    });
}
main();
