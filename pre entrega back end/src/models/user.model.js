import mongoose from "mongoose";

const { schema } = mongoose;

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: Number, required: true },
  role: { type: String, default: "user" },
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
