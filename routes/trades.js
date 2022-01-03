const {validateOffer, Offers, Events, validateEvent} = require("../models/trade");
const {User,} = require("../models/user");

const express = require("express");
const router = express.Router();

//* Post an offer
router.post("/postOffer/:userName", async (req, res) => {
  try {
    const { error } = validateOffer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ userName: req.params.userName });

    const newOffer = new Offers({
      owner: req.params.userName,
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

//* Delete an offer
router.delete("/deleteOffer/:userId/:offerId", async (req, res) => {
  try {
    const badOffer = await Offers.findById(req.params.offerId);
    if (!badOffer)
      return res
      .status(400)
      .send(`Offer with id ${req.params.offerId} does not exist`);
    const user = await User.findById(req.params.userId);
    await user.outgoingOffers.remove(badOffer);
    await user.incomingOffers.remove(badOffer);
    await badOffer.remove();
    await user.save();
    return res.send(badOffer);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Post Send a trade request
router.post("/sendTradeRequest/:userId", async (req, res) => {
  try {
    const tradee = await User.findOne({ userName: req.body.userName });
    const trader = await User.findById(req.params.userId);

    const giveOffer = new Offers({
      owner: req.params.userId,
      offer: req.body.offer,
    });

    await tradee.incomingOffers.push(giveOffer);
    await trader.outgoingOffers.push(giveOffer);
    await tradee.save();
    await trader.save();
    return res
    .send({
      _id: giveOffer._id,
      owner: giveOffer.owner,
      offer: giveOffer.offer,
    });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* Delete Complete a trade request
router.delete("/completeTrade/:userId/:offerId", async (req, res) => {
  try {
    const tradeRecipientA = await User.findById(req.params.userId);
    const tradeRecipientB = await User.findOne({userName: req.body.userName});
    const offer = await Offers.findById(req.params.offerId);

    await tradeRecipientA.incomingOffers.remove({_id: req.params.offerId});
    await tradeRecipientA.outgoingOffers.remove({_id: req.params.offerId});
    await tradeRecipientB.incomingOffers.remove({_id: req.params.offerId});
    await tradeRecipientB.outgoingOffers.remove({_id: req.params.offerId});
    await tradeRecipientA.save();
    await tradeRecipientB.save();
    return res.send(offer);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* Post and event
router.post("/postEvent", async (req, res) => {
  try {
    const { error } = validateEvent(req.body);
    if (error)
    return res.status(400).send(error);

    const newEvent = new Events({
      date: req.date,
      event: req.body.event,
    });

    await newEvent.save();

    return res.send(newEvent);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`)
  }
});

//* Get All events
router.get("/getEvents", async (req, res) => {
  try {
    const allEvents = await Events.find();
    return res.send(allEvents);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`)
  }
});

//*Delete an event
router.delete("/:eventId", async (req, res) => {
  try {
    const badEvent = await Events.findById(req.params.eventId);
    if (!badEvent)
    return res
    .status(400)
    .send(`Event with Id ${req.params.eventId} does not exist.`);
    await badEvent.remove();
    return res.send(badEvent);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;