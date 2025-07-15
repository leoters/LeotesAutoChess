"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundCryEffect = exports.electricTripleAttackEffect = exports.FireHitEffect = exports.DarkHarvestEffect = exports.DrySkinEffect = exports.SynchroEffect = exports.ClearWingEffect = exports.GrowGroundEffect = exports.MonsterKillEffect = exports.OnMoveEffect = exports.OnDamageReceivedEffect = exports.OnAbilityCastEffect = exports.OnAttackEffect = exports.OnHitEffect = exports.PeriodicEffect = exports.OnKillEffect = exports.OnItemEquippedEffect = exports.OnItemRemovedEffect = exports.OnItemGainedEffect = exports.OnSpawnEffect = exports.Effect = void 0;
const effects_1 = require("../../models/effects");
const types_1 = require("../../types");
const Ability_1 = require("../../types/enum/Ability");
const Effect_1 = require("../../types/enum/Effect");
const Game_1 = require("../../types/enum/Game");
const Item_1 = require("../../types/enum/Item");
const Passive_1 = require("../../types/enum/Passive");
const Pokemon_1 = require("../../types/enum/Pokemon");
const Synergy_1 = require("../../types/enum/Synergy");
const number_1 = require("../../utils/number");
const random_1 = require("../../utils/random");
class Effect {
    apply(...args) { }
    constructor(effect, origin) {
        if (effect) {
            this.apply = effect;
        }
        this.origin = origin;
    }
}
exports.Effect = Effect;
class OnSpawnEffect extends Effect {
    constructor(effect) {
        super(effect);
    }
    apply(entity) { }
}
exports.OnSpawnEffect = OnSpawnEffect;
class OnItemGainedEffect extends Effect {
}
exports.OnItemGainedEffect = OnItemGainedEffect;
class OnItemRemovedEffect extends Effect {
}
exports.OnItemRemovedEffect = OnItemRemovedEffect;
class OnItemEquippedEffect extends Effect {
    apply(args) {
        return true;
    }
    constructor(effect, origin) {
        super(effect, origin);
    }
}
exports.OnItemEquippedEffect = OnItemEquippedEffect;
class OnKillEffect extends Effect {
    apply(attacker, target, board, attackType) { }
    constructor(effect, origin) {
        super(effect, origin);
    }
}
exports.OnKillEffect = OnKillEffect;
class PeriodicEffect extends Effect {
    constructor(effect, origin, intervalMs) {
        super(effect, origin);
        this.intervalMs = intervalMs;
        this.timer = intervalMs;
        this.count = 0;
    }
    update(dt, entity) {
        this.timer -= dt;
        if (this.timer <= 0) {
            this.count++;
            this.apply(entity);
            this.timer = this.intervalMs;
        }
    }
}
exports.PeriodicEffect = PeriodicEffect;
class OnHitEffect extends Effect {
    apply(params) { }
    constructor(effect, origin) {
        super(effect, origin);
    }
}
exports.OnHitEffect = OnHitEffect;
class OnAttackEffect extends Effect {
    apply(args) { }
    constructor(effect, origin) {
        super(effect, origin);
    }
}
exports.OnAttackEffect = OnAttackEffect;
class OnAbilityCastEffect extends Effect {
    apply(pokemon, board, target, crit) { }
    constructor(effect, origin) {
        super(effect, origin);
    }
}
exports.OnAbilityCastEffect = OnAbilityCastEffect;
class OnDamageReceivedEffect extends Effect {
    apply(entity, attacker, board, damage) { }
    constructor(effect, origin) {
        super(effect, origin);
    }
}
exports.OnDamageReceivedEffect = OnDamageReceivedEffect;
class OnMoveEffect extends Effect {
    apply(pokemon, board, x, y) { }
    constructor(effect, origin) {
        super(effect, origin);
    }
}
exports.OnMoveEffect = OnMoveEffect;
class MonsterKillEffect extends OnKillEffect {
    constructor(effect) {
        super(undefined, effect);
        this.hpBoosted = 0;
        this.count = 0;
        this.synergyLevel = effects_1.SynergyEffects[Synergy_1.Synergy.MONSTER].indexOf(effect);
    }
    apply(pokemon, target, board, attackType) {
        var _a, _b, _c;
        const attackBoost = (_a = [3, 6, 10, 10][this.synergyLevel]) !== null && _a !== void 0 ? _a : 10;
        const apBoost = (_b = [10, 20, 30, 30][this.synergyLevel]) !== null && _b !== void 0 ? _b : 30;
        const hpGain = (_c = [0.2, 0.4, 0.6, 0.6][this.synergyLevel]) !== null && _c !== void 0 ? _c : 0.6;
        const lifeBoost = hpGain * target.hp;
        pokemon.addAttack(attackBoost, pokemon, 0, false);
        pokemon.addAbilityPower(apBoost, pokemon, 0, false);
        pokemon.addMaxHP(lifeBoost, pokemon, 0, false);
        this.hpBoosted += lifeBoost;
        this.count += 1;
        if (pokemon.items.has(Item_1.Item.BERSERK_GENE)) {
            pokemon.status.triggerConfusion(30000, pokemon, pokemon);
        }
    }
}
exports.MonsterKillEffect = MonsterKillEffect;
class GrowGroundEffect extends PeriodicEffect {
    constructor(effect) {
        super((pokemon) => {
            if (this.count > 5) {
                return;
            }
            pokemon.addDefense(this.synergyLevel * 2, pokemon, 0, false);
            pokemon.addSpecialDefense(this.synergyLevel * 2, pokemon, 0, false);
            pokemon.addAttack(this.synergyLevel, pokemon, 0, false);
            pokemon.transferAbility("GROUND_GROW");
            if (pokemon.items.has(Item_1.Item.BIG_NUGGET) &&
                this.count === 5 &&
                pokemon.player) {
                pokemon.player.addMoney(2, true, pokemon);
                pokemon.count.moneyCount += 2;
            }
            if (pokemon.passive === Passive_1.Passive.ZYGARDE && this.count === 5) {
                pokemon.handleHeal(0.2 * pokemon.hp, pokemon, 0, false);
                if (pokemon.index === Pokemon_1.PkmIndex[Pokemon_1.Pkm.ZYGARDE_10]) {
                    pokemon.addDefense(2, pokemon, 0, false);
                    pokemon.addSpecialDefense(2, pokemon, 0, false);
                    pokemon.addMaxHP(50, pokemon, 0, false);
                    pokemon.addSpeed(-12, pokemon, 0, false);
                    pokemon.range = (0, number_1.min)(1)(pokemon.range + 1);
                }
                else {
                    pokemon.addAttack(5, pokemon, 0, false);
                    pokemon.addDefense(5, pokemon, 0, false);
                    pokemon.addSpecialDefense(5, pokemon, 0, false);
                    pokemon.addMaxHP(80, pokemon, 0, false);
                    pokemon.addSpeed(-5, pokemon, 0, false);
                    pokemon.range = (0, number_1.min)(1)(pokemon.range - 1);
                }
                pokemon.index = Pokemon_1.PkmIndex[Pokemon_1.Pkm.ZYGARDE_100];
                pokemon.name = Pokemon_1.Pkm.ZYGARDE_100;
                pokemon.changePassive(Passive_1.Passive.NONE);
                pokemon.skill = Ability_1.Ability.CORE_ENFORCER;
                pokemon.pp = 0;
                if (pokemon.player) {
                    pokemon.player.pokemonsPlayed.add(Pokemon_1.Pkm.ZYGARDE_100);
                }
            }
        }, effect, 3000);
        this.synergyLevel = effects_1.SynergyEffects[Synergy_1.Synergy.GROUND].indexOf(effect) + 1;
    }
}
exports.GrowGroundEffect = GrowGroundEffect;
class ClearWingEffect extends PeriodicEffect {
    constructor() {
        super((pokemon) => {
            pokemon.addSpeed(1, pokemon, 0, false);
        }, Passive_1.Passive.CLEAR_WING, 1000);
    }
}
exports.ClearWingEffect = ClearWingEffect;
class SynchroEffect extends PeriodicEffect {
    constructor() {
        super((pokemon) => {
            const status = pokemon.status;
            if (status.burn && status.burnOrigin) {
                status.burnOrigin.status.triggerBurn(3000, status.burnOrigin, pokemon);
            }
            if (status.poisonStacks && status.poisonOrigin) {
                status.poisonOrigin.status.triggerPoison(3000, status.poisonOrigin, pokemon);
            }
            if (status.wound && status.woundOrigin) {
                status.woundOrigin.status.triggerWound(3000, status.woundOrigin, pokemon);
            }
            if (status.silence && status.silenceOrigin) {
                status.silenceOrigin.status.triggerSilence(3000, status.silenceOrigin, pokemon);
            }
        }, Passive_1.Passive.SYNCHRO, 3000);
    }
}
exports.SynchroEffect = SynchroEffect;
class DrySkinEffect extends PeriodicEffect {
    constructor() {
        super((pokemon) => {
            pokemon.handleHeal(8, pokemon, 0, false);
        }, Passive_1.Passive.DRY_SKIN, 1000);
    }
}
exports.DrySkinEffect = DrySkinEffect;
class DarkHarvestEffect extends PeriodicEffect {
    constructor(duration, pokemon) {
        super((pokemon) => {
            var _a;
            pokemon.transferAbility(Ability_1.Ability.DARK_HARVEST);
            const board = pokemon.simulation.board;
            const crit = pokemon.effects.has(Effect_1.EffectEnum.ABILITY_CRIT)
                ? (0, random_1.chance)(pokemon.critChance, pokemon)
                : false;
            const darkHarvestDamage = (_a = [5, 10, 20][pokemon.stars - 1]) !== null && _a !== void 0 ? _a : 20;
            const healFactor = 0.3;
            board
                .getAdjacentCells(pokemon.positionX, pokemon.positionY)
                .forEach((cell) => {
                if (cell.value && cell.value.team !== pokemon.team) {
                    const { takenDamage } = cell.value.handleSpecialDamage(darkHarvestDamage, board, Game_1.AttackType.SPECIAL, pokemon, crit, true);
                    pokemon.handleHeal(Math.round(takenDamage * healFactor), pokemon, 0, false);
                }
            });
            if (this.duration <= 0) {
                pokemon.effectsSet.delete(this);
                pokemon.effects.delete(Effect_1.EffectEnum.DARK_HARVEST);
            }
            else {
                this.duration -= this.intervalMs;
            }
        }, Effect_1.EffectEnum.DARK_HARVEST, 1000);
        this.timer = 0;
        this.duration = duration + this.intervalMs;
        if (pokemon.effects.has(Effect_1.EffectEnum.DARK_HARVEST)) {
            pokemon.effectsSet.delete(this);
            for (const effect of pokemon.effectsSet) {
                if (effect instanceof DarkHarvestEffect) {
                    effect.duration = Math.max(this.duration, effect.duration);
                    effect.timer = this.timer;
                    break;
                }
            }
        }
        else {
            pokemon.effects.add(Effect_1.EffectEnum.DARK_HARVEST);
        }
    }
}
exports.DarkHarvestEffect = DarkHarvestEffect;
class FireHitEffect extends OnAttackEffect {
    constructor(effect) {
        super(undefined, effect);
        this.count = 0;
        this.synergyLevel = effects_1.SynergyEffects[Synergy_1.Synergy.FIRE].indexOf(effect);
    }
    apply({ pokemon }) {
        pokemon.addAttack(this.synergyLevel, pokemon, 0, false);
        this.count += 1;
    }
}
exports.FireHitEffect = FireHitEffect;
exports.electricTripleAttackEffect = new OnAttackEffect(({ pokemon, target, board, isTripleAttack }) => {
    if (isTripleAttack)
        return;
    let shouldTriggerTripleAttack = false, isPowerSurge = false;
    if (pokemon.effects.has(Effect_1.EffectEnum.RISING_VOLTAGE)) {
        shouldTriggerTripleAttack = pokemon.count.attackCount % 4 === 0;
    }
    else if (pokemon.effects.has(Effect_1.EffectEnum.OVERDRIVE)) {
        shouldTriggerTripleAttack = pokemon.count.attackCount % 3 === 0;
    }
    else if (pokemon.effects.has(Effect_1.EffectEnum.POWER_SURGE)) {
        shouldTriggerTripleAttack = pokemon.count.attackCount % 3 === 0;
        isPowerSurge = true;
    }
    if (shouldTriggerTripleAttack) {
        pokemon.count.tripleAttackCount++;
        if (pokemon.name === Pokemon_1.Pkm.MORPEKO && target) {
            target.status.triggerParalysis(2000, target, pokemon);
        }
        if (pokemon.name === Pokemon_1.Pkm.MORPEKO_HANGRY && target) {
            target.status.triggerWound(4000, target, pokemon);
        }
        pokemon.state.attack(pokemon, board, target, true);
        pokemon.state.attack(pokemon, board, target, true);
        if (isPowerSurge && target) {
            board
                .getAdjacentCells(target.positionX, target.positionY, true)
                .forEach((cell) => {
                if (cell) {
                    const enemy = board.getEntityOnCell(cell.x, cell.y);
                    if (enemy && pokemon.team !== enemy.team) {
                        enemy.handleSpecialDamage(10, board, Game_1.AttackType.SPECIAL, pokemon, false, false);
                        if (enemy !== target) {
                            pokemon.simulation.room.broadcast(types_1.Transfer.ABILITY, {
                                id: pokemon.simulation.id,
                                skill: "LINK_CABLE_link",
                                positionX: target.positionX,
                                positionY: target.positionY,
                                targetX: enemy.positionX,
                                targetY: enemy.positionY
                            });
                        }
                    }
                }
            });
        }
    }
});
class SoundCryEffect extends OnAbilityCastEffect {
    constructor(effect) {
        super(undefined, effect);
        this.count = 0;
        this.synergyLevel = -1;
        if (effect) {
            this.synergyLevel = effects_1.SynergyEffects[Synergy_1.Synergy.SOUND].indexOf(effect);
        }
    }
    apply(pokemon, board, target, crit) {
        var _a, _b, _c;
        pokemon.transferAbility(Ability_1.Ability.ECHO);
        const attackBoost = (_a = [2, 1, 1][this.synergyLevel]) !== null && _a !== void 0 ? _a : 0;
        const speedBoost = (_b = [0, 5, 5][this.synergyLevel]) !== null && _b !== void 0 ? _b : 0;
        const manaBoost = (_c = [0, 0, 3][this.synergyLevel]) !== null && _c !== void 0 ? _c : 0;
        const chimecho = board
            .getAdjacentCells(pokemon.positionX, pokemon.positionY)
            .some((cell) => { var _a; return ((_a = cell.value) === null || _a === void 0 ? void 0 : _a.passive) === Passive_1.Passive.CHIMECHO; });
        const scale = (chimecho ? 2 : 1) * (pokemon.passive === Passive_1.Passive.MEGA_LAUNCHER ? 3 : 1);
        board.cells.forEach((ally) => {
            if ((ally === null || ally === void 0 ? void 0 : ally.team) === pokemon.team) {
                ally.status.sleep = false;
                ally.addAttack(attackBoost * scale, pokemon, 0, false);
                ally.addSpeed(speedBoost * scale, pokemon, 0, false);
                ally.addPP(manaBoost * scale, pokemon, 0, false);
                ally.count.soundCryCount += scale;
            }
        });
    }
}
exports.SoundCryEffect = SoundCryEffect;
//# sourceMappingURL=effect.js.map