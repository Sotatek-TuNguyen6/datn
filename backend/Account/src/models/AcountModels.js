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
  phone: {
    type: String,
    // required: true,
    validate: {
      validator: (phone) => /^\d{10,15}$/.test(phone), // Adjust regex as needed
      message: "Please enter a valid phone number.",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
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
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
// Login
AccountSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// Register
AccountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const isHashed = this.password.startsWith('$2b$');
  if (!isHashed) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});
module.exports = mongoose.model("Account", AccountSchema);