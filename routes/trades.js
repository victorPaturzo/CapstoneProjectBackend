const {validateOffer, Offers,} = require("../models/trade");
const {User,} = require("../models/user");

const express = require("express");
const router = express.Router();

//* Post an offer
router.post("/postOffer/:userId", async (req, res) => {
  try {
    const { error } = validateOffer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findById(req.params.userId);

    const newOffer = new Offers({
      owner: req.params.userId,
      offer: req.body.offer,
    });

    await newOffer.save();
    await user.outgoingOffers.push(newOffer);
    await user.save();
    return res
    .send({
      _id: newOffer._id,
      owner: newOffer.owner,
      offer: newOffer.offer,
    });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* Get all offers
router.get("/getAllOffers", async (req, res) => {
    try {
      const allOffers = await Offers.find();
      return res.send(allOffers);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });

module.exports = router;