const {Model, StatBlock, WeaponProfile, WeaponAbilities, ModelAbilities, Factions, Keywords, weaponAbilities} = require("../models/modeldata");

const express = require("express");
const { exist } = require("joi");
const { models } = require("mongoose");
const res = require("express/lib/response");
const router = express.Router();

router.post("/addNewModel", async (req, res) => {
    try{
        let newModel = new Model({
            modelName: req.body.modelName,
            powerLevel: req.body.powerLevel,
            pointCost: req.body.pointCost,
            deescalatingStatBlock: req.body.deescalatingStatBlock,
            stats: req.body.stats,
            weapons: req.body.weapons,
            abilities: req.body.abilities,
            factionKeywords: req.body.factionKeywords,
            modelKeywords: req.body.modelKeywords,
        });
        await newModel.save();
        return res
        .send({
            _id: newModel._id,
            modelName: newModel.modelName,
            powerLevel: newModel.powerLevel,
            pointCost: newModel.pointCost,
            deescalatingStatBlock: newModel.deescalatingStatBlock,
            stats: newModel.stats,
            weapons: newModel.weapons,
            abilities: newModel.abilities,
            factionKeywords: newModel.factionKeywords,
            modelKeywords: newModel.modelKeywords,
        })
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Get all models
router.get("/getAllModels", async (req, res) => {
    try{
        const allModels = await Model.find();
        return res.send(allModels);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//*Get a model by name
router.get("/getModelByName/:modelName", async (req, res) => {
    try {
        let aModel = await Model.find({ modelName: req.params.modelName });
        return res.send(aModel);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
});

// router.get("/getModelByName", async (req, res) => {
//     console.log(req.params);
//     try {
//         let models = await Model.find({ 'modelName_lower': req.query.modelName.toLowerCase() });
 
//         return res.send(models);
//     } catch (ex) {
//         return res.status(500).send(`Internal Server Error: ${ex}`)
//     }
// });

//*Delete a model
router.delete("/:modelId", async (req, res) => {
    try {
        const badModel = await Model.findById(req.params.modelId);
        if (!badModel)
        return res
        .status(400)
        .send(`Model with id ${req.params.modelId} does not exist.`);
        await badModel.remove();
        return res.send(badModel);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//*Push model image into model

// router.put("pushModelImg/:modelId/:imgUrl", async)

//* Post register a weapon ability
router.post("/addNewWeaponAbility", async (req, res) => {
    try {
        let weaponAbility = new WeaponAbilities({
            weaponType: req.body.weaponType,
            ability: req.body.ability,
        });
        await weaponAbility.save();
        return res
        .send({
            _id: weaponAbility._id,
            ability: weaponAbility.ability,
        })
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Get all weapon abilities
router.get("/getAllWeaponAbilities", async (req, res) => {
    try{
        const weaponAbilities = await WeaponAbilities.find();
        return res.send(weaponAbilities);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Delete a weaponAbility
router.delete("/deleteWeaponAbility/:weaponAbilityId", async (req, res) => {
    try {
        const weaponAbility = await WeaponAbilities.findById(req.params.weaponAbilityId);
        if (!weaponAbility)
        return res
        .status(400)
        .send(`WeaponAbility with id ${req.params.weaponAbilityId} does not exist.`);
        await weaponAbility.remove();
        return res.send(weaponAbility);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Push Weapon ability into weapon
router.put("/pushWeaponAbility/:weaponAbilityId/:weaponName", async (req, res) => {
    try {
        const weapon = await WeaponProfile.findOne({weaponName: req.params.weaponName});
        if (!weapon)
        return res
        .status(400)
        .send(`Weapon with name ${req.params.weaponName} does not exist.`);
        const weaponAbility = await WeaponAbilities.findById(req.params.weaponAbilityId);
        if (!weaponAbility)
        return res
        .status(400)
        .send(`Weapon Ability with id ${req.params.weaponAbilityId} does not exist.`);
        await weapon.abilities.push(weaponAbility);
        await weapon.save();
        return res.send(weapon);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Post a weaponProfile
router.post("/addWeaponProfile", async (req, res) => {
    try{
        let newWeaponProfile = new WeaponProfile({
            weaponName: req.body.weaponName,
            range: req.body.range,
            weaponType: req.body.weaponType,
            attacks: req.body.attacks,
            weaponStrength: req.body.weaponStrength,
            armorPenetration: req.body.armorPenetration,
            damage: req.body.damage,
            abilities: req.body.abilities,
        });
        await newWeaponProfile.save();
        return res
        .send({
            _id: newWeaponProfile._id,
            weaponName: newWeaponProfile.weaponName,
            range: newWeaponProfile.range,
            weaponType: newWeaponProfile.weaponType,
            attacks: newWeaponProfile.attacks,
            weaponStrength: newWeaponProfile.weaponStrength,
            armorPenetration: newWeaponProfile.armorPenetration,
            damage: newWeaponProfile.damage,
            abilities: newWeaponProfile.abilities,
        })
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Get all weaponProfiles
router.get("/getAllWeaponProfiles", async (req, res) => {
    try {
        const weaponProfiles = await WeaponProfile.find();
        return res.send(weaponProfiles);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
});

//*Delete a weaponProfile
router.delete("/deleteWeaponProfile/:weaponProfileId", async (req, res) => {
    try {
        const badWeaponProfile = await WeaponProfile.findById(req.params.weaponProfileId);
        if (!badWeaponProfile)
        return res
        .status(400)
        .send(`WeaponProfile with id ${req.params.weaponProfileId} does not exist`);
        await badWeaponProfile.remove();
        return res.send(badWeaponProfile);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//*Push weapon into model
router.put("/pushWeapon/:weaponName/:modelId", async (req, res) => {
    try {
        const model = await Model.findById(req.params.modelId);
        if (!model)
        return res
        .status(400)
        .send(`Model with Id ${req.params.modelId} does not exist`);
        const weapon = await WeaponProfile.findOne( {weaponName: req.params.weaponName} );
        if (!weapon) 
        return res
        .status(400)
        .send(`Weapon with name ${req.params.weaponName} does not exist`);
        await model.weapons.push(weapon);
        await model.save();
        return res.send(model);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


//* Post a statBlock
router.post("/addStatBlock", async (req, res) => {
    try{
        let newStatBlock = new StatBlock({
            name: req.body.name,
            movement: req.body.movement,
            weaponSkill: req.body.weaponSkill,
            ballisticSkill: req.body.ballisticSkill,
            strength: req.body.strength,
            toughness: req.body.toughness,
            wounds: req.body.wounds,
            attacks: req.body.attacks,
            leadership: req.body.leadership,
            modelSave: req.body.modelSave,  
        });
        await newStatBlock.save();
        return res
        .send({
            _id: newStatBlock._id,
            name: newStatBlock.name,
            movement: newStatBlock.movement,
            weaponSkill: newStatBlock.weaponSkill,
            ballisticSkill: newStatBlock.ballisticSkill,
            strength: newStatBlock.strength,
            toughness: newStatBlock.toughness,
            wounds: newStatBlock.wounds,
            attacks: newStatBlock.attacks,
            leadership: newStatBlock.leadership,
            modelSave: newStatBlock.modelSave,
        })
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//*Get all statBlocks
router.get("/getAllStatBlocks", async (req, res) => {
    try {
        const statBlocks = await StatBlock.find();
        return res.send(statBlocks);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Delete a statBlock
router.delete("/deleteStatBlock/:statBlockId", async (req, res) => {
    try {
        const statBlock = await StatBlock.findById(req.params.statBlockId);
        if (!statBlock)
        return res
        .status(400)
        .send(`StatBlock with id ${req.params.userId} does not exist.`);
        await statBlock.remove();
        return res.send(statBlock);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//*Push a stat block
router.put("/pushStatBlock/:statBlockId/:modelId", async (req, res) => {
    try {
        const model = await Model.findById(req.params.modelId);
        if (!model)
        return res
        .status(400)
        .send(`Model with id ${req.params.modelId} does not exist`);
        const statBlock = await StatBlock.findById(req.params.statBlockId);
        if (!statBlock)
        return res
        .status (400)
        .send(`StatBlock with id ${req.params.statBlockId} does not exist`);
        await model.stats.push(statBlock);
        await model.save();
        return res.send(model);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Post a modelAbility
router.post("/addModelAbility", async (req, res) => {
    try{
        const modelAbility = new ModelAbilities({
            name: req.body.name,
            ability: req.body.ability,
        });
        await modelAbility.save();
        return res
        .send({
            _id: modelAbility._id,
            name: modelAbility.name,
            ability: modelAbility.ability
        })
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Get all modelAbilities
router.get("/getAllModelAbilities", async (req, res) => {
    try{
        const modelAbilities = await ModelAbilities.find();
        return res.send(modelAbilities);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Delete a model ability
router.delete("/deleteModelAbility/:modelAbilityId", async (req, res) => {
    try {
        const modelAbility = await ModelAbilities.findById(req.params.modelAbilityId);
        if (!modelAbility)
        return res
        .status(400)
        .send(`ModelAbility with id ${req.params.modelAbilityId} does not exist.`);
        await modelAbility.remove();
        return res.send(modelAbility);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Post a faction
router.post("/addFaction", async (req, res) => {
    try {
        let newFaction = new Factions({
            faction: req.body.faction
        });
        await newFaction.save();
        return res
        .send({
            _id: newFaction._id,
            faction: newFaction.faction,
        })
    } catch (ex) {
        return res.status(500).send(`Internal ServerError: ${ex}`);
    }
});

//* Get all factions
router.get("/getAllFactions", async (req, res) => {
    try {
        let factions = await Factions.find();
        return res.send(factions);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Delete a faction
router.delete("/deleteFaction/:factionId", async (req, res) => {
    try {
        let badFaction = await Factions.findById(req.params.factionId);
        if (!badFaction)
        return res
        .status(400)
        .send(`Faction with id ${req.params.factionId} does not exist`);
        await badFaction.remove();
        return res.send(badFaction);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Post a new keyword
router.post("/addKeyword", async (req, res) => {
    try {
        let newKeyword = new Keywords({
            keyword: req.body.keyword,
        });
        await newKeyword.save();
        return res
        .send({
            _id: newKeyword._id,
            keyword: newKeyword.keyword,
        })
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Get all Keywords
router.get("/getAllKeywords", async (req, res) => {
    try {
        let keywords = await Keywords.find();
        return res.send(keywords);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//* Delete a Keyword
router.delete("/deleteKeyword/:keywordId", async (req, res) => {
    try {
        let badKeyword = await Keywords.findById(req.params.keywordId);
        if (!badKeyword)
        return res
        .status(400)
        .send(`Keyword with id ${req.params.badKeywordId} does not exist`);
        await badKeyword.remove();
        return res.send(badKeyword);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});



module.exports = router;