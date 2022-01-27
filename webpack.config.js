const path = require("path");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "index.bundle.js",
    path: path.resolve(__dirname, "./static/js"),
  },
};
