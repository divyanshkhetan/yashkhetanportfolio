import mongoose from "mongoose";
let { Schema } = mongoose;

let user = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

let User;
try {
  User = mongoose.model("User");
} catch (err) {
  User = mongoose.model("User", user);
}

module.exports = User;