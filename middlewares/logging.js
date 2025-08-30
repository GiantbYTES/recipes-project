function logger(req, res, next) {
  console.log(
    `Console: ${new Date().toISOString()} - ${req.method} ${req.url}`
  );
  next();
}

module.exports = { logger };
