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

// handles cors policy
app.use(cors(corsOptions));

app.use(cookieParser());

// Enables JSON request body parsing
app.use(express.json());

// to respond static files
app.use(express.static(path.join(__dirname, "/public")));
app.use("/", require("./routes/rootRoutes"));

// handles all the routes
app.use("/users", require("./routes/userRoutes"));

// handles unknown routes
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

//starts the server after database connection is successful
mongoose.connection.once("open", () => {
  console.log("Database connected!!!");
  app.listen(process.env.PORT, () => {
    console.log(`Server start on port ${process.env.PORT}`);
  });
});

// logs any error when database fails to connect
mongoose.connection.on("error", (error) => {
  console.log(error);
  logEvents(`Code no:${error.code}\t ${error.codeName}`, "dbErrorDetails.log");
});
