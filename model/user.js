const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    phone: {
      type: Number,
      required: [true, "Phone is Required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
    },
    userName: {
      type: String,
      required: [true, "UserName is Required"],
      unique: true,
    },
    photo: {
      type: String,
      required: [true, "Photo is Required"],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
