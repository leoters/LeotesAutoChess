"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooster = createBooster;
exports.pickRandomPokemonBooster = pickRandomPokemonBooster;
exports.hasUnlocked = hasUnlocked;
const precomputed_emotions_1 = require("../models/precomputed/precomputed-emotions");
const precomputed_pokemon_data_1 = require("../models/precomputed/precomputed-pokemon-data");
const precomputed_rarity_1 = require("../models/precomputed/precomputed-rarity");
const types_1 = require("../types");
const Config_1 = require("../types/Config");
const Ability_1 = require("../types/enum/Ability");
const Game_1 = require("../types/enum/Game");
const Pokemon_1 = require("../types/enum/Pokemon");
const array_1 = require("../utils/array");
const random_1 = require("../utils/random");
function createBooster(user) {
    const NB_PER_BOOSTER = 10;
    const boosterContent = [];
    for (let i = 0; i < NB_PER_BOOSTER; i++) {
        const guaranteedUnique = i === NB_PER_BOOSTER - 1;
        boosterContent.push(pickRandomPokemonBooster(user, guaranteedUnique));
    }
    return boosterContent;
}
function pickRandomPokemonBooster(user, guarantedUnique) {
    var _a, _b;
    let name = Pokemon_1.Pkm.MAGIKARP;
    const rarities = Object.keys(Game_1.Rarity);
    const seed = Math.random() * (0, array_1.sum)(Object.values(Config_1.BoosterRarityProbability));
    let threshold = 0;
    if (guarantedUnique) {
        name = (0, random_1.pickRandomIn)([
            ...precomputed_rarity_1.PRECOMPUTED_POKEMONS_PER_RARITY[Game_1.Rarity.UNIQUE],
            ...precomputed_rarity_1.PRECOMPUTED_POKEMONS_PER_RARITY[Game_1.Rarity.LEGENDARY]
        ]);
    }
    else {
        for (let i = 0; i < rarities.length; i++) {
            const rarity = rarities[i];
            const rarityProbability = Config_1.BoosterRarityProbability[rarity];
            threshold += rarityProbability;
            if (seed < threshold) {
                const candidates = ((_a = precomputed_rarity_1.PRECOMPUTED_POKEMONS_PER_RARITY[rarity]) !== null && _a !== void 0 ? _a : []).filter((p) => Pokemon_1.Unowns.includes(p) === false &&
                    (0, precomputed_pokemon_data_1.getPokemonData)(p).skill !== Ability_1.Ability.DEFAULT);
                if (candidates.length > 0) {
                    name = (0, random_1.pickRandomIn)(candidates);
                    break;
                }
            }
        }
    }
    const availableEmotions = Object.values(types_1.Emotion).filter((e, i) => { var _a; return ((_a = precomputed_emotions_1.PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[Pokemon_1.PkmIndex[name]]) === null || _a === void 0 ? void 0 : _a[i]) === 1; });
    const emotion = (_b = (0, random_1.randomWeighted)(availableEmotions.reduce((o, e) => (Object.assign(Object.assign({}, o), { [e]: 1 / Config_1.EmotionCost[e] })), {}))) !== null && _b !== void 0 ? _b : types_1.Emotion.NORMAL;
    const shiny = (0, random_1.chance)(0.05);
    const hasAlreadyUnlocked = hasUnlocked(user.pokemonCollection, {
        name,
        shiny,
        emotion
    });
    return { name: name, shiny, emotion, new: !hasAlreadyUnlocked };
}
function hasUnlocked(collection, card) {
    var _a;
    const index = Pokemon_1.PkmIndex[card.name];
    if (collection.has(index) === false) {
        return false;
    }
    const collectionItem = collection.get(index);
    const emotions = card.shiny
        ? collectionItem.shinyEmotions
        : collectionItem.emotions;
    return emotions.includes((_a = card.emotion) !== null && _a !== void 0 ? _a : types_1.Emotion.NORMAL);
}
//# sourceMappingURL=collection.js.map