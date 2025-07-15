"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassiveEffects = exports.AccelerationEffect = exports.SlowStartEffect = exports.WaterSpringEffect = void 0;
exports.drumBeat = drumBeat;
exports.stenchJump = stenchJump;
exports.partingShot = partingShot;
const types_1 = require("../../types");
const Config_1 = require("../../types/Config");
const Ability_1 = require("../../types/enum/Ability");
const Effect_1 = require("../../types/enum/Effect");
const Game_1 = require("../../types/enum/Game");
const Item_1 = require("../../types/enum/Item");
const Passive_1 = require("../../types/enum/Passive");
const Pokemon_1 = require("../../types/enum/Pokemon");
const Synergy_1 = require("../../types/enum/Synergy");
const random_1 = require("../../utils/random");
const schemas_1 = require("../../utils/schemas");
const abilities_1 = require("../abilities/abilities");
const effect_1 = require("./effect");
const items_1 = require("./items");
function drumBeat(pokemon, board) {
    var _a;
    const speed = pokemon.status.paralysis ? pokemon.speed / 2 : pokemon.speed;
    pokemon.cooldown = Math.round(1000 / (0.4 + speed * 0.007));
    if (pokemon.pp >= pokemon.maxPP && !pokemon.status.silence) {
        let crit = false;
        if (pokemon.effects.has(Effect_1.EffectEnum.ABILITY_CRIT)) {
            crit = (0, random_1.chance)(pokemon.critChance / 100, pokemon);
        }
        const target = (_a = pokemon.state.getNearestTargetAtSight(pokemon, board)) === null || _a === void 0 ? void 0 : _a.target;
        if (target) {
            abilities_1.AbilityStrategies[pokemon.skill].process(pokemon, board, target, crit);
        }
        return;
    }
    pokemon.count.attackCount++;
    pokemon.targetY = -1;
    const ppGained = 1 + pokemon.stars;
    board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, true)
        .forEach((cell) => {
        if (cell.value && cell.value.team === pokemon.team) {
            cell.value.addPP(ppGained, pokemon, 0, false);
        }
    });
    pokemon.effectsSet.forEach((effect) => {
        if (effect instanceof effect_1.OnAttackEffect) {
            effect.apply({
                pokemon,
                target: null,
                board,
                physicalDamage: 0,
                specialDamage: 0,
                trueDamage: 0,
                totalDamage: 0
            });
        }
    });
    const itemEffects = (0, schemas_1.values)(pokemon.items)
        .flatMap((item) => { var _a; return (_a = items_1.ItemEffects[item]) !== null && _a !== void 0 ? _a : []; })
        .filter((effect) => effect instanceof effect_1.OnAttackEffect);
    itemEffects.forEach((effect) => {
        effect.apply({
            pokemon,
            target: null,
            board,
            physicalDamage: 0,
            specialDamage: 0,
            trueDamage: 0,
            totalDamage: 0
        });
    });
}
function stenchJump(pokemon, board, x, y) {
    board
        .getCellsBetween(x, y, pokemon.positionX, pokemon.positionY)
        .forEach((cell) => {
        if (cell.x !== x || cell.y !== y) {
            board.addBoardEffect(cell.x, cell.y, Effect_1.EffectEnum.POISON_GAS, pokemon.simulation);
        }
    });
}
function partingShot(pokemon, target, x, y) {
    target.addAbilityPower(-20, pokemon, 0, false);
    target.addAttack(-0.2 * target.baseAtk, pokemon, 0, false);
    (0, abilities_1.broadcastAbility)(pokemon, {
        skill: "PARTING_SHOT",
        positionX: x,
        positionY: y
    });
}
const SharedVisionEffect = new effect_1.OnAttackEffect(({ pokemon, board }) => {
    board.forEach((x, y, ally) => {
        if (ally &&
            ally.passive === Passive_1.Passive.SHARED_VISION &&
            pokemon.team === ally.team &&
            pokemon.targetEntityId !== ally.id) {
            ally.targetX = pokemon.targetX;
            ally.targetY = pokemon.targetY;
            ally.targetEntityId = pokemon.targetEntityId;
        }
    });
});
const DurantBugBuffEffect = new effect_1.OnAttackEffect(({ pokemon, target, board }) => {
    if (target) {
        const bugAllies = board.cells.filter((entity) => entity &&
            entity.team === pokemon.team &&
            entity.types.has(Synergy_1.Synergy.BUG)).length - 1;
        if (bugAllies > 0) {
            target.handleDamage({
                damage: bugAllies,
                board,
                attackType: Game_1.AttackType.TRUE,
                attacker: pokemon,
                shouldTargetGainMana: true
            });
        }
    }
});
const MiniorKernelOnAttackEffect = new effect_1.OnAttackEffect(({ pokemon, target, board, physicalDamage }) => {
    if (target &&
        (pokemon.name === Pokemon_1.Pkm.MINIOR_KERNEL_BLUE ||
            pokemon.name === Pokemon_1.Pkm.MINIOR_KERNEL_GREEN ||
            pokemon.name === Pokemon_1.Pkm.MINIOR_KERNEL_RED ||
            pokemon.name === Pokemon_1.Pkm.MINIOR_KERNEL_ORANGE)) {
        const cells = board.getAdjacentCells(target.positionX, target.positionY);
        const targets = cells
            .filter((cell) => cell.value && pokemon.team != cell.value.team)
            .map((cell) => cell.value)
            .concat(target);
        targets.forEach((t) => {
            pokemon.simulation.room.broadcast(types_1.Transfer.ABILITY, {
                id: pokemon.simulation.id,
                skill: Ability_1.Ability.SHIELDS_DOWN,
                targetX: t.positionX,
                targetY: t.positionY
            });
            if (pokemon.name === Pokemon_1.Pkm.MINIOR_KERNEL_BLUE) {
                t.handleDamage({
                    damage: Math.ceil(physicalDamage * (1 + pokemon.ap / 100)),
                    board,
                    attackType: Game_1.AttackType.SPECIAL,
                    attacker: pokemon,
                    shouldTargetGainMana: false
                });
            }
            if (pokemon.name === Pokemon_1.Pkm.MINIOR_KERNEL_RED) {
                t.handleDamage({
                    damage: Math.ceil(physicalDamage * 1.5 * (1 + pokemon.ap / 100)),
                    board,
                    attackType: Game_1.AttackType.PHYSICAL,
                    attacker: pokemon,
                    shouldTargetGainMana: false
                });
            }
            if (pokemon.name === Pokemon_1.Pkm.MINIOR_KERNEL_ORANGE) {
                t.handleDamage({
                    damage: Math.ceil(physicalDamage * 0.5 * (1 + pokemon.ap / 100)),
                    board,
                    attackType: Game_1.AttackType.TRUE,
                    attacker: pokemon,
                    shouldTargetGainMana: false
                });
            }
        });
        if (pokemon.name === Pokemon_1.Pkm.MINIOR_KERNEL_GREEN) {
            cells.forEach((v) => {
                if (v && v.value && v.value.team === pokemon.team) {
                    v.value.handleHeal(physicalDamage, pokemon, 1, false);
                }
            });
        }
    }
});
const KubfuOnKillEffect = new effect_1.OnKillEffect((pokemon, target, board, attackType) => {
    const SPEED_BUFF_PER_KILL = 3;
    const AP_BUFF_PER_KILL = 5;
    const MAX_BUFFS = 10;
    if (attackType === Game_1.AttackType.PHYSICAL) {
        const baseSpeed = 50;
        const nbBuffs = Math.floor((pokemon.refToBoardPokemon.speed - baseSpeed) / SPEED_BUFF_PER_KILL);
        if (nbBuffs < MAX_BUFFS) {
            pokemon.addSpeed(SPEED_BUFF_PER_KILL, pokemon, 0, false, true);
            if (nbBuffs + 1 === MAX_BUFFS &&
                pokemon.player &&
                pokemon.player.items.includes(Item_1.Item.SCROLL_OF_WATERS) === false) {
                pokemon.player.items.push(Item_1.Item.SCROLL_OF_WATERS);
            }
        }
    }
    else {
        const nbBuffs = Math.floor(pokemon.refToBoardPokemon.ap / AP_BUFF_PER_KILL);
        if (nbBuffs < MAX_BUFFS) {
            pokemon.addAbilityPower(AP_BUFF_PER_KILL, pokemon, 0, false, true);
            if (nbBuffs + 1 === MAX_BUFFS &&
                pokemon.player &&
                pokemon.player.items.includes(Item_1.Item.SCROLL_OF_DARKNESS) === false) {
                pokemon.player.items.push(Item_1.Item.SCROLL_OF_DARKNESS);
            }
        }
    }
});
exports.WaterSpringEffect = new effect_1.OnAbilityCastEffect((pokemon, board) => {
    board.forEach((x, y, pkm) => {
        if ((pkm === null || pkm === void 0 ? void 0 : pkm.passive) === Passive_1.Passive.WATER_SPRING && pkm.team !== pokemon.team) {
            pkm.addPP(5, pkm, 0, false);
            pkm.transferAbility(pkm.skill);
        }
    });
});
exports.SlowStartEffect = new effect_1.OnAbilityCastEffect((pokemon, board) => {
    if (pokemon.count.ult === 1) {
        pokemon.addSpeed(30, pokemon, 0, false);
        pokemon.addAttack(10, pokemon, 0, false);
    }
});
class AccelerationEffect extends effect_1.OnMoveEffect {
    constructor() {
        super((pkm, board, x, y) => {
            pkm.addSpeed(20, pkm, 0, false);
            this.accelerationStacks += 1;
        });
        this.accelerationStacks = 0;
    }
}
exports.AccelerationEffect = AccelerationEffect;
const MimikuBustedTransformEffect = new effect_1.OnDamageReceivedEffect((pokemon, attacker, board) => {
    if (pokemon.life / pokemon.hp < 0.5) {
        pokemon.index = Pokemon_1.PkmIndex[Pokemon_1.Pkm.MIMIKYU_BUSTED];
        pokemon.name = Pokemon_1.Pkm.MIMIKYU_BUSTED;
        pokemon.changePassive(Passive_1.Passive.MIMIKYU_BUSTED);
        pokemon.addAttack(10, pokemon, 0, false);
        pokemon.status.triggerProtect(2000);
        if (pokemon.player) {
            pokemon.player.pokemonsPlayed.add(Pokemon_1.Pkm.MIMIKYU_BUSTED);
        }
    }
});
const DarmanitanZenTransformEffect = new effect_1.OnDamageReceivedEffect((pokemon, attacker, board) => {
    if (pokemon.life < 0.3 * pokemon.hp && pokemon.passive === Passive_1.Passive.DARMANITAN) {
        pokemon.index = Pokemon_1.PkmIndex[Pokemon_1.Pkm.DARMANITAN_ZEN];
        pokemon.name = Pokemon_1.Pkm.DARMANITAN_ZEN;
        pokemon.changePassive(Passive_1.Passive.DARMANITAN_ZEN);
        pokemon.skill = Ability_1.Ability.TRANSE;
        pokemon.pp = 0;
        const destination = board.getTeleportationCell(pokemon.positionX, pokemon.positionY, pokemon.team);
        if (destination)
            pokemon.moveTo(destination.x, destination.y, board);
        pokemon.toIdleState();
        pokemon.addAttack(-10, pokemon, 0, false);
        pokemon.addSpeed(-20, pokemon, 0, false);
        pokemon.addDefense(10, pokemon, 0, false);
        pokemon.addSpecialDefense(10, pokemon, 0, false);
        pokemon.range += 4;
        pokemon.attackType = Game_1.AttackType.SPECIAL;
    }
});
const DarmanitanZenOnHitEffect = new effect_1.OnHitEffect(({ attacker, totalTakenDamage }) => {
    attacker.handleHeal(totalTakenDamage, attacker, 0, false);
});
const PikachuSurferBuffEffect = new effect_1.OnSpawnEffect((pkm) => {
    if (!pkm.player)
        return;
    const aquaticStepReached = pkm.player.synergies.getSynergyStep(Synergy_1.Synergy.AQUATIC);
    pkm.addShield(50 * aquaticStepReached, pkm, 0, false);
    pkm.addAttack(3 * aquaticStepReached, pkm, 0, false);
});
const ToxicSpikesEffect = new effect_1.OnDamageReceivedEffect((pokemon, attacker, board) => {
    if (pokemon.passive === Passive_1.Passive.GLIMMORA && pokemon.life < 0.5 * pokemon.hp) {
        pokemon.changePassive(Passive_1.Passive.NONE);
        const cells = new Array();
        let startY = 1;
        let endY = 3;
        if (pokemon.team === Game_1.Team.RED_TEAM) {
            startY = -2;
            endY = 0;
        }
        for (let x = -1; x < 2; x++) {
            for (let y = startY; y < endY; y++) {
                if (!(pokemon.positionX + x < 0 ||
                    pokemon.positionX + x > Config_1.BOARD_WIDTH ||
                    pokemon.positionY + y < 0 ||
                    pokemon.positionY + y > Config_1.BOARD_HEIGHT)) {
                    cells.push({
                        x: pokemon.positionX + x,
                        y: pokemon.positionY + y,
                        value: board.cells[board.columns * pokemon.positionY + y + pokemon.positionX + x]
                    });
                }
            }
        }
        cells.forEach((cell) => {
            board.addBoardEffect(cell.x, cell.y, Effect_1.EffectEnum.TOXIC_SPIKES, pokemon.simulation);
            pokemon.simulation.room.broadcast(types_1.Transfer.ABILITY, {
                id: pokemon.simulation.id,
                skill: "TOXIC_SPIKES",
                positionX: pokemon.positionX,
                positionY: pokemon.positionY,
                targetX: cell.x,
                targetY: cell.y
            });
            if (cell.value && cell.value.team !== pokemon.team) {
                cell.value.handleSpecialDamage(20, board, Game_1.AttackType.SPECIAL, pokemon, false);
            }
        });
    }
});
exports.PassiveEffects = {
    [Passive_1.Passive.DURANT]: [DurantBugBuffEffect],
    [Passive_1.Passive.SHARED_VISION]: [SharedVisionEffect],
    [Passive_1.Passive.METEOR]: [MiniorKernelOnAttackEffect],
    [Passive_1.Passive.KUBFU]: [KubfuOnKillEffect],
    [Passive_1.Passive.SLOW_START]: [exports.SlowStartEffect],
    [Passive_1.Passive.VIGOROTH]: [
        new effect_1.OnSpawnEffect((pkm) => pkm.effects.add(Effect_1.EffectEnum.IMMUNITY_SLEEP))
    ],
    [Passive_1.Passive.PIKACHU_SURFER]: [PikachuSurferBuffEffect],
    [Passive_1.Passive.ACCELERATION]: [
        () => new AccelerationEffect()
    ],
    [Passive_1.Passive.MIMIKYU]: [MimikuBustedTransformEffect],
    [Passive_1.Passive.DARMANITAN]: [DarmanitanZenTransformEffect],
    [Passive_1.Passive.DARMANITAN_ZEN]: [DarmanitanZenOnHitEffect],
    [Passive_1.Passive.GLIMMORA]: [ToxicSpikesEffect]
};
//# sourceMappingURL=passives.js.map