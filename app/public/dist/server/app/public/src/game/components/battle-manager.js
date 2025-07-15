"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = require("phaser");
const attacking_state_1 = require("../../../../core/attacking-state");
const pokemon_entity_1 = require("../../../../core/pokemon-entity");
const pokemon_1 = require("../../../../models/colyseus-models/pokemon");
const precomputed_pokemon_data_1 = require("../../../../models/precomputed/precomputed-pokemon-data");
const Config_1 = require("../../../../types/Config");
const Ability_1 = require("../../../../types/enum/Ability");
const Effect_1 = require("../../../../types/enum/Effect");
const Game_1 = require("../../../../types/enum/Game");
const Item_1 = require("../../../../types/enum/Item");
const Passive_1 = require("../../../../types/enum/Passive");
const Pokemon_1 = require("../../../../types/enum/Pokemon");
const number_1 = require("../../../../utils/number");
const random_1 = require("../../../../utils/random");
const utils_1 = require("../../pages/utils/utils");
const depths_1 = require("../depths");
const abilities_animations_1 = require("./abilities-animations");
const pokemon_2 = __importDefault(require("./pokemon"));
const pokemon_detail_1 = __importDefault(require("./pokemon-detail"));
class BattleManager {
    constructor(scene, group, simulation, animationManager, player) {
        this.pokemonSprites = new Map();
        this.group = group;
        this.scene = scene;
        this.animationManager = animationManager;
        this.player = player;
        this.boardEventSprites = new Array(Config_1.BOARD_WIDTH * Config_1.BOARD_HEIGHT).fill(null);
        this.pokemonSprites = new Map();
        if (simulation)
            this.setSimulation(simulation);
    }
    get flip() {
        var _a;
        return this.player.id !== ((_a = this.simulation) === null || _a === void 0 ? void 0 : _a.bluePlayerId);
    }
    buildPokemons() {
        var _a, _b;
        (_a = this.simulation) === null || _a === void 0 ? void 0 : _a.blueTeam.forEach((pkm, key) => {
            var _a;
            ((_a = this.simulation) === null || _a === void 0 ? void 0 : _a.id) &&
                this.addPokemonEntitySprite(this.simulation.id, pkm);
        });
        (_b = this.simulation) === null || _b === void 0 ? void 0 : _b.redTeam.forEach((pkm, key) => {
            var _a;
            ((_a = this.simulation) === null || _a === void 0 ? void 0 : _a.id) &&
                this.addPokemonEntitySprite(this.simulation.id, pkm);
        });
    }
    addPokemonEntitySprite(simulationId, pokemon) {
        var _a, _b, _c;
        if (((_a = this.simulation) === null || _a === void 0 ? void 0 : _a.id) === simulationId &&
            this.pokemonSprites.has(pokemon.id) === false) {
            const coordinates = (0, utils_1.transformEntityCoordinates)(pokemon.positionX, pokemon.positionY, this.flip);
            const pokemonUI = new pokemon_2.default(this.scene, coordinates[0], coordinates[1], pokemon, simulationId, true, this.flip);
            pokemonUI.setVisible((_c = (_b = this.simulation) === null || _b === void 0 ? void 0 : _b.started) !== null && _c !== void 0 ? _c : false);
            this.animationManager.animatePokemon(pokemonUI, pokemon.status.tree ? Game_1.PokemonActionState.IDLE : Game_1.PokemonActionState.WALK, this.flip);
            this.group.add(pokemonUI);
            this.pokemonSprites.set(pokemon.id, pokemonUI);
        }
    }
    clear() {
        this.group.getChildren().forEach((p) => {
            const pkm = p;
            if (pkm.projectile) {
                pkm.projectile.destroy();
            }
        });
        this.group.clear(true, true);
        this.boardEventSprites = new Array(Config_1.BOARD_WIDTH * Config_1.BOARD_HEIGHT).fill(null);
        this.pokemonSprites.clear();
    }
    removePokemon(simulationId, pokemon) {
        var _a;
        if (((_a = this.simulation) === null || _a === void 0 ? void 0 : _a.id) == simulationId &&
            this.pokemonSprites.has(pokemon.id)) {
            const pokemonSprite = this.pokemonSprites.get(pokemon.id);
            if (pokemon.passive === Passive_1.Passive.INANIMATE && pokemon.life > 0) {
                setTimeout(() => pokemonSprite.destroy(), 500);
            }
            else {
                this.animationManager.animatePokemon(pokemonSprite, Game_1.PokemonActionState.HURT, this.flip);
                pokemonSprite.deathAnimation();
            }
        }
    }
    updatePokemonItems(simulationId, pokemon) {
        var _a;
        if (((_a = this.simulation) === null || _a === void 0 ? void 0 : _a.id) === simulationId &&
            this.pokemonSprites.has(pokemon.id)) {
            const pkm = this.pokemonSprites.get(pokemon.id);
            pkm.itemsContainer.render(pokemon.items);
        }
    }
    changeStatus(simulationId, pokemon, field, previousValue) {
        var _a;
        if (pokemon.passive === Passive_1.Passive.INANIMATE)
            return;
        if (((_a = this.simulation) === null || _a === void 0 ? void 0 : _a.id) == simulationId &&
            this.pokemonSprites.has(pokemon.id)) {
            const pkm = this.pokemonSprites.get(pokemon.id);
            if (field === "poisonStacks") {
                if (pokemon.status.poisonStacks > 0) {
                    pkm.addPoison();
                }
                else {
                    pkm.removePoison();
                }
            }
            else if (field === "sleep") {
                if (pokemon.status.sleep) {
                    pkm.addSleep();
                    this.animationManager.animatePokemon(pkm, Game_1.PokemonActionState.SLEEP, this.flip);
                }
                else {
                    pkm.removeSleep();
                }
            }
            else if (field === "burn") {
                if (pokemon.status.burn) {
                    pkm.addBurn();
                }
                else {
                    pkm.removeBurn();
                }
            }
            else if (field === "silence") {
                if (pokemon.status.silence) {
                    pkm.addSilence();
                }
                else {
                    pkm.removeSilence();
                }
            }
            else if (field === "fatigue") {
                if (pokemon.status.fatigue) {
                    pkm.addFatigue();
                }
                else {
                    pkm.removeFatigue();
                }
            }
            else if (field === "confusion") {
                if (pokemon.status.confusion) {
                    pkm.addConfusion();
                }
                else {
                    pkm.removeConfusion();
                }
            }
            else if (field === "freeze") {
                if (pokemon.status.freeze) {
                    pkm.addFreeze();
                }
                else {
                    pkm.removeFreeze();
                }
            }
            else if (field === "protect") {
                if (pokemon.status.protect) {
                    pkm.addProtect();
                }
                else {
                    pkm.removeProtect();
                }
            }
            else if (field === "skydiving") {
                if (pokemon.status.skydiving) {
                    pkm.skydiveUp();
                }
                else {
                    pkm.skydiveDown();
                }
            }
            else if (field === "wound") {
                if (pokemon.status.wound) {
                    pkm.addWound();
                }
                else {
                    pkm.removeWound();
                }
            }
            else if (field === "resurection") {
                if (pokemon.status.resurection) {
                    pkm.addResurection();
                }
                else {
                    pkm.removeResurection();
                }
            }
            else if (field === "resurecting") {
                if (pokemon.status.resurecting) {
                    pkm.resurectAnimation();
                }
                else {
                    pkm.animationLocked = false;
                }
            }
            else if (field === "paralysis") {
                if (pokemon.status.paralysis) {
                    pkm.addParalysis();
                }
                else {
                    pkm.removeParalysis();
                }
            }
            else if (field === "pokerus") {
                if (pokemon.status.pokerus) {
                    pkm.addPokerus();
                }
                else {
                    pkm.removePokerus();
                }
            }
            else if (field === "possessed") {
                if (pokemon.status.possessed) {
                    pkm.addPossessed();
                }
                else if (previousValue === true) {
                    pkm.removePossessed();
                }
            }
            else if (field === "locked") {
                if (pokemon.status.locked) {
                    pkm.addLocked();
                }
                else {
                    pkm.removeLocked();
                }
            }
            else if (field === "blinded") {
                if (pokemon.status.blinded) {
                    pkm.addBlinded();
                }
                else {
                    pkm.removeBlinded();
                }
            }
            else if (field === "armorReduction") {
                if (pokemon.status.armorReduction) {
                    pkm.addArmorReduction();
                }
                else {
                    pkm.removeArmorReduction();
                }
            }
            else if (field === "charm") {
                if (pokemon.status.charm) {
                    pkm.addCharm();
                }
                else {
                    pkm.removeCharm();
                }
            }
            else if (field === "flinch") {
                if (pokemon.status.flinch) {
                    pkm.addFlinch();
                }
                else {
                    pkm.removeFlinch();
                }
            }
            else if (field === "runeProtect") {
                if (pokemon.status.runeProtect) {
                    pkm.addRuneProtect();
                }
                else {
                    pkm.removeRuneProtect();
                }
            }
            else if (field === "curse") {
                if (pokemon.status.curse) {
                    pkm.addCurse();
                }
                else {
                    pkm.removeCurse();
                }
            }
            else if (field === "curseVulnerability") {
                if (pokemon.status.curseVulnerability) {
                    pkm.addCurseVulnerability();
                }
            }
            else if (field === "curseWeakness") {
                if (pokemon.status.curseWeakness) {
                    pkm.addCurseWeakness();
                }
            }
            else if (field === "curseTorment") {
                if (pokemon.status.curseTorment) {
                    pkm.addCurseTorment();
                }
            }
            else if (field === "curseFate") {
                if (pokemon.status.curseFate) {
                    pkm.addCurseFate();
                }
            }
            else if (field === "spikeArmor") {
                if (pokemon.status.spikeArmor) {
                    pkm.addReflectShieldAnim();
                }
                else {
                    pkm.removeReflectShieldAnim();
                }
            }
            else if (field === "magicBounce") {
                if (pokemon.status.magicBounce) {
                    pkm.addReflectShieldAnim(0xffa0ff);
                }
                else {
                    pkm.removeReflectShieldAnim();
                }
            }
            else if (field === "reflect") {
                if (pokemon.status.reflect) {
                    pkm.addReflectShieldAnim(0xff3030);
                }
                else {
                    pkm.removeReflectShieldAnim();
                }
            }
            else if (field === "electricField") {
                if (pokemon.status.electricField) {
                    pkm.addElectricField();
                }
                else {
                    pkm.removeElectricField();
                }
            }
            else if (field === "psychicField") {
                if (pokemon.status.psychicField) {
                    pkm.addPsychicField();
                }
                else {
                    pkm.removePsychicField();
                }
            }
            else if (field === "grassField") {
                if (pokemon.status.grassField) {
                    pkm.addGrassField();
                }
                else {
                    pkm.removeGrassField();
                }
            }
            else if (field === "fairyField") {
                if (pokemon.status.fairyField) {
                    pkm.addFairyField();
                }
                else {
                    pkm.removeFairyField();
                }
            }
            else if (field === "enraged") {
                if (pokemon.status.enraged) {
                    pkm.addRageEffect();
                }
                else if (previousValue === true) {
                    pkm.removeRageEffect(pokemon.items.has(Item_1.Item.BERSERK_GENE));
                }
            }
        }
    }
    changeCount(simulationId, pokemon, field, value, previousValue) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        if (((_a = this.simulation) === null || _a === void 0 ? void 0 : _a.id) == simulationId &&
            this.group &&
            this.pokemonSprites.has(pokemon.id)) {
            const pkm = this.pokemonSprites.get(pokemon.id);
            if (field == "crit") {
                if (value != 0) {
                    this.displayCriticalHit(pkm.x, pkm.y);
                }
            }
            else if (field == "dodgeCount") {
                if (value != 0) {
                    this.displayDodge(pkm.x, pkm.y);
                }
            }
            else if (field == "ult") {
                if (value != 0) {
                    pkm.specialAttackAnimation(pokemon);
                }
            }
            else if (field === "fieldCount") {
                if (value != 0) {
                    (0, abilities_animations_1.displayAbility)(this.scene, [], "FIELD_DEATH", pkm.orientation, pkm.positionX, pkm.positionY, (_b = pkm.targetX) !== null && _b !== void 0 ? _b : -1, (_c = pkm.targetY) !== null && _c !== void 0 ? _c : -1, this.flip);
                }
            }
            else if (field == "fightingBlockCount") {
                if (value > 0 && value % 10 === 0) {
                    (0, abilities_animations_1.displayAbility)(this.scene, [], "FIGHTING_KNOCKBACK", pkm.orientation, pkm.positionX, pkm.positionY, (_d = pkm.targetX) !== null && _d !== void 0 ? _d : -1, (_e = pkm.targetY) !== null && _e !== void 0 ? _e : -1, this.flip);
                }
            }
            else if (field === "fairyCritCount") {
                if (value != 0) {
                    (0, abilities_animations_1.displayAbility)(this.scene, [], "FAIRY_CRIT", pkm.orientation, pkm.positionX, pkm.positionY, (_f = pkm.targetX) !== null && _f !== void 0 ? _f : -1, (_g = pkm.targetY) !== null && _g !== void 0 ? _g : -1, this.flip);
                }
            }
            else if (field === "powerLensCount") {
                if (value != 0) {
                    (0, abilities_animations_1.displayAbility)(this.scene, [], "POWER_LENS", pkm.orientation, pkm.positionX, pkm.positionY, (_h = pkm.targetX) !== null && _h !== void 0 ? _h : -1, (_j = pkm.targetY) !== null && _j !== void 0 ? _j : -1, this.flip);
                }
            }
            else if (field === "starDustCount") {
                if (value != 0) {
                    (0, abilities_animations_1.displayAbility)(this.scene, [], "STAR_DUST", pkm.orientation, pkm.positionX, pkm.positionY, (_k = pkm.targetX) !== null && _k !== void 0 ? _k : -1, (_l = pkm.targetY) !== null && _l !== void 0 ? _l : -1, this.flip);
                }
            }
            else if (field === "spellBlockedCount") {
                if (value != 0) {
                    this.displayBlockedSpell(pkm.x, pkm.y);
                }
            }
            else if (field === "manaBurnCount") {
                if (value != 0) {
                    this.displayManaBurn(pkm.x, pkm.y);
                }
            }
            else if (field === "moneyCount") {
                if (value > 0) {
                    this.scene.displayMoneyGain(pkm.x, pkm.y, value - previousValue);
                }
            }
            else if (field === "amuletCoinCount") {
                if (value > 0) {
                    pkm.itemsContainer.updateCount(Item_1.Item.AMULET_COIN, value);
                }
            }
            else if (field === "bottleCapCount") {
                if (value > 0) {
                    pkm.itemsContainer.updateCount(Item_1.Item.GOLD_BOTTLE_CAP, value);
                }
            }
            else if (field === "attackCount") {
                if (value !== 0) {
                    if (pkm.action == Game_1.PokemonActionState.ATTACK &&
                        pkm.targetX !== null &&
                        pkm.targetY !== null) {
                        const { delayBeforeShoot, travelTime } = (0, attacking_state_1.getAttackTimings)(pokemon);
                        pkm.attackAnimation(pokemon.targetX, pokemon.targetY, delayBeforeShoot, travelTime);
                    }
                }
            }
            else if (field === "tripleAttackCount") {
                if (value !== 0) {
                    this.displayTripleAttack(pkm.x, pkm.y);
                }
            }
            else if (field === "upgradeCount") {
                pkm.itemsContainer.updateCount(Item_1.Item.UPGRADE, value);
            }
            else if (field === "soulDewCount") {
                pkm.itemsContainer.updateCount(Item_1.Item.SOUL_DEW, value);
            }
            else if (field === "defensiveRibbonCount") {
                pkm.itemsContainer.updateCount(Item_1.Item.MUSCLE_BAND, value);
            }
            else if (field === "magmarizerCount") {
                pkm.itemsContainer.updateCount(Item_1.Item.MAGMARIZER, value);
            }
        }
    }
    changePokemon(simulationId, pokemon, field, value, previousValue) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (((_a = this.simulation) === null || _a === void 0 ? void 0 : _a.id) == simulationId &&
            this.pokemonSprites.has(pokemon.id)) {
            const pkm = this.pokemonSprites.get(pokemon.id);
            if (field === "positionX" || field === "positionY") {
                if (field === "positionX") {
                    pkm.positionX = pokemon.positionX;
                }
                else if (field == "positionY") {
                    pkm.positionY = pokemon.positionY;
                }
                const coordinates = (0, utils_1.transformEntityCoordinates)(pokemon.positionX, pokemon.positionY, this.flip);
                if (pokemon.skill == Ability_1.Ability.TELEPORT) {
                    pkm.x = coordinates[0];
                    pkm.y = coordinates[1];
                    pkm.specialAttackAnimation(pokemon);
                }
                else if (!pokemon.status.skydiving) {
                    pkm.moveManager.setSpeed(2 *
                        (0, pokemon_entity_1.getMoveSpeed)(pokemon) *
                        Math.max(Math.abs(pkm.x - coordinates[0]), Math.abs(pkm.y - coordinates[1])));
                    pkm.moveManager.moveTo(coordinates[0], coordinates[1]);
                }
            }
            else if (field === "orientation" &&
                pkm.orientation !== pokemon.orientation) {
                pkm.orientation = pokemon.orientation;
                if (pokemon.action !== Game_1.PokemonActionState.SLEEP) {
                    this.animationManager.animatePokemon(pkm, pokemon.action, this.flip);
                }
            }
            else if (field === "action" && pkm.action !== pokemon.action) {
                pkm.action = pokemon.action;
                this.animationManager.animatePokemon(pkm, pokemon.action, this.flip);
            }
            else if (field == "critChance") {
                pkm.critChance = pokemon.critChance;
                if (pkm.detail && pkm.detail instanceof pokemon_detail_1.default) {
                    pkm.detail.critChance.textContent =
                        pokemon.critChance.toString() + "%";
                }
            }
            else if (field === "critPower") {
                pkm.critPower = parseFloat(pokemon.critPower.toFixed(2));
                if (pkm.detail && pkm.detail instanceof pokemon_detail_1.default) {
                    pkm.detail.critPower.textContent = pokemon.critPower.toFixed(2);
                }
            }
            else if (field === "ap") {
                if (value && value > (previousValue || 0)) {
                    pkm.displayBoost(Game_1.Stat.AP);
                }
                pkm.ap = pokemon.ap;
                if (pkm.detail && pkm.detail instanceof pokemon_detail_1.default) {
                    pkm.detail.updateValue(pkm.detail.ap, previousValue, value);
                    pkm.detail.updateAbilityDescription(pkm);
                    if (pokemon.passive != Passive_1.Passive.NONE) {
                        pkm.detail.updatePassiveDescription(pokemon);
                    }
                }
            }
            else if (field === "luck") {
                pkm.luck = pokemon.luck;
                if (pkm.detail && pkm.detail instanceof pokemon_detail_1.default) {
                    pkm.detail.updateValue(pkm.detail.luck, previousValue, value);
                    pkm.detail.updateAbilityDescription(pkm);
                    if (pokemon.passive != Passive_1.Passive.NONE) {
                        pkm.detail.updatePassiveDescription(pokemon);
                    }
                }
            }
            else if (field === "speed") {
                if (value && value > (previousValue || 0)) {
                    pkm.displayBoost(Game_1.Stat.SPEED);
                }
                pkm.speed = pokemon.speed;
                if (pkm.detail && pkm.detail instanceof pokemon_detail_1.default) {
                    pkm.detail.speed.textContent = pokemon.speed.toString();
                }
            }
            else if (field === "hp") {
                const baseHP = (0, precomputed_pokemon_data_1.getPokemonData)(pokemon.name).hp;
                const sizeBuff = (pokemon.hp - baseHP) / baseHP;
                pkm.sprite.setScale(2 + sizeBuff);
                (_b = pkm.lifebar) === null || _b === void 0 ? void 0 : _b.setMaxLife(pokemon.hp);
            }
            else if (field == "life") {
                pkm.life = pokemon.life;
                (_c = pkm.lifebar) === null || _c === void 0 ? void 0 : _c.setLife(pkm.life);
                if (pkm.detail && pkm.detail instanceof pokemon_detail_1.default) {
                    pkm.detail.hp.textContent = pokemon.life.toString();
                }
            }
            else if (field === "shield") {
                if (pokemon.shield >= 0) {
                    if (value && value > (previousValue || 0)) {
                        pkm.displayBoost(Game_1.Stat.SHIELD);
                    }
                    pkm.shield = pokemon.shield;
                    (_d = pkm.lifebar) === null || _d === void 0 ? void 0 : _d.setShield(pkm.shield);
                }
            }
            else if (field === "pp") {
                pkm.pp = pokemon.pp;
                (_e = pkm.lifebar) === null || _e === void 0 ? void 0 : _e.setPP((0, number_1.max)(pkm.maxPP)(pkm.pp));
                if (pkm.detail && pkm.detail instanceof pokemon_detail_1.default) {
                    pkm.detail.updateValue(pkm.detail.pp, previousValue, value);
                }
            }
            else if (field === "atk") {
                if (value && value > (previousValue || 0)) {
                    pkm.displayBoost(Game_1.Stat.ATK);
                }
                pkm.atk = pokemon.atk;
                if (pkm.detail && pkm.detail instanceof pokemon_detail_1.default) {
                    pkm.detail.updateValue(pkm.detail.atk, previousValue, value);
                }
            }
            else if (field === "def") {
                if (value && value > (previousValue || 0)) {
                    pkm.displayBoost(Game_1.Stat.DEF);
                }
                pkm.def = pokemon.def;
                if (pkm.detail && pkm.detail instanceof pokemon_detail_1.default) {
                    pkm.detail.updateValue(pkm.detail.def, previousValue, value);
                }
            }
            else if (field === "speDef") {
                if (value && value > (previousValue || 0)) {
                    pkm.displayBoost(Game_1.Stat.SPE_DEF);
                }
                pkm.speDef = pokemon.speDef;
                if (pkm.detail && pkm.detail instanceof pokemon_detail_1.default) {
                    pkm.detail.updateValue(pkm.detail.speDef, previousValue, value);
                }
            }
            else if (field === "range") {
                pkm.range = pokemon.range;
                if (pkm.detail && pkm.detail instanceof pokemon_detail_1.default) {
                    pkm.detail.updateValue(pkm.detail.range, previousValue, value);
                }
            }
            else if (field === "targetX") {
                if (pokemon.targetX >= 0) {
                    pkm.targetX = pokemon.targetX;
                }
                else {
                    pkm.targetX = null;
                }
            }
            else if (field === "targetY") {
                if (pokemon.targetY >= 0) {
                    pkm.targetY = pokemon.targetY;
                }
                else {
                    pkm.targetY = null;
                }
            }
            else if (field === "team") {
                if (pkm.lifebar) {
                    pkm.lifebar.setTeam(value, this.flip);
                }
            }
            else if (field === "index") {
                if (pkm.index !== value) {
                    pkm.lazyloadAnimations(this.scene, true);
                    pkm.index = value;
                    pkm.attackSprite =
                        (_g = (_f = new pokemon_1.PokemonClasses[Pokemon_1.PkmByIndex[value]]()) === null || _f === void 0 ? void 0 : _f.attackSprite) !== null && _g !== void 0 ? _g : pkm.attackSprite;
                    pkm.lazyloadAnimations(this.scene);
                    pkm.displayAnimation("EVOLUTION");
                    this.animationManager.animatePokemon(pkm, Game_1.PokemonActionState.IDLE, this.flip, false);
                }
            }
            else if (field === "shiny") {
                if (pkm.shiny !== value) {
                    pkm.shiny = value;
                    this.animationManager.animatePokemon(pkm, Game_1.PokemonActionState.IDLE, this.flip, false);
                }
            }
            else if (field === "skill") {
                pkm.skill = value;
                if (pkm.detail && pkm.detail instanceof pokemon_detail_1.default) {
                    pkm.detail.updateAbilityDescription(pkm);
                }
            }
            else if (field === "stars") {
                pkm.stars = value;
                if (pkm.detail && pkm.detail instanceof pokemon_detail_1.default) {
                    pkm.detail.updateAbilityDescription(pkm);
                }
            }
        }
    }
    displayDodge(x, y) {
        const textStyle = {
            fontSize: "25px",
            fontFamily: "Verdana",
            color: "#FFFFFF",
            align: "center",
            strokeThickness: 2,
            stroke: "#000"
        };
        const crit = this.scene.add.existing(new phaser_1.GameObjects.Text(this.scene, x - 40, y - 50, "DODGE !", textStyle));
        crit.setDepth(depths_1.DEPTH.TEXT);
        this.scene.add.tween({
            targets: [crit],
            ease: "Linear",
            duration: 1000,
            delay: 0,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },
            y: {
                getStart: () => y - 50,
                getEnd: () => y - 110
            },
            onComplete: () => {
                crit.destroy();
            }
        });
    }
    displayCriticalHit(x, y) {
        const textStyle = {
            fontSize: "25px",
            fontFamily: "Verdana",
            color: "#FF0000",
            align: "center",
            strokeThickness: 2,
            stroke: "#000"
        };
        const crit = this.scene.add.existing(new phaser_1.GameObjects.Text(this.scene, x - 25, y - 50, "CRIT !", textStyle));
        crit.setDepth(depths_1.DEPTH.TEXT);
        this.scene.add.tween({
            targets: [crit],
            ease: "Linear",
            duration: 1000,
            delay: 0,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },
            y: {
                getStart: () => y - 50,
                getEnd: () => y - 110
            },
            onComplete: () => {
                crit.destroy();
            }
        });
    }
    displayBlockedSpell(x, y) {
        const textStyle = {
            fontSize: "25px",
            fontFamily: "Verdana",
            color: "#007BA7",
            align: "center",
            strokeThickness: 2,
            stroke: "#000"
        };
        const blockedSpell = this.scene.add.existing(new phaser_1.GameObjects.Text(this.scene, x - 30, y - 50, "Block!", textStyle));
        blockedSpell.setDepth(depths_1.DEPTH.TEXT);
        this.scene.add.tween({
            targets: [blockedSpell],
            ease: "Linear",
            duration: 1000,
            delay: 0,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },
            y: {
                getStart: () => y - 50,
                getEnd: () => y - 110
            },
            onComplete: () => {
                blockedSpell.destroy();
            }
        });
    }
    displayManaBurn(x, y) {
        const textStyle = {
            fontSize: "20px",
            fontFamily: "Verdana",
            color: "#9f40ff",
            align: "center",
            strokeThickness: 2,
            stroke: "#000"
        };
        const manaBurn = this.scene.add.existing(new phaser_1.GameObjects.Text(this.scene, x - 30, y - 50, "Burn!", textStyle));
        manaBurn.setDepth(depths_1.DEPTH.TEXT);
        this.scene.add.tween({
            targets: [manaBurn],
            ease: "Linear",
            duration: 1000,
            delay: 0,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },
            y: {
                getStart: () => y - 50,
                getEnd: () => y - 110
            },
            onComplete: () => {
                manaBurn.destroy();
            }
        });
    }
    displayTripleAttack(x, y) {
        const textStyle = {
            fontSize: "25px",
            fontFamily: "Verdana",
            color: "#FFFF00",
            align: "center",
            strokeThickness: 2,
            stroke: "#000"
        };
        const tripleAttack = this.scene.add.existing(new phaser_1.GameObjects.Text(this.scene, x - 30, y - 50, "ZAP!", textStyle));
        tripleAttack.setDepth(depths_1.DEPTH.TEXT_MINOR);
        this.scene.add.tween({
            targets: [tripleAttack],
            ease: "Linear",
            duration: 1000,
            delay: 0,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },
            y: {
                getStart: () => y - 50,
                getEnd: () => y - 110
            },
            onComplete: () => {
                tripleAttack.destroy();
            }
        });
    }
    displayAbility(id, skill, orientation, positionX, positionY, targetX, targetY, delay) {
        var _a;
        if (((_a = this.simulation) === null || _a === void 0 ? void 0 : _a.id) === id && skill) {
            (0, abilities_animations_1.displayAbility)(this.scene, this.group.getChildren(), skill, orientation, positionX, positionY, targetX !== null && targetX !== void 0 ? targetX : -1, targetY !== null && targetY !== void 0 ? targetY : -1, this.flip, delay !== null && delay !== void 0 ? delay : -1);
        }
    }
    displayBoardEvent(event) {
        const coordinates = (0, utils_1.transformEntityCoordinates)(event.x, event.y, this.flip);
        const index = event.y * Config_1.BOARD_WIDTH + event.x;
        const existingBoardEventSprite = this.boardEventSprites[index];
        if (existingBoardEventSprite != null) {
            this.group.remove(existingBoardEventSprite, true, true);
            this.boardEventSprites[index] = null;
        }
        if (event.effect === Effect_1.EffectEnum.LIGHTNING_STRIKE) {
            const thunderSprite = this.scene.add.sprite(coordinates[0], coordinates[1], "abilities", `${Ability_1.Ability.THUNDER}/000.png`);
            thunderSprite.setDepth(depths_1.DEPTH.WEATHER_FX);
            thunderSprite.setScale(2, 2);
            thunderSprite.anims.play(Ability_1.Ability.THUNDER);
            thunderSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                thunderSprite.destroy();
            });
        }
        if (event.effect === Effect_1.EffectEnum.SMOKE) {
            const sprite = this.scene.add.sprite(coordinates[0], coordinates[1], "abilities", "SMOKE/000.png");
            sprite.setDepth(depths_1.DEPTH.BOARD_EFFECT_AIR_LEVEL);
            sprite.anims.play(Effect_1.EffectEnum.SMOKE);
            sprite.setScale(3, 3);
            sprite.setAlpha(0);
            this.boardEventSprites[index] = sprite;
            this.group.add(sprite);
            this.scene.tweens.add({
                targets: sprite,
                alpha: 1,
                duration: 500
            });
        }
        if (event.effect === Effect_1.EffectEnum.POISON_GAS) {
            const sprite = this.scene.add.sprite(coordinates[0], coordinates[1], "abilities", `${Effect_1.EffectEnum.SMOKE}/000.png`);
            sprite.setDepth(depths_1.DEPTH.BOARD_EFFECT_AIR_LEVEL);
            sprite.setScale(3, 3);
            sprite.anims.play(Effect_1.EffectEnum.SMOKE);
            sprite.setTint(0xa0ff20);
            sprite.setFlipX(true);
            sprite.setAlpha(0);
            this.boardEventSprites[index] = sprite;
            this.group.add(sprite);
            this.scene.tweens.add({
                targets: sprite,
                alpha: 0.5,
                duration: 500,
                delay: (8 - coordinates[1]) * 100
            });
        }
        if (event.effect === Effect_1.EffectEnum.STEALTH_ROCKS) {
            const sprite = this.scene.add.sprite(coordinates[0], coordinates[1], "abilities", "STEALTH_ROCKS/013.png");
            sprite.setDepth(depths_1.DEPTH.BOARD_EFFECT_GROUND_LEVEL);
            sprite.setScale(1, 1);
            this.boardEventSprites[index] = sprite;
            this.group.add(sprite);
            this.scene.tweens.add({
                targets: sprite,
                alpha: 1,
                duration: 200,
                delay: 1000
            });
        }
        if (event.effect === Effect_1.EffectEnum.SPIKES) {
            const sprite = this.scene.add.sprite(coordinates[0], coordinates[1] + 16, "abilities", "SPIKES/001.png");
            sprite
                .setDepth(depths_1.DEPTH.BOARD_EFFECT_GROUND_LEVEL)
                .setOrigin(0.5, 0.5)
                .setScale(0, 0);
            this.boardEventSprites[index] = sprite;
            this.group.add(sprite);
            this.scene.tweens.add({
                targets: sprite,
                alpha: 1,
                duration: 200,
                delay: 500,
                scaleX: 1,
                scaleY: 1
            });
        }
        if (event.effect === Effect_1.EffectEnum.TOXIC_SPIKES) {
            const spriteNumber = (0, random_1.pickRandomIn)([0, 1, 2]).toString();
            const sprite = this.scene.add.sprite(coordinates[0], coordinates[1] + 16, "abilities", "TOXIC_SPIKES/00" + spriteNumber + ".png");
            sprite
                .setDepth(depths_1.DEPTH.BOARD_EFFECT_GROUND_LEVEL)
                .setOrigin(0.5, 0.5)
                .setScale(0, 0);
            this.boardEventSprites[index] = sprite;
            this.group.add(sprite);
            this.scene.tweens.add({
                targets: sprite,
                alpha: 1,
                duration: 200,
                delay: 500,
                scaleX: 2,
                scaleY: 2
            });
        }
        if (event.effect === Effect_1.EffectEnum.STICKY_WEB) {
            const sprite = this.scene.add.sprite(coordinates[0], coordinates[1], "abilities", `${Effect_1.EffectEnum.STICKY_WEB}/000.png`);
            sprite.setDepth(depths_1.DEPTH.BOARD_EFFECT_POKEMON_LEVEL);
            sprite.setScale(3, 3);
            sprite.anims.play(Effect_1.EffectEnum.STICKY_WEB);
            sprite.setAlpha(0);
            this.boardEventSprites[index] = sprite;
            this.group.add(sprite);
            this.scene.tweens.add({
                targets: sprite,
                alpha: 0.4,
                duration: 1000
            });
        }
        if (event.effect === Effect_1.EffectEnum.COTTON_BALL) {
            const sprite = this.scene.add.sprite(coordinates[0], coordinates[1], "abilities", `${Ability_1.Ability.COTTON_SPORE}/025.png`);
            sprite.setDepth(depths_1.DEPTH.BOARD_EFFECT_GROUND_LEVEL);
            sprite.setScale(2, 2);
            sprite.setAlpha(0);
            this.boardEventSprites[index] = sprite;
            this.group.add(sprite);
            this.scene.tweens.add({
                targets: sprite,
                alpha: 0.5,
                duration: 1000
            });
        }
        if (event.effect === Effect_1.EffectEnum.HAIL) {
            const sprite = this.scene.add.sprite(coordinates[0], coordinates[1], "abilities", `${Effect_1.EffectEnum.HAIL}/000.png`);
            sprite.setDepth(depths_1.DEPTH.BOARD_EFFECT_GROUND_LEVEL).setScale(1).setAlpha(0);
            sprite.anims.play(Effect_1.EffectEnum.HAIL);
            this.boardEventSprites[index] = sprite;
            this.group.add(sprite);
            this.scene.tweens.add({
                targets: sprite,
                alpha: 1,
                duration: 200,
                delay: 800
            });
        }
        if (event.effect === Effect_1.EffectEnum.EMBER) {
            const sprite = this.scene.add.sprite(coordinates[0], coordinates[1] + 12, "abilities", `${Effect_1.EffectEnum.EMBER}/000.png`);
            sprite.setDepth(depths_1.DEPTH.BOARD_EFFECT_GROUND_LEVEL).setScale(2).setAlpha(0);
            sprite.anims.play(Effect_1.EffectEnum.EMBER);
            this.boardEventSprites[index] = sprite;
            this.group.add(sprite);
            this.scene.tweens.add({
                targets: sprite,
                alpha: 1,
                duration: 200,
                delay: 800
            });
        }
    }
    clearBoardEvents() {
        this.boardEventSprites.forEach((sprite, index) => {
            if (sprite != null) {
                this.group.remove(sprite, true, true);
                this.boardEventSprites[index] = null;
            }
        });
    }
    displayHit(x, y) {
        const hitSprite = this.scene.add.sprite(x + (Math.random() - 0.5) * 30, y + (Math.random() - 0.5) * 30, "attacks", "NORMAL/hit/000.png");
        hitSprite.setDepth(depths_1.DEPTH.HIT_FX_ABOVE_POKEMON);
        hitSprite.setScale(2, 2);
        hitSprite.anims.play("NORMAL/hit");
        hitSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            hitSprite.destroy();
        });
    }
    displayDamage(positionX, positionY, damage, type, index, id) {
        var _a;
        if (((_a = this.simulation) === null || _a === void 0 ? void 0 : _a.id) === id) {
            const coordinates = (0, utils_1.transformEntityCoordinates)(positionX, positionY, this.flip);
            const color = type === Game_1.AttackType.PHYSICAL
                ? "#e76e55"
                : type === Game_1.AttackType.SPECIAL
                    ? "#209cee"
                    : "#f7d51d";
            this.displayTween(color, coordinates, index, damage);
            this.displayHit(coordinates[0], coordinates[1]);
        }
    }
    displayHeal(positionX, positionY, amount, type, index, id) {
        var _a;
        if (((_a = this.simulation) === null || _a === void 0 ? void 0 : _a.id) === id) {
            const coordinates = (0, utils_1.transformEntityCoordinates)(positionX, positionY, this.flip);
            const color = type === Game_1.HealType.HEAL ? "#92cc41" : "#8d8d8d";
            this.displayTween(color, coordinates, index, amount);
        }
    }
    displayTween(color, coordinates, index, amount) {
        if (!this.scene.sys.displayList)
            return;
        const fontSize = amount < 10
            ? "20px"
            : amount < 20
                ? "25px"
                : amount < 30
                    ? "30px"
                    : amount < 50
                        ? "35px"
                        : "40px";
        const textStyle = {
            fontSize: fontSize,
            fontFamily: "Verdana",
            color: color,
            align: "center",
            strokeThickness: 2,
            stroke: "#000"
        };
        const dy = Math.round(50 * (Math.random() - 0.5));
        const image = this.scene.add.existing(new phaser_1.GameObjects.Image(this.scene, 0, 0, `portrait-${index}`)
            .setScale(0.5, 0.5)
            .setOrigin(0, 0));
        const text = this.scene.add.existing(new phaser_1.GameObjects.Text(this.scene, 25, 0, amount.toFixed(0), textStyle));
        image.setDepth(depths_1.DEPTH.DAMAGE_PORTRAIT);
        text.setDepth(depths_1.DEPTH.DAMAGE_TEXT);
        const container = this.scene.add.existing(new phaser_1.GameObjects.Container(this.scene, coordinates[0] + 30, coordinates[1] + dy, [text, image]));
        this.scene.add.tween({
            targets: [container],
            ease: "linear",
            duration: 1500,
            delay: 0,
            x: {
                getStart: () => container.x,
                getEnd: () => container.x + Math.random() * 50
            },
            y: {
                getStart: () => container.y,
                getEnd: () => container.y + Math.random() * 50
            },
            scale: {
                getStart: () => 1,
                getEnd: () => 0.5
            },
            alpha: {
                getStart: () => 1,
                getEnd: () => 0,
                delay: 800
            },
            onComplete: () => {
                container.destroy();
            }
        });
    }
    setSimulation(simulation) {
        this.simulation = simulation;
        this.clear();
        this.buildPokemons();
    }
    onSimulationStart() {
        this.pokemonSprites.forEach((pkm) => {
            pkm.setVisible(true);
        });
    }
    setPlayer(player) {
        this.player = player;
    }
}
exports.default = BattleManager;
//# sourceMappingURL=battle-manager.js.map