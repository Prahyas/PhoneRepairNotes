const path = require("path");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = async (message, fileName) => {
  const date = new Date();
  const logItem = `${date}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", `${fileName}`),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

//middleware
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\n`, `logDetails.log`);
  next();
};

module.exports = {
  logEvents,
  logger,
};
