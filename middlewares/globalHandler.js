const globalErrHandler = (err, req, res, next) => {
  //status: failed/something/server error
  //message
  //stack

  const stack = err.stack;
  const message = err.message;
  //   const status = err.stack ? err.status : "failed";
  const status = "failed";
  const statusCode = err.statusCode ? err.statusCode : 500;

  //send response
  res.status(statusCode).json({
    message,
    status,
    stack,
  });
};

module.exports = globalErrHandler;
