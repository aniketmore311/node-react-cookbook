import { config } from "dotenv";
config();

import User from "./models/User";

async function main() {
  let user = await User.create({
    name: "aniket2",
    email: "aniket2@gmail.com",
  });
  console.dir(user, { depth: Infinity });
}

main().catch((err) => {
  console.log(err);
});
