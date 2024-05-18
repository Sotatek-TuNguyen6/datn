const Account = require("../models/AcountModels");
const { generateToken, refreshToken } = require("../utils/generateToken");
const logger = require('../utils/logger');
const Joi = require("joi");
const redis = require('redis');
const util = require('util');



// Controller for creating a new account
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
    const checkuserName = await  Account.findOne({ username });
    if(checkEmail){
      return res.status(409).json({
        message: "Email is exits",
        error: true
      })
    }
    if(checkuserName){
      return res.status(409).json({
        message: "UserName is exits",
        error: true
      })
    }
    const newAccount = new Account(req.body);
    const savedAccount = await newAccount.save();
    req.app.io.emit('newAccountAdded');
    res.status(201).json(savedAccount);
    logger.info("New account created:", savedAccount);
  } catch (error) {
    res.status(500).json({ message: "Error creating account", error: error.message });
    logger.error("Error creating account:", error);
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userCheck = await Account.findOne({ username });
    if (userCheck && (await userCheck.matchPassword(password))) {
      const access_token = await generateToken({
        id: userCheck._id,
      });

      return res.json({
        status: "OK",
        message: "SUCESS",
        access_token,
      });
    } else {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error login account", error: error.message });

    logger.error("Error login account:", error);
  }
}

// Controller for getting all accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const redisClient = redis.createClient();
    await redisClient.connect();
    const cachedAccounts = await redisClient.get('accounts');
    if (cachedAccounts) {
      const accounts = JSON.parse(cachedAccounts);
      res.status(200).json(accounts);
      logger.info("Retrieved all accounts from cache");
      return;
    }

    const accounts = await Account.find();

    await asyncSet('accounts', JSON.stringify(accounts));

    res.status(200).json(accounts);
    logger.info("Retrieved all accounts from database:", accounts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving accounts", error: error.message });
    logger.error("Error retrieving accounts:", error);
  }
};

// Controller for getting an account by ID
exports.getAccountById = async (req, res) => {
  const accountId = req.params.id;
  try {
    const account = await Account.findById(accountId);
    if (!account) {
      res.status(404).json({ message: "Account not found" });
    } else {
      res.status(200).json(account);
      logger.info("Retrieved account by ID:", account);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving account", error: error.message });
    logger.error("Error retrieving account by ID:", error);
  }
};

// Controller for updating an account
exports.updateAccount = async (req, res) => {
  const accountId = req.params.id;
  try {
    const updatedAccount = await Account.findByIdAndUpdate(accountId, req.body, { new: true });
    if (!updatedAccount) {
      res.status(404).json({ message: "Account not found" });
    } else {
      res.status(200).json(updatedAccount);
      logger.info("Updated account:", updatedAccount);
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating account", error: error.message });
    logger.error("Error updating account:", error);
  }
};

// Controller for deleting an account
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
