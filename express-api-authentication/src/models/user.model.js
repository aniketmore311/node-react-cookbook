//@ts-check
const { Schema, default: mongoose } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: Schema.Types.String,
      unique: true,
      required: true
    },
    password: {
      type: Schema.Types.String,
      required: true
    },
    role: {
      type: Schema.Types.String,
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
