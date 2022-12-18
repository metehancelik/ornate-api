const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.config.env" });

// handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.stack);
  process.exit(1);
});

// connect db
const DB = process.env.DATABASE_LOCAL;
mongoose.connect(DB).then(() => console.log("DB connection successful!"));

// set up the express server
const app = require("./app");
const { PORT = 8000 } = require("./config");
const server = app.listen(PORT, () => {
  console.log(`Server is awake on port ${PORT}:${process.env.NODE_ENV}`);
});

// handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.stack);
  mongoose.connection.close();
  server.close(() => {
    process.exit(1);
  });
});

// ensure graceful shutdown in case sigterm received
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  mongoose.connection.close();
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
