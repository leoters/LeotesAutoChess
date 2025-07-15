"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionBasedEvolutionRule = exports.HatchEvolutionRule = exports.ItemEvolutionRule = exports.CountEvolutionRule = exports.EvolutionRule = void 0;
exports.carryOverPermanentStats = carryOverPermanentStats;
const pokemon_1 = require("../models/colyseus-models/pokemon");
const pokemon_factory_1 = __importDefault(require("../models/pokemon-factory"));
const Config_1 = require("../types/Config");
const Effect_1 = require("../types/enum/Effect");
const Game_1 = require("../types/enum/Game");
const Item_1 = require("../types/enum/Item");
const Passive_1 = require("../types/enum/Passive");
const Pokemon_1 = require("../types/enum/Pokemon");
const array_1 = require("../utils/array");
const logger_1 = require("../utils/logger");
const random_1 = require("../utils/random");
const schemas_1 = require("../utils/schemas");
class EvolutionRule {
    constructor(divergentEvolution) {
        if (divergentEvolution)
            this.divergentEvolution = divergentEvolution;
        this.stacks = 0;
    }
    getEvolution(pokemon, player, ...additionalArgs) {
        if (this.divergentEvolution) {
            return this.divergentEvolution(pokemon, player, ...additionalArgs);
        }
        return pokemon.evolution;
    }
    tryEvolve(pokemon, player, stageLevel) {
        if (this.canEvolve(pokemon, player, stageLevel)) {
            const pokemonEvolved = this.evolve(pokemon, player, stageLevel);
            this.afterEvolve(pokemonEvolved, player, stageLevel);
            return pokemonEvolved;
        }
    }
    afterEvolve(pokemonEvolved, player, stageLevel) {
        pokemonEvolved.onAcquired(player);
        player.updateSynergies();
        player.board.forEach((pokemon) => {
            if ((pokemon.passive === Passive_1.Passive.COSMOG ||
                pokemon.passive === Passive_1.Passive.COSMOEM) &&
                pokemonEvolved.passive !== Passive_1.Passive.COSMOG &&
                pokemonEvolved.passive !== Passive_1.Passive.COSMOEM) {
                pokemon.hp += 10;
                pokemon.evolutionRule.stacks++;
            }
            pokemon.evolutionRule.tryEvolve(pokemon, player, stageLevel);
        });
    }
}
exports.EvolutionRule = EvolutionRule;
class CountEvolutionRule extends EvolutionRule {
    constructor(numberRequired, divergentEvolution) {
        super(divergentEvolution);
        this.numberRequired = numberRequired;
    }
    canEvolve(pokemon, player, stageLevel) {
        if (!pokemon.hasEvolution)
            return false;
        const copies = (0, schemas_1.values)(player.board).filter((p) => p.index === pokemon.index && !p.items.has(Item_1.Item.EVIOLITE));
        return copies.length >= this.numberRequired;
    }
    canEvolveIfBuyingOne(pokemon, player) {
        if (!pokemon.hasEvolution)
            return false;
        const copies = (0, schemas_1.values)(player.board).filter((p) => p.index === pokemon.index && !p.items.has(Item_1.Item.EVIOLITE));
        return copies.length >= this.numberRequired - 1;
    }
    evolve(pokemon, player, stageLevel) {
        const pokemonEvolutionName = this.getEvolution(pokemon, player, stageLevel);
        let coord;
        const itemsToAdd = new Array();
        const itemComponentsToAdd = new Array();
        const pokemonsBeforeEvolution = [];
        player.board.forEach((pkm, id) => {
            if (pkm.index == pokemon.index &&
                !pkm.items.has(Item_1.Item.EVIOLITE) &&
                pokemonsBeforeEvolution.length < this.numberRequired) {
                if (coord) {
                    if (pkm.positionY > coord.y) {
                        coord.x = pkm.positionX;
                        coord.y = pkm.positionY;
                    }
                }
                else {
                    if (pkm.positionX !== -1) {
                        coord = { x: pkm.positionX, y: pkm.positionY };
                    }
                }
                pkm.items.forEach((el) => {
                    if (Item_1.ItemComponents.includes(el)) {
                        itemComponentsToAdd.push(el);
                    }
                    else {
                        itemsToAdd.push(el);
                    }
                });
                player.board.delete(id);
                pokemonsBeforeEvolution.push(pkm);
            }
        });
        const pokemonEvolved = pokemon_factory_1.default.createPokemonFromName(pokemonEvolutionName, player);
        carryOverPermanentStats(pokemonEvolved, pokemonsBeforeEvolution);
        if (pokemonsBeforeEvolution.some((p) => p.meal)) {
            pokemonEvolved.meal = (0, random_1.pickRandomIn)(pokemonsBeforeEvolution.filter((p) => p.meal).map((p) => p.meal));
        }
        (0, random_1.shuffleArray)(itemsToAdd);
        for (const item of itemsToAdd) {
            if (pokemonEvolved.items.has(item) || pokemonEvolved.items.size >= 3) {
                player.items.push(item);
            }
            else {
                pokemonEvolved.items.add(item);
                if (item === Item_1.Item.SHINY_CHARM) {
                    pokemonEvolved.shiny = true;
                }
            }
        }
        (0, random_1.shuffleArray)(itemComponentsToAdd);
        for (const itemComponent of itemComponentsToAdd) {
            if ((0, schemas_1.values)(pokemonEvolved.items).some((i) => Item_1.ItemComponents.includes(i)) ||
                pokemonEvolved.items.size >= 3) {
                player.items.push(itemComponent);
            }
            else {
                pokemonEvolved.items.add(itemComponent);
            }
        }
        if (coord) {
            pokemonEvolved.positionX = coord.x;
            pokemonEvolved.positionY = coord.y;
            player.board.set(pokemonEvolved.id, pokemonEvolved);
        }
        else {
            logger_1.logger.error("no coordinate found for new evolution");
        }
        if (pokemon.afterEvolve) {
            pokemon.afterEvolve({ pokemonEvolved, pokemonsBeforeEvolution, player });
        }
        return pokemonEvolved;
    }
}
exports.CountEvolutionRule = CountEvolutionRule;
class ItemEvolutionRule extends EvolutionRule {
    constructor(itemsTriggeringEvolution, divergentEvolution) {
        super(divergentEvolution);
        this.itemsTriggeringEvolution = itemsTriggeringEvolution;
    }
    canEvolve(pokemon, player, stageLevel) {
        if (pokemon.items.has(Item_1.Item.EVIOLITE))
            return false;
        const items = (0, schemas_1.values)(pokemon.items);
        pokemon.meal !== "" && items.push(pokemon.meal);
        const itemEvolution = items.find((item) => this.itemsTriggeringEvolution.includes(item));
        const pokemonEvolutionName = this.getEvolution(pokemon, player, itemEvolution);
        return itemEvolution != null && pokemonEvolutionName !== pokemon.name;
    }
    evolve(pokemon, player, stageLevel) {
        const itemEvolution = (0, schemas_1.values)(pokemon.items).find((item) => this.itemsTriggeringEvolution.includes(item));
        const pokemonEvolutionName = this.getEvolution(pokemon, player, itemEvolution);
        const pokemonEvolved = player.transformPokemon(pokemon, pokemonEvolutionName);
        return pokemonEvolved;
    }
}
exports.ItemEvolutionRule = ItemEvolutionRule;
class HatchEvolutionRule extends EvolutionRule {
    constructor(divergentEvolution) {
        super(divergentEvolution);
        this.evolutionTimer = 0;
    }
    getHatchTime(pokemon, player) {
        if (pokemon.name === Pokemon_1.Pkm.EGG) {
            return player.effects.has(Effect_1.EffectEnum.BREEDER) ||
                player.effects.has(Effect_1.EffectEnum.GOLDEN_EGGS)
                ? Config_1.EvolutionTime.EGG_HATCH - 1
                : Config_1.EvolutionTime.EGG_HATCH;
        }
        return Config_1.EvolutionTime.EVOLVE_HATCH;
    }
    updateHatch(pokemon, player, stageLevel) {
        this.evolutionTimer += 1;
        const willHatch = this.canEvolve(pokemon, player, stageLevel);
        if (willHatch) {
            pokemon.action = Game_1.PokemonActionState.HOP;
            setTimeout(() => {
                pokemon.evolutionRule.tryEvolve(pokemon, player, stageLevel);
                if (pokemon.name === Pokemon_1.Pkm.EGG && pokemon.shiny) {
                    player.items.push((0, random_1.pickRandomIn)(Item_1.ShinyItems));
                }
            }, 2000);
        }
        else if (pokemon.name === Pokemon_1.Pkm.EGG) {
            const hatchTime = this.getHatchTime(pokemon, player);
            if (this.evolutionTimer >= hatchTime) {
                pokemon.action = Game_1.PokemonActionState.HOP;
            }
            else if (this.evolutionTimer >= hatchTime - 1) {
                pokemon.action = Game_1.PokemonActionState.EMOTE;
            }
            else {
                pokemon.action = Game_1.PokemonActionState.IDLE;
            }
        }
    }
    canEvolve(pokemon, player, stageLevel) {
        if (pokemon.items.has(Item_1.Item.EVIOLITE))
            return false;
        return this.evolutionTimer >= this.getHatchTime(pokemon, player);
    }
    evolve(pokemon, player, stageLevel) {
        this.evolutionTimer = 0;
        const pokemonEvolutionName = this.getEvolution(pokemon, player, stageLevel);
        const pokemonEvolved = player.transformPokemon(pokemon, pokemonEvolutionName);
        return pokemonEvolved;
    }
}
exports.HatchEvolutionRule = HatchEvolutionRule;
class ConditionBasedEvolutionRule extends EvolutionRule {
    constructor(condition, divergentEvolution) {
        super(divergentEvolution);
        this.condition = condition;
    }
    canEvolve(pokemon, player, stageLevel) {
        if (pokemon.items.has(Item_1.Item.EVIOLITE))
            return false;
        return this.condition(pokemon, player, stageLevel);
    }
    evolve(pokemon, player, stageLevel) {
        const pokemonEvolutionName = this.getEvolution(pokemon, player, stageLevel);
        const pokemonEvolved = player.transformPokemon(pokemon, pokemonEvolutionName);
        return pokemonEvolved;
    }
}
exports.ConditionBasedEvolutionRule = ConditionBasedEvolutionRule;
function carryOverPermanentStats(pokemonEvolved, pokemonsBeforeEvolution) {
    const permanentBuffStats = [
        "hp",
        "atk",
        "def",
        "speDef",
        "speed",
        "ap"
    ];
    const baseData = new pokemon_1.PokemonClasses[pokemonsBeforeEvolution[0].name]();
    for (const stat of permanentBuffStats) {
        const sumOfPermaStatsModifier = (0, array_1.sum)(pokemonsBeforeEvolution.map((p) => p[stat] - baseData[stat]));
        pokemonEvolved[stat] += sumOfPermaStatsModifier;
    }
    const existingTms = pokemonsBeforeEvolution
        .map((p) => p.tm)
        .filter((tm) => tm != null);
    if (existingTms.length > 0) {
        pokemonEvolved.tm = (0, random_1.pickRandomIn)(existingTms);
        pokemonEvolved.skill = pokemonEvolved.tm;
        pokemonEvolved.maxPP = 100;
    }
}
//# sourceMappingURL=evolution-rules.js.map