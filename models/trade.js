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

const Offers = mongoose.model("Offers", offersSchema);

module.exports.Offers = Offers;
module.exports.offersSchema = offersSchema;

module.exports.validateOffer = validateOffer;