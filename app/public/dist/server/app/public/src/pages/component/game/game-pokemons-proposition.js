"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GamePokemonsPropositions;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const Config_1 = require("../../../../../types/Config");
const Item_1 = require("../../../../../types/enum/Item");
const Pokemon_1 = require("../../../../../types/enum/Pokemon");
const SpecialGameRule_1 = require("../../../../../types/enum/SpecialGameRule");
const hooks_1 = require("../../../hooks");
const NetworkStore_1 = require("../../../stores/NetworkStore");
const game_1 = require("../../game");
const audio_1 = require("../../utils/audio");
const descriptions_1 = require("../../utils/descriptions");
const store_1 = require("../../utils/store");
const game_pokemon_duo_portrait_1 = __importDefault(require("./game-pokemon-duo-portrait"));
const game_pokemon_portrait_1 = __importDefault(require("./game-pokemon-portrait"));
require("./game-pokemon-propositions.css");
const depths_1 = require("../../../game/depths");
function GamePokemonsPropositions() {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, hooks_1.useAppDispatch)();
    const pokemonsProposition = (0, hooks_1.useAppSelector)((state) => state.game.pokemonsProposition);
    const itemsProposition = (0, hooks_1.useAppSelector)((state) => state.game.itemsProposition);
    const stageLevel = (0, hooks_1.useAppSelector)((state) => state.game.stageLevel);
    const specialGameRule = (0, hooks_1.useAppSelector)((state) => state.game.specialGameRule);
    const board = (_a = (0, game_1.getGameScene)()) === null || _a === void 0 ? void 0 : _a.board;
    const isBenchFull = board &&
        board.getBenchSize() >=
            (pokemonsProposition.some((p) => p in Pokemon_1.PkmDuo) ? 7 : 8);
    const life = (0, hooks_1.useAppSelector)((state) => { var _a, _b; return (_b = (_a = state.game.players.find((p) => p.id === state.network.uid)) === null || _a === void 0 ? void 0 : _a.life) !== null && _b !== void 0 ? _b : 0; });
    const [teamPlanner, setTeamPlanner] = (0, react_1.useState)(store_1.localStore.get(store_1.LocalStoreKeys.TEAM_PLANNER));
    (0, react_1.useEffect)(() => {
        const updateTeamPlanner = (e) => {
            if (e.key === store_1.LocalStoreKeys.TEAM_PLANNER) {
                setTeamPlanner(store_1.localStore.get(store_1.LocalStoreKeys.TEAM_PLANNER));
            }
        };
        window.addEventListener("storage", updateTeamPlanner);
        return () => {
            window.removeEventListener("storage", updateTeamPlanner);
        };
    }, []);
    const [visible, setVisible] = (0, react_1.useState)(true);
    if (pokemonsProposition.length > 0 && life > 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "game-pokemons-proposition", style: { zIndex: depths_1.DEPTH.MODAL }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "my-container", style: { visibility: visible ? "visible" : "hidden" }, children: [Config_1.AdditionalPicksStages.includes(stageLevel) && ((0, jsx_runtime_1.jsx)("h2", { children: t("pick_additional_pokemon_hint") })), stageLevel === 1 &&
                            specialGameRule === SpecialGameRule_1.SpecialGameRule.FIRST_PARTNER && ((0, jsx_runtime_1.jsx)("h2", { children: t("pick_first_partner_hint") })), (0, jsx_runtime_1.jsx)("div", { className: "game-pokemons-proposition-list", children: pokemonsProposition.map((proposition, index) => {
                                var _a, _b;
                                const item = itemsProposition[index];
                                return ((0, jsx_runtime_1.jsxs)("div", { className: "my-box active clickable", onClick: (e) => {
                                        e.stopPropagation();
                                        (0, audio_1.playSound)(audio_1.SOUNDS.BUTTON_CLICK);
                                        dispatch((0, NetworkStore_1.pokemonPropositionClick)(proposition));
                                    }, children: [proposition in Pokemon_1.PkmDuos ? ((0, jsx_runtime_1.jsx)(game_pokemon_duo_portrait_1.default, { origin: "proposition", index: index, duo: proposition, inPlanner: (_a = teamPlanner === null || teamPlanner === void 0 ? void 0 : teamPlanner.some((p) => p.name === proposition[0] ||
                                                p.name === proposition[1])) !== null && _a !== void 0 ? _a : false }, "proposition" + index)) : ((0, jsx_runtime_1.jsx)(game_pokemon_portrait_1.default, { origin: "proposition", index: index, pokemon: proposition, inPlanner: (_b = teamPlanner === null || teamPlanner === void 0 ? void 0 : teamPlanner.some((p) => p.name === proposition)) !== null && _b !== void 0 ? _b : false }, "proposition" + index)), item && Item_1.ShinyItems.includes(item) === false && ((0, jsx_runtime_1.jsxs)("div", { className: "additional-pick-item ", children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                                        fontSize: "2rem",
                                                        verticalAlign: "middle"
                                                    }, children: "+" }), (0, jsx_runtime_1.jsx)("img", { style: {
                                                        width: "2rem",
                                                        height: "2rem",
                                                        verticalAlign: "middle"
                                                    }, src: "assets/item/" + item + ".png" }), (0, jsx_runtime_1.jsx)("p", { children: (0, descriptions_1.addIconsToDescription)(t(`item_description.${item}`)) })] }))] }, index));
                            }) }), isBenchFull && (0, jsx_runtime_1.jsx)("p", { children: t("free_slot_hint") })] }), (0, jsx_runtime_1.jsx)("div", { className: "show-hide-action", children: (0, jsx_runtime_1.jsx)("button", { className: "bubbly orange active", onClick: () => {
                            setVisible(!visible);
                        }, children: visible ? t("hide") : t("show") }) })] }));
    }
    else {
        return null;
    }
}
//# sourceMappingURL=game-pokemons-proposition.js.map