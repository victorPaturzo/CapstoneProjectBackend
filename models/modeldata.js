const mongoose = require("mongoose");

const statBlock = mongoose.Schema({
    name: {type: String},
    movement: {type: Number},
    weaponSkill: {type: Number},
    ballisticSkill: {type: Number},
    strength: {type: Number},
    toughness: {type: Number},
    wounds: {type: Number},
    attacks: {type: Number},
    leadership: {type: Number},
    modelSave: {type: Number},
});

const weaponAbilities = mongoose.Schema({
    weaponType: {type: String},
    ability: {type: String}
})

const weaponProfile = mongoose.Schema({
    weaponName: {type: String},
    range: {type: Number},
    weaponType: {type: String},
    attacks: {type: Number},
    weaponStrength: {type: Number},
    armorPenetration: {type: Number},
    damage: {type: Number},
    abilities: {type: [weaponAbilities]},
});

const modelAbilities = mongoose.Schema({
    name: {type: String},
    ability: {type: [String]}
})

const factions = mongoose.Schema({
    faction: {type: [Object]}
})

const keywords = mongoose.Schema({
    keyword: {type: [Object]}
})

const modelSchema = mongoose.Schema({
  modelName: {type: String, minLength: 5, maxLength: 75},
  powerLevel: {type: Number},
  pointCost: {type: Number},
  deescalatingStatBlock: {type: Boolean, default: false},
  stats: {type: [statBlock], default: []},
  weapons: {type: [weaponProfile], default: []},
  abilities: {type: [modelAbilities], default: []},
  factionKeywords: {type: [factions], default: []},
  modelKeywords: {type: [keywords], default: []},
});

const Model = mongoose.model("Model", modelSchema);
const StatBlock = mongoose.model("StatBlock", statBlock);
const WeaponProfile = mongoose.model("WeaponProfile", weaponProfile);
const WeaponAbilities = mongoose.model("WeaponAbilities", weaponAbilities);
const ModelAbilities = mongoose.model("ModelAbilities", modelAbilities);
const Factions = mongoose.model("Factions", factions);
const Keywords = mongoose.model("Keywords", keywords);

module.exports.Model = Model;
module.exports.modelSchema = modelSchema;

module.exports.StatBlock = StatBlock;
module.exports.statBlock = statBlock;

module.exports.WeaponProfile = WeaponProfile;
module.exports.weaponProfile = weaponProfile;

module.exports.WeaponAbilities = WeaponAbilities;
module.exports.weaponAbilities = weaponAbilities;

module.exports.ModelAbilities = ModelAbilities;
module.exports.modelAbilities = modelAbilities;

module.exports.Factions = Factions;
module.exports.factions = factions;

module.exports.Keywords = Keywords;
module.exports.keywords = keywords;