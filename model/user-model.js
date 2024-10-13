import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required."],
    },
    email: {
      type: String,
      required: [true, "User Email is Required."],
      unique: [true, "Provide Different Email."],
    },
    role: {
      type: String,
      required: [true, "Role Must be provided!"],
      enum: ["Admin", "User"],
      default: "User",
    },
    password: {
      type: String,
      required: [true, "Password is Required."],
    },
    favorites: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Tour", default: [] },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
