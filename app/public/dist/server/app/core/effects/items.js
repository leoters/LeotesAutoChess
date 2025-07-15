"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemEffects = exports.SoulDewEffect = exports.choiceScarfOnAttackEffect = exports.blueOrbOnAttackEffect = void 0;
const pokemon_factory_1 = __importDefault(require("../../models/pokemon-factory"));
const types_1 = require("../../types");
const Config_1 = require("../../types/Config");
const Ability_1 = require("../../types/enum/Ability");
const Effect_1 = require("../../types/enum/Effect");
const Game_1 = require("../../types/enum/Game");
const Item_1 = require("../../types/enum/Item");
const Passive_1 = require("../../types/enum/Passive");
const Pokemon_1 = require("../../types/enum/Pokemon");
const Synergy_1 = require("../../types/enum/Synergy");
const array_1 = require("../../utils/array");
const distance_1 = require("../../utils/distance");
const number_1 = require("../../utils/number");
const schemas_1 = require("../../utils/schemas");
const abilities_1 = require("../abilities/abilities");
const simulation_command_1 = require("../simulation-command");
const effect_1 = require("./effect");
exports.blueOrbOnAttackEffect = new effect_1.OnAttackEffect(({ pokemon, target, board }) => {
    pokemon.count.staticHolderCount++;
    if (pokemon.count.staticHolderCount >= 4) {
        pokemon.count.staticHolderCount = 0;
        const nbBounces = 2;
        const closestEnemies = new Array();
        board.forEach((x, y, enemy) => {
            if (enemy && pokemon.team !== enemy.team) {
                closestEnemies.push(enemy);
            }
        });
        closestEnemies.sort((a, b) => {
            const distanceA = (0, distance_1.distanceC)(a.positionX, a.positionY, pokemon.positionX, pokemon.positionY);
            const distanceB = (0, distance_1.distanceC)(b.positionX, b.positionY, pokemon.positionX, pokemon.positionY);
            return distanceA - distanceB;
        });
        let previousTg = pokemon;
        let secondaryTargetHit = target;
        for (let i = 0; i < nbBounces; i++) {
            secondaryTargetHit = closestEnemies[i];
            if (secondaryTargetHit) {
                pokemon.simulation.room.broadcast(types_1.Transfer.ABILITY, {
                    id: pokemon.simulation.id,
                    skill: "LINK_CABLE_link",
                    positionX: previousTg.positionX,
                    positionY: previousTg.positionY,
                    targetX: secondaryTargetHit.positionX,
                    targetY: secondaryTargetHit.positionY
                });
                secondaryTargetHit.handleSpecialDamage(10, board, Game_1.AttackType.SPECIAL, pokemon, false);
                secondaryTargetHit.addPP(-20, pokemon, 0, false);
                secondaryTargetHit.count.manaBurnCount++;
                previousTg = secondaryTargetHit;
            }
            else {
                break;
            }
        }
    }
});
exports.choiceScarfOnAttackEffect = new effect_1.OnAttackEffect(({ pokemon, target, board, totalDamage, physicalDamage, specialDamage, trueDamage }) => {
    if (totalDamage > 0 && target) {
        const cells = board.getAdjacentCells(target.positionX, target.positionY);
        const candidateTargets = cells
            .filter((cell) => cell.value && pokemon.team != cell.value.team)
            .map((cell) => cell.value);
        candidateTargets.sort((a, b) => a.life - b.life);
        let targetCount = 1;
        candidateTargets.forEach((target) => {
            if (targetCount > 0) {
                let totalTakenDamage = 0;
                if (physicalDamage > 0) {
                    const { takenDamage } = target.handleDamage({
                        damage: Math.ceil(0.5 * physicalDamage),
                        board,
                        attackType: Game_1.AttackType.PHYSICAL,
                        attacker: pokemon,
                        shouldTargetGainMana: true
                    });
                    totalTakenDamage += takenDamage;
                }
                if (specialDamage > 0) {
                    const scarfSpecialDamage = Math.ceil(0.5 * specialDamage);
                    const { takenDamage } = target.handleDamage({
                        damage: scarfSpecialDamage,
                        board,
                        attackType: Game_1.AttackType.SPECIAL,
                        attacker: pokemon,
                        shouldTargetGainMana: true
                    });
                    totalTakenDamage += takenDamage;
                    if (target.items.has(Item_1.Item.POWER_LENS) &&
                        !pokemon.items.has(Item_1.Item.PROTECTIVE_PADS)) {
                        const speDef = target.status.armorReduction
                            ? Math.round(target.speDef / 2)
                            : target.speDef;
                        const damageAfterReduction = scarfSpecialDamage / (1 + Config_1.ARMOR_FACTOR * speDef);
                        const damageBlocked = (0, number_1.min)(0)(scarfSpecialDamage - damageAfterReduction);
                        pokemon.handleDamage({
                            damage: Math.round(damageBlocked),
                            board,
                            attackType: Game_1.AttackType.SPECIAL,
                            attacker: target,
                            shouldTargetGainMana: true
                        });
                    }
                }
                if (trueDamage > 0) {
                    const { takenDamage } = target.handleDamage({
                        damage: Math.ceil(0.5 * trueDamage),
                        board,
                        attackType: Game_1.AttackType.TRUE,
                        attacker: pokemon,
                        shouldTargetGainMana: true
                    });
                    totalTakenDamage += takenDamage;
                }
                pokemon.onHit({
                    target,
                    board,
                    totalTakenDamage,
                    physicalDamage,
                    specialDamage,
                    trueDamage
                });
                targetCount--;
            }
        });
    }
});
class SoulDewEffect extends effect_1.PeriodicEffect {
    constructor() {
        super((pokemon) => {
            pokemon.addAbilityPower(10, pokemon, 0, false);
            pokemon.count.soulDewCount++;
        }, Item_1.Item.SOUL_DEW, 1000);
    }
}
exports.SoulDewEffect = SoulDewEffect;
const smokeBallEffect = new effect_1.OnDamageReceivedEffect((pokemon, attacker, board, damage) => {
    if (pokemon.life > 0 && pokemon.life < 0.4 * pokemon.hp) {
        const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
        cells.forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
                cell.value.status.triggerParalysis(4000, cell.value, pokemon);
                cell.value.status.triggerBlinded(4000, cell.value);
            }
        });
        pokemon.simulation.room.broadcast(types_1.Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: "SMOKE_BALL",
            positionX: pokemon.positionX,
            positionY: pokemon.positionY
        });
        pokemon.removeItem(Item_1.Item.SMOKE_BALL);
        pokemon.flyAway(board);
    }
});
const ogerponMaskEffect = new effect_1.OnItemEquippedEffect(({ pokemon, player, item }) => {
    if (pokemon.passive === Passive_1.Passive.OGERPON_TEAL ||
        pokemon.passive === Passive_1.Passive.OGERPON_WELLSPRING ||
        pokemon.passive === Passive_1.Passive.OGERPON_HEARTHFLAME ||
        pokemon.passive === Passive_1.Passive.OGERPON_CORNERSTONE) {
        const currentMask = (0, schemas_1.values)(pokemon.items).find((i) => Item_1.OgerponMasks.includes(i));
        if (currentMask) {
            pokemon.items.delete(currentMask);
        }
        else if (pokemon.items.size >= 3) {
            return false;
        }
        if (item === Item_1.Item.TEAL_MASK) {
            pokemon.items.add(Item_1.Item.TEAL_MASK);
            player.transformPokemon(pokemon, Pokemon_1.Pkm.OGERPON_TEAL_MASK);
        }
        else if (item === Item_1.Item.WELLSPRING_MASK) {
            pokemon.items.add(Item_1.Item.WELLSPRING_MASK);
            player.transformPokemon(pokemon, Pokemon_1.Pkm.OGERPON_WELLSPRING_MASK);
        }
        else if (item === Item_1.Item.HEARTHFLAME_MASK) {
            pokemon.items.add(Item_1.Item.HEARTHFLAME_MASK);
            player.transformPokemon(pokemon, Pokemon_1.Pkm.OGERPON_HEARTHFLAME_MASK);
        }
        else if (item === Item_1.Item.CORNERSTONE_MASK) {
            pokemon.items.add(Item_1.Item.CORNERSTONE_MASK);
            player.transformPokemon(pokemon, Pokemon_1.Pkm.OGERPON_CORNERSTONE_MASK);
        }
        return true;
    }
    return false;
});
exports.ItemEffects = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, Object.fromEntries(Item_1.SynergyStones.map((stone) => [stone, [
        new effect_1.OnItemEquippedEffect(({ pokemon, item }) => pokemon.types.has(Item_1.SynergyGivenByItem[item]))
    ]]))), Object.fromEntries([...Item_1.TMs, ...Item_1.HMs].map(tm => [tm, [
        new effect_1.OnItemEquippedEffect(({ pokemon, player, item }) => {
            const ability = Item_1.AbilityPerTM[item];
            if (!ability || pokemon.types.has(Synergy_1.Synergy.HUMAN) === false)
                return false;
            pokemon.tm = ability;
            pokemon.skill = ability;
            pokemon.maxPP = 100;
            (0, array_1.removeInArray)(player.items, item);
            const tmIndex = player.tms.findIndex((tm) => tm === item);
            if (tmIndex !== -1) {
                player.tms[tmIndex] = null;
            }
            return true;
        })
    ]]))), { [Item_1.Item.RUSTED_SWORD]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            pokemon.addAttack(pokemon.baseAtk * 0.5, pokemon, 0, false);
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            pokemon.addAttack(-pokemon.baseAtk * 0.5, pokemon, 0, false);
        })
    ], [Item_1.Item.SOUL_DEW]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            pokemon.effectsSet.add(new SoulDewEffect());
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            for (const effect of pokemon.effectsSet) {
                if (effect instanceof SoulDewEffect) {
                    pokemon.addAbilityPower(-10 * effect.count, pokemon, 0, false);
                    pokemon.effectsSet.delete(effect);
                    pokemon.count.soulDewCount = 0;
                    break;
                }
            }
        })
    ], [Item_1.Item.PUNCHING_GLOVE]: [
        new effect_1.OnHitEffect(({ attacker, target, board }) => {
            target.handleDamage({
                damage: Math.round(0.08 * target.hp),
                board,
                attackType: Game_1.AttackType.PHYSICAL,
                attacker,
                shouldTargetGainMana: true
            });
        })
    ], [Item_1.Item.WIDE_LENS]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            pokemon.range += 2;
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            pokemon.range = (0, number_1.min)(1)(pokemon.range - 2);
        })
    ], [Item_1.Item.MAX_REVIVE]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            pokemon.status.addResurrection(pokemon);
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            pokemon.status.resurection = false;
        })
    ], [Item_1.Item.AIR_BALLOON]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            pokemon.addDodgeChance(0.1, pokemon, 0, false);
            pokemon.effects.add(Effect_1.EffectEnum.IMMUNITY_BOARD_EFFECTS);
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            pokemon.addDodgeChance(-0.1, pokemon, 0, false);
            pokemon.effects.delete(Effect_1.EffectEnum.IMMUNITY_BOARD_EFFECTS);
        })
    ], [Item_1.Item.FLAME_ORB]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            pokemon.addAttack(pokemon.baseAtk, pokemon, 0, false);
            pokemon.status.triggerBurn(60000, pokemon, pokemon);
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            pokemon.addAttack(-pokemon.baseAtk, pokemon, 0, false);
            pokemon.status.burnCooldown = 0;
        })
    ], [Item_1.Item.TOXIC_ORB]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            pokemon.addAttack(pokemon.baseAtk, pokemon, 0, false);
            pokemon.status.triggerPoison(60000, pokemon, pokemon);
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            pokemon.addAttack(-pokemon.baseAtk, pokemon, 0, false);
            pokemon.status.poisonCooldown = 0;
        })
    ], [Item_1.Item.POKERUS_VIAL]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            pokemon.status.triggerPokerus(pokemon);
        })
    ], [Item_1.Item.FLUFFY_TAIL]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            pokemon.status.triggerRuneProtect(60000);
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            pokemon.status.runeProtectCooldown = 0;
        })
    ], [Item_1.Item.KINGS_ROCK]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            pokemon.addShield(0.3 * pokemon.baseHP, pokemon, 0, false);
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            pokemon.addShield(-0.3 * pokemon.baseHP, pokemon, 0, false);
        })
    ], [Item_1.Item.DYNAMAX_BAND]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            pokemon.addMaxHP(2 * pokemon.baseHP, pokemon, 0, false);
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            pokemon.addMaxHP(-2 * pokemon.baseHP, pokemon, 0, false);
        })
    ], [Item_1.Item.GOLD_BOTTLE_CAP]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            var _a, _b;
            pokemon.addCritPower((_b = (_a = pokemon.player) === null || _a === void 0 ? void 0 : _a.money) !== null && _b !== void 0 ? _b : 0, pokemon, 0, false);
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            var _a, _b;
            pokemon.addCritPower(-((_b = (_a = pokemon.player) === null || _a === void 0 ? void 0 : _a.money) !== null && _b !== void 0 ? _b : 0), pokemon, 0, false);
        }),
        new effect_1.OnKillEffect((pokemon, target, board, attackType) => {
            if (pokemon.player) {
                const isLastEnemy = board.cells.some((p) => p &&
                    p.team !== pokemon.team &&
                    (p.life > 0 || p.status.resurecting)) === false;
                pokemon.count.bottleCapCount++;
                const moneyGained = isLastEnemy ? pokemon.count.bottleCapCount + 1 : 1;
                pokemon.player.addMoney(moneyGained, true, pokemon);
                pokemon.count.moneyCount += moneyGained;
                if (isLastEnemy && pokemon.count.bottleCapCount >= 10) {
                    pokemon.player.titles.add(types_1.Title.LUCKY);
                }
            }
        })
    ], [Item_1.Item.REPEAT_BALL]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            var _a, _b, _c, _d;
            pokemon.addShield(Math.floor((((_b = (_a = pokemon.player) === null || _a === void 0 ? void 0 : _a.rerollCount) !== null && _b !== void 0 ? _b : 0) + pokemon.simulation.stageLevel) /
                2) * 2, pokemon, 0, false);
            pokemon.addSpeed(Math.floor((((_d = (_c = pokemon.player) === null || _c === void 0 ? void 0 : _c.rerollCount) !== null && _d !== void 0 ? _d : 0) + pokemon.simulation.stageLevel) /
                2), pokemon, 0, false);
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            var _a, _b;
            pokemon.addAbilityPower(-Math.floor((((_b = (_a = pokemon.player) === null || _a === void 0 ? void 0 : _a.rerollCount) !== null && _b !== void 0 ? _b : 0) + pokemon.simulation.stageLevel) /
                2), pokemon, 0, false);
        })
    ], [Item_1.Item.SACRED_ASH]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            pokemon.status.addResurrection(pokemon);
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            pokemon.status.resurection = false;
        })
    ], [Item_1.Item.UPGRADE]: [
        new effect_1.OnAttackEffect(({ pokemon, target, board }) => {
            pokemon.addSpeed(5, pokemon, 0, false);
            pokemon.count.upgradeCount++;
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            pokemon.addSpeed(-5 * pokemon.count.upgradeCount, pokemon, 0, false);
            pokemon.count.upgradeCount = 0;
        })
    ], [Item_1.Item.MUSCLE_BAND]: [
        new effect_1.OnDamageReceivedEffect((pokemon, attacker, board, damage) => {
            if (pokemon.count.defensiveRibbonCount < 20 &&
                damage > 0) {
                pokemon.count.defensiveRibbonCount++;
                if (pokemon.count.defensiveRibbonCount % 2 === 0) {
                    pokemon.addAttack(1, pokemon, 0, false);
                    pokemon.addDefense(2, pokemon, 0, false);
                    pokemon.addSpeed(5, pokemon, 0, false);
                }
            }
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            const stacks = Math.floor(pokemon.count.defensiveRibbonCount / 2);
            pokemon.addAttack(-stacks, pokemon, 0, false);
            pokemon.addDefense(-2 * stacks, pokemon, 0, false);
            pokemon.addSpeed(-5 * stacks, pokemon, 0, false);
            pokemon.count.defensiveRibbonCount = 0;
        })
    ], [Item_1.Item.MANA_SCARF]: [
        new effect_1.OnAttackEffect(({ pokemon, target, board }) => {
            pokemon.addPP(8, pokemon, 0, false);
        })
    ], [Item_1.Item.AMULET_COIN]: [
        new effect_1.OnKillEffect((pokemon) => {
            if (pokemon.player) {
                pokemon.player.addMoney(1, true, pokemon);
                pokemon.count.moneyCount += 1;
                pokemon.count.amuletCoinCount += 1;
            }
        })
    ], [Item_1.Item.SMOKE_BALL]: [smokeBallEffect], [Item_1.Item.COMFEY]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            const comfey = pokemon_factory_1.default.createPokemonFromName(Pokemon_1.Pkm.COMFEY);
            pokemon.addAbilityPower(comfey.ap, pokemon, 0, false);
            pokemon.addAttack(comfey.atk, pokemon, 0, false);
            pokemon.addSpeed(comfey.speed - Config_1.DEFAULT_SPEED, pokemon, 0, false);
            pokemon.addMaxHP(comfey.hp, pokemon, 0, false);
            pokemon.addDefense(comfey.def, pokemon, 0, false);
            pokemon.addSpecialDefense(comfey.speDef, pokemon, 0, false);
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            const comfey = pokemon_factory_1.default.createPokemonFromName(Pokemon_1.Pkm.COMFEY);
            pokemon.addAbilityPower(-comfey.ap, pokemon, 0, false);
            pokemon.addAttack(-comfey.atk, pokemon, 0, false);
            pokemon.addSpeed(-(comfey.speed - Config_1.DEFAULT_SPEED), pokemon, 0, false);
            pokemon.addMaxHP(-comfey.hp, pokemon, 0, false);
            pokemon.addDefense(-comfey.def, pokemon, 0, false);
            pokemon.addSpecialDefense(-comfey.speDef, pokemon, 0, false);
        }),
        new effect_1.OnAbilityCastEffect((pokemon, board, target, crit) => {
            abilities_1.AbilityStrategies[Ability_1.Ability.FLORAL_HEALING].process(pokemon, board, target, crit, true);
        })
    ], [Item_1.Item.MAGMARIZER]: [
        new effect_1.OnAttackEffect(({ pokemon, target, board }) => {
            pokemon.addAttack(1, pokemon, 0, false);
            pokemon.count.magmarizerCount++;
        }),
        new effect_1.OnHitEffect(({ attacker, target }) => {
            target.status.triggerBurn(2000, target, attacker);
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            pokemon.addAttack(-pokemon.count.magmarizerCount, pokemon, 0, false);
            pokemon.count.magmarizerCount = 0;
        })
    ], [Item_1.Item.ELECTIRIZER]: [
        new effect_1.OnAttackEffect(({ pokemon, target, board }) => {
            if (target && pokemon.count.attackCount % 3 === 0) {
                target.addPP(-15, pokemon, 0, false);
                target.count.manaBurnCount++;
                target.status.triggerParalysis(2000, target, pokemon);
            }
        })
    ], [Item_1.Item.REAPER_CLOTH]: [
        new effect_1.OnItemGainedEffect((pokemon) => {
            pokemon.effects.add(Effect_1.EffectEnum.ABILITY_CRIT);
            if (abilities_1.AbilityStrategies[pokemon.skill].canCritByDefault) {
                pokemon.addCritPower(50, pokemon, 0, false);
            }
        }),
        new effect_1.OnItemRemovedEffect((pokemon) => {
            pokemon.effects.delete(Effect_1.EffectEnum.ABILITY_CRIT);
            if (abilities_1.AbilityStrategies[pokemon.skill].canCritByDefault) {
                pokemon.addCritPower(-50, pokemon, 0, false);
            }
        })
    ], [Item_1.Item.BLUE_ORB]: [exports.blueOrbOnAttackEffect], [Item_1.Item.CHOICE_SCARF]: [exports.choiceScarfOnAttackEffect], [Item_1.Item.AQUA_EGG]: [
        new effect_1.OnAbilityCastEffect((pokemon) => {
            pokemon.addPP(20, pokemon, 0, false);
        })
    ], [Item_1.Item.STAR_DUST]: [
        new effect_1.OnAbilityCastEffect((pokemon) => {
            pokemon.addShield(Math.round(0.5 * pokemon.maxPP), pokemon, 0, false);
            pokemon.count.starDustCount++;
        })
    ], [Item_1.Item.LEPPA_BERRY]: [
        new effect_1.OnAbilityCastEffect((pokemon) => {
            pokemon.eatBerry(Item_1.Item.LEPPA_BERRY);
        })
    ], [Item_1.Item.MAX_ELIXIR]: [
        new effect_1.OnAbilityCastEffect((pokemon) => {
            if (pokemon.count.ult === 1) {
                pokemon.commands.push(new simulation_command_1.DelayedCommand(() => {
                    pokemon.addPP(pokemon.maxPP, pokemon, 0, false);
                    pokemon.removeItem(Item_1.Item.MAX_ELIXIR, false);
                }, 1000));
            }
        })
    ], [Item_1.Item.ABSORB_BULB]: [
        new effect_1.OnDamageReceivedEffect((pokemon, attacker, board, damage) => {
            if (pokemon.life < 0.5 * pokemon.hp) {
                const damage = pokemon.physicalDamageReduced + pokemon.specialDamageReduced;
                pokemon.simulation.room.broadcast(types_1.Transfer.ABILITY, {
                    id: pokemon.simulation.id,
                    skill: Ability_1.Ability.EXPLOSION,
                    positionX: pokemon.positionX,
                    positionY: pokemon.positionY
                });
                board.getAdjacentCells(pokemon.positionX, pokemon.positionY).forEach((cell) => {
                    if (cell.value && cell.value.team !== pokemon.team) {
                        cell.value.handleSpecialDamage(damage, board, Game_1.AttackType.SPECIAL, pokemon, false, false);
                    }
                });
                pokemon.removeItem(Item_1.Item.ABSORB_BULB);
            }
        })
    ], [Item_1.Item.METEORITE]: [
        new effect_1.OnItemEquippedEffect(({ pokemon, player }) => {
            if ((pokemon === null || pokemon === void 0 ? void 0 : pokemon.passive) === Passive_1.Passive.ALIEN_DNA) {
                if (pokemon.name === Pokemon_1.Pkm.DEOXYS) {
                    player.transformPokemon(pokemon, Pokemon_1.Pkm.DEOXYS_ATTACK);
                }
                else if (pokemon.name === Pokemon_1.Pkm.DEOXYS_ATTACK) {
                    player.transformPokemon(pokemon, Pokemon_1.Pkm.DEOXYS_DEFENSE);
                }
                else if (pokemon.name === Pokemon_1.Pkm.DEOXYS_DEFENSE) {
                    player.transformPokemon(pokemon, Pokemon_1.Pkm.DEOXYS_SPEED);
                }
                else if (pokemon.name === Pokemon_1.Pkm.DEOXYS_SPEED) {
                    player.transformPokemon(pokemon, Pokemon_1.Pkm.DEOXYS);
                }
            }
            return false;
        })
    ], [Item_1.Item.ZYGARDE_CUBE]: [
        new effect_1.OnItemEquippedEffect(({ pokemon, player }) => {
            if ((pokemon === null || pokemon === void 0 ? void 0 : pokemon.passive) === Passive_1.Passive.ZYGARDE) {
                if (pokemon.name === Pokemon_1.Pkm.ZYGARDE_10) {
                    player.transformPokemon(pokemon, Pokemon_1.Pkm.ZYGARDE_50);
                }
                else if (pokemon.name === Pokemon_1.Pkm.ZYGARDE_50) {
                    player.transformPokemon(pokemon, Pokemon_1.Pkm.ZYGARDE_10);
                }
            }
            return false;
        })
    ], [Item_1.Item.TEAL_MASK]: [ogerponMaskEffect], [Item_1.Item.WELLSPRING_MASK]: [ogerponMaskEffect], [Item_1.Item.CORNERSTONE_MASK]: [ogerponMaskEffect], [Item_1.Item.HEARTHFLAME_MASK]: [ogerponMaskEffect], [Item_1.Item.FIRE_SHARD]: [
        new effect_1.OnItemEquippedEffect(({ pokemon, player, item }) => {
            if (pokemon.types.has(Synergy_1.Synergy.FIRE) && player.life > 3) {
                pokemon.atk += 3;
                pokemon.speed += 3;
                player.life = (0, number_1.min)(1)(player.life - 3);
                (0, array_1.removeInArray)(player.items, item);
            }
            return false;
        })
    ], [Item_1.Item.CHEF_HAT]: [
        new effect_1.OnItemEquippedEffect(({ pokemon, player, item }) => {
            return pokemon.types.has(Synergy_1.Synergy.GOURMET);
        })
    ], [Item_1.Item.EVIOLITE]: [
        new effect_1.OnItemEquippedEffect(({ pokemon, player, item }) => {
            return pokemon.hasEvolution;
        })
    ], [Item_1.Item.PICNIC_SET]: [
        new effect_1.OnItemEquippedEffect(({ pokemon, player, item }) => {
            if (pokemon.meal == "") {
                let nbSandwiches = 0;
                (0, schemas_1.values)(player.board).forEach((pkm) => {
                    if (pkm.meal === "" &&
                        pkm.canEat &&
                        pokemon &&
                        (0, distance_1.distanceC)(pkm.positionX, pkm.positionY, pokemon.positionX, pokemon.positionY) <= 1) {
                        pkm.meal = Item_1.Item.SANDWICH;
                        pkm.action = Game_1.PokemonActionState.EAT;
                        nbSandwiches++;
                    }
                });
                (0, array_1.removeInArray)(player.items, item);
                if (nbSandwiches >= 9) {
                    player.titles.add(types_1.Title.PICNICKER);
                }
            }
            return false;
        })
    ] }), Object.fromEntries(Item_1.Flavors.map((flavor) => [flavor, [
        new effect_1.OnItemEquippedEffect(({ pokemon }) => pokemon.skill === Ability_1.Ability.DECORATE)
    ]]))), { [Item_1.Item.BLACK_AUGURITE]: [
        new effect_1.OnItemEquippedEffect(({ pokemon, player, item, room }) => {
            return pokemon.passive === Passive_1.Passive.SCYTHER;
        })
    ], [Item_1.Item.MALICIOUS_ARMOR]: [
        new effect_1.OnItemEquippedEffect(({ pokemon, player, room, item }) => {
            return pokemon.passive === Passive_1.Passive.CHARCADET;
        })
    ], [Item_1.Item.AUSPICIOUS_ARMOR]: [
        new effect_1.OnItemEquippedEffect(({ pokemon, player, room, item }) => {
            return pokemon.passive === Passive_1.Passive.CHARCADET;
        })
    ], [Item_1.Item.SCROLL_OF_DARKNESS]: [
        new effect_1.OnItemEquippedEffect(({ pokemon, player, room, item }) => {
            return pokemon.passive === Passive_1.Passive.KUBFU;
        })
    ], [Item_1.Item.SCROLL_OF_WATERS]: [
        new effect_1.OnItemEquippedEffect(({ pokemon, player, room, item }) => {
            return pokemon.passive === Passive_1.Passive.KUBFU;
        })
    ], [Item_1.Item.RARE_CANDY]: [
        new effect_1.OnItemEquippedEffect(({ pokemon, player, room, item }) => {
            var _a;
            const evolution = (_a = pokemon.evolutionRule) === null || _a === void 0 ? void 0 : _a.getEvolution(pokemon, player);
            if (!evolution ||
                evolution === Pokemon_1.Pkm.DEFAULT ||
                pokemon.items.has(Item_1.Item.EVIOLITE)) {
                return false;
            }
            const pokemonEvolved = player.transformPokemon(pokemon, evolution);
            pokemon.afterEvolve({
                pokemonEvolved,
                pokemonsBeforeEvolution: [pokemon],
                player
            });
            pokemonEvolved.items.add(item);
            (0, array_1.removeInArray)(player.items, item);
            if (pokemonEvolved.items.has(Item_1.Item.SHINY_CHARM)) {
                pokemonEvolved.shiny = true;
            }
            room.checkEvolutionsAfterItemAcquired(player.id, pokemon);
            player.updateSynergies();
            return false;
        })
    ] });
//# sourceMappingURL=items.js.map