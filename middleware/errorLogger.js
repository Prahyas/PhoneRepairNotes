const { logEvents } = require("./logger");

//middleware
const errorLogger = (err, req, res, next) => {
  logEvents(
    `${err.name}\t${err.message}\t${req.method}\t${req.url}`,
    "errorLogDetails.log"
  );
  next();
};

module.exports = errorLogger;
