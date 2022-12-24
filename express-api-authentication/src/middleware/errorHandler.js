//@ts-check
const createHttpError = require("http-errors");

function errorHandler() {
  //   eslint-disable-next-line
  return function (err, req, res, next) {
    console.log("inside");
    if (createHttpError.isHttpError(err)) {
      res.json({
        message: err.message,
        statusCode: err.statusCode,
      });
      return;
    } else {
      res.json({
        status: 500,
        message: "something went wrong",
      });
      return;
    }
  };
}

module.exports = errorHandler;
