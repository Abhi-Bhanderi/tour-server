import mongoose from "mongoose";
//  `mongodb+srv://aidictapp:${Mongodb_Pass}@aidict.xc7thkg.mongodb.net/Data?retryWrites=true&w=majority`,
const connectDB = async (Mongodb_Pass) => {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(
      `mongodb+srv://abhibhanderi0:${Mongodb_Pass}@cluster0.jwlee.mongodb.net/data?retryWrites=true&w=majority&appName=Cluster0`
    );
    if (conn.connection._hasOpened) {
      console.log(`Database connection has been established...`);
    }
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
    console.log("Shutting down the server...");
    process.exit(1);
  }
  mongoose.connection.on("disconnected", () => {
    console.log("Database connection disconnected!");
  });
};

export default connectDB;
