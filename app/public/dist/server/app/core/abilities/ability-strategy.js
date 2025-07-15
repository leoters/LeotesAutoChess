"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbilityStrategy = void 0;
const types_1 = require("../../types");
const number_1 = require("../../utils/number");
const effect_1 = require("../effects/effect");
const schemas_1 = require("../../utils/schemas");
const items_1 = require("../effects/items");
class AbilityStrategy {
    constructor() {
        this.copyable = true;
        this.canCritByDefault = false;
    }
    process(pokemon, board, target, crit, preventDefaultAnim) {
        pokemon.pp = (0, number_1.min)(0)(pokemon.pp - pokemon.maxPP);
        pokemon.count.ult += 1;
        if (!preventDefaultAnim) {
            pokemon.simulation.room.broadcast(types_1.Transfer.ABILITY, {
                id: pokemon.simulation.id,
                skill: pokemon.skill,
                positionX: pokemon.positionX,
                positionY: pokemon.positionY,
                targetX: target.positionX,
                targetY: target.positionY,
                orientation: pokemon.orientation
            });
        }
        const onAbilityCastEffects = [
            ...pokemon.effectsSet.values(),
            ...(0, schemas_1.values)(pokemon.items).flatMap((item) => { var _a; return (_a = items_1.ItemEffects[item]) !== null && _a !== void 0 ? _a : []; })
        ].filter((effect) => effect instanceof effect_1.OnAbilityCastEffect);
        onAbilityCastEffects.forEach((effect) => {
            effect.apply(pokemon, board, target, crit);
        });
    }
}
exports.AbilityStrategy = AbilityStrategy;
//# sourceMappingURL=ability-strategy.js.map