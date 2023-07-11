const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const app = express();

// init middleware
app.use(morgan("dev"));
// app.use(morgan('common'))
// app.use(morgan("combined"));
// app.use(morgan("short"));
// app.use(morgan("tiny"));
app.use(helmet());
app.use(compression());
// init db

// init router
app.get("/", (_req, res) => {
  const strCompress = "Hello le hong phong";
  return res.status(200).json({
    massage: "Welcome Fanpage",
    metadata: strCompress.repeat(1000000),
  });
});
// handle error

module.exports = app;
