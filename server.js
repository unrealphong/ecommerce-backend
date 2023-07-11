require("dotenv").config({
  path: process.env.NODE_ENV === "development" ? ".env.dev" : ".env",
});

const app = require("./src/app");

const PORT = process.env.PORT || 3333;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce start with ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log(`Exit Server Express`);
  });
});
