"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PokemonCollection;
exports.PokemonCollectionList = PokemonCollectionList;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const react_tabs_1 = require("react-tabs");
const precomputed_pokemons_1 = require("../../../../../../gen/precomputed-pokemons");
const precomputed_pokemon_data_1 = require("../../../../../models/precomputed/precomputed-pokemon-data");
const Ability_1 = require("../../../../../types/enum/Ability");
const Passive_1 = require("../../../../../types/enum/Passive");
const Pokemon_1 = require("../../../../../types/enum/Pokemon");
const Synergy_1 = require("../../../../../types/enum/Synergy");
const hooks_1 = require("../../../hooks");
const store_1 = require("../../utils/store");
const synergy_icon_1 = __importDefault(require("../icons/synergy-icon"));
const pokemon_typeahead_1 = require("../typeahead/pokemon-typeahead");
const pokemon_collection_item_1 = __importDefault(require("./pokemon-collection-item"));
const pokemon_emotions_modal_1 = __importDefault(require("./pokemon-emotions-modal"));
const unown_panel_1 = __importDefault(require("./unown-panel"));
require("./pokemon-collection.css");
function PokemonCollection() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [selectedPokemon, setSelectedPokemon] = (0, react_1.useState)("");
    const prevFilterState = (0, react_1.useMemo)(() => {
        var _a, _b, _c;
        const prevState = store_1.localStore.get(store_1.LocalStoreKeys.COLLECTION_FILTER);
        return {
            mode: (_a = prevState === null || prevState === void 0 ? void 0 : prevState.mode) !== null && _a !== void 0 ? _a : "collection",
            filter: (_b = prevState === null || prevState === void 0 ? void 0 : prevState.filter) !== null && _b !== void 0 ? _b : "unlockable",
            sort: (_c = prevState === null || prevState === void 0 ? void 0 : prevState.sort) !== null && _c !== void 0 ? _c : "index"
        };
    }, []);
    const [filterState, setFilterState] = (0, react_1.useState)(prevFilterState);
    const [count, setCount] = (0, react_1.useState)(0);
    const [total, setTotal] = (0, react_1.useState)(0);
    const pokemonCollection = (0, hooks_1.useAppSelector)((state) => { var _a; return (_a = state.network.profile) === null || _a === void 0 ? void 0 : _a.pokemonCollection; });
    const updateCount = (0, react_1.useCallback)(function updateCount() {
        switch (filterState.mode) {
            case "pokedex":
                setCount(pokemonCollection
                    ? [...pokemonCollection.values()].filter((item) => item.played > 0).length
                    : 0);
                setTotal(precomputed_pokemons_1.precomputedPokemons.length);
                break;
            case "shiny":
                setCount(pokemonCollection
                    ? [...pokemonCollection.values()].filter((item) => item.shinyEmotions.length > 0).length
                    : 0);
                setTotal(precomputed_pokemons_1.precomputedPokemons.filter((p) => { var _a; return !((_a = Pokemon_1.AnimationConfig[p.name]) === null || _a === void 0 ? void 0 : _a.shinyUnavailable); }).length);
                break;
            default:
                setCount(pokemonCollection
                    ? [...pokemonCollection.values()].filter((item) => item.emotions.length > 0 || item.shinyEmotions.length > 0).length
                    : 0);
                setTotal(precomputed_pokemons_1.precomputedPokemons.length);
                break;
        }
    }, [filterState.mode]);
    (0, react_1.useEffect)(() => {
        store_1.localStore.set(store_1.LocalStoreKeys.COLLECTION_FILTER, filterState);
        updateCount();
    }, [filterState]);
    (0, react_1.useEffect)(() => {
        if (filterState.mode === "pokedex" && (filterState.filter === "unlockable" || filterState.filter === "refundable")) {
            setFilterState(Object.assign(Object.assign({}, filterState), { filter: "all" }));
        }
    }, [filterState.mode, filterState.filter]);
    return ((0, jsx_runtime_1.jsxs)("div", { id: "pokemon-collection", children: [(0, jsx_runtime_1.jsxs)("header", { children: [(0, jsx_runtime_1.jsxs)("select", { value: filterState.mode, onChange: (e) => setFilterState(Object.assign(Object.assign({}, filterState), { mode: e.target.value })), children: [(0, jsx_runtime_1.jsx)("option", { value: "collection", children: t("collection") }), (0, jsx_runtime_1.jsx)("option", { value: "shiny", children: t("shiny_hunter") }), (0, jsx_runtime_1.jsx)("option", { value: "pokedex", children: t("pokedex") })] }), (0, jsx_runtime_1.jsxs)("p", { children: [filterState.mode === "shiny"
                                ? t("shiny_hunter")
                                : filterState.mode === "pokedex"
                                    ? t("pokedex")
                                    : t("unlocked"), ": ", count, " / ", total] }), (0, jsx_runtime_1.jsxs)("select", { value: filterState.filter, onChange: (e) => setFilterState(Object.assign(Object.assign({}, filterState), { filter: e.target.value })), children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: t("show_all") }), filterState.mode !== "pokedex" && (0, jsx_runtime_1.jsx)("option", { value: "unlockable", children: t("show_unlockable") }), (0, jsx_runtime_1.jsx)("option", { value: "locked", children: t("show_locked") }), (0, jsx_runtime_1.jsx)("option", { value: "unlocked", children: t("show_unlocked") }), filterState.mode !== "pokedex" && (0, jsx_runtime_1.jsx)("option", { value: "refundable", children: t("show_refundable") })] }), (0, jsx_runtime_1.jsxs)("select", { value: filterState.sort, onChange: (e) => setFilterState(Object.assign(Object.assign({}, filterState), { sort: e.target.value })), children: [(0, jsx_runtime_1.jsx)("option", { value: "index", children: t("sort_by_index") }), (0, jsx_runtime_1.jsx)("option", { value: "shards", children: t("sort_by_shards") }), (0, jsx_runtime_1.jsx)("option", { value: "unlocked", children: t("sort_by_emotes_unlocked") }), (0, jsx_runtime_1.jsx)("option", { value: "played", children: t("sort_by_played") })] }), (0, jsx_runtime_1.jsx)(pokemon_typeahead_1.PokemonTypeahead, { value: selectedPokemon, onChange: setSelectedPokemon })] }), (0, jsx_runtime_1.jsx)("div", { style: { maxWidth: "100%" }, children: (0, jsx_runtime_1.jsxs)(react_tabs_1.Tabs, { children: [(0, jsx_runtime_1.jsxs)(react_tabs_1.TabList, { className: "pokemon-collection-tabs", children: [(0, jsx_runtime_1.jsx)(react_tabs_1.Tab, { children: t("all") }, "title-all"), Object.keys(Synergy_1.Synergy).map((type) => {
                                    return ((0, jsx_runtime_1.jsx)(react_tabs_1.Tab, { children: (0, jsx_runtime_1.jsx)(synergy_icon_1.default, { type: type }) }, "title-" + type));
                                }), (0, jsx_runtime_1.jsx)(react_tabs_1.Tab, { children: (0, jsx_runtime_1.jsx)("img", { src: "assets/ui/unown.svg", alt: "?", className: "unown-icon" }) }, "?")] }), ["all"].concat(Object.keys(Synergy_1.Synergy)).map((type) => {
                            return ((0, jsx_runtime_1.jsx)(react_tabs_1.TabPanel, { children: (0, jsx_runtime_1.jsx)(PokemonCollectionList, { type: type, setPokemon: setSelectedPokemon, filterState: filterState }) }, type));
                        }), (0, jsx_runtime_1.jsx)(react_tabs_1.TabPanel, { children: (0, jsx_runtime_1.jsx)(unown_panel_1.default, { setPokemon: setSelectedPokemon, filterState: filterState }) })] }) }), selectedPokemon && ((0, jsx_runtime_1.jsx)(pokemon_emotions_modal_1.default, { pokemon: selectedPokemon, onClose: () => setSelectedPokemon("") }))] }));
}
function PokemonCollectionList(props) {
    const pokemonCollection = (0, hooks_1.useAppSelector)((state) => { var _a; return (_a = state.network.profile) === null || _a === void 0 ? void 0 : _a.pokemonCollection; });
    const getConfig = (0, react_1.useCallback)((index) => pokemonCollection === null || pokemonCollection === void 0 ? void 0 : pokemonCollection.get(index), [pokemonCollection]);
    const pokemonsSorted = (0, react_1.useMemo)(() => {
        return Object.values(Pokemon_1.Pkm).sort((a, b) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            if (props.filterState.sort === "index") {
                return Pokemon_1.PkmFamily[a] === Pokemon_1.PkmFamily[b]
                    ? (0, precomputed_pokemon_data_1.getPokemonData)(a).stars - (0, precomputed_pokemon_data_1.getPokemonData)(b).stars
                    : Pokemon_1.PkmIndex[Pokemon_1.PkmFamily[a]].localeCompare(Pokemon_1.PkmIndex[Pokemon_1.PkmFamily[b]]);
            }
            else if (props.filterState.sort === "played") {
                return (((_b = (_a = getConfig(Pokemon_1.PkmIndex[b])) === null || _a === void 0 ? void 0 : _a.played) !== null && _b !== void 0 ? _b : 0) -
                    ((_d = (_c = getConfig(Pokemon_1.PkmIndex[a])) === null || _c === void 0 ? void 0 : _c.played) !== null && _d !== void 0 ? _d : 0));
            }
            else if (props.filterState.sort === "unlocked") {
                const configA = getConfig(Pokemon_1.PkmIndex[a]);
                const configB = getConfig(Pokemon_1.PkmIndex[b]);
                return ((((_e = configB === null || configB === void 0 ? void 0 : configB.emotions.length) !== null && _e !== void 0 ? _e : 0) + ((_f = configB === null || configB === void 0 ? void 0 : configB.shinyEmotions.length) !== null && _f !== void 0 ? _f : 0)) -
                    (((_g = configA === null || configA === void 0 ? void 0 : configA.emotions.length) !== null && _g !== void 0 ? _g : 0) + ((_h = configA === null || configA === void 0 ? void 0 : configA.shinyEmotions.length) !== null && _h !== void 0 ? _h : 0)));
            }
            else {
                return (((_k = (_j = getConfig(Pokemon_1.PkmIndex[b])) === null || _j === void 0 ? void 0 : _j.dust) !== null && _k !== void 0 ? _k : 0) -
                    ((_m = (_l = getConfig(Pokemon_1.PkmIndex[a])) === null || _l === void 0 ? void 0 : _l.dust) !== null && _m !== void 0 ? _m : 0));
            }
        });
    }, [props.filterState.sort, getConfig]);
    const pokemonsFiltered = (0, react_1.useMemo)(() => {
        return pokemonsSorted.filter((pkm) => {
            const pokemonData = (0, precomputed_pokemon_data_1.getPokemonData)(pkm);
            return (pkm !== Pokemon_1.Pkm.DEFAULT &&
                (pokemonData.skill !== Ability_1.Ability.DEFAULT ||
                    pokemonData.passive !== Passive_1.Passive.NONE) &&
                pokemonData.passive !== Passive_1.Passive.UNOWN &&
                (props.type === "all" ||
                    pokemonData.types.includes(Synergy_1.Synergy[props.type])));
        });
    }, [pokemonsSorted, props.type]);
    const elligiblePokemons = (0, react_1.useMemo)(() => pokemonsFiltered.map((pkm) => {
        const pokemonData = (0, precomputed_pokemon_data_1.getPokemonData)(pkm);
        return ((0, jsx_runtime_1.jsx)(pokemon_collection_item_1.default, { name: pkm, index: pokemonData.index, config: getConfig(pokemonData.index), filterState: props.filterState, setPokemon: props.setPokemon }, `${pokemonData.index}-${props.type}`));
    }), [getConfig, pokemonsFiltered, props.filterState, props.setPokemon, props.type]);
    return (0, jsx_runtime_1.jsx)("div", { className: "pokemon-collection-list", children: elligiblePokemons });
}
//# sourceMappingURL=pokemon-collection.js.map