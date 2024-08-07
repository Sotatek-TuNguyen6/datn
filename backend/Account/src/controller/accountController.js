const Account = require("../models/AcountModels");
const { generateToken, refreshToken } = require("../utils/generateToken");
const logger = require('../utils/logger');
const Joi = require("joi");
const redis = require('redis');
const util = require('util');
const redisClient = require("../utils/redisClient");
const { publishToQueue, consumeQueue, publishToExchange, publishToQueueV2 } = require("../utils/amqp");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

/**
 * Controller for creating a new account
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.createAccount = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.email": "Email không hợp lệ",
        "any.required": "Email is required",
      }),
    password: Joi.string().min(8).required().messages({
      "any.required": "Password is required",
    }),
    username: Joi.string().required().messages({
      "any.required": "Username is required",
    }),
    name: Joi.string().required().messages({
      "any.required": "Name is required",
    }),
    role: Joi.string(),
    addresses: Joi.array(),
    phone: Joi.string()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  
  try {
    const { email, password, username, name } = req.body;

    const checkEmail = await Account.findOne({ email });
    const checkuserName = await Account.findOne({ username });
    if (checkEmail) {
      return res.status(409).json({
        message: "Email is exits",
        error: true
      });
    }
    if (checkuserName) {
      return res.status(409).json({
        message: "UserName is exits",
        error: true
      });
    }
    
    const newAccount = new Account(req.body);
    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
    logger.info("New account created:", savedAccount);

    const message = {
      type: 'email',
      recipientEmail: savedAccount,
      message: `Welcome ${savedAccount.name}! Your account has been successfully created.`,
      userToken: '' // If you want to send push notifications, you need the user's device token.
    };
    await publishToExchange('notification_exchange', 'account.created', message);

  } catch (error) {
    res.status(500).json({ message: "Error creating account", error: error.message });
    logger.error("Error creating account:", error);
  }
};

/**
 * Controller for logging in a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const userCheck = await Account.findOne({ username });
    if (userCheck && (await userCheck.matchPassword(password))) {
      if (role && userCheck.role !== role) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      const access_token = await generateToken({
        id: userCheck._id,
        role: userCheck.role,
        email: userCheck.email
      });

      return res.json({
        status: "OK",
        message: "SUCCESS",
        access_token,
      });
    } else {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error login account", error: error.message });
    logger.error("Error login account:", error);
  }
};

/**
 * Controller for getting all accounts
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json(accounts);
    logger.info("Retrieved all accounts from database:", accounts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving accounts", error: error.message });
    logger.error("Error retrieving accounts:", error);
  }
};

/**
 * Controller for getting an account by ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.getAccountById = async (req, res) => {
  const accountId = req.params.id;
  try {
    const account = await Account.findById(accountId).select('-password');
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const productIds = account.wishlist.map(item => item);
    const detailedWishlist = await publishToQueueV2('productDetailsRequestQueue', { productIds }, async (item) => {
      const accountWithDetailedWishlist = { ...account.toObject(), wishlist: item };
      res.status(200).json(accountWithDetailedWishlist);
    });

    logger.info("Retrieved account by ID with detailed wishlist:");
  } catch (error) {
    res.status(500).json({ message: "Error retrieving account", error: error.message });
    logger.error("Error retrieving account by ID:", error);
  }
};

/**
 * Controller for updating an account
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.updateAccount = async (req, res) => {
  const { id, role } = req.user;
  const accountId = req.params.id;

  try {
    if (role != "admin" && accountId !== id) {
      return res.status(404).json({ message: "Helo Hacker!" });
    }
    const allowedUpdates = ['name', 'email', 'phone', 'addresses', 'orders', 'wishlist', 'role'];

    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid updates!" });
    }

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    updates.forEach((update) => {
      if (update === 'wishlist') {
        let newWishlist = req.body.wishlist;

        // Ensure the wishlist is an array
        if (typeof newWishlist === 'string') {
          newWishlist = [newWishlist];
        } else if (!Array.isArray(newWishlist)) {
          return res.status(400).json({ message: "Wishlist must be a string or an array" });
        }

        account.wishlist = [...new Set([...account.wishlist, ...newWishlist])];
      } else {
        account[update] = req.body[update];
      }
    });

    const updatedAccount = await account.save();

    res.status(200).json({ status: true, message: "OK" });
    logger.info("Updated account:", updatedAccount);
  } catch (error) {
    res.status(500).json({ message: "Error updating account", error: error.message });
    logger.error("Error updating account:", error);
  }
};

/**
 * Controller for deleting an account
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.deleteAccount = async (req, res) => {
  const accountId = req.params.id;
  try {
    const deletedAccount = await Account.findByIdAndDelete(accountId);
    if (!deletedAccount) {
      res.status(404).json({ message: "Account not found" });
    } else {
      res.status(200).json({ message: "Account deleted successfully" });
      logger.info("Deleted account:", deletedAccount);
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting account", error: error.message });
    logger.error("Error deleting account:", error);
  }
};

/**
 * Controller for updating a user's wishlist
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.updateWishlist = async (req, res) => {
  try {
    const accountId = req.user._id;
    const productId = req.params.product;

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const productIndex = account.wishlist.indexOf(productId);
    if (productIndex !== -1) {
      account.wishlist.splice(productIndex, 1);
    } else {
      account.wishlist.push(productId);
    }

    await account.save();

    res.status(200).json({ message: "Wishlist updated successfully", wishlist: account.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error updating wishlist", error: error.message });
  }
};

/**
 * Controller for updating a user's password
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.updatePassword = async (req, res) => {
  try {
    const { passwordOld, passwordNew } = req.body;
    const accountId = req.user._id;
    const account = await Account.findOne(accountId);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    logger.info(`Hashed password in database: ${account.password}`);

    if (!(await account.matchPassword(passwordOld))) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordNew, salt);

    account.password = hashedPassword;
    await account.save();

    const updatedAccount = await Account.findById(accountId);
    console.log("Updated Account Password:", updatedAccount.password);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error: error.message });
    logger.error("Error updating password:", error);
  }
};

/**
 * Controller for resetting a password
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { passwordNew } = req.body;

    const account = await Account.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() } // Ensure the token has not expired
    });

    if (!account) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordNew, salt);

    account.password = hashedPassword;
    account.resetPasswordToken = undefined;
    account.resetPasswordExpire = undefined;

    await account.save();
    const updatedAccount = await Account.findById(account._id);
    console.log("Updated Account Password:", updatedAccount.password);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message });
    logger.error("Error resetting password:", error);
  }
};

/**
 * Controller for forgotPassword 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const account = await Account.findOne({ email });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    account.resetPasswordToken = resetToken;
    account.resetPasswordExpire = resetPasswordExpire;

    await account.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const message = {
      type: 'restPass',
      recipientEmail: account,
      message: resetUrl,
    };

    await publishToExchange('notification_resetPassword', 'account.restPassword', message);
    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending password reset link", error: error.message });
    logger.error("Error sending password reset link:", error);
  }
};