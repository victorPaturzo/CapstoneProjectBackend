const { User, Post, Reply, Message, Army, Comment, validateLogin, validateUser, validatePost, validateMessage, validateArmy, validateComment} = require("../models/user");
const {Model} = require("../models/modeldata");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const bcrypt = require("bcrypt");
const express = require("express");
const { model } = require("mongoose");
const router = express.Router();

//* POST register a new user
router.post("/register", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send(`Email ${req.body.email} already claimed!`);

    const salt = await bcrypt.genSalt(10);
    user = new User({
      name: req.body.name,
      userName: req.body.userName,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
      isAdmin: req.body.isAdmin
    });

    await user.save();
    const token = user.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({
        _id: user._id,
        name: user.name,
        userName: user.userName,
        email: user.email,
        isAdmin: user.isAdmin,
      });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});
//* POST a valid login attempt
//! when a user logs in, a new JWT token is generated and sent if their email/password credentials are correct
router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ userName: req.body.userName });
    if (!user) return res.status(400).send(`Invalid User Name or password.`);

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid User Name or password.");

    const token = user.generateAuthToken();
    return res.send(token);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* DELETE a single user from the database
router.delete("/:userId", [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`User with id ${req.params.userId} does not exist!`);
    await user.remove();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* Get a user's profile
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
    return res
    .status(400)
    .send(`User with id ${req.params.userId} does not exist.`)
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//*Put Update/edit user profile
router.put("/editProfile/:userId", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    
    const user = await User.findById(req.params.userId);
    user.name = req.body.name,
    user.userName = req.body.userName,
    user.email = req.body.email,
    user.mailingAddress = req.body.mailingAddress,
    user.password =  await bcrypt.hash(req.body.password, salt),
    user.contactInfo = req.body.contactInfo;
    
    await user.save();

    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`)
  }
});

//* Post Create a Post
router.post("/createPost/:userId", async (req, res) => {
  try {
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send(`Could not find user with id ${req.params.userId}.`)

    const newPost = new Post({
      text: req.body.text
    });

    await newPost.save();
    await user.posts.push(newPost);
    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`)
  }
});

//*Adding likes and dislikes
router.put("/:userId/posts/:postId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    let thePost = user.posts.id(req.params.postId);

    thePost = {...thePost, ...req.body};

    await user.save();
    await thePost.save();

    return res.send(thePost);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`)
  }
});

//*Replying to posts
router.post("/:userId/posts/:postId/replies", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    let thePost = user.posts.id(req.params.postId);

    const reply = new Reply({
      text: req.body.text,
      likes: req.body.likes,
      dislikes: req.body.dislikes
    });

    await thePost.replies.push(reply);
    await user.save();
    return res.send(thePost.replies);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//*Post send a message
router.post("/sendMessage/:recipientUserName/:userName", async (req, res) => {
  try {
    const { error } = validateMessage(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const recipient = await User.findOne({ userName: req.params.recipientUserName });
    if (!recipient) return res.status(400).send(`Could not find user with UserName ${req.params.recipientUserName}.`)

    const newMessage = new Message({
      userName: req.params.userName,
      text: req.body.text,
    });

    await recipient.inbox.push(newMessage);
    await recipient.save();
    return res.send({
      _id: newMessage._id,
      userName: newMessage.userName,
      text: newMessage.text,
    });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`)
  }
});

//*Sending a friend request to friend's pendingFriends Array
router.get("/:userId/pendingFriends/:friendId",[auth], async (req, res) => {
  
  const user = await User.findById(req.params.friendId);
  user.pendingFriends.push(req.params.userId);

  await user.save()
  return res.send(user.pendingFriends)   
})

//* Accepting a friend request and moving from pending array to accepted array
router.get("/:yourId/acceptFriends/:userId",[auth], async (req, res)=>{
 const user = await User.findById(req.params.yourId);
 const indexOfFriend = user.pendingFriends.findIndex(e=>e===req.params.userId)
user.pendingFriends.splice (indexOfFriend,1);

user.acceptedFriends.push(req.params.userId);
const friend = await User.findById(req.params.userId);
friend.acceptedFriends.push(req.params.yourId);

await user.save();
await friend.save();
return res.send([user,friend])
})

//* Get all of User's Pending Friends
router.get("/getPendingFriends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    // const friends = await User.findById(friendsList);
    return res.send(user.pendingFriends)
  } catch (ex) {
    console.log(ex.message)
    return res.status(500).send(`Internal Server Error: ${ex.message}`)
  }
});

//* Get all of User's Friends
router.get("/getFriends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    // const friends = await User.findById(friendsList);
    return res.send(user.acceptedFriends)
  } catch (ex) {
    console.log(ex.message)
    return res.status(500).send(`Internal Server Error: ${ex.message}`)
  }
});

//*Delete friend
router.delete("/deleteFriend/:yourId/:userId", [auth], async (req, res) => {
  const user = await User.findById(req.params.yourId);
  const badFriend = user.acceptedFriends.findIndex(e=>e===req.params.userId);
  user.acceptedFriends.splice (badFriend, 1);

  // const friend = await User.findById(req.params.userId);
  // const yourOwnId = friend.acceptedFriends.findIndex(e=>e===req.params.yourId);
  // friend.acceptedFriends.splice (yourOwnId, 1);

  await user.save();
  // await friend.save();
  return res.send(user)
})

//*Post add an army
router.post("/addArmy/:userId", async (req, res) => {
  try {
    const { error } = validateArmy(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.params.userId);
    const newArmy = new Army({
      army: req.body.army,
    });

    await user.armies.push(newArmy);
    await user.save();
    return res.send({
      army: newArmy.army,
    });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`)
  }
});

//*Get user's armies
router.get("/getArmies/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    return res.send(user.armies);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* DELETE an army from user's armies
router.delete("/deleteArmy/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    let armies = user.armies;
    let badArmy = armies.findIndex(i => i.army === req.body.army);
    await armies.splice(badArmy, 1);
    await user.save();
    return res.send(armies);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//*Post create an army comp for user
// router.post("/createArmy/userId")

//*Post a comment for a model
router.post("/modelComment/:userName/:modelName", async (req, res) => {
  try {
    const model = await Model.findOne({ modelName: req.params.modelName });
    const comment = new Comment({
      userName: req.params.userName,
      text: req.body.text
    });

    await model.comments.push(comment);
    await model.save();
    return res.send(model);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`)
  }
});

module.exports = router;
