const express = require("express");
const path = require("path");
const { logger } = require("./middlewares/logging.js");
const { errorHandler } = require("./middlewares/errorHandling.js");
const recipesRouter = require("./routes/recipesRouter.js");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/recipes", recipesRouter);

app.get("/sanity", (req, res) => {
  res.send("Server is running");
});

app.use(errorHandler);

const port = 3000;
app.listen(port, function () {
  console.log(`Server running on ${port}`);
});
