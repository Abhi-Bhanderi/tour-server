import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required."],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required."],
    },
    email: {
      type: String,
      required: [true, "User Email is Required."],
    },
    message: {
      type: String,
      required: [true, "message is Required."],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", ContactSchema);
