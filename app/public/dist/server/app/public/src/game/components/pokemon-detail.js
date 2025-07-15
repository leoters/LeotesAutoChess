"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const i18next_1 = require("i18next");
const phaser_1 = require("phaser");
const client_1 = __importDefault(require("react-dom/client"));
const precomputed_pokemon_data_1 = require("../../../../models/precomputed/precomputed-pokemon-data");
const Config_1 = require("../../../../types/Config");
const Ability_1 = require("../../../../types/enum/Ability");
const Game_1 = require("../../../../types/enum/Game");
const Passive_1 = require("../../../../types/enum/Passive");
const Pokemon_1 = require("../../../../types/enum/Pokemon");
const Synergy_1 = require("../../../../types/enum/Synergy");
const ability_tooltip_1 = require("../../pages/component/ability/ability-tooltip");
const descriptions_1 = require("../../pages/utils/descriptions");
const avatar_1 = require("../../../../utils/avatar");
const dishes_1 = require("../../../../core/dishes");
const Item_1 = require("../../../../types/enum/Item");
class PokemonDetail extends phaser_1.GameObjects.DOMElement {
    constructor(scene, x, y, name, rarity, hp, atk, def, speDef, range, speed, critChance, critPower, ap, pp, luck = 0, types, skill, passive, emotion, shiny, index, stars, stages, evolution, items, inBattle) {
        super(scene, x, y);
        this.abilityDescription = null;
        this.passiveDescription = null;
        this.abilityRoot = null;
        this.passiveDescriptionRoot = null;
        this.dom = document.createElement("div");
        this.dom.className = "my-container game-pokemon-detail-tooltip";
        const wrap = document.createElement("div");
        wrap.className = `game-pokemon-detail ${inBattle ? "in-battle" : "in-board"}`;
        this.hp = document.createElement("span");
        this.hp.textContent = hp.toString();
        this.pp = document.createElement("span");
        this.pp.innerHTML = pp.toString();
        this.atk = document.createElement("span");
        this.atk.textContent = atk.toString();
        this.def = document.createElement("span");
        this.def.textContent = def.toString();
        this.speDef = document.createElement("span");
        this.speDef.textContent = speDef.toString();
        this.range = document.createElement("span");
        this.range.textContent = range.toString();
        this.speed = document.createElement("span");
        this.speed.textContent = speed.toString();
        this.luck = document.createElement("span");
        this.luck.textContent = luck.toString();
        this.critChance = document.createElement("span");
        this.critChance.textContent = critChance.toString() + "%";
        this.critPower = document.createElement("span");
        this.critPower.textContent = critPower.toString();
        this.ap = document.createElement("span");
        this.ap.textContent = ap.toString();
        this.ap.classList.toggle("negative", ap < 0);
        const avatar = document.createElement("img");
        avatar.className = "game-pokemon-detail-portrait";
        avatar.src = (0, avatar_1.getPortraitSrc)(index, shiny, emotion);
        avatar.style.borderColor = Config_1.RarityColor[rarity];
        wrap.appendChild(avatar);
        if (index === Pokemon_1.PkmIndex[Pokemon_1.Pkm.EGG]) {
            const eggHint = document.createElement("img");
            eggHint.className = "game-pokemon-detail-portrait-hint";
            eggHint.src = (0, avatar_1.getPortraitSrc)(Pokemon_1.PkmIndex[evolution]);
            wrap.appendChild(eggHint);
        }
        const entry = document.createElement("div");
        entry.className = "game-pokemon-detail-entry";
        wrap.appendChild(entry);
        const pokemonName = document.createElement("p");
        pokemonName.textContent = (0, i18next_1.t)(`pkm.${name}`);
        pokemonName.className = "game-pokemon-detail-entry-name";
        entry.appendChild(pokemonName);
        const pokemonRarity = document.createElement("p");
        pokemonRarity.textContent = (0, i18next_1.t)(`rarity.${rarity}`);
        pokemonRarity.style.color = Config_1.RarityColor[rarity];
        pokemonRarity.className = "game-pokemon-detail-entry-rarity";
        entry.appendChild(pokemonRarity);
        const pokemonStars = document.createElement("p");
        pokemonStars.className = "game-pokemon-detail-entry-tier";
        for (let i = 0; i < stars; i++) {
            const img = document.createElement("img");
            img.src = "assets/ui/star.svg";
            img.setAttribute("height", "16");
            pokemonStars.appendChild(img);
        }
        for (let i = stars; i < (0, precomputed_pokemon_data_1.getPokemonData)(name).stages; i++) {
            const img = document.createElement("img");
            img.src = "assets/ui/star_empty.svg";
            img.setAttribute("height", "16");
            pokemonStars.appendChild(img);
        }
        entry.appendChild(pokemonStars);
        const typesList = document.createElement("div");
        typesList.className = "game-pokemon-detail-types";
        types.forEach((type) => {
            const ty = document.createElement("img");
            ty.src = "assets/types/" + type + ".svg";
            ty.alt = type;
            ty.title = type;
            ty.className = "synergy-icon";
            ty.style.width = "34px";
            ty.style.height = "34px";
            typesList.appendChild(ty);
        });
        wrap.appendChild(typesList);
        let stats = inBattle ? [
            { stat: Game_1.Stat.HP, elm: this.hp },
            { stat: Game_1.Stat.DEF, elm: this.def },
            { stat: Game_1.Stat.ATK, elm: this.atk },
            { stat: Game_1.Stat.AP, elm: this.ap },
            { stat: Game_1.Stat.CRIT_POWER, elm: this.critPower },
            { stat: Game_1.Stat.PP, elm: this.pp },
            { stat: Game_1.Stat.SPE_DEF, elm: this.speDef },
            { stat: Game_1.Stat.SPEED, elm: this.speed },
            { stat: Game_1.Stat.LUCK, elm: this.luck },
            { stat: Game_1.Stat.CRIT_CHANCE, elm: this.critChance }
        ] : [
            { stat: Game_1.Stat.HP, elm: this.hp },
            { stat: Game_1.Stat.DEF, elm: this.def },
            { stat: Game_1.Stat.ATK, elm: this.atk },
            { stat: Game_1.Stat.RANGE, elm: this.range },
            { stat: Game_1.Stat.PP, elm: this.pp },
            { stat: Game_1.Stat.SPE_DEF, elm: this.speDef },
            { stat: Game_1.Stat.SPEED, elm: this.speed },
        ];
        if (passive === Passive_1.Passive.INANIMATE) {
            stats = [
                { stat: Game_1.Stat.HP, elm: this.hp },
                { stat: Game_1.Stat.DEF, elm: this.def },
                { stat: Game_1.Stat.SPE_DEF, elm: this.speDef }
            ];
        }
        const statsElm = document.createElement("div");
        statsElm.className = "game-pokemon-detail-stats";
        for (const { stat, elm } of stats) {
            const statElm = document.createElement("div");
            statElm.className = "game-pokemon-detail-stat-" + stat.toLowerCase();
            const statImg = document.createElement("img");
            statImg.src = `assets/icons/${stat}.png`;
            statImg.alt = stat;
            statImg.title = (0, i18next_1.t)(`stat.${stat}`);
            statElm.appendChild(statImg);
            statElm.appendChild(elm);
            statsElm.appendChild(statElm);
        }
        wrap.appendChild(statsElm);
        let dish = dishes_1.DishByPkm[name];
        if (!dish && types.has(Synergy_1.Synergy.GOURMET)) {
            if (items.includes(Item_1.Item.COOKING_POT)) {
                dish = Item_1.Item.HEARTY_STEW;
            }
            else if (name !== Pokemon_1.Pkm.GUZZLORD) {
                dish = Item_1.Item.SANDWICH;
            }
        }
        if (dish) {
            const pokemonDish = document.createElement("div");
            pokemonDish.className = "game-pokemon-detail-dish";
            client_1.default.createRoot(pokemonDish).render((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "game-pokemon-detail-dish-name", children: [(0, jsx_runtime_1.jsx)("img", { src: "assets/ui/dish.svg" }), (0, jsx_runtime_1.jsxs)("i", { children: [(0, i18next_1.t)("signature_dish"), ":"] }), " ", (0, i18next_1.t)(`item.${dish}`)] }), (0, jsx_runtime_1.jsx)("img", { src: `assets/item/${dish}.png`, className: "game-pokemon-detail-dish-icon", alt: dish, title: (0, i18next_1.t)(`item.${dish}`) }), (0, jsx_runtime_1.jsx)("p", { children: (0, descriptions_1.addIconsToDescription)((0, i18next_1.t)(`item_description.${dish}`)) })] }));
            wrap.appendChild(pokemonDish);
        }
        if (passive != Passive_1.Passive.NONE) {
            this.passiveDescription = document.createElement("div");
            this.passiveDescription.className = "game-pokemon-detail-passive";
            this.passiveDescriptionRoot = client_1.default.createRoot(this.passiveDescription);
            this.updatePassiveDescription({ passive, stars, ap, luck });
            wrap.appendChild(this.passiveDescription);
        }
        if (skill !== Ability_1.Ability.DEFAULT) {
            const abilityDiv = document.createElement("div");
            abilityDiv.className = "game-pokemon-detail-ult";
            this.abilityRoot = client_1.default.createRoot(abilityDiv);
            this.updateAbilityDescription({ skill, stars, stages, ap, luck });
            wrap.appendChild(abilityDiv);
        }
        this.dom.appendChild(wrap);
        this.setElement(this.dom);
    }
    updateValue(el, previousValue, value) {
        el.textContent = value.toString();
        el.classList.toggle("negative", value < 0);
    }
    updateAbilityDescription({ skill, stars, stages, ap, luck }) {
        var _a;
        (_a = this.abilityRoot) === null || _a === void 0 ? void 0 : _a.render((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "ability-name", children: (0, i18next_1.t)(`ability.${skill}`) }), (0, jsx_runtime_1.jsx)(ability_tooltip_1.AbilityTooltip, { ability: skill, stats: { stars, stages, ap, luck } })] }));
    }
    updatePassiveDescription({ passive, stars, ap, luck }) {
        var _a;
        (_a = this.passiveDescriptionRoot) === null || _a === void 0 ? void 0 : _a.render((0, jsx_runtime_1.jsx)("p", { children: (0, descriptions_1.addIconsToDescription)((0, i18next_1.t)(`passive_description.${passive}`), { stars, ap, luck }) }));
    }
}
exports.default = PokemonDetail;
//# sourceMappingURL=pokemon-detail.js.map