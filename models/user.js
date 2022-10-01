const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    requied: [true, "Username Cannot be blank"],
  },
  password: {
    type: String,
    requied: [true, "Password Cannot be blank"],
  },
});
module.exports = mongoose.model("User", userSchema);
