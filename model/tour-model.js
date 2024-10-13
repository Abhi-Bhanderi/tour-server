import mongoose from "mongoose";
import slugify from "slugify";

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title must be Provided"],
      unique: [
        true,
        "there is already tour with this title. title needs to be unique",
      ],
    },
    description: {
      type: String,
      required: [true, "description must be Provided"],
    },
    slug: String,
    role: {
      type: String,
      required: true,
      enum: ["Member", "Admin"],
      default: "Member",
    },

    location: {
      type: String,
      required: [true, "location must be Provided"],
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    startDate: Date,
  },
  { timestamps: true }
);

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

export default mongoose.model("Tour", tourSchema);
