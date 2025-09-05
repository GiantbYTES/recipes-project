const express = require("express");
require("dotenv").config();
const path = require("path");
const { logger } = require("./middlewares/logging.js");
const { errorHandler } = require("./middlewares/errorHandling.js");
const recipesRouter = require("./routes/recipesRouter.js");
const authRouter = require("./routes/authRouter.js");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/recipes", recipesRouter);
app.use("/api/auth", authRouter);

app.get("/sanity", (req, res) => {
  res.send("Server is running");
});

app.use(errorHandler);

// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log("✅ Database connection established successfully.");
//   } catch (error) {
//     console.error("❌ Unable to connect to database:", error);
//   }
// }

const port = 3000;
app.listen(port, async function () {
  console.log(`Server running on ${port}`);
  // await testConnection();
});
