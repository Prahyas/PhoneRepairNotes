const path = require("path");
const { v4: uuid } = require("uuid");
const fsPromises = require("fs").promises;

const logEvents = async (message) => {
  const date = new Date();
  const logItem = `${date}\t${uuid()}\t${message}`;

  try {
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", "logDetails.log"),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

//middleware
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}`);
  console.log(req.method, req.url);
  next();
};

module.exports = {
  logEvents,
  logger,
};
