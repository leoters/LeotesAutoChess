"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressTab = ProgressTab;
exports.ProgessBox = ProgessBox;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const hooks_1 = require("../../../hooks");
const precomputed_pokemons_1 = require("../../../../../../gen/precomputed-pokemons");
const types_1 = require("../../../../../types");
const gadgets_1 = require("../../../../../core/gadgets");
require("./progress-tab.css");
function ProgressTab() {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const pokemonCollection = (0, hooks_1.useAppSelector)((state) => { var _a, _b, _c; return [...(_c = (_b = (_a = state.network.profile) === null || _a === void 0 ? void 0 : _a.pokemonCollection) === null || _b === void 0 ? void 0 : _b.values()) !== null && _c !== void 0 ? _c : []]; });
    const user = (0, hooks_1.useAppSelector)((state) => state.network.profile);
    const nbAvatarsUnlocked = pokemonCollection.filter((item) => item.emotions.length > 0 || item.shinyEmotions.length > 0).length;
    const nbPokemonsPlayed = pokemonCollection.filter((item) => item.played > 0).length;
    const nbPokemonsTotal = precomputed_pokemons_1.precomputedPokemons.length;
    const nbTitlesUnlocked = (_a = user === null || user === void 0 ? void 0 : user.titles.length) !== null && _a !== void 0 ? _a : 0;
    const nbTitlesTotal = Object.keys(types_1.Title).length;
    const level = (_b = user === null || user === void 0 ? void 0 : user.level) !== null && _b !== void 0 ? _b : 0;
    const gadgets = Object.values(gadgets_1.GADGETS).filter((g) => !g.disabled);
    const nbGadgetsUnlocked = gadgets.filter((g) => g.levelRequired <= level).length;
    return (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("div", { className: "progress-grid", children: [(0, jsx_runtime_1.jsx)(ProgessBox, { label: t("avatars_unlocked", { count: nbAvatarsUnlocked, total: nbPokemonsTotal }), count: nbAvatarsUnlocked, total: nbPokemonsTotal }), (0, jsx_runtime_1.jsx)(ProgessBox, { label: t("pokemons_played", { count: nbPokemonsPlayed, total: nbPokemonsTotal }), count: nbPokemonsPlayed, total: nbPokemonsTotal }), (0, jsx_runtime_1.jsx)(ProgessBox, { label: t("titles_unlocked", { count: nbTitlesUnlocked, total: nbTitlesTotal }), count: nbTitlesUnlocked, total: nbTitlesTotal }), (0, jsx_runtime_1.jsx)(ProgessBox, { label: t("gadgets_unlocked", { count: nbGadgetsUnlocked, total: gadgets.length }), count: nbGadgetsUnlocked, total: gadgets.length })] }) });
}
function ProgessBox(props) {
    const { label, count, total } = props;
    return ((0, jsx_runtime_1.jsx)("div", { className: "progress-box", style: { "--pc": `${(100 * count / total).toFixed(3)}%` }, children: label }));
}
//# sourceMappingURL=progress-tab.js.map