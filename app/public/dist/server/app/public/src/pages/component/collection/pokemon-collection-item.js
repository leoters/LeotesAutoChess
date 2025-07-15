"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PokemonCollectionItem;
const jsx_runtime_1 = require("react/jsx-runtime");
const precomputed_emotions_1 = require("../../../../../models/precomputed/precomputed-emotions");
const precomputed_pokemon_data_1 = require("../../../../../models/precomputed/precomputed-pokemon-data");
const Config_1 = require("../../../../../types/Config");
const Emotion_1 = require("../../../../../types/enum/Emotion");
const Pokemon_1 = require("../../../../../types/enum/Pokemon");
const avatar_1 = require("../../../../../utils/avatar");
const jsx_1 = require("../../utils/jsx");
const pokemon_portrait_1 = __importDefault(require("../pokemon-portrait"));
require("./pokemon-collection-item.css");
function PokemonCollectionItem(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (props.index in precomputed_emotions_1.PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX === false ||
        precomputed_emotions_1.PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[props.index].includes(1) === false) {
        return null;
    }
    const { dust, emotions, shinyEmotions } = (_a = props.config) !== null && _a !== void 0 ? _a : {
        dust: 0,
        emotions: [],
        shinyEmotions: []
    };
    const isUnlocked = props.filterState.mode === "pokedex" ? ((_c = (_b = props.config) === null || _b === void 0 ? void 0 : _b.played) !== null && _c !== void 0 ? _c : 0) > 0
        : props.filterState.mode === "shiny" ? (shinyEmotions === null || shinyEmotions === void 0 ? void 0 : shinyEmotions.length) > 0
            : (emotions === null || emotions === void 0 ? void 0 : emotions.length) > 0 || (shinyEmotions === null || shinyEmotions === void 0 ? void 0 : shinyEmotions.length) > 0;
    const availableEmotions = Object.values(Emotion_1.Emotion).filter((e, i) => { var _a; return ((_a = precomputed_emotions_1.PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[props.index]) === null || _a === void 0 ? void 0 : _a[i]) === 1; });
    const rarity = (0, precomputed_pokemon_data_1.getPokemonData)(props.name).rarity;
    const boosterCost = Config_1.BoosterPriceByRarity[rarity];
    if (props.filterState.filter === "refundable" && dust < boosterCost)
        return null;
    const canUnlock = props.filterState.mode !== "pokedex" && availableEmotions.some((e) => {
        var _a;
        return (emotions.includes(e) === false &&
            dust >= (0, Config_1.getEmotionCost)(e, false) &&
            props.filterState.mode !== "shiny") ||
            (shinyEmotions.includes(e) === false && dust >= (0, Config_1.getEmotionCost)(e, true) && !((_a = Pokemon_1.AnimationConfig[props.name]) === null || _a === void 0 ? void 0 : _a.shinyUnavailable));
    });
    if (props.filterState.filter === "unlocked" && !isUnlocked)
        return null;
    if (props.filterState.filter === "unlockable" && !canUnlock)
        return null;
    if (props.filterState.filter === "locked" && isUnlocked)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, jsx_1.cc)("my-box", "clickable", "pokemon-collection-item", {
            unlocked: isUnlocked,
            unlockable: canUnlock
        }), onClick: () => {
            props.setPokemon(props.name);
        }, children: [(0, jsx_runtime_1.jsx)(pokemon_portrait_1.default, { portrait: { index: props.index, shiny: (_e = (_d = props.config) === null || _d === void 0 ? void 0 : _d.selectedShiny) !== null && _e !== void 0 ? _e : false, emotion: (_g = (_f = props.config) === null || _f === void 0 ? void 0 : _f.selectedEmotion) !== null && _g !== void 0 ? _g : Emotion_1.Emotion.NORMAL } }), props.filterState.mode === "pokedex" ? (0, jsx_runtime_1.jsx)("p", { children: (_j = (_h = props.config) === null || _h === void 0 ? void 0 : _h.played) !== null && _j !== void 0 ? _j : 0 }) : (0, jsx_runtime_1.jsxs)("p", { className: "dust", children: [(0, jsx_runtime_1.jsx)("span", { children: props.config ? props.config.dust : 0 }), (0, jsx_runtime_1.jsx)("img", { src: (0, avatar_1.getPortraitSrc)(props.index) })] })] }));
}
//# sourceMappingURL=pokemon-collection-item.js.map