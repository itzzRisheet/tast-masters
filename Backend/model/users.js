import mongoose, { mongo } from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  contact: {
    type: Number,
  },
  username: {
    type: String,
  },
  name: {
    type: String,
    default: "",
  },
  profile: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("users", userSchema);
