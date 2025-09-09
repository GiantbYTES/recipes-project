const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const sequelize = new Sequelize("mysql://root:tvnVbgMI@localhost:3307/recipes");

async function getUserById(id) {
  const [user] = await sequelize.query(
    `SELECT id, email, username, firstName, lastName FROM users WHERE id=:id`,
    { replacements: { id } }
  );
  return user[0];
}

async function getUser(email) {
  const [user] = await sequelize.query(
    `SELECT * FROM users WHERE email=:email`,
    { replacements: { email } }
  );
  return user[0];
}

async function setUser(email, password, username, firstName, lastName) {
  try {
    const result = await sequelize.query(
      `INSERT INTO users (email, password, username, firstName, lastName) VALUES (:email, :password, :username, :firstName, :lastName)`,
      {
        replacements: { email, password, username, firstName, lastName },
        type: sequelize.QueryTypes.INSERT,
      }
    );
    console.log("Insert successful, ID:", result);
    return result;
  } catch (error) {
    console.error("Database error:", error.message);
    throw error;
  }
}

async function login(email, password) {
  const query = `
  SELECT *
  FROM users
  WHERE email=:email
  `;
  const [results, metadata] = await sequelize.query(query, {
    replacements: { email },
  });
  const user = results[0];
  if (user && (await bcrypt.compare(password, user.password))) {
    const { password: _, ...userNoPassword } = user;
    return userNoPassword;
  }
}

async function register(email, password, username, firstName, lastName) {
  const saltRound = 12;
  const hashedPassword = await bcrypt.hash(password, saltRound);
  console.log("hashed password: " + hashedPassword);
  const success = await setUser(
    email,
    hashedPassword,
    username,
    firstName,
    lastName
  );
  console.log("user was added");
  return success;
}
async function profile(token, user) {}

module.exports = { login, register, profile, getUserById };
