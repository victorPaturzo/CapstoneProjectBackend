const mongoose = require("mongoose");
const Joi = require("joi");

const offersSchema = mongoose.Schema({
    owner: {type: String},
    offer: {type: String, required: true, minlength: 5, maxLength: 250},
});

const validateOffer = (req) => {
    const schema = Joi.object({
      offer: Joi.string().min(5).max(250).required(),
    });
    return schema.validate(req);
};

const eventSchema = mongoose.Schema({
  date: {type: Date},
  event: {type: String, required: true, minlength: 5, maxLength: 1024},
})

const validateEvent = (req) => {
  const schema = Joi.object({
    date: Joi.string().min(5).max(10),
    event: Joi.string().min(5).max(1024).required()
  });
  return schema.validate(req);
};

const Offers = mongoose.model("Offers", offersSchema);
const Events = mongoose.model("Events", eventSchema);

module.exports.Offers = Offers;
module.exports.offersSchema = offersSchema;

module.exports.Events = Events;
module.exports.eventSchema = eventSchema;

module.exports.validateOffer = validateOffer;
module.exports.validateEvent = validateEvent;