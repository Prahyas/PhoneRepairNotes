const express = require("express");
const path = require("path");
const { logger } = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(logger);

app.use(express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/routes"));

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

app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});
