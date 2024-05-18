const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const AccountSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, 
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
    lowercase: true,
    validate: {
      validator: (email) => /^([^\s@]+@[^\s@]+\.[^\s@]+)$/.test(email), 
      message: "Please enter a valid email address.",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8, 
  },
  role: {
    type: String,
    enum: ["customer", "admin", "vendor"], 
    default: "customer",
  },
  addresses: [
    {
      type: String,
    },
  ],
  orders: [
    {
      type: String,
    },
  ],
  wishlist: [
    {
      type: String,
    },
  ],
});
// Login
AccountSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// Register
AccountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
module.exports = mongoose.model("Account", AccountSchema);