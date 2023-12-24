const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { logger, logEvents } = require("./middleware/logger");
const errorLogger = require("./middleware/errorLogger");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/connectDB");

const app = express();

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json()); // Enable JSON request body parsing

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/rootRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "public", "404Error.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.send("404 Not Found");
  }
});

app.use(errorLogger);

mongoose.connection.once("open", () => {
  console.log("Database connected!!!");
  app.listen(process.env.PORT, () => {
    console.log(`Server start on port ${process.env.PORT}`);
  });
});

mongoose.connection.on("error", (error) => {
  console.log(error);
  logEvents(`Code no:${error.code}\t ${error.codeName}`, "dbErrorDetails.log");
});
