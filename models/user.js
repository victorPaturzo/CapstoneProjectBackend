const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const { offersSchema } = require("./trade");

const userSchema = mongoose.Schema({
  name: { type: String, required: true, minLength: 5, maxLength: 50 },
  userName: { type: String, required: true, minLength: 5, maxLength: 50},
  email: {
    type: String,
    unique: true,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  mailIngAddress: {type: String, minLength: 5, maxLength: 150, default: "requires a mailing address"},
  contactInfo: {type: Number},
  password: { type: String, required: true, minLength: 8, maxLength: 1024 },
  isAdmin: { type: Boolean, required: true },
  outgoingOffers: {type: [offersSchema]},
  incomingOffers: {type: [offersSchema]},
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      userName: this.userName,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    config.get("JWT_SECRET")
  );
};

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    userName: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
    isAdmin: Joi.bool().required(),
  });
  return schema.validate(user);
};

const validateLogin = (req) => {
  const schema = Joi.object({
    userName: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(req);
};

const User = mongoose.model("User", userSchema);
module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;
module.exports.validateLogin = validateLogin;

