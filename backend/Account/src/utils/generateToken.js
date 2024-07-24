const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token
 * @param {Object} id - The payload to be included in the token
 * @returns {Promise<string>} - The generated JWT token
 */
const generateToken = async (id) => {
  return jwt.sign({ ...id }, process.env.JWT_SECRET, {
    expiresIn: "365d",
  });
};

/**
 * Generates a refresh token
 * @param {Object} id - The payload to be included in the token
 * @returns {Promise<string>} - The generated refresh token
 */
const refreshToken = async (id) => {
  return jwt.sign({ ...id }, process.env.REFRESH_TOKEN_SECRET);
};
module.exports = { generateToken, refreshToken };