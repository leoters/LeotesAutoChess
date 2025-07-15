"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effects_1 = require("../models/effects");
const types_1 = require("../types");
const Config_1 = require("../types/Config");
const Effect_1 = require("../types/enum/Effect");
const Game_1 = require("../types/enum/Game");
const Item_1 = require("../types/enum/Item");
const Passive_1 = require("../types/enum/Passive");
const Synergy_1 = require("../types/enum/Synergy");
const Weather_1 = require("../types/enum/Weather");
const array_1 = require("../utils/array");
const distance_1 = require("../utils/distance");
const logger_1 = require("../utils/logger");
const number_1 = require("../utils/number");
const random_1 = require("../utils/random");
const abilities_1 = require("./abilities/abilities");
const effect_1 = require("./effects/effect");
class PokemonState {
    constructor() {
        this.name = "";
    }
    attack(pokemon, board, target, isTripleAttack = false) {
        if (target && target.life > 0) {
            let damage = pokemon.atk;
            let physicalDamage = 0;
            let specialDamage = 0;
            let trueDamage = 0;
            let totalTakenDamage = 0;
            let attackType = pokemon.attackType;
            if ((0, random_1.chance)(pokemon.critChance / 100, pokemon)) {
                if (target.items.has(Item_1.Item.ROCKY_HELMET) === false) {
                    let opponentCritPower = pokemon.critPower;
                    if (target.effects.has(Effect_1.EffectEnum.BATTLE_ARMOR)) {
                        opponentCritPower -= 0.3;
                    }
                    else if (target.effects.has(Effect_1.EffectEnum.MOUTAIN_RESISTANCE)) {
                        opponentCritPower -= 0.5;
                    }
                    else if (target.effects.has(Effect_1.EffectEnum.DIAMOND_STORM)) {
                        opponentCritPower -= 0.7;
                    }
                    const nbBlackAugurite = target.player
                        ? (0, array_1.count)(target.player.items, Item_1.Item.BLACK_AUGURITE)
                        : 0;
                    opponentCritPower -= 0.1 * nbBlackAugurite;
                    damage = (0, number_1.min)(0)(Math.round(damage * opponentCritPower));
                    target.count.crit++;
                }
                pokemon.onCriticalAttack({ target, board, damage });
            }
            if (pokemon.attackType === Game_1.AttackType.SPECIAL) {
                damage = Math.ceil(damage * (1 + pokemon.ap / 100));
            }
            let additionalSpecialDamagePart = 0;
            if (pokemon.effects.has(Effect_1.EffectEnum.AROMATIC_MIST)) {
                additionalSpecialDamagePart += 0.2;
            }
            else if (pokemon.effects.has(Effect_1.EffectEnum.FAIRY_WIND)) {
                additionalSpecialDamagePart += 0.4;
            }
            else if (pokemon.effects.has(Effect_1.EffectEnum.STRANGE_STEAM)) {
                additionalSpecialDamagePart += 0.6;
            }
            else if (pokemon.effects.has(Effect_1.EffectEnum.MOON_FORCE)) {
                additionalSpecialDamagePart += 0.8;
            }
            if (pokemon.effects.has(Effect_1.EffectEnum.CHARGE)) {
                additionalSpecialDamagePart +=
                    1 * pokemon.count.ult * (1 + pokemon.ap / 100);
            }
            let isAttackSuccessful = true;
            let dodgeChance = target.dodge;
            if (pokemon.status.blinded) {
                dodgeChance += 0.5;
            }
            if ((0, random_1.chance)(dodgeChance, target, 0.9) &&
                !pokemon.items.has(Item_1.Item.XRAY_VISION) &&
                !pokemon.effects.has(Effect_1.EffectEnum.LOCK_ON) &&
                !target.status.paralysis &&
                !target.status.sleep &&
                !target.status.freeze) {
                isAttackSuccessful = false;
                damage = 0;
                target.count.dodgeCount += 1;
            }
            if (target.status.protect || target.status.skydiving) {
                isAttackSuccessful = false;
                damage = 0;
            }
            if (additionalSpecialDamagePart > 0) {
                specialDamage += Math.ceil(damage * additionalSpecialDamagePart);
            }
            if (pokemon.passive === Passive_1.Passive.SPOT_PANDA && target.status.confusion) {
                specialDamage += 1 * damage * (1 + pokemon.ap / 100);
            }
            if (target.effects.has(Effect_1.EffectEnum.WONDER_ROOM)) {
                damage = Math.ceil(damage * (1 + pokemon.ap / 100));
                attackType = Game_1.AttackType.SPECIAL;
            }
            let trueDamagePart = 0;
            if (pokemon.effects.has(Effect_1.EffectEnum.STEEL_SURGE)) {
                trueDamagePart += 0.33;
            }
            else if (pokemon.effects.has(Effect_1.EffectEnum.STEEL_SPIKE)) {
                trueDamagePart += 0.66;
            }
            else if (pokemon.effects.has(Effect_1.EffectEnum.CORKSCREW_CRASH)) {
                trueDamagePart += 1.0;
            }
            else if (pokemon.effects.has(Effect_1.EffectEnum.MAX_MELTDOWN)) {
                trueDamagePart += 1.2;
            }
            if (pokemon.items.has(Item_1.Item.RED_ORB) && target) {
                trueDamagePart += 0.25;
            }
            if (pokemon.effects.has(Effect_1.EffectEnum.LOCK_ON) && target) {
                trueDamagePart += 2.0 * (1 + pokemon.ap / 100);
                pokemon.effects.delete(Effect_1.EffectEnum.LOCK_ON);
            }
            if (trueDamagePart > 0) {
                trueDamage = Math.ceil(damage * trueDamagePart);
                damage = (0, number_1.min)(0)(damage * (1 - trueDamagePart));
                const { takenDamage } = target.handleDamage({
                    damage: trueDamage,
                    board,
                    attackType: Game_1.AttackType.TRUE,
                    attacker: pokemon,
                    shouldTargetGainMana: true
                });
                totalTakenDamage += takenDamage;
            }
            if (attackType === Game_1.AttackType.SPECIAL) {
                specialDamage += damage;
            }
            else {
                physicalDamage = damage;
            }
            if (pokemon.effects.has(Effect_1.EffectEnum.STONE_EDGE)) {
                physicalDamage += Math.round(pokemon.def * (1 + pokemon.ap / 100));
            }
            if (physicalDamage > 0) {
                const { takenDamage } = target.handleDamage({
                    damage: physicalDamage,
                    board,
                    attackType: Game_1.AttackType.PHYSICAL,
                    attacker: pokemon,
                    shouldTargetGainMana: true
                });
                totalTakenDamage += takenDamage;
            }
            if (specialDamage > 0) {
                const { takenDamage } = target.handleDamage({
                    damage: specialDamage,
                    board,
                    attackType: Game_1.AttackType.SPECIAL,
                    attacker: pokemon,
                    shouldTargetGainMana: true
                });
                totalTakenDamage += takenDamage;
                if (target.items.has(Item_1.Item.POWER_LENS) && !pokemon.items.has(Item_1.Item.PROTECTIVE_PADS)) {
                    const speDef = target.status.armorReduction ? Math.round(target.speDef / 2) : target.speDef;
                    const damageAfterReduction = specialDamage / (1 + Config_1.ARMOR_FACTOR * speDef);
                    const damageBlocked = (0, number_1.min)(0)(specialDamage - damageAfterReduction);
                    pokemon.handleDamage({
                        damage: Math.round(damageBlocked),
                        board,
                        attackType: Game_1.AttackType.SPECIAL,
                        attacker: target,
                        shouldTargetGainMana: true
                    });
                }
            }
            const totalDamage = physicalDamage + specialDamage + trueDamage;
            pokemon.onAttack({
                target,
                board,
                physicalDamage,
                specialDamage,
                trueDamage,
                totalDamage,
                isTripleAttack
            });
            if (isAttackSuccessful) {
                pokemon.onHit({
                    target,
                    board,
                    totalTakenDamage,
                    physicalDamage,
                    specialDamage,
                    trueDamage
                });
            }
        }
    }
    handleHeal(pokemon, heal, caster, apBoost, crit) {
        if (pokemon.status.wound) {
            if (pokemon.simulation.weather === Weather_1.Weather.BLOODMOON &&
                pokemon.player &&
                pokemon.player.items.includes(Item_1.Item.BLOOD_STONE)) {
                const nbBloodStones = (0, array_1.count)(pokemon.player.items, Item_1.Item.BLOOD_STONE);
                if (nbBloodStones > 0) {
                    pokemon.addShield(Math.round(0.3 * nbBloodStones * heal), pokemon, apBoost, crit);
                }
            }
            return;
        }
        if (pokemon.life > 0 &&
            pokemon.life < pokemon.hp &&
            !pokemon.status.protect) {
            if (apBoost > 0) {
                heal *= 1 + (apBoost * caster.ap) / 100;
            }
            if (crit) {
                heal *= caster.critPower;
            }
            if (pokemon.effects.has(Effect_1.EffectEnum.BUFF_HEAL_RECEIVED)) {
                heal *= 1.3;
            }
            if (pokemon.status.burn) {
                heal *= 0.5;
            }
            if (pokemon.status.enraged) {
                heal *= 0.5;
            }
            heal = Math.round(heal);
            const healTaken = Math.min(pokemon.hp - pokemon.life, heal);
            pokemon.life = Math.min(pokemon.hp, pokemon.life + heal);
            if (caster && healTaken > 0) {
                if (pokemon.simulation.room.state.time < Config_1.FIGHTING_PHASE_DURATION) {
                    pokemon.simulation.room.broadcast(types_1.Transfer.POKEMON_HEAL, {
                        index: caster.index,
                        type: Game_1.HealType.HEAL,
                        amount: healTaken,
                        x: pokemon.positionX,
                        y: pokemon.positionY,
                        id: pokemon.simulation.id
                    });
                }
                caster.healDone += healTaken;
            }
        }
    }
    addShield(pokemon, shield, caster, apBoost, crit) {
        if (pokemon.life > 0) {
            if (apBoost > 0)
                shield *= 1 + (caster.ap * apBoost) / 100;
            if (crit)
                shield *= caster.critPower;
            if (pokemon.status.enraged)
                shield *= 0.5;
            if (pokemon.items.has(Item_1.Item.SILK_SCARF))
                shield *= 1.5;
            shield = Math.round(shield);
            pokemon.shield = (0, number_1.min)(0)(pokemon.shield + shield);
            if (caster && shield > 0) {
                if (pokemon.simulation.room.state.time < Config_1.FIGHTING_PHASE_DURATION) {
                    pokemon.simulation.room.broadcast(types_1.Transfer.POKEMON_HEAL, {
                        index: caster.index,
                        type: Game_1.HealType.SHIELD,
                        amount: shield,
                        x: pokemon.positionX,
                        y: pokemon.positionY,
                        id: pokemon.simulation.id
                    });
                }
                caster.shieldDone += shield;
            }
        }
    }
    handleDamage({ target: pokemon, damage, board, attackType, attacker, shouldTargetGainMana }) {
        let death = false;
        let takenDamage = 0;
        if (isNaN(damage)) {
            logger_1.logger.trace(`NaN Damage from ${attacker ? attacker.name : "Environment"}`);
            return { death: false, takenDamage: 0 };
        }
        if (pokemon.life <= 0 || pokemon.status.resurecting) {
            pokemon.status.possessedCooldown = 0;
            return { death: false, takenDamage: 0 };
        }
        if (attacker && attacker.status.enraged) {
            damage *= 2;
        }
        if (pokemon.status.protect || pokemon.status.skydiving) {
            death = false;
            takenDamage = 0;
        }
        else {
            if (attacker && attacker.status.electricField) {
                damage = Math.ceil(damage * 1.2);
            }
            if (attacker && attacker.status.psychicField) {
                damage = Math.ceil(damage * 1.2);
            }
            if (attacker && attacker.status.grassField) {
                damage = Math.ceil(damage * 1.2);
            }
            if (attacker && attacker.status.fairyField) {
                damage = Math.ceil(damage * 1.2);
            }
            if (attacker &&
                attacker.passive === Passive_1.Passive.HISUIAN_TYPHLOSION &&
                (pokemon.status.burn || pokemon.status.silence)) {
                damage = Math.ceil(damage * 1.2);
            }
            if (pokemon.simulation.weather === Weather_1.Weather.MISTY &&
                attackType === Game_1.AttackType.SPECIAL) {
                damage = Math.ceil(damage * 1.2);
            }
            if (pokemon.simulation.weather === Weather_1.Weather.BLOODMOON &&
                attackType === Game_1.AttackType.PHYSICAL) {
                damage = Math.ceil(damage * 1.2);
            }
            if (pokemon.status.freeze &&
                attacker &&
                attacker.effects.has(Effect_1.EffectEnum.SHEER_COLD)) {
                damage = Math.ceil(damage * 1.3);
            }
            let def = pokemon.status.armorReduction
                ? Math.round(pokemon.def / 2)
                : pokemon.def;
            let speDef = pokemon.status.armorReduction
                ? Math.round(pokemon.speDef / 2)
                : pokemon.speDef;
            if (pokemon.effects.has(Effect_1.EffectEnum.WONDER_ROOM)) {
                const swap = def;
                def = speDef;
                speDef = swap;
            }
            if (pokemon.status.reflect && attackType === Game_1.AttackType.PHYSICAL) {
                if (attacker && attacker.items.has(Item_1.Item.PROTECTIVE_PADS) === false) {
                    const crit = pokemon.effects.has(Effect_1.EffectEnum.ABILITY_CRIT) &&
                        (0, random_1.chance)(pokemon.critChance, pokemon);
                    const reflectDamage = Math.round(0.5 * damage * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1));
                    attacker.handleDamage({
                        damage: reflectDamage,
                        board,
                        attackType: Game_1.AttackType.SPECIAL,
                        attacker: pokemon,
                        shouldTargetGainMana: true
                    });
                }
                return { death: false, takenDamage: 0 };
            }
            let reducedDamage = damage;
            if (attackType == Game_1.AttackType.PHYSICAL) {
                reducedDamage = damage / (1 + Config_1.ARMOR_FACTOR * def);
            }
            else if (attackType == Game_1.AttackType.SPECIAL) {
                reducedDamage = damage / (1 + Config_1.ARMOR_FACTOR * speDef);
            }
            else if (attackType == Game_1.AttackType.TRUE) {
                reducedDamage = damage;
            }
            if (attackType !== Game_1.AttackType.TRUE) {
                if (pokemon.items.has(Item_1.Item.POKE_DOLL)) {
                    reducedDamage = Math.ceil(reducedDamage * 0.7);
                }
                if (pokemon.effects.has(Effect_1.EffectEnum.GUTS) ||
                    pokemon.effects.has(Effect_1.EffectEnum.STURDY) ||
                    pokemon.effects.has(Effect_1.EffectEnum.DEFIANT) ||
                    pokemon.effects.has(Effect_1.EffectEnum.JUSTIFIED)) {
                    const damageBlocked = pokemon.effects.has(Effect_1.EffectEnum.JUSTIFIED)
                        ? 13
                        : pokemon.effects.has(Effect_1.EffectEnum.DEFIANT)
                            ? 10
                            : pokemon.effects.has(Effect_1.EffectEnum.STURDY)
                                ? 7
                                : 4;
                    reducedDamage = reducedDamage - damageBlocked;
                    pokemon.count.fightingBlockCount++;
                }
                if (pokemon.passive === Passive_1.Passive.WONDER_GUARD) {
                    const damageBlocked = 20;
                    reducedDamage = reducedDamage - damageBlocked;
                }
            }
            reducedDamage = (0, number_1.min)(1)(reducedDamage);
            if (attackType === Game_1.AttackType.PHYSICAL) {
                pokemon.physicalDamageReduced += (0, number_1.min)(0)(damage - reducedDamage);
            }
            else if (attackType === Game_1.AttackType.SPECIAL) {
                pokemon.specialDamageReduced += (0, number_1.min)(0)(damage - reducedDamage);
                if (attacker && attacker.items.has(Item_1.Item.POKEMONOMICON)) {
                    pokemon.status.triggerBurn(3000, pokemon, attacker);
                }
            }
            if (isNaN(reducedDamage)) {
                reducedDamage = 0;
                logger_1.logger.error(`error calculating damage, damage: ${damage}, target: ${pokemon.name}, attacker: ${attacker ? attacker.name : "Environment"}, attack type: ${attackType}, defense : ${pokemon.def}, spedefense: ${pokemon.speDef}, life: ${pokemon.life}`);
            }
            let residualDamage = reducedDamage;
            if (pokemon.shield > 0) {
                let damageOnShield;
                if (pokemon.status.flinch) {
                    damageOnShield = Math.ceil(reducedDamage * 0.5);
                    residualDamage = Math.ceil(reducedDamage * 0.5);
                }
                else {
                    damageOnShield = reducedDamage;
                    residualDamage = 0;
                }
                if (attacker && attacker.items.has(Item_1.Item.PROTECTIVE_PADS)) {
                    damageOnShield *= 2;
                }
                if (damageOnShield > pokemon.shield) {
                    residualDamage += damageOnShield - pokemon.shield;
                    damageOnShield = pokemon.shield;
                }
                pokemon.shieldDamageTaken += damageOnShield;
                takenDamage += damageOnShield;
                pokemon.shield -= damageOnShield;
            }
            takenDamage += Math.min(residualDamage, pokemon.life);
            if (pokemon.items.has(Item_1.Item.SHINY_CHARM) &&
                pokemon.life - residualDamage < 0.3 * pokemon.hp) {
                death = false;
                takenDamage = 0;
                residualDamage = 0;
                pokemon.status.triggerProtect(2000);
                pokemon.removeItem(Item_1.Item.SHINY_CHARM);
            }
            if (pokemon.hasSynergyEffect(Synergy_1.Synergy.FOSSIL) && pokemon.life - residualDamage <= 0) {
                const shield = Math.round(pokemon.hp * (pokemon.effects.has(Effect_1.EffectEnum.FORGOTTEN_POWER)
                    ? 1
                    : pokemon.effects.has(Effect_1.EffectEnum.ELDER_POWER)
                        ? 0.7
                        : 0.4));
                const attackBonus = pokemon.effects.has(Effect_1.EffectEnum.FORGOTTEN_POWER)
                    ? 1
                    : pokemon.effects.has(Effect_1.EffectEnum.ELDER_POWER)
                        ? 0.7
                        : 0.4;
                pokemon.addShield(shield, pokemon, 0, false);
                const damageOnShield = (0, number_1.max)(shield)(residualDamage);
                pokemon.shieldDamageTaken += damageOnShield;
                takenDamage += damageOnShield;
                pokemon.shield -= damageOnShield;
                residualDamage = (0, number_1.min)(0)(residualDamage - shield);
                pokemon.addAttack(pokemon.baseAtk * attackBonus, pokemon, 0, false);
                pokemon.cooldown = Math.round(500 * (50 / pokemon.speed));
                (0, abilities_1.broadcastAbility)(pokemon, { skill: "FOSSIL_RESURRECT" });
                effects_1.SynergyEffects[Synergy_1.Synergy.FOSSIL].forEach((e) => {
                    pokemon.effects.delete(e);
                });
            }
            pokemon.life = Math.max(0, pokemon.life - residualDamage);
            if (shouldTargetGainMana) {
                pokemon.addPP(Math.ceil(residualDamage / 10), pokemon, 0, false);
            }
            if (takenDamage > 0) {
                pokemon.onDamageReceived({ attacker, damage: takenDamage, board });
                if (attacker) {
                    attacker.onDamageDealt({ target: pokemon, damage: takenDamage });
                    if (pokemon !== attacker) {
                        switch (attackType) {
                            case Game_1.AttackType.PHYSICAL:
                                attacker.physicalDamage += takenDamage;
                                break;
                            case Game_1.AttackType.SPECIAL:
                                attacker.specialDamage += takenDamage;
                                break;
                            case Game_1.AttackType.TRUE:
                                attacker.trueDamage += takenDamage;
                                break;
                            default:
                                break;
                        }
                    }
                    pokemon.simulation.room.broadcast(types_1.Transfer.POKEMON_DAMAGE, {
                        index: attacker.index,
                        type: attackType,
                        amount: takenDamage,
                        x: pokemon.positionX,
                        y: pokemon.positionY,
                        id: pokemon.simulation.id
                    });
                }
            }
            if (pokemon.life <= 0) {
                if (pokemon.status.resurection) {
                    pokemon.status.triggerResurection(pokemon);
                    board.forEach((x, y, entity) => {
                        if (entity && entity.targetEntityId === pokemon.id) {
                            entity.cooldown = 0;
                            entity.toMovingState();
                        }
                    });
                }
                else {
                    death = true;
                }
                if (pokemon.passive === Passive_1.Passive.PRIMEAPE) {
                    pokemon.applyStat(Game_1.Stat.ATK, 1, true);
                }
            }
            if (death) {
                const originalTeam = pokemon.status.possessed ? (pokemon.team === Game_1.Team.BLUE_TEAM ? Game_1.Team.RED_TEAM : Game_1.Team.BLUE_TEAM) : pokemon.team;
                pokemon.team = originalTeam;
                pokemon.onDeath({ board });
                board.setEntityOnCell(pokemon.positionX, pokemon.positionY, undefined);
                if (attacker && pokemon !== attacker) {
                    attacker.onKill({ target: pokemon, board, attackType });
                }
                const effectsRemovedList = [];
                if (pokemon.passive === Passive_1.Passive.ELECTRIC_TERRAIN) {
                    board.forEach((x, y, pkm) => {
                        if (pkm && pkm.team == pokemon.team && pkm.status.electricField) {
                            pkm.status.removeElectricField(pkm);
                        }
                    });
                    effectsRemovedList.push(Effect_1.EffectEnum.ELECTRIC_TERRAIN);
                }
                else if (pokemon.passive === Passive_1.Passive.PSYCHIC_TERRAIN) {
                    board.forEach((x, y, pkm) => {
                        if (pkm && pkm.team == pokemon.team && pkm.status.psychicField) {
                            pkm.status.removePsychicField(pkm);
                        }
                    });
                    effectsRemovedList.push(Effect_1.EffectEnum.PSYCHIC_TERRAIN);
                }
                else if (pokemon.passive === Passive_1.Passive.GRASSY_TERRAIN) {
                    board.forEach((x, y, pkm) => {
                        if (pkm && pkm.team == pokemon.team && pkm.status.grassField) {
                            pkm.status.grassField = false;
                        }
                    });
                    effectsRemovedList.push(Effect_1.EffectEnum.GRASSY_TERRAIN);
                }
                else if (pokemon.passive === Passive_1.Passive.MISTY_TERRAIN) {
                    board.forEach((x, y, pkm) => {
                        if (pkm && pkm.team == pokemon.team && pkm.status.fairyField) {
                            pkm.status.fairyField = false;
                        }
                    });
                    effectsRemovedList.push(Effect_1.EffectEnum.MISTY_TERRAIN);
                }
                if (originalTeam == Game_1.Team.BLUE_TEAM) {
                    effectsRemovedList.forEach((x) => pokemon.simulation.blueEffects.delete(x));
                }
                else {
                    effectsRemovedList.forEach((x) => pokemon.simulation.redEffects.delete(x));
                }
                if (pokemon.simulation.redTeam.has(pokemon.id)) {
                    pokemon.simulation.redTeam.delete(pokemon.id);
                }
                if (pokemon.simulation.blueTeam.has(pokemon.id)) {
                    pokemon.simulation.blueTeam.delete(pokemon.id);
                }
            }
        }
        takenDamage = Math.round(takenDamage);
        return { death, takenDamage };
    }
    updateCommands(pokemon, dt) {
        pokemon.commands.forEach((command) => command.update(dt));
        pokemon.commands = pokemon.commands.filter((command) => !command.executed);
    }
    update(pokemon, dt, board, player) {
        this.updateCommands(pokemon, dt);
        pokemon.status.updateAllStatus(dt, pokemon, board);
        pokemon.effectsSet.forEach((effect) => {
            if (effect instanceof effect_1.PeriodicEffect) {
                effect.update(dt, pokemon);
            }
        });
        if ((pokemon.status.resurecting ||
            pokemon.status.freeze ||
            pokemon.status.sleep) &&
            pokemon.state.name !== "idle") {
            pokemon.toIdleState();
        }
        if (pokemon.effects.has(Effect_1.EffectEnum.INGRAIN) ||
            pokemon.effects.has(Effect_1.EffectEnum.GROWTH) ||
            pokemon.effects.has(Effect_1.EffectEnum.SPORE)) {
            if (pokemon.grassHealCooldown - dt <= 0) {
                const heal = pokemon.effects.has(Effect_1.EffectEnum.SPORE)
                    ? 30
                    : pokemon.effects.has(Effect_1.EffectEnum.GROWTH)
                        ? 15
                        : 5;
                pokemon.handleHeal(heal, pokemon, 0, false);
                pokemon.grassHealCooldown = 2000;
                pokemon.simulation.room.broadcast(types_1.Transfer.ABILITY, {
                    id: pokemon.simulation.id,
                    skill: "GRASS_HEAL",
                    positionX: pokemon.positionX,
                    positionY: pokemon.positionY
                });
            }
            else {
                pokemon.grassHealCooldown = pokemon.grassHealCooldown - dt;
            }
        }
        if (pokemon.simulation.weather === Weather_1.Weather.SANDSTORM) {
            pokemon.sandstormDamageTimer -= dt;
            if (pokemon.sandstormDamageTimer <= 0 && !pokemon.simulation.finished) {
                pokemon.sandstormDamageTimer = 1000;
                let sandstormDamage = 5;
                const nbSmoothRocks = player ? (0, array_1.count)(player.items, Item_1.Item.SMOOTH_ROCK) : 0;
                if (nbSmoothRocks > 0) {
                    sandstormDamage -= nbSmoothRocks;
                    pokemon.addSpeed(nbSmoothRocks, pokemon, 0, false);
                }
                if (pokemon.types.has(Synergy_1.Synergy.GROUND) === false) {
                    pokemon.handleDamage({
                        damage: sandstormDamage,
                        board,
                        attackType: Game_1.AttackType.SPECIAL,
                        attacker: null,
                        shouldTargetGainMana: false
                    });
                }
            }
        }
        if (pokemon.oneSecondCooldown <= 0) {
            this.updateEachSecond(pokemon, board);
            pokemon.oneSecondCooldown = 1000;
        }
        else {
            pokemon.oneSecondCooldown = (0, number_1.min)(0)(pokemon.oneSecondCooldown - dt);
        }
        if (pokemon.fairySplashCooldown > 0) {
            pokemon.fairySplashCooldown = (0, number_1.min)(0)(pokemon.fairySplashCooldown - dt);
        }
        if (pokemon.items.has(Item_1.Item.FLAME_ORB) &&
            !pokemon.status.burn &&
            pokemon.action !== Game_1.PokemonActionState.HOP) {
            pokemon.status.triggerBurn(60000, pokemon, pokemon);
        }
        if (pokemon.items.has(Item_1.Item.TOXIC_ORB) &&
            pokemon.status.poisonStacks === 0 &&
            pokemon.action !== Game_1.PokemonActionState.HOP) {
            pokemon.status.triggerPoison(60000, pokemon, pokemon);
        }
    }
    updateEachSecond(pokemon, board) {
        pokemon.addPP(10, pokemon, 0, false);
        if (pokemon.effects.has(Effect_1.EffectEnum.RAIN_DANCE)) {
            pokemon.addPP(4, pokemon, 0, false);
        }
        if (pokemon.effects.has(Effect_1.EffectEnum.DRIZZLE)) {
            pokemon.addPP(8, pokemon, 0, false);
        }
        if (pokemon.effects.has(Effect_1.EffectEnum.PRIMORDIAL_SEA)) {
            pokemon.addPP(12, pokemon, 0, false);
        }
        if (pokemon.simulation.weather === Weather_1.Weather.RAIN) {
            pokemon.addPP(3, pokemon, 0, false);
            const nbDampRocks = pokemon.player
                ? (0, array_1.count)(pokemon.player.items, Item_1.Item.DAMP_ROCK)
                : 0;
            if (nbDampRocks > 0) {
                pokemon.addPP(2 * nbDampRocks, pokemon, 0, false);
            }
        }
        if (pokemon.passive === Passive_1.Passive.ILLUMISE_VOLBEAT) {
            board.forEach((x, y, p) => {
                if (p && p.passive === Passive_1.Passive.ILLUMISE_VOLBEAT && p !== pokemon) {
                    pokemon.addPP(5, pokemon, 0, false);
                }
            });
        }
        if (pokemon.effects.has(Effect_1.EffectEnum.LIGHT_PULSE) ||
            pokemon.effects.has(Effect_1.EffectEnum.ETERNAL_LIGHT) ||
            pokemon.effects.has(Effect_1.EffectEnum.MAX_ILLUMINATION)) {
            pokemon.addPP(8, pokemon, 0, false);
        }
        if (pokemon.items.has(Item_1.Item.METRONOME)) {
            pokemon.addPP(5, pokemon, 0, false);
        }
        if (pokemon.items.has(Item_1.Item.GREEN_ORB)) {
            for (const cell of board.getAdjacentCells(pokemon.positionX, pokemon.positionY, true)) {
                if (cell.value && cell.value.team === pokemon.team) {
                    cell.value.handleHeal(0.04 * cell.value.hp, pokemon, 0, false);
                }
            }
        }
        if (pokemon.effects.has(Effect_1.EffectEnum.STEALTH_ROCKS) &&
            !pokemon.types.has(Synergy_1.Synergy.ROCK)) {
            pokemon.handleDamage({
                damage: 10,
                board,
                attackType: Game_1.AttackType.PHYSICAL,
                attacker: null,
                shouldTargetGainMana: true
            });
            pokemon.status.triggerWound(1000, pokemon, undefined);
        }
        if (pokemon.effects.has(Effect_1.EffectEnum.SPIKES) &&
            !pokemon.types.has(Synergy_1.Synergy.FLYING)) {
            pokemon.handleDamage({
                damage: 10,
                board,
                attackType: Game_1.AttackType.TRUE,
                attacker: null,
                shouldTargetGainMana: true
            });
            pokemon.status.triggerArmorReduction(1000, pokemon);
        }
        if (pokemon.effects.has(Effect_1.EffectEnum.TOXIC_SPIKES) &&
            !pokemon.types.has(Synergy_1.Synergy.POISON)) {
            pokemon.status.triggerPoison(1000, pokemon, undefined);
        }
        if (pokemon.effects.has(Effect_1.EffectEnum.HAIL) &&
            !pokemon.types.has(Synergy_1.Synergy.ICE)) {
            pokemon.handleDamage({
                damage: 10,
                board,
                attackType: Game_1.AttackType.SPECIAL,
                attacker: null,
                shouldTargetGainMana: true
            });
            pokemon.status.triggerFreeze(1000, pokemon);
            pokemon.effects.delete(Effect_1.EffectEnum.HAIL);
        }
        if (pokemon.effects.has(Effect_1.EffectEnum.EMBER) &&
            !(pokemon.types.has(Synergy_1.Synergy.FIRE) || pokemon.types.has(Synergy_1.Synergy.FLYING))) {
            pokemon.handleDamage({
                damage: 10,
                board,
                attackType: Game_1.AttackType.SPECIAL,
                attacker: null,
                shouldTargetGainMana: true
            });
            pokemon.status.triggerBurn(1100, pokemon, undefined);
        }
    }
    onEnter(pokemon) { }
    onExit(pokemon) { }
    getTargetsAtRange(pokemon, board) {
        const targets = [];
        for (let x = (0, number_1.min)(0)(pokemon.positionX - pokemon.range); x <= (0, number_1.max)(board.columns - 1)(pokemon.positionX + pokemon.range); x++) {
            for (let y = (0, number_1.min)(0)(pokemon.positionY - pokemon.range); y <= (0, number_1.max)(board.rows - 1)(pokemon.positionY + pokemon.range); y++) {
                const value = board.getEntityOnCell(x, y);
                if (value && value.isTargettableBy(pokemon)) {
                    targets.push(value);
                }
            }
        }
        return targets;
    }
    getNearestTargetAtRange(pokemon, board) {
        const targets = this.getTargetsAtRange(pokemon, board);
        let distance = pokemon.range + 1;
        let candidates = [];
        for (const target of targets) {
            const candidateDistance = (0, distance_1.distanceC)(pokemon.positionX, pokemon.positionY, target.positionX, target.positionY);
            if (candidateDistance < distance) {
                distance = candidateDistance;
                candidates = [target];
            }
            else if (candidateDistance == distance) {
                candidates.push(target);
            }
        }
        if (candidates.length > 0) {
            return (0, random_1.pickRandomIn)(candidates);
        }
        else {
            return undefined;
        }
    }
    getNearestTargetAtSight(pokemon, board) {
        let distance = 999;
        let candidatesCoordinates = new Array();
        board.forEach((x, y, value) => {
            if (value && value.isTargettableBy(pokemon)) {
                const candidateDistance = (0, distance_1.distanceM)(pokemon.positionX, pokemon.positionY, x, y);
                if (candidateDistance < distance) {
                    distance = candidateDistance;
                    candidatesCoordinates = [{ x, y, target: value }];
                }
                else if (candidateDistance == distance) {
                    candidatesCoordinates.push({ x, y, target: value });
                }
            }
        });
        if (candidatesCoordinates.length > 0) {
            return (0, random_1.pickRandomIn)(candidatesCoordinates);
        }
        else {
            return null;
        }
    }
    getFarthestTarget(pokemon, board, targettableBy = pokemon) {
        let farthestTarget = undefined;
        let maxDistance = 0;
        board.forEach((x, y, enemy) => {
            if (enemy && enemy.isTargettableBy(targettableBy)) {
                const distance = (0, distance_1.distanceM)(pokemon.positionX, pokemon.positionY, x, y);
                if (distance > maxDistance) {
                    farthestTarget = enemy;
                    maxDistance = distance;
                }
            }
        });
        return farthestTarget;
    }
    getNearestAllies(pokemon, board) {
        let nearestAllies = [];
        let minDistance = 999;
        board.forEach((x, y, value) => {
            if (value && value.team === pokemon.team && pokemon.id !== value.id) {
                const distance = (0, distance_1.distanceC)(pokemon.positionX, pokemon.positionY, value.positionX, value.positionY);
                if (distance < minDistance) {
                    nearestAllies = [value];
                    minDistance = distance;
                }
                else if (distance === minDistance) {
                    nearestAllies.push(value);
                }
            }
        });
        return nearestAllies;
    }
    getMostSurroundedCoordinateAvailablePlace(pokemon, board) {
        let x = undefined;
        let y = undefined;
        const team = pokemon.team;
        const emptyPlaces = new Array();
        board.forEach((x, y, value) => {
            if (value === undefined) {
                const cells = board.getAdjacentCells(x, y);
                let n = 0;
                cells.forEach((cell) => {
                    if (cell.value && cell.value.team !== team) {
                        n++;
                    }
                });
                emptyPlaces.push({ x, y, neighbour: n });
            }
        });
        emptyPlaces.sort((a, b) => {
            return b.neighbour - a.neighbour;
        });
        if (emptyPlaces.length > 0) {
            x = emptyPlaces[0].x;
            y = emptyPlaces[0].y;
        }
        if (x !== undefined && y !== undefined) {
            return { x, y };
        }
        else {
            return undefined;
        }
    }
    getNearestAvailablePlaceCoordinates(pokemon, board, maxRange) {
        let candidateCells = [];
        let minDistance = 999;
        board.forEach((x, y, value) => {
            const distance = (0, distance_1.distanceM)(pokemon.positionX, pokemon.positionY, x, y);
            if (value === undefined &&
                (maxRange === undefined || distance <= maxRange)) {
                if (distance < minDistance) {
                    candidateCells = [{ x, y, value }];
                    minDistance = distance;
                }
                else if (distance == minDistance) {
                    candidateCells.push({ x, y, value });
                }
            }
        });
        return (0, random_1.pickRandomIn)(candidateCells);
    }
    getTargetWhenConfused(pokemon, board) {
        let distance = pokemon.range + 1;
        let candidates = [];
        board.forEach((x, y, pkm) => {
            if (pkm &&
                pkm.id !== pokemon.id &&
                pkm.isTargettableBy(pokemon, true, true)) {
                const candidateDistance = (0, distance_1.distanceM)(pokemon.positionX, pokemon.positionY, x, y);
                if (candidateDistance < distance) {
                    distance = candidateDistance;
                    candidates = [pkm];
                }
                else if (candidateDistance == distance) {
                    candidates.push(pkm);
                }
            }
        });
        candidates.push(pokemon);
        if (candidates.length > 0) {
            return (0, random_1.pickRandomIn)(candidates);
        }
        else {
            return undefined;
        }
    }
}
exports.default = PokemonState;
//# sourceMappingURL=pokemon-state.js.map