import mongoose from "mongoose";

const bookTourSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email must be Provided"],
    },

    name: {
      type: String,
      required: [true, "Name of must be Provided"],
    },

    numberOfTickets: {
      type: String,
      required: [true, "numberOfTickets must be Provided"],
    },

    pricePerTicket: {
      type: Number,
      required: [true, "pricePerTicket must be Provided"],
    },

    totalPayment: {
      type: Number,
      required: [true, "totalPayment must be Provided"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("BookTour", bookTourSchema);
