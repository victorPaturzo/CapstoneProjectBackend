const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const { offersSchema } = require("./trade");

const messageSchema = mongoose.Schema({
  userName: {type: String, required: true},
  text: {type: String, required: true}
})

const replySchema = mongoose.Schema({
  text: {type: String, required: true},
  likes: {type: Number, default: 0},
  dislikes: {type: Number, default: 0}
});

const postSchema = mongoose.Schema({
  text: {type: String, require: true},
  likes: {type: Number, default: 0},
  dislikes: {type: Number, default: 0},
  replies: {type: [replySchema], default: []}
});

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
  mailingAddress: {type: String, minLength: 5, maxLength: 150, default: "requires a mailing address"},
  contactInfo: {type: Number},
  password: { type: String, required: true, minLength: 8, maxLength: 1024 },
  isAdmin: { type: Boolean, required: true },
  outgoingOffers: {type: [offersSchema]},
  incomingOffers: {type: [offersSchema]},
  posts: {type: [postSchema], default: []},
  inbox: {type: [messageSchema], default: []},
  acceptedFriends: {type: [mongoose.Schema.Types.ObjectId], default: []},
  pendingFriends: {type: [mongoose.Schema.Types.ObjectId], default: []}
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

const validatePost = (req) => {
  const schema = Joi.object({
    text: Joi.string().min(8).max(1024).required(),
  });
  return schema.validate(req);
};

const validateMessage = (req) => {
  const schema = Joi.object({
    text: Joi.string().min(8).max(1024).required(),
  });
  return schema.validate(req);
};

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);
const Reply = mongoose.model("Reply", replySchema);
const Message = mongoose.model("Message", messageSchema);
module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.Post = Post;
module.exports.postSchema = postSchema;
module.exports.Reply = Reply;
module.exports.replySchema = replySchema;
module.exports.Message = Message;
module.exports.messageSchema = messageSchema;
module.exports.validateUser = validateUser;
module.exports.validateLogin = validateLogin;
module.exports.validatePost = validatePost;
module.exports.validateMessage = validateMessage;

