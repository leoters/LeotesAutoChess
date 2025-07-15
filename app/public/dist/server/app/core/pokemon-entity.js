"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonEntity = void 0;
exports.getStrongestUnit = getStrongestUnit;
exports.getUnitScore = getUnitScore;
exports.canSell = canSell;
exports.getMoveSpeed = getMoveSpeed;
const schema_1 = require("@colyseus/schema");
const nanoid_1 = require("nanoid");
const count_1 = __importDefault(require("../models/colyseus-models/count"));
const player_1 = __importDefault(require("../models/colyseus-models/player"));
const pokemon_1 = require("../models/colyseus-models/pokemon");
const status_1 = __importDefault(require("../models/colyseus-models/status"));
const effects_1 = require("../models/effects");
const pokemon_factory_1 = __importDefault(require("../models/pokemon-factory"));
const precomputed_pokemon_data_1 = require("../models/precomputed/precomputed-pokemon-data");
const shop_1 = require("../models/shop");
const types_1 = require("../types");
const Config_1 = require("../types/Config");
const Ability_1 = require("../types/enum/Ability");
const Effect_1 = require("../types/enum/Effect");
const Game_1 = require("../types/enum/Game");
const Item_1 = require("../types/enum/Item");
const Passive_1 = require("../types/enum/Passive");
const Pokemon_1 = require("../types/enum/Pokemon");
const SpecialGameRule_1 = require("../types/enum/SpecialGameRule");
const Synergy_1 = require("../types/enum/Synergy");
const Weather_1 = require("../types/enum/Weather");
const array_1 = require("../utils/array");
const board_1 = require("../utils/board");
const distance_1 = require("../utils/distance");
const number_1 = require("../utils/number");
const random_1 = require("../utils/random");
const schemas_1 = require("../utils/schemas");
const attacking_state_1 = __importDefault(require("./attacking-state"));
const effect_1 = require("./effects/effect");
const items_1 = require("./effects/items");
const passives_1 = require("./effects/passives");
const idle_state_1 = require("./idle-state");
const items_2 = require("./items");
const moving_state_1 = __importDefault(require("./moving-state"));
const simulation_command_1 = require("./simulation-command");
class PokemonEntity extends schema_1.Schema {
    constructor(pokemon, positionX, positionY, team, simulation) {
        super();
        this.action = Game_1.PokemonActionState.WALK;
        this.orientation = Game_1.Orientation.DOWNLEFT;
        this.pp = 0;
        this.ap = 0;
        this.luck = 0;
        this.critChance = Config_1.DEFAULT_CRIT_CHANCE;
        this.critPower = Config_1.DEFAULT_CRIT_POWER;
        this.shield = 0;
        this.targetEntityId = "";
        this.targetX = -1;
        this.targetY = -1;
        this.effects = new schema_1.SetSchema();
        this.items = new schema_1.SetSchema();
        this.types = new schema_1.SetSchema();
        this.cooldown = 500;
        this.oneSecondCooldown = 1000;
        this.flyingProtection = 0;
        this.grassHealCooldown = 2000;
        this.sandstormDamageTimer = 0;
        this.fairySplashCooldown = 0;
        this.isSpawn = false;
        this.commands = new Array();
        this.effectsSet = new Set();
        this.state = new moving_state_1.default();
        this.refToBoardPokemon = pokemon;
        pokemon.items.forEach((it) => {
            this.items.add(it);
        });
        this.status = new status_1.default(simulation);
        this.count = new count_1.default();
        this.simulation = simulation;
        this.id = (0, nanoid_1.nanoid)();
        this.rarity = pokemon.rarity;
        this.positionX = positionX;
        this.positionY = positionY;
        this.index = pokemon.index;
        this.name = pokemon.name;
        this.action = Game_1.PokemonActionState.WALK;
        this.orientation = Game_1.Orientation.DOWNLEFT;
        this.baseAtk = pokemon.atk;
        this.baseDef = pokemon.def;
        this.baseSpeDef = pokemon.speDef;
        this.baseRange = pokemon.range;
        this.baseHP = pokemon.hp;
        this.atk = pokemon.atk;
        this.def = pokemon.def;
        this.speDef = pokemon.speDef;
        this.attackType = pokemon.attackType;
        this.hp = pokemon.hp;
        this.maxPP = pokemon.maxPP;
        this.life = pokemon.hp;
        this.speed = pokemon.speed;
        this.range = pokemon.range;
        this.team = team;
        this.attackSprite = pokemon.attackSprite;
        this.stars = pokemon.stars;
        this.skill = pokemon.skill;
        this.shiny = pokemon.shiny;
        this.emotion = pokemon.emotion;
        this.ap = pokemon.ap;
        this.luck = pokemon.permanentLuck;
        this.dodge = 0;
        this.physicalDamage = 0;
        this.specialDamage = 0;
        this.trueDamage = 0;
        this.physicalDamageReduced = 0;
        this.specialDamageReduced = 0;
        this.shieldDamageTaken = 0;
        this.healDone = 0;
        this.shieldDone = 0;
        this.cooldown = Math.round(500 * (50 / this.speed));
        pokemon.types.forEach((type) => {
            this.types.add(type);
        });
        this.passive = Passive_1.Passive.NONE;
        this.changePassive(pokemon.passive);
    }
    update(dt, board, player) {
        this.state.update(this, dt, board, player);
    }
    get canMove() {
        return (!this.status.freeze &&
            !this.status.sleep &&
            !this.status.resurecting &&
            !this.status.locked);
    }
    get canBeCopied() {
        return this.passive !== Passive_1.Passive.INANIMATE;
    }
    get isGhostOpponent() {
        return this.simulation.isGhostBattle && this.team === Game_1.Team.RED_TEAM;
    }
    isTargettableBy(attacker, targetEnemies = true, targetAllies = false) {
        return (!this.status.resurecting &&
            ((targetAllies && this.team === attacker.team) ||
                (targetEnemies && this.team !== attacker.team) ||
                (attacker.effects.has(Effect_1.EffectEnum.MERCILESS) &&
                    attacker.id !== this.id &&
                    this.life <= 0.1 * this.hp)));
    }
    get player() {
        const player = this.team === Game_1.Team.BLUE_TEAM
            ? this.simulation.bluePlayer
            : this.simulation.redPlayer;
        if (player instanceof player_1.default) {
            return player;
        }
        else {
            return undefined;
        }
    }
    get inSpotlight() {
        if (!this.player)
            return false;
        const { lightX, lightY } = this.player;
        const { positionX, positionY } = this.refToBoardPokemon;
        return ((positionX === lightX && positionY === lightY) ||
            this.items.has(Item_1.Item.SHINY_STONE) ||
            (this.passive === Passive_1.Passive.CONVERSION &&
                this.types.has(Synergy_1.Synergy.LIGHT) &&
                !this.items.has(Item_1.Item.LIGHT_BALL)));
    }
    hasSynergyEffect(synergy) {
        return effects_1.SynergyEffects[synergy].some((effect) => this.effects.has(effect));
    }
    setTarget(target) {
        if (target) {
            this.targetEntityId = target.id;
            this.targetX = target.positionX;
            this.targetY = target.positionY;
        }
        else {
            this.targetEntityId = "";
            this.targetX = -1;
            this.targetY = -1;
        }
    }
    handleDamage(params) {
        return this.state.handleDamage(Object.assign({ target: this }, params));
    }
    handleSpecialDamage(damage, board, attackType, attacker, crit, apBoost = true) {
        var _a;
        if (this.status.protect ||
            this.status.skydiving ||
            this.status.magicBounce) {
            this.count.spellBlockedCount++;
            if (this.status.magicBounce &&
                attackType === Game_1.AttackType.SPECIAL &&
                damage > 0 &&
                attacker &&
                !attacker.items.has(Item_1.Item.PROTECTIVE_PADS)) {
                const bounceCrit = crit ||
                    (this.effects.has(Effect_1.EffectEnum.ABILITY_CRIT) &&
                        (0, random_1.chance)(this.critChance, this));
                const bounceDamage = Math.round(((_a = [0.5, 1][this.stars - 1]) !== null && _a !== void 0 ? _a : 1) *
                    damage *
                    (1 + this.ap / 100) *
                    (bounceCrit ? this.critPower : 1));
                attacker.handleDamage({
                    damage: bounceDamage,
                    board,
                    attackType: Game_1.AttackType.SPECIAL,
                    attacker: this,
                    shouldTargetGainMana: true
                });
            }
            return { death: false, takenDamage: 0 };
        }
        else {
            let specialDamage = damage + (damage * (attacker && apBoost ? attacker.ap : 0)) / 100;
            if (attacker && attacker.effects.has(Effect_1.EffectEnum.DOUBLE_DAMAGE)) {
                specialDamage *= 2;
                attacker.effects.delete(Effect_1.EffectEnum.DOUBLE_DAMAGE);
            }
            if (crit && attacker && this.items.has(Item_1.Item.ROCKY_HELMET) === false) {
                specialDamage = Math.round(specialDamage * attacker.critPower);
            }
            if (attacker &&
                attacker.items.has(Item_1.Item.POKEMONOMICON) &&
                attackType === Game_1.AttackType.SPECIAL) {
                this.status.triggerBurn(3000, this, attacker);
            }
            if ((attacker === null || attacker === void 0 ? void 0 : attacker.passive) === Passive_1.Passive.BERSERK) {
                attacker.addAbilityPower(5, attacker, 0, false, false);
            }
            const damageResult = this.state.handleDamage({
                target: this,
                damage: specialDamage,
                board,
                attackType,
                attacker,
                shouldTargetGainMana: true
            });
            if (this.items.has(Item_1.Item.POWER_LENS) &&
                specialDamage >= 1 &&
                attacker &&
                !attacker.items.has(Item_1.Item.PROTECTIVE_PADS) &&
                attackType === Game_1.AttackType.SPECIAL) {
                const speDef = this.status.armorReduction
                    ? Math.round(this.speDef / 2)
                    : this.speDef;
                const damageAfterReduction = specialDamage / (1 + Config_1.ARMOR_FACTOR * speDef);
                const damageBlocked = (0, number_1.min)(0)(specialDamage - damageAfterReduction);
                attacker.handleDamage({
                    damage: Math.round(damageBlocked),
                    board,
                    attackType: Game_1.AttackType.SPECIAL,
                    attacker: this,
                    shouldTargetGainMana: true
                });
            }
            return damageResult;
        }
    }
    handleHeal(heal, caster, apBoost, crit) {
        return this.state.handleHeal(this, heal, caster, apBoost, crit);
    }
    addShield(shield, caster, apBoost, crit) {
        return this.state.addShield(this, shield, caster, apBoost, crit);
    }
    changeState(state) {
        this.state.onExit(this);
        this.state = state;
        this.state.onEnter(this);
    }
    toMovingState() {
        if (this.passive === Passive_1.Passive.INANIMATE)
            return;
        this.changeState(new moving_state_1.default());
    }
    toAttackingState() {
        if (this.passive === Passive_1.Passive.INANIMATE)
            return;
        this.changeState(new attacking_state_1.default());
    }
    toIdleState() {
        this.changeState(new idle_state_1.IdleState());
    }
    addPP(value, caster, apBoost, crit) {
        value = Math.round(value *
            (1 + (apBoost * caster.ap) / 100) *
            (crit ? caster.critPower : 1) *
            (this.status.fatigue && value > 0 ? 0.5 : 1));
        if (!this.status.silence &&
            !this.status.protect &&
            !this.status.resurecting &&
            !(value < 0 && this.status.tree)) {
            this.pp = (0, number_1.clamp)(this.pp + value, 0, this.maxPP * 2 - 1);
        }
    }
    addCritChance(value, caster, apBoost, crit) {
        value =
            value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1);
        this.critChance += value;
        if (this.critChance > 100) {
            const overCritChance = Math.round(this.critChance - 100);
            this.addCritPower(overCritChance, this, 0, false);
            this.critChance = 100;
        }
    }
    addCritPower(value, caster, apBoost, crit) {
        value =
            (value / 100) *
                (1 + (apBoost * caster.ap) / 100) *
                (crit ? caster.critPower : 1);
        this.critPower = (0, number_1.min)(0)((0, number_1.roundToNDigits)(this.critPower + value, 2));
    }
    addMaxHP(value, caster, apBoost, crit, permanent = false) {
        if (this.life <= 0)
            return;
        value =
            value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1);
        const update = (target) => {
            target.hp = (0, number_1.min)(1)(target.hp + value);
        };
        update(this);
        this.life = (0, number_1.clamp)(this.life + value, 1, this.hp);
        if (permanent && !this.isGhostOpponent) {
            update(this.refToBoardPokemon);
        }
        if (this.hp >= 1500 && this.player) {
            this.player.titles.add(types_1.Title.GIANT);
        }
    }
    addDodgeChance(value, caster, apBoost, crit) {
        value =
            value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1);
        this.dodge = (0, number_1.clamp)(this.dodge + value, 0, 0.9);
    }
    addAbilityPower(value, caster, apBoost, crit, permanent = false) {
        value = Math.round(value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1));
        const update = (target) => {
            target.ap = (0, number_1.min)(-100)(target.ap + value);
        };
        update(this);
        if (permanent && !this.isGhostOpponent) {
            update(this.refToBoardPokemon);
        }
    }
    addLuck(value, caster, apBoost, crit, permanent = false) {
        value =
            value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1);
        const update = (target) => {
            target.luck = (0, number_1.clamp)(target.luck + value, -100, +100);
        };
        update(this);
        if (permanent && !this.isGhostOpponent) {
            update(this.refToBoardPokemon);
        }
    }
    addDefense(value, caster, apBoost, crit, permanent = false) {
        value = Math.round(value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1));
        const update = (target) => {
            target.def = (0, number_1.min)(0)(target.def + value);
        };
        update(this);
        if (permanent && !this.isGhostOpponent) {
            update(this.refToBoardPokemon);
        }
    }
    addSpecialDefense(value, caster, apBoost, crit, permanent = false) {
        value = Math.round(value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1));
        const update = (target) => {
            target.speDef = (0, number_1.min)(0)(target.speDef + value);
        };
        update(this);
        if (permanent && !this.isGhostOpponent) {
            update(this.refToBoardPokemon);
        }
    }
    addAttack(value, caster, apBoost, crit, permanent = false) {
        value = Math.round(value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1));
        const update = (target) => {
            target.atk = (0, number_1.min)(1)(target.atk + value);
        };
        update(this);
        if (permanent && !this.isGhostOpponent) {
            update(this.refToBoardPokemon);
        }
    }
    addSpeed(value, caster, apBoost, crit, permanent = false) {
        if (this.passive === Passive_1.Passive.MELMETAL) {
            this.addAttack(value * 0.5, caster, apBoost, crit, permanent);
        }
        else {
            value =
                value *
                    (1 + (apBoost * caster.ap) / 100) *
                    (crit ? caster.critPower : 1);
            const update = (target) => {
                target.speed = (0, number_1.clamp)(target.speed + value, 0, 300);
            };
            update(this);
            if (permanent && !this.isGhostOpponent) {
                update(this.refToBoardPokemon);
            }
        }
    }
    addItem(item, permanent = false) {
        const type = Item_1.SynergyGivenByItem[item];
        if (this.items.size >= 3 ||
            (Item_1.SynergyStones.includes(item) && this.types.has(type)) ||
            ((item === Item_1.Item.EVIOLITE || item === Item_1.Item.RARE_CANDY) &&
                !this.refToBoardPokemon.hasEvolution) ||
            (item === Item_1.Item.RARE_CANDY && this.items.has(Item_1.Item.EVIOLITE))) {
            return;
        }
        if (this.items.has(item) == false) {
            this.items.add(item);
            this.simulation.applyItemEffect(this, item);
        }
        if (permanent && !this.isGhostOpponent) {
            this.refToBoardPokemon.items.add(item);
        }
        if (type && !this.types.has(type)) {
            this.types.add(type);
            this.simulation.applySynergyEffects(this, type);
        }
    }
    removeItem(item, permanent = false) {
        this.items.delete(item);
        this.removeItemEffect(item);
        if (permanent && !this.isGhostOpponent) {
            this.refToBoardPokemon.items.delete(item);
        }
    }
    removeItemEffect(item) {
        var _a, _b, _c;
        Object.entries((_a = items_2.ItemStats[item]) !== null && _a !== void 0 ? _a : {}).forEach(([stat, value]) => this.applyStat(stat, -value));
        const type = Item_1.SynergyGivenByItem[item];
        const default_types = (0, precomputed_pokemon_data_1.getPokemonData)(this.name).types;
        if (type && !default_types.includes(type)) {
            this.types.delete(type);
            effects_1.SynergyEffects[type].forEach((effectName) => {
                this.effects.delete(effectName);
                this.effectsSet.forEach((effect) => {
                    if (effect.origin === effectName)
                        this.effectsSet.delete(effect);
                });
            });
        }
        (_c = (_b = items_1.ItemEffects[item]) === null || _b === void 0 ? void 0 : _b.filter((effect) => effect instanceof effect_1.OnItemRemovedEffect)) === null || _c === void 0 ? void 0 : _c.forEach((effect) => effect.apply(this));
    }
    moveTo(x, y, board) {
        this.toMovingState();
        const target = board.getEntityOnCell(x, y);
        if (target)
            target.toMovingState();
        board.swapCells(this.positionX, this.positionY, x, y);
        this.cooldown = 100;
    }
    skydiveTo(x, y, board) {
        board.swapCells(this.positionX, this.positionY, x, y);
        this.status.skydiving = true;
        this.toMovingState();
        this.cooldown = 1000;
    }
    onAttack({ target, board, physicalDamage, specialDamage, trueDamage, totalDamage, isTripleAttack }) {
        this.addPP(Config_1.ON_ATTACK_MANA, this, 0, false);
        this.effectsSet.forEach((effect) => {
            if (effect instanceof effect_1.OnAttackEffect) {
                effect.apply({
                    pokemon: this,
                    target,
                    board,
                    physicalDamage,
                    specialDamage,
                    trueDamage,
                    totalDamage,
                    isTripleAttack
                });
            }
        });
        const itemEffects = (0, schemas_1.values)(this.items)
            .flatMap((item) => { var _a; return (_a = items_1.ItemEffects[item]) !== null && _a !== void 0 ? _a : []; })
            .filter((effect) => effect instanceof effect_1.OnAttackEffect);
        itemEffects.forEach((effect) => {
            effect.apply({
                pokemon: this,
                target,
                board,
                physicalDamage,
                specialDamage,
                trueDamage,
                totalDamage,
                isTripleAttack
            });
        });
        if (this.effects.has(Effect_1.EffectEnum.TELEPORT_NEXT_ATTACK)) {
            const crit = this.effects.has(Effect_1.EffectEnum.ABILITY_CRIT) &&
                (0, random_1.chance)(this.critChance / 100, this);
            target.handleSpecialDamage([15, 30, 60][this.stars - 1], board, Game_1.AttackType.SPECIAL, this, crit);
            this.effects.delete(Effect_1.EffectEnum.TELEPORT_NEXT_ATTACK);
        }
        if (this.effects.has(Effect_1.EffectEnum.SHADOW_PUNCH_NEXT_ATTACK)) {
            const crit = this.effects.has(Effect_1.EffectEnum.ABILITY_CRIT) &&
                (0, random_1.chance)(this.critChance / 100, this);
            target.handleSpecialDamage([30, 60, 120][this.stars - 1], board, Game_1.AttackType.SPECIAL, this, crit);
            this.effects.delete(Effect_1.EffectEnum.SHADOW_PUNCH_NEXT_ATTACK);
        }
        if (target.effects.has(Effect_1.EffectEnum.OBSTRUCT)) {
            this.addDefense(-2, target, 0, false);
        }
    }
    onHit({ target, board, totalTakenDamage, physicalDamage, specialDamage, trueDamage }) {
        if (this.passive === Passive_1.Passive.BERRY_EATER) {
            for (const item of target.items.values()) {
                Item_1.Berries.includes(item) && this.eatBerry(item, target);
            }
        }
        if (target.passive === Passive_1.Passive.PSYDUCK && (0, random_1.chance)(0.1, this)) {
            target.status.triggerConfusion(3000, target, target);
        }
        if (this.name === Pokemon_1.Pkm.MINIOR) {
            this.addSpeed(5, this, 1, false);
        }
        if (this.passive === Passive_1.Passive.DREAM_CATCHER && target.status.sleep) {
            const allies = board.cells.filter((p) => p && p.team === this.team && p.id !== this.id);
            const alliesHit = allies
                .sort((a, b) => (0, distance_1.distanceM)(a.positionX, a.positionY, this.targetX, this.targetY) -
                (0, distance_1.distanceM)(b.positionX, b.positionY, this.targetX, this.targetY))
                .slice(0, 2);
            alliesHit.forEach((ally) => {
                ally.addShield(10, ally, 1, false);
                ally.simulation.room.broadcast(types_1.Transfer.ABILITY, {
                    id: ally.simulation.id,
                    skill: Ability_1.Ability.MOON_DREAM,
                    positionX: ally.positionX,
                    positionY: ally.positionY
                });
            });
        }
        const onHitEffects = [
            ...this.effectsSet.values(),
            ...(0, schemas_1.values)(this.items).flatMap((item) => { var _a; return (_a = items_1.ItemEffects[item]) !== null && _a !== void 0 ? _a : []; })
        ].filter((effect) => effect instanceof effect_1.OnHitEffect);
        onHitEffects.forEach((effect) => {
            effect.apply({ attacker: this, target, board, totalTakenDamage, physicalDamage, specialDamage, trueDamage });
        });
        if (this.hasSynergyEffect(Synergy_1.Synergy.ICE)) {
            const nbIcyRocks = this.player && this.simulation.weather === Weather_1.Weather.SNOW
                ? (0, array_1.count)(this.player.items, Item_1.Item.ICY_ROCK)
                : 0;
            if (this.types.has(Synergy_1.Synergy.ICE) || nbIcyRocks > 0) {
                let freezeChance = 0;
                if (this.effects.has(Effect_1.EffectEnum.CHILLY)) {
                    freezeChance = 0.2;
                }
                else if (this.effects.has(Effect_1.EffectEnum.FROSTY)) {
                    freezeChance = 0.3;
                }
                else if (this.effects.has(Effect_1.EffectEnum.FREEZING)) {
                    freezeChance = 0.4;
                }
                else if (this.effects.has(Effect_1.EffectEnum.SHEER_COLD)) {
                    freezeChance = 0.4;
                }
                freezeChance += nbIcyRocks * 0.05;
                if ((0, random_1.chance)(freezeChance, this)) {
                    target.status.triggerFreeze(2000, target);
                }
            }
        }
        if (this.hasSynergyEffect(Synergy_1.Synergy.FIRE)) {
            let burnChance = 0.3;
            const nbHeatRocks = this.player && this.simulation.weather === Weather_1.Weather.SUN
                ? (0, array_1.count)(this.player.items, Item_1.Item.HEAT_ROCK)
                : 0;
            burnChance += nbHeatRocks * 0.05;
            if ((0, random_1.chance)(burnChance, this)) {
                target.status.triggerBurn(3000, target, this);
            }
        }
        if (this.hasSynergyEffect(Synergy_1.Synergy.MONSTER)) {
            const flinchChance = 0.3;
            if ((0, random_1.chance)(flinchChance, this)) {
                target.status.triggerFlinch(3000, target, this);
            }
        }
        if (this.hasSynergyEffect(Synergy_1.Synergy.GHOST)) {
            const silenceChance = 0.2;
            if ((0, random_1.chance)(silenceChance, this)) {
                target.status.triggerSilence(2000, target, this);
            }
        }
        if (this.hasSynergyEffect(Synergy_1.Synergy.POISON)) {
            let poisonChance = 0;
            if (this.effects.has(Effect_1.EffectEnum.POISONOUS)) {
                poisonChance = 0.3;
            }
            if (this.effects.has(Effect_1.EffectEnum.VENOMOUS)) {
                poisonChance = 0.6;
            }
            if (this.effects.has(Effect_1.EffectEnum.TOXIC)) {
                poisonChance = 1.0;
            }
            if (target.player) {
                const nbSmellyClays = (0, array_1.count)(target.player.items, Item_1.Item.SMELLY_CLAY);
                poisonChance -= nbSmellyClays * 0.1;
            }
            if (poisonChance > 0 && (0, random_1.chance)(poisonChance, this)) {
                target.status.triggerPoison(4000, target, this);
            }
        }
        if (this.hasSynergyEffect(Synergy_1.Synergy.WILD)) {
            const woundChance = 0.25;
            if ((0, random_1.chance)(woundChance, this)) {
                target.status.triggerWound(3000, target, this);
            }
        }
        if (target.status.spikeArmor &&
            (0, distance_1.distanceC)(this.positionX, this.positionY, target.positionX, target.positionY) === 1 &&
            !this.items.has(Item_1.Item.PROTECTIVE_PADS)) {
            const damage = Math.round(target.def * (1 + target.ap / 100));
            const crit = target.effects.has(Effect_1.EffectEnum.ABILITY_CRIT) &&
                (0, random_1.chance)(target.critChance, this);
            this.status.triggerWound(2000, this, target);
            this.handleSpecialDamage(damage, board, Game_1.AttackType.SPECIAL, target, crit, true);
        }
        if (target.effects.has(Effect_1.EffectEnum.SHELL_TRAP) && physicalDamage > 0) {
            const cells = board.getAdjacentCells(target.positionX, target.positionY);
            const crit = target.effects.has(Effect_1.EffectEnum.ABILITY_CRIT) &&
                (0, random_1.chance)(target.critChance, this);
            target.effects.delete(Effect_1.EffectEnum.SHELL_TRAP);
            this.simulation.room.broadcast(types_1.Transfer.ABILITY, {
                id: this.simulation.id,
                skill: "SHELL_TRAP_trigger",
                positionX: target.positionX,
                positionY: target.positionY,
                orientation: target.orientation
            });
            cells.forEach((cell) => {
                if (cell.value && cell.value.team !== target.team) {
                    cell.value.handleSpecialDamage(100, board, Game_1.AttackType.SPECIAL, target, crit, true);
                }
            });
        }
    }
    onDamageDealt({ target, damage }) {
        if (this.hasSynergyEffect(Synergy_1.Synergy.HUMAN)) {
            let lifesteal = 0;
            if (this.effects.has(Effect_1.EffectEnum.MEDITATE)) {
                lifesteal = 0.25;
            }
            else if (this.effects.has(Effect_1.EffectEnum.FOCUS_ENERGY)) {
                lifesteal = 0.4;
            }
            else if (this.effects.has(Effect_1.EffectEnum.CALM_MIND)) {
                lifesteal = 0.6;
            }
            this.handleHeal(Math.ceil(lifesteal * damage), this, 0, false);
        }
        if (this.items.has(Item_1.Item.SHELL_BELL)) {
            this.handleHeal(Math.ceil(0.33 * damage), this, 0, false);
        }
        if (this.simulation.weather === Weather_1.Weather.BLOODMOON &&
            target.status.wound &&
            this.player &&
            this.player.items.includes(Item_1.Item.BLOOD_STONE)) {
            const nbBloodStones = (0, array_1.count)(this.player.items, Item_1.Item.BLOOD_STONE);
            if (nbBloodStones > 0) {
                this.handleHeal(Math.ceil(0.2 * nbBloodStones * damage), this, 0, false);
            }
        }
    }
    onDamageReceived({ attacker, damage, board }) {
        if (this.flyingProtection > 0 &&
            this.life > 0 &&
            this.canMove &&
            !this.status.paralysis) {
            const pcLife = this.life / this.hp;
            if (this.effects.has(Effect_1.EffectEnum.TAILWIND) && pcLife < 0.2) {
                this.flyAway(board);
                this.flyingProtection--;
            }
            else if (this.effects.has(Effect_1.EffectEnum.FEATHER_DANCE) && pcLife < 0.2) {
                this.status.triggerProtect(2000);
                this.flyAway(board);
                this.flyingProtection--;
            }
            else if (this.effects.has(Effect_1.EffectEnum.MAX_AIRSTREAM)) {
                if ((this.flyingProtection === 2 && pcLife < 0.5) ||
                    (this.flyingProtection === 1 && pcLife < 0.2)) {
                    this.status.triggerProtect(2000);
                    this.flyAway(board);
                    this.flyingProtection--;
                }
            }
            else if (this.effects.has(Effect_1.EffectEnum.SKYDIVE)) {
                if ((this.flyingProtection === 2 && pcLife < 0.5) ||
                    (this.flyingProtection === 1 && pcLife < 0.2)) {
                    const destination = board.getFarthestTargetCoordinateAvailablePlace(this);
                    if (destination) {
                        this.status.triggerProtect(2000);
                        this.simulation.room.broadcast(types_1.Transfer.ABILITY, {
                            id: this.simulation.id,
                            skill: "FLYING_TAKEOFF",
                            positionX: this.positionX,
                            positionY: this.positionY,
                            targetX: destination.target.positionX,
                            targetY: destination.target.positionY
                        });
                        this.skydiveTo(destination.x, destination.y, board);
                        this.setTarget(destination.target);
                        this.flyingProtection--;
                        this.commands.push(new simulation_command_1.DelayedCommand(() => {
                            this.simulation.room.broadcast(types_1.Transfer.ABILITY, {
                                id: this.simulation.id,
                                skill: "FLYING_SKYDIVE",
                                positionX: destination.x,
                                positionY: destination.y,
                                targetX: destination.target.positionX,
                                targetY: destination.target.positionY
                            });
                        }, 500));
                        this.commands.push(new simulation_command_1.DelayedCommand(() => {
                            var _a;
                            if (((_a = destination.target) === null || _a === void 0 ? void 0 : _a.hp) > 0) {
                                destination.target.handleSpecialDamage(1.5 * this.atk, board, Game_1.AttackType.PHYSICAL, this, (0, random_1.chance)(this.critChance, this));
                            }
                        }, 1000));
                    }
                }
            }
        }
        if (this.count.fightingBlockCount > 0 &&
            this.count.fightingBlockCount % 10 === 0 &&
            (0, distance_1.distanceC)(this.positionX, this.positionY, this.targetX, this.targetY) ===
                1) {
            const targetAtContact = board.getEntityOnCell(this.targetX, this.targetY);
            const destination = this.state.getNearestAvailablePlaceCoordinates(this, board, 4);
            if (destination && targetAtContact) {
                targetAtContact.shield = 0;
                targetAtContact.handleDamage({
                    damage: this.atk,
                    board,
                    attackType: Game_1.AttackType.PHYSICAL,
                    attacker: this,
                    shouldTargetGainMana: true
                });
                targetAtContact.moveTo(destination.x, destination.y, board);
            }
        }
        const berry = (0, schemas_1.values)(this.items).find((item) => Item_1.Berries.includes(item));
        if (berry && this.life > 0 && this.life < 0.5 * this.hp) {
            this.eatBerry(berry);
        }
        if (this.status.sleepCooldown > 0) {
            this.status.sleepCooldown -= 300;
        }
        if (this.status.charmCooldown > 0 && attacker === this.status.charmOrigin) {
            this.status.charmCooldown -= 500;
        }
        const onDamageReceivedEffects = [
            ...this.effectsSet.values(),
            ...(0, schemas_1.values)(this.items).flatMap((item) => { var _a; return (_a = items_1.ItemEffects[item]) !== null && _a !== void 0 ? _a : []; })
        ].filter((effect) => effect instanceof effect_1.OnDamageReceivedEffect);
        onDamageReceivedEffects.forEach((effect) => {
            effect.apply(this, attacker, board, damage);
        });
    }
    onCriticalAttack({ target, board, damage }) {
        if (target.fairySplashCooldown === 0 && target.types.has(Synergy_1.Synergy.FAIRY)) {
            let shockDamageFactor = 0.3;
            if (target.effects.has(Effect_1.EffectEnum.AROMATIC_MIST)) {
                shockDamageFactor += 0.2;
            }
            else if (target.effects.has(Effect_1.EffectEnum.FAIRY_WIND)) {
                shockDamageFactor += 0.4;
            }
            else if (target.effects.has(Effect_1.EffectEnum.STRANGE_STEAM)) {
                shockDamageFactor += 0.6;
            }
            else if (target.effects.has(Effect_1.EffectEnum.MOON_FORCE)) {
                shockDamageFactor += 0.8;
            }
            const shockDamage = shockDamageFactor * damage;
            target.count.fairyCritCount++;
            target.fairySplashCooldown = 250;
            const distance = (0, distance_1.distanceC)(this.positionX, this.positionY, target.positionX, target.positionY);
            if (distance <= 1 && this.items.has(Item_1.Item.PROTECTIVE_PADS) === false) {
                this.handleSpecialDamage(shockDamage, board, Game_1.AttackType.SPECIAL, target, false);
            }
        }
        if (this.items.has(Item_1.Item.SCOPE_LENS)) {
            const ppStolen = (0, number_1.max)(target.pp)(10);
            this.addPP(ppStolen, this, 0, false);
            target.addPP(-ppStolen, this, 0, false);
            target.count.manaBurnCount++;
        }
        if (this.items.has(Item_1.Item.RAZOR_FANG)) {
            target.status.triggerArmorReduction(4000, target);
        }
        if (target.items.has(Item_1.Item.BABIRI_BERRY)) {
            target.eatBerry(Item_1.Item.BABIRI_BERRY);
        }
    }
    onKill({ target, board, attackType }) {
        const itemEffects = (0, schemas_1.values)(this.items)
            .flatMap((item) => { var _a; return (_a = items_1.ItemEffects[item]) !== null && _a !== void 0 ? _a : []; })
            .filter((effect) => effect instanceof effect_1.OnKillEffect);
        itemEffects.forEach((effect) => {
            effect.apply(this, target, board, attackType);
        });
        this.effectsSet.forEach((effect) => {
            if (effect instanceof effect_1.OnKillEffect) {
                effect.apply(this, target, board, attackType);
            }
        });
        if (this.passive === Passive_1.Passive.SOUL_HEART) {
            this.addPP(10, this, 0, false);
            this.addAbilityPower(10, this, 0, false);
        }
        if (this.passive === Passive_1.Passive.BEAST_BOOST_ATK) {
            this.addAttack(5, this, 0, false);
        }
        if (this.passive === Passive_1.Passive.BEAST_BOOST_AP) {
            this.addAbilityPower(10, this, 0, false);
        }
        board.forEach((x, y, v) => v &&
            v.passive === Passive_1.Passive.MOXIE &&
            v.team === this.team &&
            v.addAttack(target.stars, v, 0, false));
        if (target.effects.has(Effect_1.EffectEnum.ODD_FLOWER) ||
            target.effects.has(Effect_1.EffectEnum.GLOOM_FLOWER) ||
            target.effects.has(Effect_1.EffectEnum.VILE_FLOWER) ||
            target.effects.has(Effect_1.EffectEnum.SUN_FLOWER)) {
            if (!target.simulation.flowerSpawn[target.team]) {
                target.simulation.flowerSpawn[target.team] = true;
                const spawnSpot = board.getFarthestTargetCoordinateAvailablePlace(target);
                if (spawnSpot) {
                    let flowerSpawnName = Pokemon_1.Pkm.ODDISH;
                    if (target.effects.has(Effect_1.EffectEnum.GLOOM_FLOWER)) {
                        flowerSpawnName = Pokemon_1.Pkm.GLOOM;
                    }
                    else if (target.effects.has(Effect_1.EffectEnum.VILE_FLOWER)) {
                        flowerSpawnName = Pokemon_1.Pkm.VILEPLUME;
                    }
                    else if (target.effects.has(Effect_1.EffectEnum.SUN_FLOWER)) {
                        flowerSpawnName = Pokemon_1.Pkm.BELLOSSOM;
                    }
                    target.simulation.addPokemon(pokemon_factory_1.default.createPokemonFromName(flowerSpawnName, target.player), spawnSpot.x, spawnSpot.y, target.team, true);
                    if (target.player) {
                        target.player.pokemonsPlayed.add(flowerSpawnName);
                    }
                }
            }
            const floraSpawn = board.cells.find((entity) => entity &&
                entity.team === target.team &&
                [Pokemon_1.Pkm.ODDISH, Pokemon_1.Pkm.GLOOM, Pokemon_1.Pkm.VILEPLUME, Pokemon_1.Pkm.BELLOSSOM].includes(entity.name));
            const randomItem = (0, random_1.pickRandomIn)((0, schemas_1.values)(target.items).filter((item) => item !== Item_1.Item.COMFEY && item !== Item_1.Item.LEAF_STONE));
            if (floraSpawn && randomItem && floraSpawn.items.size < 3) {
                floraSpawn.addItem(randomItem);
                target.removeItem(randomItem);
            }
        }
        if (target.items.has(Item_1.Item.COMFEY)) {
            const nearestAvailableCoordinate = this.state.getNearestAvailablePlaceCoordinates(target, board, 2);
            if (nearestAvailableCoordinate) {
                target.simulation.addPokemon(pokemon_factory_1.default.createPokemonFromName(Pokemon_1.Pkm.COMFEY, target.player), nearestAvailableCoordinate.x, nearestAvailableCoordinate.y, target.team, false);
            }
        }
        if (this.passive === Passive_1.Passive.GRIM_NEIGH) {
            this.addAbilityPower(30, this, 0, false);
        }
        if (this.passive === Passive_1.Passive.GUZZLORD && this.items.has(Item_1.Item.CHEF_HAT)) {
            this.addAbilityPower(5, this, 0, false, true);
            this.addMaxHP(10, this, 0, false, true);
        }
        if (this.player &&
            this.simulation.room.state.specialGameRule ===
                SpecialGameRule_1.SpecialGameRule.BLOOD_MONEY &&
            !target.isSpawn) {
            this.player.addMoney(1, true, this);
            this.count.moneyCount += 1;
        }
        if (target.name === Pokemon_1.Pkm.MAGIKARP &&
            target.shiny &&
            target.simulation.stageLevel === 1 &&
            this.player) {
            this.player.addMoney(10, true, this);
            this.count.moneyCount += 10;
        }
    }
    onDeath({ board }) {
        if (!this.isGhostOpponent) {
            this.refToBoardPokemon.deathCount++;
        }
        const isWorkUp = this.effects.has(Effect_1.EffectEnum.BULK_UP);
        const isRage = this.effects.has(Effect_1.EffectEnum.RAGE);
        const isAngerPoint = this.effects.has(Effect_1.EffectEnum.ANGER_POINT);
        if (isWorkUp || isRage || isAngerPoint) {
            let heal = 0;
            let speedBoost = 0;
            if (isWorkUp) {
                heal = 30;
                speedBoost = 15;
            }
            else if (isRage) {
                heal = 35;
                speedBoost = 20;
            }
            else if (isAngerPoint) {
                heal = 40;
                speedBoost = 25;
            }
            const _pokemon = this;
            this.simulation.room.clock.setTimeout(() => {
                board.forEach((x, y, value) => {
                    if (value &&
                        value.team == _pokemon.team &&
                        value.types.has(Synergy_1.Synergy.FIELD)) {
                        value.count.fieldCount++;
                        value.handleHeal(heal, _pokemon, 0, false);
                        value.addSpeed(speedBoost, value, 0, false);
                    }
                });
            }, 16);
        }
        if (this.status.curseVulnerability) {
            this.simulation.applyCurse(Effect_1.EffectEnum.CURSE_OF_VULNERABILITY, this.team);
        }
        if (this.status.curseWeakness) {
            this.simulation.applyCurse(Effect_1.EffectEnum.CURSE_OF_WEAKNESS, this.team);
        }
        if (this.status.curseTorment) {
            this.simulation.applyCurse(Effect_1.EffectEnum.CURSE_OF_TORMENT, this.team);
        }
        if (this.status.curseFate) {
            this.simulation.applyCurse(Effect_1.EffectEnum.CURSE_OF_FATE, this.team);
        }
        if (this.passive === Passive_1.Passive.PYUKUMUKU) {
            this.simulation.room.broadcast(types_1.Transfer.ABILITY, {
                id: this.simulation.id,
                skill: Ability_1.Ability.EXPLOSION,
                positionX: this.positionX,
                positionY: this.positionY
            });
            const adjcells = board.getAdjacentCells(this.positionX, this.positionY);
            const damage = Math.round(0.5 * this.hp);
            adjcells.forEach((cell) => {
                if (cell.value && this.team != cell.value.team) {
                    cell.value.handleSpecialDamage(damage, board, Game_1.AttackType.SPECIAL, this, false);
                }
            });
        }
        if (this.items.has(Item_1.Item.RUSTED_SWORD)) {
            this.items.delete(Item_1.Item.RUSTED_SWORD);
            const alliesSortByLowestAtk = board.cells.filter((p) => p && p.team === this.team && p.id !== this.id && p.items.size < 3).sort((a, b) => a.atk - b.atk);
            const target = alliesSortByLowestAtk[0];
            if (target) {
                target.addItem(Item_1.Item.RUSTED_SWORD);
            }
        }
    }
    flyAway(board) {
        const flyAwayCell = board.getFlyAwayCell(this.positionX, this.positionY);
        if (flyAwayCell) {
            this.moveTo(flyAwayCell.x, flyAwayCell.y, board);
        }
    }
    applyStat(stat, value, permanent = false) {
        switch (stat) {
            case Game_1.Stat.ATK:
                this.addAttack(value, this, 0, false, permanent);
                break;
            case Game_1.Stat.DEF:
                this.addDefense(value, this, 0, false, permanent);
                break;
            case Game_1.Stat.SPE_DEF:
                this.addSpecialDefense(value, this, 0, false, permanent);
                break;
            case Game_1.Stat.AP:
                this.addAbilityPower(value, this, 0, false, permanent);
                break;
            case Game_1.Stat.PP:
                this.addPP(value, this, 0, false);
                break;
            case Game_1.Stat.SPEED:
                this.addSpeed(value, this, 0, false, permanent);
                break;
            case Game_1.Stat.CRIT_CHANCE:
                this.addCritChance(value, this, 0, false);
                break;
            case Game_1.Stat.CRIT_POWER:
                this.addCritPower(value, this, 0, false);
                break;
            case Game_1.Stat.SHIELD:
                this.addShield(value, this, 0, false);
                break;
            case Game_1.Stat.HP:
                this.addMaxHP(value, this, 0, false, permanent);
                break;
            case Game_1.Stat.LUCK:
                this.addLuck(value, this, 0, false, permanent);
                break;
        }
    }
    resurrect() {
        this.life = this.hp;
        this.pp = 0;
        this.status.clearNegativeStatus();
        if (this.items.has(Item_1.Item.SACRED_ASH)) {
            const team = this.team === Game_1.Team.BLUE_TEAM
                ? this.simulation.blueTeam
                : this.simulation.redTeam;
            if (team) {
                const alliesAlive = (0, schemas_1.values)(team).filter((e) => e.life > 0);
                let koAllies = [];
                if (this.player) {
                    koAllies = (0, schemas_1.values)(this.player.board).filter((p) => p.id !== this.refToBoardPokemon.id &&
                        !(0, board_1.isOnBench)(p) &&
                        !alliesAlive.some((ally) => ally.refToBoardPokemon.id === p.id));
                }
                else if (this.name === Pokemon_1.Pkm.HO_OH) {
                    koAllies = alliesAlive.some((p) => p.name === Pokemon_1.Pkm.LUGIA)
                        ? []
                        : [
                            pokemon_factory_1.default.createPokemonFromName(Pokemon_1.Pkm.LUGIA, {
                                shiny: this.shiny,
                                emotion: types_1.Emotion.ANGRY
                            })
                        ];
                }
                const spawns = (0, random_1.pickNRandomIn)(koAllies, 3);
                spawns.forEach((spawn) => {
                    const mon = pokemon_factory_1.default.createPokemonFromName(spawn.name, {
                        emotion: spawn.emotion,
                        shiny: spawn.shiny
                    });
                    const coord = this.simulation.getClosestAvailablePlaceOnBoardToPokemonEntity(this);
                    const spawnedEntity = this.simulation.addPokemon(mon, coord.x, coord.y, this.team, true);
                    spawnedEntity.shield = 0;
                    spawnedEntity.flyingProtection = 0;
                    effects_1.SynergyEffects[Synergy_1.Synergy.FOSSIL].forEach((e) => spawnedEntity.effects.delete(e));
                });
            }
        }
        const stackingItems = [
            Item_1.Item.MUSCLE_BAND,
            Item_1.Item.SOUL_DEW,
            Item_1.Item.UPGRADE,
            Item_1.Item.MAGMARIZER
        ];
        const removedItems = [Item_1.Item.DYNAMAX_BAND, Item_1.Item.SACRED_ASH, Item_1.Item.MAX_REVIVE];
        stackingItems.forEach((item) => {
            var _a, _b, _c, _d;
            if (this.items.has(item)) {
                (_b = (_a = items_1.ItemEffects[item]) === null || _a === void 0 ? void 0 : _a.filter((effect) => effect instanceof effect_1.OnItemRemovedEffect)) === null || _b === void 0 ? void 0 : _b.forEach((effect) => effect.apply(this));
                (_d = (_c = items_1.ItemEffects[item]) === null || _c === void 0 ? void 0 : _c.filter((effect) => effect instanceof effect_1.OnItemGainedEffect)) === null || _d === void 0 ? void 0 : _d.forEach((effect) => effect.apply(this));
            }
        });
        removedItems.forEach((item) => {
            if (this.items.has(item)) {
                this.removeItem(item);
            }
        });
        const resetGroundStacks = (effect) => {
            const removalAmount = -effect.synergyLevel * effect.count;
            this.addDefense(removalAmount, this, 0, false);
            this.addSpecialDefense(removalAmount, this, 0, false);
            this.addAttack(removalAmount, this, 0, false);
            effect.count = 0;
        };
        const resetMonsterStacks = (effect) => {
            var _a, _b;
            const attackBoost = (_a = [3, 6, 10, 10][effect.synergyLevel]) !== null && _a !== void 0 ? _a : 10;
            const apBoost = (_b = [10, 20, 30, 30][effect.synergyLevel]) !== null && _b !== void 0 ? _b : 30;
            this.addAttack(-effect.count * attackBoost, this, 0, false);
            this.addAbilityPower(-effect.count * apBoost, this, 0, false);
            this.addMaxHP(-effect.hpBoosted, this, 0, false);
            effect.hpBoosted = 0;
            effect.count = 0;
        };
        const resetFireStacks = (effect) => {
            const removalAmount = -effect.count * effect.synergyLevel;
            this.addAttack(removalAmount, this, 0, false);
            effect.count = 0;
        };
        const resetSoundStacks = (effect) => {
            var _a, _b, _c;
            const synergyLevel = effects_1.SynergyEffects[Synergy_1.Synergy.SOUND].indexOf(effect);
            const attackBoost = ((_a = [2, 1, 1][synergyLevel]) !== null && _a !== void 0 ? _a : 0) * -this.count.soundCryCount;
            const speedBoost = ((_b = [0, 5, 5][synergyLevel]) !== null && _b !== void 0 ? _b : 0) * -this.count.soundCryCount;
            const manaBoost = ((_c = [0, 0, 3][synergyLevel]) !== null && _c !== void 0 ? _c : 0) * -this.count.soundCryCount;
            this.addAttack(attackBoost, this, 0, false);
            this.addSpeed(speedBoost, this, 0, false);
            this.addPP(manaBoost, this, 0, false);
            this.count.soundCryCount = 0;
        };
        this.effectsSet.forEach((effect) => {
            if (effect instanceof effect_1.GrowGroundEffect) {
                resetGroundStacks(effect);
            }
            else if (effect instanceof effect_1.MonsterKillEffect) {
                resetMonsterStacks(effect);
            }
            else if (effect instanceof effect_1.FireHitEffect) {
                resetFireStacks(effect);
            }
        });
        const soundEffect = effects_1.SynergyEffects[Synergy_1.Synergy.SOUND].find((effect) => { var _a; return (_a = this.player) === null || _a === void 0 ? void 0 : _a.effects.has(effect); });
        if (soundEffect) {
            resetSoundStacks(soundEffect);
        }
        this.status.resurection = false;
        this.shield = 0;
        this.flyingProtection = 0;
    }
    eatBerry(berry, stealedFrom, inPuffin = false) {
        var _a;
        const heal = (val) => inPuffin
            ? this.addShield(val, this, 0, false)
            : this.handleHeal(val, this, 0, false);
        switch (berry) {
            case Item_1.Item.AGUAV_BERRY:
                heal((0, number_1.min)(50)(0.5 * this.hp));
                this.status.triggerConfusion(3000, this, this);
                break;
            case Item_1.Item.APICOT_BERRY:
                heal(50);
                this.addSpecialDefense(20, this, 0, false);
                break;
            case Item_1.Item.ASPEAR_BERRY:
                this.status.freeze = false;
                this.status.freezeCooldown = 0;
                this.effects.add(Effect_1.EffectEnum.IMMUNITY_FREEZE);
                heal(50);
                this.addSpeed(15, this, 0, false);
                break;
            case Item_1.Item.CHERI_BERRY:
                this.status.healParalysis(this);
                this.effects.add(Effect_1.EffectEnum.IMMUNITY_PARALYSIS);
                heal(50);
                this.addAttack(10, this, 0, false);
                break;
            case Item_1.Item.CHESTO_BERRY:
                this.status.sleep = false;
                this.status.sleepCooldown = 0;
                this.effects.add(Effect_1.EffectEnum.IMMUNITY_SLEEP);
                heal(50);
                this.addAbilityPower(50, this, 0, false);
                break;
            case Item_1.Item.GANLON_BERRY:
                heal(50);
                this.addDefense(20, this, 0, false);
                break;
            case Item_1.Item.JABOCA_BERRY:
                heal(50);
                this.status.triggerSpikeArmor(10000);
                break;
            case Item_1.Item.LANSAT_BERRY:
                heal(50);
                this.addCritChance(50, this, 0, false);
                break;
            case Item_1.Item.LEPPA_BERRY:
                heal(50);
                this.addPP(50, this, 0, false);
                break;
            case Item_1.Item.LIECHI_BERRY:
                heal(50);
                this.addAttack(15, this, 0, false);
                break;
            case Item_1.Item.LUM_BERRY:
                heal(50);
                this.status.clearNegativeStatus();
                this.status.triggerRuneProtect(5000);
                break;
            case Item_1.Item.ORAN_BERRY:
                heal(50);
                this.addShield(80, this, 0, false);
                break;
            case Item_1.Item.PECHA_BERRY:
                heal(100);
                this.status.poisonOrigin = undefined;
                this.status.poisonStacks = 0;
                this.status.poisonDamageCooldown = 0;
                this.effects.add(Effect_1.EffectEnum.IMMUNITY_POISON);
                break;
            case Item_1.Item.PERSIM_BERRY:
                this.status.confusion = false;
                this.status.confusionCooldown = 0;
                this.effects.add(Effect_1.EffectEnum.IMMUNITY_CONFUSION);
                heal(50);
                this.addSpecialDefense(10, this, 0, false);
                break;
            case Item_1.Item.PETAYA_BERRY:
                heal(50);
                this.addAbilityPower(80, this, 0, false);
                break;
            case Item_1.Item.ROWAP_BERRY:
                heal(50);
                this.status.triggerMagicBounce(10000);
                break;
            case Item_1.Item.RAWST_BERRY:
                this.status.healBurn(this);
                this.effects.add(Effect_1.EffectEnum.IMMUNITY_BURN);
                heal(50);
                this.addDefense(10, this, 0, false);
                break;
            case Item_1.Item.SALAC_BERRY:
                heal(50);
                this.addSpeed(50, this, 0, false);
                break;
            case Item_1.Item.SITRUS_BERRY:
                this.effects.add(Effect_1.EffectEnum.BUFF_HEAL_RECEIVED);
                heal(100);
                break;
            case Item_1.Item.BERRY_JUICE:
                heal(this.hp - this.life);
                break;
            case Item_1.Item.BABIRI_BERRY:
                heal(50);
                this.status.triggerProtect(2000);
                break;
        }
        if (stealedFrom) {
            stealedFrom.removeItem(berry, true);
        }
        else {
            this.removeItem(berry, true);
        }
        if (this.passive === Passive_1.Passive.GLUTTON) {
            this.applyStat(Game_1.Stat.HP, 10, true);
            if (this.refToBoardPokemon.hp > 750) {
                (_a = this.player) === null || _a === void 0 ? void 0 : _a.titles.add(types_1.Title.GLUTTON);
            }
        }
        if (this.effects.has(Effect_1.EffectEnum.BERRY_JUICE)) {
            this.addShield(100, this, 0, false);
        }
    }
    transferAbility(name, positionX = this.positionX, positionY = this.positionY, targetX = this.targetX, targetY = this.targetY) {
        this.simulation.room.broadcast(types_1.Transfer.ABILITY, {
            id: this.simulation.id,
            skill: name,
            positionX: positionX,
            positionY: positionY,
            targetX: targetX,
            targetY: targetY,
            orientation: this.orientation
        });
    }
    changePassive(newPassive) {
        var _a, _b;
        if (this.passive === newPassive) {
            return;
        }
        if (this.passive) {
            const oldPassiveEffects = (_a = passives_1.PassiveEffects[this.passive]) !== null && _a !== void 0 ? _a : [];
            oldPassiveEffects.forEach((effect) => {
                this.effectsSet.delete(effect);
            });
        }
        this.passive = newPassive;
        const newPassiveEffects = (_b = passives_1.PassiveEffects[newPassive]) !== null && _b !== void 0 ? _b : [];
        for (const effect of newPassiveEffects) {
            this.effectsSet.add(effect instanceof effect_1.Effect ? effect : effect());
        }
    }
}
exports.PokemonEntity = PokemonEntity;
__decorate([
    (0, schema_1.type)("boolean")
], PokemonEntity.prototype, "shiny", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], PokemonEntity.prototype, "positionX", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], PokemonEntity.prototype, "positionY", void 0);
__decorate([
    (0, schema_1.type)("string")
], PokemonEntity.prototype, "action", void 0);
__decorate([
    (0, schema_1.type)("string")
], PokemonEntity.prototype, "index", void 0);
__decorate([
    (0, schema_1.type)("string")
], PokemonEntity.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)("string")
], PokemonEntity.prototype, "orientation", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], PokemonEntity.prototype, "hp", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], PokemonEntity.prototype, "pp", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], PokemonEntity.prototype, "maxPP", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], PokemonEntity.prototype, "atk", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], PokemonEntity.prototype, "def", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], PokemonEntity.prototype, "speDef", void 0);
__decorate([
    (0, schema_1.type)("int16")
], PokemonEntity.prototype, "ap", void 0);
__decorate([
    (0, schema_1.type)("int16")
], PokemonEntity.prototype, "luck", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], PokemonEntity.prototype, "critChance", void 0);
__decorate([
    (0, schema_1.type)("float32")
], PokemonEntity.prototype, "critPower", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], PokemonEntity.prototype, "attackType", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], PokemonEntity.prototype, "life", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], PokemonEntity.prototype, "shield", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], PokemonEntity.prototype, "team", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], PokemonEntity.prototype, "range", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], PokemonEntity.prototype, "speed", void 0);
__decorate([
    (0, schema_1.type)("string")
], PokemonEntity.prototype, "targetEntityId", void 0);
__decorate([
    (0, schema_1.type)("int8")
], PokemonEntity.prototype, "targetX", void 0);
__decorate([
    (0, schema_1.type)("int8")
], PokemonEntity.prototype, "targetY", void 0);
__decorate([
    (0, schema_1.type)("string")
], PokemonEntity.prototype, "attackSprite", void 0);
__decorate([
    (0, schema_1.type)("string")
], PokemonEntity.prototype, "rarity", void 0);
__decorate([
    (0, schema_1.type)("string")
], PokemonEntity.prototype, "name", void 0);
__decorate([
    (0, schema_1.type)({ set: "string" })
], PokemonEntity.prototype, "effects", void 0);
__decorate([
    (0, schema_1.type)({ set: "string" })
], PokemonEntity.prototype, "items", void 0);
__decorate([
    (0, schema_1.type)({ set: "string" })
], PokemonEntity.prototype, "types", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], PokemonEntity.prototype, "stars", void 0);
__decorate([
    (0, schema_1.type)("string")
], PokemonEntity.prototype, "skill", void 0);
__decorate([
    (0, schema_1.type)("string")
], PokemonEntity.prototype, "passive", void 0);
__decorate([
    (0, schema_1.type)(status_1.default)
], PokemonEntity.prototype, "status", void 0);
__decorate([
    (0, schema_1.type)(count_1.default)
], PokemonEntity.prototype, "count", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], PokemonEntity.prototype, "healDone", void 0);
__decorate([
    (0, schema_1.type)("string")
], PokemonEntity.prototype, "emotion", void 0);
function getStrongestUnit(pokemons) {
    const pokemonScores = pokemons.map((pokemon) => getUnitScore(pokemon));
    const bestScore = Math.max(...pokemonScores);
    return (0, random_1.pickRandomIn)(pokemons.filter((p, i) => pokemonScores[i] === bestScore));
}
function getUnitScore(pokemon) {
    let score = 0;
    score += 100 * pokemon.items.size;
    score += 10 * pokemon.stars;
    score += (0, shop_1.getSellPrice)(pokemon, null, true);
    return score;
}
function canSell(pkm, specialGameRule) {
    if (specialGameRule === SpecialGameRule_1.SpecialGameRule.DITTO_PARTY && pkm === Pokemon_1.Pkm.DITTO) {
        return false;
    }
    return new pokemon_1.PokemonClasses[pkm]().canBeSold;
}
function getMoveSpeed(pokemon) {
    const speed = pokemon.status.paralysis ? pokemon.speed / 2 : pokemon.speed;
    return 0.5 + speed / 100;
}
//# sourceMappingURL=pokemon-entity.js.map