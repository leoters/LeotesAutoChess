"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PokemonEmotionsModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const precomputed_emotions_1 = require("../../../../../models/precomputed/precomputed-emotions");
const types_1 = require("../../../../../types");
const Pokemon_1 = require("../../../../../types/enum/Pokemon");
const hooks_1 = require("../../../hooks");
const NetworkStore_1 = require("../../../stores/NetworkStore");
const avatar_1 = require("../../../../../utils/avatar");
const jsx_1 = require("../../utils/jsx");
const modal_1 = require("../modal/modal");
const pokemon_emotion_1 = __importDefault(require("./pokemon-emotion"));
const Config_1 = require("../../../../../types/Config");
const precomputed_pokemon_data_1 = require("../../../../../models/precomputed/precomputed-pokemon-data");
const pokemon_portrait_1 = __importDefault(require("../pokemon-portrait"));
require("./pokemon-emotions-modal.css");
function PokemonEmotionsModal(props) {
    var _a, _b, _c, _d, _e;
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, hooks_1.useAppDispatch)();
    const pokemonCollection = (0, hooks_1.useAppSelector)((state) => { var _a, _b; return (_b = (_a = state.network.profile) === null || _a === void 0 ? void 0 : _a.pokemonCollection) !== null && _b !== void 0 ? _b : new Map(); });
    const user = (0, hooks_1.useAppSelector)((state) => state.network.profile);
    const index = Pokemon_1.PkmIndex[props.pokemon];
    const rarity = (0, precomputed_pokemon_data_1.getPokemonData)(props.pokemon).rarity;
    const boosterCost = Config_1.BoosterPriceByRarity[rarity];
    const availableEmotions = Object.values(types_1.Emotion).filter((e, i) => { var _a; return ((_a = precomputed_emotions_1.PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[index]) === null || _a === void 0 ? void 0 : _a[i]) === 1; });
    const shinyAvailable = ((_a = Pokemon_1.AnimationConfig[props.pokemon]) === null || _a === void 0 ? void 0 : _a.shinyUnavailable) !== true;
    const pConfig = (0, react_1.useMemo)(() => {
        var _a;
        const foundPokemon = (_a = pokemonCollection.get(index)) !== null && _a !== void 0 ? _a : {
            dust: 0,
            emotions: [],
            shinyEmotions: [],
            selectedEmotion: types_1.Emotion.NORMAL,
            selectedShiny: false,
            id: "0000",
            played: 0
        };
        return foundPokemon;
    }, [index, pokemonCollection]);
    const handlePokemonEmotionClick = (0, react_1.useCallback)((unlocked, update) => {
        if (unlocked) {
            dispatch((0, NetworkStore_1.changeSelectedEmotion)(update));
        }
        else {
            dispatch((0, NetworkStore_1.buyEmotion)(update));
        }
    }, [dispatch]);
    const resetEmotion = (0, react_1.useCallback)(() => {
        dispatch((0, NetworkStore_1.changeSelectedEmotion)({ index: index, emotion: null, shiny: false }));
    }, [dispatch]);
    return ((0, jsx_runtime_1.jsx)(modal_1.Modal, { show: true, onClose: props.onClose, className: "pokemon-emotions-modal anchor-top", header: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(pokemon_portrait_1.default, { portrait: { index, shiny: pConfig.selectedShiny, emotion: (_b = pConfig.selectedEmotion) !== null && _b !== void 0 ? _b : types_1.Emotion.NORMAL }, className: (0, jsx_1.cc)({ unlocked: pConfig != null }) }), (0, jsx_runtime_1.jsxs)("h2", { children: [t(`pkm.${props.pokemon}`), " #", Pokemon_1.PkmIndex[props.pokemon], " - ", t("played_times", { count: (_c = pConfig.played) !== null && _c !== void 0 ? _c : 0 })] }), (0, jsx_runtime_1.jsx)("div", { className: "spacer" }), (0, jsx_runtime_1.jsxs)("p", { className: "dust", children: [(0, jsx_runtime_1.jsx)("img", { src: (0, avatar_1.getPortraitSrc)(index), className: "dust", alt: "dust" }), pConfig.dust, " ", t("shards"), " "] })] }), body: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("section", { children: [(0, jsx_runtime_1.jsx)("p", { children: t("normal_emotions") }), (0, jsx_runtime_1.jsx)("div", { children: availableEmotions.map((e) => {
                                return ((0, jsx_runtime_1.jsx)(pokemon_emotion_1.default, { index: index, shiny: false, unlocked: pConfig && pConfig.emotions.includes(e), selected: pConfig.selectedEmotion === e && !pConfig.selectedShiny, path: index.replace("-", "/"), emotion: e, dust: pConfig.dust, onClick: () => handlePokemonEmotionClick(pConfig && pConfig.emotions.includes(e), { index: index, emotion: e, shiny: false }) }, e));
                            }) })] }), shinyAvailable && ((0, jsx_runtime_1.jsxs)("section", { children: [(0, jsx_runtime_1.jsx)("p", { children: t("shiny_emotions") }), (0, jsx_runtime_1.jsx)("div", { children: availableEmotions.map((e) => {
                                return ((0, jsx_runtime_1.jsx)(pokemon_emotion_1.default, { index: index, shiny: true, unlocked: pConfig && pConfig.shinyEmotions.includes(e), selected: pConfig.selectedEmotion === e && pConfig.selectedShiny, path: `${index.replace("-", "/")}/0000/0001`, emotion: e, dust: pConfig.dust, onClick: () => handlePokemonEmotionClick(pConfig && pConfig.shinyEmotions.includes(e), { index: index, emotion: e, shiny: true }) }, e));
                            }) })] }))] }), footer: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("button", { className: "bubbly blue", disabled: (pConfig.emotions.length === 0 &&
                        pConfig.shinyEmotions.length === 0) ||
                        (user &&
                            (0, avatar_1.getAvatarSrc)(user === null || user === void 0 ? void 0 : user.avatar) ===
                                (0, avatar_1.getPortraitSrc)(index, pConfig.selectedShiny, (_d = pConfig.selectedEmotion) !== null && _d !== void 0 ? _d : types_1.Emotion.NORMAL)), onClick: () => {
                        var _a;
                        return dispatch((0, NetworkStore_1.changeAvatar)({
                            index,
                            emotion: (_a = pConfig.selectedEmotion) !== null && _a !== void 0 ? _a : types_1.Emotion.NORMAL,
                            shiny: pConfig.selectedShiny
                        }));
                    }, children: [t("choose_as_avatar"), "\u00A0", (0, jsx_runtime_1.jsx)(pokemon_portrait_1.default, { portrait: { index, shiny: pConfig.selectedShiny, emotion: (_e = pConfig.selectedEmotion) !== null && _e !== void 0 ? _e : types_1.Emotion.NORMAL }, alt: "avatar" })] }), (0, jsx_runtime_1.jsxs)("button", { className: "bubbly orange", disabled: pConfig.dust < boosterCost, onClick: () => dispatch((0, NetworkStore_1.buyBooster)({ index })), children: [t("buy_booster", { cost: boosterCost }), (0, jsx_runtime_1.jsx)("img", { src: (0, avatar_1.getPortraitSrc)(index), className: "dust", alt: "dust" })] }), pConfig.selectedEmotion != null && pConfig.selectedEmotion != types_1.Emotion.NORMAL && (0, jsx_runtime_1.jsx)("button", { className: "bubbly blue", onClick: resetEmotion, children: t("reset_emotion") }), (0, jsx_runtime_1.jsx)("div", { className: "spacer" }), (0, jsx_runtime_1.jsx)("button", { className: "bubbly red", onClick: props.onClose, children: t("close") })] }) }));
}
//# sourceMappingURL=pokemon-emotions-modal.js.map