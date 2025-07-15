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
const schema_1 = require("@colyseus/schema");
const effects_1 = require("../models/effects");
const pokemon_factory_1 = __importDefault(require("../models/pokemon-factory"));
const precomputed_pokemon_data_1 = require("../models/precomputed/precomputed-pokemon-data");
const precomputed_types_1 = require("../models/precomputed/precomputed-types");
const types_1 = require("../types");
const Config_1 = require("../types/Config");
const Ability_1 = require("../types/enum/Ability");
const Effect_1 = require("../types/enum/Effect");
const Game_1 = require("../types/enum/Game");
const Item_1 = require("../types/enum/Item");
const Passive_1 = require("../types/enum/Passive");
const Pokemon_1 = require("../types/enum/Pokemon");
const Synergy_1 = require("../types/enum/Synergy");
const Weather_1 = require("../types/enum/Weather");
const array_1 = require("../utils/array");
const avatar_1 = require("../utils/avatar");
const board_1 = require("../utils/board");
const logger_1 = require("../utils/logger");
const number_1 = require("../utils/number");
const random_1 = require("../utils/random");
const schemas_1 = require("../utils/schemas");
const abilities_1 = require("./abilities/abilities");
const board_2 = __importDefault(require("./board"));
const dishes_1 = require("./dishes");
const dps_1 = __importDefault(require("./dps"));
const effect_1 = require("./effects/effect");
const items_1 = require("./effects/items");
const passives_1 = require("./effects/passives");
const items_2 = require("./items");
const pokemon_entity_1 = require("./pokemon-entity");
const simulation_command_1 = require("./simulation-command");
class Simulation extends schema_1.Schema {
    constructor(id, room, blueBoard, redBoard, bluePlayer, redPlayer, stageLevel, weather, isGhostBattle = false) {
        var _a;
        super();
        this.weather = Weather_1.Weather.NEUTRAL;
        this.winnerId = "";
        this.blueTeam = new schema_1.MapSchema();
        this.redTeam = new schema_1.MapSchema();
        this.blueDpsMeter = new schema_1.MapSchema();
        this.redDpsMeter = new schema_1.MapSchema();
        this.blueEffects = new Set();
        this.redEffects = new Set();
        this.board = new board_2.default(Config_1.BOARD_HEIGHT, Config_1.BOARD_WIDTH);
        this.finished = false;
        this.flowerSpawn = [false, false];
        this.stageLevel = 0;
        this.stormLightningTimer = 0;
        this.tidalWaveTimer = 0;
        this.tidalWaveCounter = 0;
        this.id = id;
        this.room = room;
        this.bluePlayer = bluePlayer;
        this.redPlayer = redPlayer;
        this.bluePlayerId = bluePlayer.id;
        this.redPlayerId = (_a = redPlayer === null || redPlayer === void 0 ? void 0 : redPlayer.id) !== null && _a !== void 0 ? _a : "pve";
        this.stageLevel = stageLevel;
        this.weather = weather;
        this.isGhostBattle = isGhostBattle;
        this.board = new board_2.default(Config_1.BOARD_HEIGHT, Config_1.BOARD_WIDTH);
        this.started = false;
        const playerEffects = [
            [this.bluePlayer, this.blueEffects, this.redEffects],
            [this.redPlayer, this.redEffects, this.blueEffects]
        ];
        for (const [player, teamEffects, opponentEffects] of playerEffects) {
            if (player) {
                player.board.forEach((pokemon, id) => {
                    pokemon.beforeSimulationStart({
                        simulationId: this.id,
                        isGhostBattle: this.isGhostBattle,
                        weather: this.weather,
                        player,
                        teamEffects,
                        opponentEffects
                    });
                });
            }
        }
        const weatherEffect = Weather_1.WeatherEffects.get(this.weather);
        if (weatherEffect) {
            this.blueEffects.add(weatherEffect);
            this.redEffects.add(weatherEffect);
        }
        bluePlayer.effects.forEach((e) => this.blueEffects.add(e));
        redPlayer === null || redPlayer === void 0 ? void 0 : redPlayer.effects.forEach((e) => this.redEffects.add(e));
        this.finished = false;
        this.winnerId = "";
        this.flowerSpawn = [false, false];
        this.stormLightningTimer = (0, random_1.randomBetween)(4000, 8000);
        if (effects_1.SynergyEffects[Synergy_1.Synergy.AQUATIC].some((e) => this.blueEffects.has(e) || this.redEffects.has(e))) {
            this.tidalWaveTimer = 8000;
        }
        blueBoard.forEach((pokemon) => {
            if (!(0, board_1.isOnBench)(pokemon)) {
                this.addPokemon(pokemon, pokemon.positionX, pokemon.positionY - 1, Game_1.Team.BLUE_TEAM);
            }
        });
        redBoard.forEach((pokemon) => {
            if (!(0, board_1.isOnBench)(pokemon)) {
                this.addPokemon(pokemon, pokemon.positionX, 5 - (pokemon.positionY - 1), Game_1.Team.RED_TEAM);
            }
        });
        this.applyPostEffects(blueBoard, redBoard);
        for (const [player, team] of [
            [this.bluePlayer, this.blueTeam],
            [this.redPlayer, this.redTeam]
        ]) {
            if (player) {
                player.board.forEach((pokemon) => {
                    pokemon.meal = "";
                    const entity = (0, schemas_1.values)(team).find((p) => p.refToBoardPokemon === pokemon);
                    if (entity) {
                        pokemon.afterSimulationStart({
                            simulation: this,
                            player,
                            team,
                            entity
                        });
                    }
                });
            }
        }
    }
    start() {
        this.started = true;
    }
    getEffects(playerId) {
        var _a, _b;
        return playerId === ((_a = this.bluePlayer) === null || _a === void 0 ? void 0 : _a.id)
            ? this.blueEffects
            : playerId === ((_b = this.redPlayer) === null || _b === void 0 ? void 0 : _b.id)
                ? this.redEffects
                : undefined;
    }
    getDpsMeter(playerId) {
        var _a, _b;
        return playerId === ((_a = this.bluePlayer) === null || _a === void 0 ? void 0 : _a.id)
            ? this.blueDpsMeter
            : playerId === ((_b = this.redPlayer) === null || _b === void 0 ? void 0 : _b.id)
                ? this.redDpsMeter
                : undefined;
    }
    getTeam(playerId) {
        var _a, _b;
        return playerId === ((_a = this.bluePlayer) === null || _a === void 0 ? void 0 : _a.id)
            ? this.blueTeam
            : playerId === ((_b = this.redPlayer) === null || _b === void 0 ? void 0 : _b.id)
                ? this.redTeam
                : undefined;
    }
    getOpponentTeam(playerId) {
        var _a, _b;
        return playerId === ((_a = this.bluePlayer) === null || _a === void 0 ? void 0 : _a.id)
            ? this.redTeam
            : playerId === ((_b = this.redPlayer) === null || _b === void 0 ? void 0 : _b.id)
                ? this.blueTeam
                : undefined;
    }
    addPokemon(pokemon, x, y, team, isSpawn = false) {
        const pokemonEntity = new pokemon_entity_1.PokemonEntity(pokemon, x, y, team, this);
        pokemonEntity.isSpawn = isSpawn;
        pokemonEntity.orientation =
            team === Game_1.Team.BLUE_TEAM ? Game_1.Orientation.UPRIGHT : Game_1.Orientation.DOWNLEFT;
        this.applySynergyEffects(pokemonEntity);
        this.applyItemsEffects(pokemonEntity);
        if (pokemon.meal) {
            this.applyDishEffects(pokemonEntity, pokemon.meal);
            pokemon.action = Game_1.PokemonActionState.IDLE;
        }
        this.board.setEntityOnCell(pokemonEntity.positionX, pokemonEntity.positionY, pokemonEntity);
        const dps = new dps_1.default(pokemonEntity.id, (0, avatar_1.getAvatarString)(pokemonEntity.index, pokemonEntity.shiny, pokemonEntity.emotion));
        if (team == Game_1.Team.BLUE_TEAM) {
            this.blueTeam.set(pokemonEntity.id, pokemonEntity);
            this.blueDpsMeter.set(pokemonEntity.id, dps);
        }
        if (team == Game_1.Team.RED_TEAM) {
            this.redTeam.set(pokemonEntity.id, pokemonEntity);
            this.redDpsMeter.set(pokemonEntity.id, dps);
        }
        pokemon.onSpawn({ entity: pokemonEntity, simulation: this });
        pokemonEntity.effectsSet.forEach((effect) => {
            if (effect instanceof effect_1.OnSpawnEffect)
                effect.apply(pokemonEntity);
        });
        return pokemonEntity;
    }
    getFirstAvailablePlaceOnBoard(team) {
        let candidateX = 0, candidateY = 0;
        if (team === Game_1.Team.BLUE_TEAM) {
            outerloop: for (let y = 0; y < this.board.rows; y++) {
                for (let x = 0; x < this.board.columns; x++) {
                    if (this.board.getEntityOnCell(x, y) === undefined) {
                        candidateX = x;
                        candidateY = y;
                        break outerloop;
                    }
                }
            }
        }
        else {
            outerloop: for (let y = 0; y < this.board.rows; y++) {
                for (let x = this.board.columns - 1; x >= 0; x--) {
                    if (this.board.getEntityOnCell(x, y) === undefined) {
                        candidateX = x;
                        candidateY = y;
                        break outerloop;
                    }
                }
            }
        }
        return { x: candidateX, y: candidateY };
    }
    getClosestAvailablePlaceOnBoardTo(positionX, positionY, team) {
        const placesToConsiderByOrderOfPriority = [
            [0, 0],
            [-1, 0],
            [+1, 0],
            [0, -1],
            [-1, -1],
            [+1, -1],
            [-1, +1],
            [+1, +1],
            [0, +1],
            [-2, 0],
            [+2, 0],
            [-2, -1],
            [+2, -1],
            [0, -2],
            [-1, -2],
            [+1, -2],
            [-2, -2],
            [+2, -2],
            [-2, +1],
            [+2, +1],
            [-3, 0],
            [+3, 0],
            [-3, -1],
            [+3, -1],
            [-3, -2],
            [+3, -2],
            [0, -3],
            [-1, -3],
            [+1, -3],
            [-2, -3],
            [+2, -3],
            [-3, -3],
            [+3, -3],
            [-3, +1],
            [+3, +1]
        ];
        for (const [dx, dy] of placesToConsiderByOrderOfPriority) {
            const x = positionX + dx;
            const y = positionY + dy * (team === Game_1.Team.BLUE_TEAM ? 1 : -1);
            if (x >= 0 &&
                x < this.board.columns &&
                y >= 0 &&
                y < this.board.rows &&
                this.board.getEntityOnCell(x, y) === undefined) {
                return { x, y };
            }
        }
        return this.getFirstAvailablePlaceOnBoard(team);
    }
    getClosestAvailablePlaceOnBoardToPokemon(pokemon, team) {
        const positionX = pokemon.positionX;
        const positionY = team === Game_1.Team.BLUE_TEAM
            ? pokemon.positionY - 1
            : 5 - (pokemon.positionY - 1);
        return this.getClosestAvailablePlaceOnBoardTo(positionX, positionY, team);
    }
    getClosestAvailablePlaceOnBoardToPokemonEntity(pokemon, team = pokemon.team) {
        return this.getClosestAvailablePlaceOnBoardTo(pokemon.positionX, pokemon.positionY, team);
    }
    applyItemsEffects(pokemon) {
        if (pokemon.passive === Passive_1.Passive.PICKUP && pokemon.items.size === 0) {
            pokemon.items.add((0, random_1.pickRandomIn)(Item_1.CraftableItems.concat(Item_1.Berries)));
        }
        if (pokemon.items.has(Item_1.Item.WONDER_BOX)) {
            pokemon.items.delete(Item_1.Item.WONDER_BOX);
            const randomItems = (0, items_2.getWonderboxItems)(pokemon.items);
            randomItems.forEach((item) => {
                if (pokemon.items.size < 3) {
                    pokemon.items.add(item);
                }
            });
        }
        pokemon.items.forEach((item) => {
            this.applyItemEffect(pokemon, item);
        });
    }
    applyItemEffect(pokemon, item) {
        var _a, _b, _c;
        Object.entries((_a = items_2.ItemStats[item]) !== null && _a !== void 0 ? _a : {}).forEach(([stat, value]) => {
            pokemon.applyStat(stat, value);
        });
        (_c = (_b = items_1.ItemEffects[item]) === null || _b === void 0 ? void 0 : _b.filter((effect) => effect instanceof effect_1.OnItemGainedEffect)) === null || _c === void 0 ? void 0 : _c.forEach((effect) => effect.apply(pokemon));
    }
    applySynergyEffects(pokemon, singleType) {
        const allyEffects = pokemon.team === Game_1.Team.BLUE_TEAM ? this.blueEffects : this.redEffects;
        const player = pokemon.team === Game_1.Team.BLUE_TEAM ? this.bluePlayer : this.redPlayer;
        const apply = (effect) => {
            this.applyEffect(pokemon, pokemon.types, effect, (player === null || player === void 0 ? void 0 : player.synergies.countActiveSynergies()) || 0);
        };
        if (singleType) {
            const effect = effects_1.SynergyEffects[singleType].find((e) => allyEffects.has(e));
            if (effect && !pokemon.effects.has(effect)) {
                apply(effect);
            }
        }
        else {
            allyEffects.forEach((effect) => {
                apply(effect);
            });
        }
        if ((singleType === Synergy_1.Synergy.SOUND ||
            (!singleType && pokemon.types.has(Synergy_1.Synergy.SOUND))) &&
            !effects_1.SynergyEffects[Synergy_1.Synergy.SOUND].some((e) => allyEffects.has(e))) {
            pokemon.effectsSet.add(new effect_1.SoundCryEffect());
        }
    }
    applyDishEffects(pokemon, dish) {
        const dishEffects = dishes_1.DishEffects[dish];
        if (!dishEffects)
            return;
        dishEffects.forEach((effect) => pokemon.effectsSet.add(effect));
        if (pokemon.passive === Passive_1.Passive.GLUTTON) {
            pokemon.addMaxHP(20, pokemon, 0, false, true);
            if (pokemon.player && pokemon.hp > 750) {
                pokemon.player.titles.add(types_1.Title.GLUTTON);
            }
        }
    }
    applyPostEffects(blueBoard, redBoard) {
        for (const board of [blueBoard, redBoard]) {
            const teamIndex = board === blueBoard ? Game_1.Team.BLUE_TEAM : Game_1.Team.RED_TEAM;
            const player = board === blueBoard ? this.bluePlayer : this.redPlayer;
            const effects = board === blueBoard ? this.blueEffects : this.redEffects;
            if ([
                Effect_1.EffectEnum.COCOON,
                Effect_1.EffectEnum.INFESTATION,
                Effect_1.EffectEnum.HORDE,
                Effect_1.EffectEnum.HEART_OF_THE_SWARM
            ].some((e) => effects.has(e))) {
                const bugTeam = new Array();
                board.forEach((pkm) => {
                    if (pkm.types.has(Synergy_1.Synergy.BUG) && pkm.positionY != 0) {
                        bugTeam.push(pkm);
                    }
                });
                bugTeam.sort((a, b) => (0, pokemon_entity_1.getUnitScore)(b) - (0, pokemon_entity_1.getUnitScore)(a));
                let numberToSpawn = 0;
                if (effects.has(Effect_1.EffectEnum.COCOON)) {
                    numberToSpawn = 1;
                }
                if (effects.has(Effect_1.EffectEnum.INFESTATION)) {
                    numberToSpawn = 2;
                }
                if (effects.has(Effect_1.EffectEnum.HORDE)) {
                    numberToSpawn = 3;
                }
                if (effects.has(Effect_1.EffectEnum.HEART_OF_THE_SWARM)) {
                    numberToSpawn = 5;
                }
                numberToSpawn = Math.min(numberToSpawn, bugTeam.length);
                for (let i = 0; i < numberToSpawn; i++) {
                    const pokemonCloned = bugTeam[i];
                    const bug = pokemon_factory_1.default.createPokemonFromName(pokemonCloned.name, player);
                    const coord = this.getClosestAvailablePlaceOnBoardToPokemon(pokemonCloned, teamIndex);
                    const cloneEntity = this.addPokemon(bug, coord.x, coord.y, teamIndex, true);
                    if (pokemonCloned.items.has(Item_1.Item.TINY_MUSHROOM)) {
                        const team = teamIndex === Game_1.Team.BLUE_TEAM ? this.blueTeam : this.redTeam;
                        const clonedEntity = (0, schemas_1.values)(team).find((p) => p.refToBoardPokemon.id === pokemonCloned.id);
                        if (clonedEntity) {
                            clonedEntity.addMaxHP(-0.5 * pokemonCloned.hp, clonedEntity, 0, false);
                        }
                        cloneEntity.addMaxHP(-0.5 * bug.hp, cloneEntity, 0, false);
                    }
                }
            }
            board.forEach((pokemon) => {
                if (pokemon.items.has(Item_1.Item.ROTOM_PHONE) && !(0, board_1.isOnBench)(pokemon)) {
                    const player = board === blueBoard ? this.bluePlayer : this.redPlayer;
                    const team = board === blueBoard ? this.blueTeam : this.redTeam;
                    const entity = (0, schemas_1.values)(team).find((e) => e.refToBoardPokemon.id === pokemon.id);
                    if (entity) {
                        entity.commands.push(new simulation_command_1.DelayedCommand(() => {
                            const rotomDrone = pokemon_factory_1.default.createPokemonFromName(Pokemon_1.Pkm.ROTOM_DRONE, player);
                            player === null || player === void 0 ? void 0 : player.pokemonsPlayed.add(Pokemon_1.Pkm.ROTOM_DRONE);
                            const coord = this.getClosestAvailablePlaceOnBoardToPokemon(pokemon, teamIndex);
                            this.addPokemon(rotomDrone, coord.x, coord.y, teamIndex, true);
                        }, 8000));
                    }
                }
                if (pokemon.items.has(Item_1.Item.WHITE_FLUTE) && !(0, board_1.isOnBench)(pokemon)) {
                    const wilds = precomputed_types_1.PRECOMPUTED_POKEMONS_PER_TYPE[Synergy_1.Synergy.WILD].map((p) => (0, precomputed_pokemon_data_1.getPokemonData)(p));
                    const spawns = [];
                    const pickWild = (rarity, tier) => {
                        const randomWild = (0, random_1.pickRandomIn)(wilds.filter((p) => p.rarity === rarity && p.stars === tier));
                        if (randomWild) {
                            spawns.push(randomWild);
                        }
                        else {
                            logger_1.logger.info("no pokemon found for white flute call", rarity, tier);
                        }
                    };
                    if (this.stageLevel <= 5) {
                        pickWild(Game_1.Rarity.COMMON, 1);
                        pickWild(Game_1.Rarity.COMMON, 1);
                        pickWild(Game_1.Rarity.COMMON, 1);
                    }
                    else if (this.stageLevel <= 10) {
                        pickWild(Game_1.Rarity.COMMON, 1);
                        pickWild(Game_1.Rarity.COMMON, 1);
                        pickWild(Game_1.Rarity.UNCOMMON, 1);
                    }
                    else if (this.stageLevel <= 15) {
                        pickWild(Game_1.Rarity.UNCOMMON, 1);
                        pickWild(Game_1.Rarity.UNCOMMON, 1);
                        pickWild(Game_1.Rarity.RARE, 1);
                    }
                    else if (this.stageLevel <= 20) {
                        pickWild(Game_1.Rarity.UNCOMMON, 1);
                        pickWild(Game_1.Rarity.RARE, 1);
                        pickWild(Game_1.Rarity.EPIC, 1);
                    }
                    else if (this.stageLevel <= 25) {
                        pickWild(Game_1.Rarity.UNCOMMON, 2);
                        pickWild(Game_1.Rarity.RARE, 1);
                        pickWild(Game_1.Rarity.EPIC, 1);
                    }
                    else if (this.stageLevel <= 30) {
                        pickWild(Game_1.Rarity.RARE, 2);
                        pickWild(Game_1.Rarity.EPIC, 1);
                        pickWild(Game_1.Rarity.EPIC, 1);
                    }
                    else if (this.stageLevel <= 35) {
                        pickWild(Game_1.Rarity.RARE, 2);
                        pickWild(Game_1.Rarity.EPIC, 2);
                        pickWild(Game_1.Rarity.UNIQUE, 3);
                    }
                    else {
                        pickWild(Game_1.Rarity.EPIC, 2);
                        pickWild(Game_1.Rarity.UNIQUE, 3);
                        pickWild(Game_1.Rarity.ULTRA, 2);
                    }
                    spawns.forEach((spawn) => {
                        const mon = pokemon_factory_1.default.createPokemonFromName(spawn.name);
                        const coord = this.getClosestAvailablePlaceOnBoardToPokemon(pokemon, teamIndex);
                        this.addPokemon(mon, coord.x, coord.y, teamIndex, true);
                    });
                }
            });
        }
        for (const team of [this.blueTeam, this.redTeam]) {
            const dragonLevel = (0, schemas_1.values)(team).reduce((acc, pokemon) => acc +
                (pokemon.types.has(Synergy_1.Synergy.DRAGON) && !pokemon.isSpawn
                    ? pokemon.stars
                    : 0), 0);
            team.forEach((pokemon) => {
                if (pokemon.effects.has(Effect_1.EffectEnum.DRAGON_SCALES) ||
                    pokemon.effects.has(Effect_1.EffectEnum.DRAGON_DANCE)) {
                    pokemon.addShield(dragonLevel * 5, pokemon, 0, false);
                }
                if (pokemon.effects.has(Effect_1.EffectEnum.DRAGON_DANCE)) {
                    pokemon.addAbilityPower(dragonLevel, pokemon, 0, false);
                    pokemon.addSpeed(dragonLevel, pokemon, 0, false);
                }
                let shieldBonus = 0;
                if (pokemon.effects.has(Effect_1.EffectEnum.STAMINA)) {
                    shieldBonus = 15;
                }
                if (pokemon.effects.has(Effect_1.EffectEnum.STRENGTH)) {
                    shieldBonus += 25;
                }
                if (pokemon.effects.has(Effect_1.EffectEnum.ENDURE)) {
                    shieldBonus += 35;
                }
                if (pokemon.effects.has(Effect_1.EffectEnum.PURE_POWER)) {
                    shieldBonus += 50;
                }
                if (shieldBonus >= 0) {
                    pokemon.addShield(shieldBonus, pokemon, 0, false);
                    const cells = this.board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
                    cells.forEach((cell) => {
                        if (cell.value && pokemon.team == cell.value.team) {
                            cell.value.addShield(shieldBonus, pokemon, 0, false);
                        }
                    });
                }
            });
        }
        for (const team of [this.blueTeam, this.redTeam]) {
            team.forEach((pokemon) => {
                if (pokemon.items.has(Item_1.Item.CLEANSE_TAG)) {
                    ;
                    [-1, 0, 1].forEach((offset) => {
                        const ally = this.board.getEntityOnCell(pokemon.positionX + offset, pokemon.positionY);
                        if (ally && ally.team === pokemon.team) {
                            ally.addShield(Math.ceil(0.2 * ally.hp), ally, 0, false);
                            ally.status.triggerRuneProtect(5000);
                        }
                    });
                }
                if (pokemon.items.has(Item_1.Item.GRACIDEA_FLOWER)) {
                    ;
                    [-1, 0, 1].forEach((offset) => {
                        const value = this.board.getEntityOnCell(pokemon.positionX + offset, pokemon.positionY);
                        if (value) {
                            value.addSpeed(20, pokemon, 0, false);
                        }
                    });
                }
                if (pokemon.items.has(Item_1.Item.EXP_SHARE)) {
                    ;
                    [-1, 1].forEach((offset) => {
                        const value = this.board.getEntityOnCell(pokemon.positionX + offset, pokemon.positionY);
                        if (value) {
                            if (value.atk > pokemon.atk)
                                pokemon.atk = value.atk;
                            if (value.def > pokemon.def)
                                pokemon.def = value.def;
                            if (value.speDef > pokemon.speDef)
                                pokemon.speDef = value.speDef;
                            if (value.ap > pokemon.ap)
                                pokemon.ap = value.ap;
                        }
                    });
                }
                if (pokemon.passive === Passive_1.Passive.LUVDISC) {
                    const lovers = [-1, 1].map((offset) => this.board.getEntityOnCell(pokemon.positionX + offset, pokemon.positionY));
                    if (lovers[0] && lovers[1]) {
                        const bestAtk = Math.max(lovers[0].atk, lovers[1].atk);
                        const bestDef = Math.max(lovers[0].def, lovers[1].def);
                        const bestSpeDef = Math.max(lovers[0].speDef, lovers[1].speDef);
                        const bestAP = Math.max(lovers[0].ap, lovers[1].ap);
                        lovers[0].atk = bestAtk;
                        lovers[1].atk = bestAtk;
                        lovers[0].def = bestDef;
                        lovers[1].def = bestDef;
                        lovers[0].speDef = bestSpeDef;
                        lovers[1].speDef = bestSpeDef;
                        lovers[0].ap = bestAP;
                        lovers[1].ap = bestAP;
                    }
                }
            });
        }
        for (const team of [this.blueTeam, this.redTeam]) {
            team.forEach((pokemon) => {
                if (pokemon.items.has(Item_1.Item.COMET_SHARD)) {
                    pokemon.commands.push(new simulation_command_1.DelayedCommand(() => {
                        const farthestCoordinate = this.board.getFarthestTargetCoordinateAvailablePlace(pokemon);
                        if (farthestCoordinate) {
                            const target = farthestCoordinate.target;
                            pokemon.skydiveTo(farthestCoordinate.x, farthestCoordinate.y, this.board);
                            pokemon.setTarget(target);
                            pokemon.status.triggerProtect(2000);
                            pokemon.commands.push(new simulation_command_1.DelayedCommand(() => {
                                pokemon.simulation.room.broadcast(types_1.Transfer.ABILITY, {
                                    id: pokemon.simulation.id,
                                    skill: "COMET_CRASH",
                                    positionX: farthestCoordinate.x,
                                    positionY: farthestCoordinate.y,
                                    targetX: target.positionX,
                                    targetY: target.positionY
                                });
                            }, 500));
                            pokemon.commands.push(new simulation_command_1.DelayedCommand(() => {
                                if ((target === null || target === void 0 ? void 0 : target.life) > 0) {
                                    const crit = (0, random_1.chance)(pokemon.critChance / 100, pokemon);
                                    target.handleSpecialDamage(3 * pokemon.atk, this.board, Game_1.AttackType.SPECIAL, pokemon, crit);
                                    this.board
                                        .getAdjacentCells(target.positionX, target.positionY)
                                        .forEach((cell) => {
                                        if (cell.value && cell.value.team !== pokemon.team) {
                                            cell.value.handleSpecialDamage(pokemon.atk, this.board, Game_1.AttackType.SPECIAL, pokemon, crit);
                                        }
                                    });
                                }
                            }, 1000));
                        }
                    }, 100));
                }
            });
            const teamEffects = team === this.blueTeam ? this.blueEffects : this.redEffects;
            const opponentTeam = team === this.blueTeam ? Game_1.Team.RED_TEAM : Game_1.Team.BLUE_TEAM;
            if (teamEffects.has(Effect_1.EffectEnum.CURSE_OF_VULNERABILITY) ||
                teamEffects.has(Effect_1.EffectEnum.CURSE_OF_WEAKNESS) ||
                teamEffects.has(Effect_1.EffectEnum.CURSE_OF_TORMENT) ||
                teamEffects.has(Effect_1.EffectEnum.CURSE_OF_FATE)) {
                this.applyCurse(Effect_1.EffectEnum.CURSE_OF_VULNERABILITY, opponentTeam);
            }
            if (teamEffects.has(Effect_1.EffectEnum.CURSE_OF_WEAKNESS) ||
                teamEffects.has(Effect_1.EffectEnum.CURSE_OF_TORMENT) ||
                teamEffects.has(Effect_1.EffectEnum.CURSE_OF_FATE)) {
                this.applyCurse(Effect_1.EffectEnum.CURSE_OF_WEAKNESS, opponentTeam);
            }
            if (teamEffects.has(Effect_1.EffectEnum.CURSE_OF_TORMENT) ||
                teamEffects.has(Effect_1.EffectEnum.CURSE_OF_FATE)) {
                this.applyCurse(Effect_1.EffectEnum.CURSE_OF_TORMENT, opponentTeam);
            }
            if (teamEffects.has(Effect_1.EffectEnum.CURSE_OF_FATE)) {
                this.applyCurse(Effect_1.EffectEnum.CURSE_OF_FATE, opponentTeam);
            }
        }
    }
    applyEffect(pokemon, types, effect, activeSynergies) {
        switch (effect) {
            case Effect_1.EffectEnum.HONE_CLAWS:
                if (types.has(Synergy_1.Synergy.DARK)) {
                    pokemon.addCritChance(30, pokemon, 0, false);
                    pokemon.addCritPower(30, pokemon, 0, false);
                    pokemon.effects.add(Effect_1.EffectEnum.HONE_CLAWS);
                }
                break;
            case Effect_1.EffectEnum.ASSURANCE:
                if (types.has(Synergy_1.Synergy.DARK)) {
                    pokemon.addCritChance(40, pokemon, 0, false);
                    pokemon.addCritPower(50, pokemon, 0, false);
                    pokemon.effects.add(Effect_1.EffectEnum.ASSURANCE);
                }
                break;
            case Effect_1.EffectEnum.BEAT_UP:
                if (types.has(Synergy_1.Synergy.DARK)) {
                    pokemon.addCritChance(50, pokemon, 0, false);
                    pokemon.addCritPower(80, pokemon, 0, false);
                    pokemon.effects.add(Effect_1.EffectEnum.BEAT_UP);
                }
                break;
            case Effect_1.EffectEnum.ANCIENT_POWER:
            case Effect_1.EffectEnum.ELDER_POWER:
            case Effect_1.EffectEnum.FORGOTTEN_POWER:
                if (types.has(Synergy_1.Synergy.FOSSIL)) {
                    pokemon.effects.add(effect);
                }
                break;
            case Effect_1.EffectEnum.BLAZE:
            case Effect_1.EffectEnum.VICTORY_STAR:
            case Effect_1.EffectEnum.DROUGHT:
            case Effect_1.EffectEnum.DESOLATE_LAND:
                if (types.has(Synergy_1.Synergy.FIRE)) {
                    pokemon.effects.add(effect);
                    pokemon.effectsSet.add(new effect_1.FireHitEffect(effect));
                }
                break;
            case Effect_1.EffectEnum.INGRAIN:
                if (types.has(Synergy_1.Synergy.GRASS)) {
                    pokemon.effects.add(Effect_1.EffectEnum.INGRAIN);
                }
                break;
            case Effect_1.EffectEnum.GROWTH:
                if (types.has(Synergy_1.Synergy.GRASS)) {
                    pokemon.effects.add(Effect_1.EffectEnum.GROWTH);
                }
                break;
            case Effect_1.EffectEnum.SPORE:
                if (types.has(Synergy_1.Synergy.GRASS)) {
                    pokemon.effects.add(Effect_1.EffectEnum.SPORE);
                }
                break;
            case Effect_1.EffectEnum.RAIN_DANCE:
                if (types.has(Synergy_1.Synergy.WATER)) {
                    pokemon.effects.add(Effect_1.EffectEnum.RAIN_DANCE);
                }
                break;
            case Effect_1.EffectEnum.DRIZZLE:
                if (types.has(Synergy_1.Synergy.WATER)) {
                    pokemon.effects.add(Effect_1.EffectEnum.DRIZZLE);
                }
                break;
            case Effect_1.EffectEnum.PRIMORDIAL_SEA:
                if (types.has(Synergy_1.Synergy.WATER)) {
                    pokemon.effects.add(Effect_1.EffectEnum.PRIMORDIAL_SEA);
                }
                break;
            case Effect_1.EffectEnum.STAMINA:
                if (types.has(Synergy_1.Synergy.NORMAL)) {
                    pokemon.effects.add(Effect_1.EffectEnum.STAMINA);
                }
                break;
            case Effect_1.EffectEnum.STRENGTH:
                if (types.has(Synergy_1.Synergy.NORMAL)) {
                    pokemon.effects.add(Effect_1.EffectEnum.STRENGTH);
                }
                break;
            case Effect_1.EffectEnum.ENDURE:
                if (types.has(Synergy_1.Synergy.NORMAL)) {
                    pokemon.effects.add(Effect_1.EffectEnum.ENDURE);
                }
                break;
            case Effect_1.EffectEnum.PURE_POWER:
                if (types.has(Synergy_1.Synergy.NORMAL)) {
                    pokemon.effects.add(Effect_1.EffectEnum.PURE_POWER);
                }
                break;
            case Effect_1.EffectEnum.RISING_VOLTAGE:
            case Effect_1.EffectEnum.OVERDRIVE:
            case Effect_1.EffectEnum.POWER_SURGE:
                if (types.has(Synergy_1.Synergy.ELECTRIC)) {
                    pokemon.effects.add(effect);
                    pokemon.effectsSet.add(effect_1.electricTripleAttackEffect);
                }
                break;
            case Effect_1.EffectEnum.GUTS:
            case Effect_1.EffectEnum.STURDY:
            case Effect_1.EffectEnum.DEFIANT:
            case Effect_1.EffectEnum.JUSTIFIED:
                if (types.has(Synergy_1.Synergy.FIGHTING)) {
                    pokemon.effects.add(effect);
                }
                break;
            case Effect_1.EffectEnum.STEEL_SURGE:
            case Effect_1.EffectEnum.STEEL_SPIKE:
            case Effect_1.EffectEnum.CORKSCREW_CRASH:
            case Effect_1.EffectEnum.MAX_MELTDOWN:
                if (types.has(Synergy_1.Synergy.STEEL)) {
                    pokemon.effects.add(effect);
                }
                break;
            case Effect_1.EffectEnum.BULK_UP:
            case Effect_1.EffectEnum.RAGE:
            case Effect_1.EffectEnum.ANGER_POINT:
                if (types.has(Synergy_1.Synergy.FIELD)) {
                    pokemon.effects.add(effect);
                }
                break;
            case Effect_1.EffectEnum.PURSUIT:
            case Effect_1.EffectEnum.BRUTAL_SWING:
            case Effect_1.EffectEnum.POWER_TRIP:
            case Effect_1.EffectEnum.MERCILESS:
                if (types.has(Synergy_1.Synergy.MONSTER)) {
                    pokemon.effects.add(effect);
                    pokemon.effectsSet.add(new effect_1.MonsterKillEffect(effect));
                }
                break;
            case Effect_1.EffectEnum.AMNESIA:
                if (types.has(Synergy_1.Synergy.PSYCHIC)) {
                    pokemon.effects.add(Effect_1.EffectEnum.AMNESIA);
                    pokemon.addAbilityPower(50, pokemon, 0, false);
                }
                break;
            case Effect_1.EffectEnum.LIGHT_SCREEN:
                if (types.has(Synergy_1.Synergy.PSYCHIC)) {
                    pokemon.effects.add(Effect_1.EffectEnum.LIGHT_SCREEN);
                    pokemon.addAbilityPower(100, pokemon, 0, false);
                }
                break;
            case Effect_1.EffectEnum.EERIE_SPELL:
                if (types.has(Synergy_1.Synergy.PSYCHIC)) {
                    pokemon.effects.add(Effect_1.EffectEnum.EERIE_SPELL);
                    pokemon.addAbilityPower(150, pokemon, 0, false);
                }
                break;
            case Effect_1.EffectEnum.MEDITATE:
            case Effect_1.EffectEnum.FOCUS_ENERGY:
            case Effect_1.EffectEnum.CALM_MIND:
                if (types.has(Synergy_1.Synergy.HUMAN)) {
                    pokemon.effects.add(effect);
                }
                break;
            case Effect_1.EffectEnum.TAILWIND:
                if (types.has(Synergy_1.Synergy.FLYING)) {
                    pokemon.flyingProtection = 1;
                    pokemon.effects.add(Effect_1.EffectEnum.TAILWIND);
                }
                break;
            case Effect_1.EffectEnum.FEATHER_DANCE:
                if (types.has(Synergy_1.Synergy.FLYING)) {
                    pokemon.flyingProtection = 1;
                    pokemon.effects.add(Effect_1.EffectEnum.FEATHER_DANCE);
                }
                break;
            case Effect_1.EffectEnum.MAX_AIRSTREAM:
                if (types.has(Synergy_1.Synergy.FLYING)) {
                    pokemon.flyingProtection = 2;
                    pokemon.effects.add(Effect_1.EffectEnum.MAX_AIRSTREAM);
                }
                break;
            case Effect_1.EffectEnum.SKYDIVE:
                if (types.has(Synergy_1.Synergy.FLYING)) {
                    pokemon.flyingProtection = 2;
                    pokemon.effects.add(Effect_1.EffectEnum.SKYDIVE);
                }
                break;
            case Effect_1.EffectEnum.SWIFT_SWIM:
            case Effect_1.EffectEnum.HYDRATION:
            case Effect_1.EffectEnum.WATER_VEIL:
            case Effect_1.EffectEnum.SURGE_SURFER:
                pokemon.effects.add(effect);
                break;
            case Effect_1.EffectEnum.ODD_FLOWER:
            case Effect_1.EffectEnum.GLOOM_FLOWER:
            case Effect_1.EffectEnum.VILE_FLOWER:
            case Effect_1.EffectEnum.SUN_FLOWER:
                if (types.has(Synergy_1.Synergy.FLORA)) {
                    pokemon.effects.add(effect);
                }
                break;
            case Effect_1.EffectEnum.BATTLE_ARMOR:
                if (types.has(Synergy_1.Synergy.ROCK)) {
                    pokemon.addDefense(10, pokemon, 0, false);
                    pokemon.effects.add(Effect_1.EffectEnum.BATTLE_ARMOR);
                }
                break;
            case Effect_1.EffectEnum.MOUTAIN_RESISTANCE:
                if (types.has(Synergy_1.Synergy.ROCK)) {
                    pokemon.addDefense(30, pokemon, 0, false);
                    pokemon.effects.add(Effect_1.EffectEnum.MOUTAIN_RESISTANCE);
                }
                break;
            case Effect_1.EffectEnum.DIAMOND_STORM:
                if (types.has(Synergy_1.Synergy.ROCK)) {
                    pokemon.addDefense(60, pokemon, 0, false);
                    pokemon.effects.add(Effect_1.EffectEnum.DIAMOND_STORM);
                }
                break;
            case Effect_1.EffectEnum.AROMATIC_MIST:
            case Effect_1.EffectEnum.FAIRY_WIND:
            case Effect_1.EffectEnum.STRANGE_STEAM:
            case Effect_1.EffectEnum.MOON_FORCE:
                if (types.has(Synergy_1.Synergy.FAIRY)) {
                    pokemon.effects.add(effect);
                }
                break;
            case Effect_1.EffectEnum.DRAGON_ENERGY:
            case Effect_1.EffectEnum.DRAGON_SCALES:
            case Effect_1.EffectEnum.DRAGON_DANCE:
                if (types.has(Synergy_1.Synergy.DRAGON)) {
                    pokemon.effects.add(effect);
                }
                break;
            case Effect_1.EffectEnum.CHILLY:
                pokemon.effects.add(Effect_1.EffectEnum.CHILLY);
                pokemon.addSpecialDefense(4, pokemon, 0, false);
                break;
            case Effect_1.EffectEnum.FROSTY:
                pokemon.effects.add(Effect_1.EffectEnum.FROSTY);
                pokemon.addSpecialDefense(12, pokemon, 0, false);
                break;
            case Effect_1.EffectEnum.FREEZING:
                pokemon.effects.add(Effect_1.EffectEnum.FREEZING);
                pokemon.addSpecialDefense(40, pokemon, 0, false);
                break;
            case Effect_1.EffectEnum.SHEER_COLD:
                pokemon.effects.add(Effect_1.EffectEnum.SHEER_COLD);
                pokemon.addSpecialDefense(60, pokemon, 0, false);
                break;
            case Effect_1.EffectEnum.POISONOUS:
            case Effect_1.EffectEnum.VENOMOUS:
            case Effect_1.EffectEnum.TOXIC:
                if (types.has(Synergy_1.Synergy.POISON)) {
                    pokemon.effects.add(effect);
                }
                break;
            case Effect_1.EffectEnum.LARGO:
            case Effect_1.EffectEnum.ALLEGRO:
            case Effect_1.EffectEnum.PRESTO:
                if (types.has(Synergy_1.Synergy.SOUND)) {
                    pokemon.effects.add(effect);
                    pokemon.effectsSet.add(new effect_1.SoundCryEffect(effect));
                }
                break;
            case Effect_1.EffectEnum.COCOON:
            case Effect_1.EffectEnum.INFESTATION:
            case Effect_1.EffectEnum.HORDE:
            case Effect_1.EffectEnum.HEART_OF_THE_SWARM:
                if (types.has(Synergy_1.Synergy.BUG)) {
                    pokemon.effects.add(effect);
                }
                break;
            case Effect_1.EffectEnum.TILLER:
            case Effect_1.EffectEnum.DIGGER:
            case Effect_1.EffectEnum.DRILLER:
            case Effect_1.EffectEnum.DEEP_MINER:
                if (types.has(Synergy_1.Synergy.GROUND)) {
                    pokemon.effects.add(effect);
                    pokemon.effectsSet.add(new effect_1.GrowGroundEffect(effect));
                }
                break;
            case Effect_1.EffectEnum.DUBIOUS_DISC:
            case Effect_1.EffectEnum.LINK_CABLE:
            case Effect_1.EffectEnum.GOOGLE_SPECS:
                if (types.has(Synergy_1.Synergy.ARTIFICIAL) && pokemon.items.size > 0) {
                    const nbItems = (0, number_1.max)(3)(pokemon.items.size + (pokemon.items.has(Item_1.Item.WONDER_BOX) ? 1 : 0));
                    const attackBoost = {
                        [Effect_1.EffectEnum.DUBIOUS_DISC]: 0,
                        [Effect_1.EffectEnum.LINK_CABLE]: (5 / 100) * pokemon.baseAtk,
                        [Effect_1.EffectEnum.GOOGLE_SPECS]: (10 / 100) * pokemon.baseAtk
                    }[effect];
                    const apBoost = {
                        [Effect_1.EffectEnum.DUBIOUS_DISC]: 0,
                        [Effect_1.EffectEnum.LINK_CABLE]: 5,
                        [Effect_1.EffectEnum.GOOGLE_SPECS]: 10
                    }[effect];
                    const shieldBoost = {
                        [Effect_1.EffectEnum.DUBIOUS_DISC]: 0,
                        [Effect_1.EffectEnum.LINK_CABLE]: (5 / 100) * pokemon.hp,
                        [Effect_1.EffectEnum.GOOGLE_SPECS]: (10 / 100) * pokemon.hp
                    }[effect];
                    pokemon.addAttack(attackBoost * nbItems, pokemon, 0, false);
                    pokemon.addAbilityPower(apBoost * nbItems, pokemon, 0, false);
                    pokemon.addShield(shieldBoost * nbItems, pokemon, 0, false);
                    pokemon.effects.add(effect);
                }
                break;
            case Effect_1.EffectEnum.GRASSY_TERRAIN:
                if (types.has(Synergy_1.Synergy.GRASS)) {
                    pokemon.status.grassField = true;
                    pokemon.effects.add(Effect_1.EffectEnum.GRASSY_TERRAIN);
                }
                break;
            case Effect_1.EffectEnum.PSYCHIC_TERRAIN:
                if (types.has(Synergy_1.Synergy.PSYCHIC)) {
                    pokemon.status.addPsychicField(pokemon);
                    pokemon.effects.add(Effect_1.EffectEnum.PSYCHIC_TERRAIN);
                }
                break;
            case Effect_1.EffectEnum.ELECTRIC_TERRAIN:
                if (types.has(Synergy_1.Synergy.ELECTRIC)) {
                    pokemon.status.addElectricField(pokemon);
                    pokemon.effects.add(Effect_1.EffectEnum.ELECTRIC_TERRAIN);
                }
                break;
            case Effect_1.EffectEnum.MISTY_TERRAIN:
                if (types.has(Synergy_1.Synergy.FAIRY)) {
                    pokemon.status.fairyField = true;
                    pokemon.effects.add(Effect_1.EffectEnum.MISTY_TERRAIN);
                }
                break;
            case Effect_1.EffectEnum.SHINING_RAY:
                if (pokemon.inSpotlight) {
                    pokemon.status.light = true;
                    pokemon.effects.add(Effect_1.EffectEnum.SHINING_RAY);
                    pokemon.addAttack(Math.ceil(pokemon.atk * 0.2), pokemon, 0, false);
                    pokemon.addAbilityPower(20, pokemon, 0, false);
                }
                break;
            case Effect_1.EffectEnum.LIGHT_PULSE:
                if (pokemon.inSpotlight) {
                    pokemon.status.light = true;
                    pokemon.effects.add(Effect_1.EffectEnum.LIGHT_PULSE);
                    pokemon.addAttack(Math.ceil(pokemon.atk * 0.2), pokemon, 0, false);
                    pokemon.addAbilityPower(20, pokemon, 0, false);
                }
                break;
            case Effect_1.EffectEnum.ETERNAL_LIGHT:
                if (pokemon.inSpotlight) {
                    pokemon.status.light = true;
                    pokemon.effects.add(Effect_1.EffectEnum.ETERNAL_LIGHT);
                    pokemon.addAttack(Math.ceil(pokemon.atk * 0.2), pokemon, 0, false);
                    pokemon.addAbilityPower(20, pokemon, 0, false);
                    pokemon.status.triggerRuneProtect(8000);
                    pokemon.addDefense(0.5 * pokemon.baseDef, pokemon, 0, false);
                    pokemon.addSpecialDefense(0.5 * pokemon.baseSpeDef, pokemon, 0, false);
                }
                break;
            case Effect_1.EffectEnum.MAX_ILLUMINATION:
                if (pokemon.inSpotlight) {
                    pokemon.status.light = true;
                    pokemon.effects.add(Effect_1.EffectEnum.MAX_ILLUMINATION);
                    pokemon.addAttack(Math.ceil(pokemon.atk * 0.2), pokemon, 0, false);
                    pokemon.addAbilityPower(20, pokemon, 0, false);
                    pokemon.status.triggerRuneProtect(8000);
                    pokemon.addDefense(0.5 * pokemon.baseDef, pokemon, 0, false);
                    pokemon.addSpecialDefense(0.5 * pokemon.baseSpeDef, pokemon, 0, false);
                    pokemon.addShield(100, pokemon, 0, false);
                    pokemon.status.addResurrection(pokemon);
                }
                break;
            case Effect_1.EffectEnum.QUICK_FEET:
                if (types.has(Synergy_1.Synergy.WILD)) {
                    pokemon.effects.add(Effect_1.EffectEnum.QUICK_FEET);
                    pokemon.addSpeed(30, pokemon, 0, false);
                }
                break;
            case Effect_1.EffectEnum.RUN_AWAY:
                if (types.has(Synergy_1.Synergy.WILD)) {
                    pokemon.effects.add(Effect_1.EffectEnum.RUN_AWAY);
                    pokemon.addSpeed(50, pokemon, 0, false);
                }
                break;
            case Effect_1.EffectEnum.HUSTLE:
                if (types.has(Synergy_1.Synergy.WILD)) {
                    pokemon.effects.add(Effect_1.EffectEnum.HUSTLE);
                    pokemon.addAttack(Math.ceil(0.2 * pokemon.baseAtk), pokemon, 0, false);
                    pokemon.addSpeed(50, pokemon, 0, false);
                }
                break;
            case Effect_1.EffectEnum.BERSERK:
                if (types.has(Synergy_1.Synergy.WILD)) {
                    pokemon.effects.add(Effect_1.EffectEnum.BERSERK);
                    pokemon.addAttack(Math.ceil(0.4 * pokemon.baseAtk), pokemon, 0, false);
                    pokemon.addSpeed(50, pokemon, 0, false);
                    pokemon.status.enrageDelay -= 5000;
                }
                break;
            case Effect_1.EffectEnum.FLUID: {
                pokemon.effects.add(Effect_1.EffectEnum.FLUID);
                pokemon.addSpeed(1 * activeSynergies, pokemon, 0, false);
                pokemon.addMaxHP(3 * activeSynergies, pokemon, 0, false);
                break;
            }
            case Effect_1.EffectEnum.SHAPELESS: {
                pokemon.effects.add(Effect_1.EffectEnum.SHAPELESS);
                pokemon.addSpeed(3 * activeSynergies, pokemon, 0, false);
                pokemon.addMaxHP(6 * activeSynergies, pokemon, 0, false);
                break;
            }
            case Effect_1.EffectEnum.ETHEREAL: {
                pokemon.effects.add(Effect_1.EffectEnum.ETHEREAL);
                pokemon.addSpeed(6 * activeSynergies, pokemon, 0, false);
                pokemon.addMaxHP(12 * activeSynergies, pokemon, 0, false);
                break;
            }
            case Effect_1.EffectEnum.CURSE_OF_VULNERABILITY:
            case Effect_1.EffectEnum.CURSE_OF_WEAKNESS:
            case Effect_1.EffectEnum.CURSE_OF_TORMENT:
            case Effect_1.EffectEnum.CURSE_OF_FATE:
                if (pokemon.types.has(Synergy_1.Synergy.GHOST)) {
                    pokemon.effects.add(effect);
                    pokemon.addDodgeChance(0.2, pokemon, 0, false);
                }
                break;
            case Effect_1.EffectEnum.VICTINI_PASSIVE: {
                pokemon.effects.add(effect);
                pokemon.addDodgeChance(-1, pokemon, 0, false);
                break;
            }
            case Effect_1.EffectEnum.GOOD_LUCK: {
                pokemon.effects.add(effect);
                pokemon.addLuck(20, pokemon, 0, false);
                break;
            }
            case Effect_1.EffectEnum.BAD_LUCK: {
                pokemon.effects.add(effect);
                pokemon.addLuck(-20, pokemon, 0, false);
                break;
            }
            case Effect_1.EffectEnum.WATER_SPRING: {
                pokemon.effectsSet.add(passives_1.WaterSpringEffect);
                break;
            }
            case Effect_1.EffectEnum.WINDY: {
                const player = pokemon.player;
                const nbFloatStones = player ? (0, array_1.count)(player.items, Item_1.Item.FLOAT_STONE) : 0;
                pokemon.addSpeed((pokemon.types.has(Synergy_1.Synergy.FLYING) ? 20 : 10) + nbFloatStones * 5, pokemon, 0, false);
                break;
            }
            case Effect_1.EffectEnum.SNOW:
                pokemon.addSpeed(-20, pokemon, 0, false);
                break;
            case Effect_1.EffectEnum.SMOG: {
                const opponentPlayer = pokemon.team === Game_1.Team.BLUE_TEAM ? this.redPlayer : this.bluePlayer;
                const nbSmellyClays = opponentPlayer
                    ? (0, array_1.count)(opponentPlayer.items, Item_1.Item.SMELLY_CLAY)
                    : 0;
                pokemon.addDodgeChance(0.15 - 0.05 * nbSmellyClays, pokemon, 0, false);
                break;
            }
            case Effect_1.EffectEnum.NIGHT: {
                const player = pokemon.player;
                const nbBlackAugurite = player
                    ? (0, array_1.count)(player.items, Item_1.Item.BLACK_AUGURITE)
                    : 0;
                pokemon.addCritChance(10 + 5 * nbBlackAugurite, pokemon, 0, false);
                break;
            }
            case Effect_1.EffectEnum.MISTY: {
                const player = pokemon.player;
                const nbMistStones = player ? (0, array_1.count)(player.items, Item_1.Item.MIST_STONE) : 0;
                if (nbMistStones > 0) {
                    pokemon.addSpecialDefense(3 * nbMistStones, pokemon, 0, false);
                }
                break;
            }
            default:
                break;
        }
    }
    update(dt) {
        if (this.blueTeam.size === 0 || this.redTeam.size === 0) {
            this.onFinish();
        }
        this.blueTeam.forEach((pkm, key) => {
            var _a;
            (_a = this.blueDpsMeter
                .get(key)) === null || _a === void 0 ? void 0 : _a.update(pkm.physicalDamage, pkm.specialDamage, pkm.trueDamage, pkm.physicalDamageReduced, pkm.specialDamageReduced, pkm.shieldDamageTaken, pkm.healDone, pkm.shieldDone);
            pkm.update(dt, this.board, this.bluePlayer);
        });
        this.redTeam.forEach((pkm, key) => {
            var _a;
            (_a = this.redDpsMeter
                .get(key)) === null || _a === void 0 ? void 0 : _a.update(pkm.physicalDamage, pkm.specialDamage, pkm.trueDamage, pkm.physicalDamageReduced, pkm.specialDamageReduced, pkm.shieldDamageTaken, pkm.healDone, pkm.shieldDone);
            pkm.update(dt, this.board, this.redPlayer);
        });
        if (this.weather === Weather_1.Weather.STORM) {
            this.stormLightningTimer -= dt;
            if (this.stormLightningTimer <= 0 && !this.finished) {
                this.stormLightningTimer = (0, random_1.randomBetween)(3000, 6000);
                const x = (0, random_1.randomBetween)(0, this.board.columns - 1);
                const y = (0, random_1.randomBetween)(0, this.board.rows - 1);
                const pokemonOnCell = this.board.getEntityOnCell(x, y);
                if (pokemonOnCell) {
                    const nbElectricQuartz = pokemonOnCell.player
                        ? (0, array_1.count)(pokemonOnCell.player.items, Item_1.Item.ELECTRIC_QUARTZ)
                        : 0;
                    if (nbElectricQuartz > 0) {
                        pokemonOnCell.addShield(50 * nbElectricQuartz, pokemonOnCell, 0, false);
                    }
                    if (pokemonOnCell.types.has(Synergy_1.Synergy.ELECTRIC) === false) {
                        pokemonOnCell.handleDamage({
                            damage: 100,
                            board: this.board,
                            attackType: Game_1.AttackType.SPECIAL,
                            attacker: null,
                            shouldTargetGainMana: false
                        });
                    }
                }
                this.room.broadcast(types_1.Transfer.BOARD_EVENT, {
                    simulationId: this.id,
                    effect: Effect_1.EffectEnum.LIGHTNING_STRIKE,
                    x,
                    y
                });
            }
        }
        if (this.tidalWaveTimer > 0) {
            this.tidalWaveTimer -= dt;
            if (this.tidalWaveTimer <= 0) {
                this.tidalWaveCounter++;
                this.handleTidalWaveForTeam(Game_1.Team.BLUE_TEAM);
                this.handleTidalWaveForTeam(Game_1.Team.RED_TEAM);
                if (this.redEffects.has(Effect_1.EffectEnum.SURGE_SURFER) ||
                    this.blueEffects.has(Effect_1.EffectEnum.SURGE_SURFER) ||
                    this.tidalWaveCounter < 2) {
                    this.tidalWaveTimer = 8000;
                }
            }
        }
    }
    stop() {
        this.blueTeam.forEach((pokemon, key) => {
            delete pokemon.simulation;
            this.blueTeam.delete(key);
        });
        this.redTeam.forEach((pokemon, key) => {
            delete pokemon.simulation;
            this.redTeam.delete(key);
        });
        this.weather = Weather_1.Weather.NEUTRAL;
        this.winnerId = "";
        this.room.broadcast(types_1.Transfer.SIMULATION_STOP);
        delete this.room;
    }
    onFinish() {
        this.finished = true;
        if (this.blueTeam.size === 0 && this.redTeam.size > 0) {
            this.winnerId = this.redPlayerId;
        }
        else if (this.redTeam.size === 0 && this.blueTeam.size > 0) {
            this.winnerId = this.bluePlayerId;
        }
        const winningTeam = this.winnerId === this.redPlayerId
            ? this.redTeam
            : this.winnerId === this.bluePlayerId
                ? this.blueTeam
                : null;
        if (winningTeam) {
            winningTeam.forEach((p) => {
                p.status.clearNegativeStatus();
                if (!p.status.tree) {
                    p.action = Game_1.PokemonActionState.HOP;
                }
            });
        }
        if (this.redPlayer &&
            this.id === this.redPlayer.simulationId &&
            !this.isGhostBattle) {
            this.redPlayer.addBattleResult(this.redPlayer.opponentId, this.redPlayer.opponentName, this.winnerId === this.redPlayerId
                ? Game_1.BattleResult.WIN
                : this.winnerId === this.bluePlayerId
                    ? Game_1.BattleResult.DEFEAT
                    : Game_1.BattleResult.DRAW, this.redPlayer.opponentAvatar, this.weather);
            const client = this.room.clients.find((cli) => cli.auth.uid === this.redPlayerId);
            if (this.winnerId === this.redPlayerId) {
                this.redPlayer.addMoney(1, true, null);
                client === null || client === void 0 ? void 0 : client.send(types_1.Transfer.PLAYER_INCOME, 1);
            }
            else {
                const playerDamage = this.room.computeRoundDamage(this.blueTeam, this.stageLevel);
                this.redPlayer.life -= playerDamage;
                if (playerDamage > 0) {
                    client === null || client === void 0 ? void 0 : client.send(types_1.Transfer.PLAYER_DAMAGE, playerDamage);
                }
                if (this.bluePlayer) {
                    this.bluePlayer.totalPlayerDamageDealt += playerDamage;
                }
            }
            if (this.weather !== Weather_1.Weather.NEUTRAL &&
                this.redPlayer.synergies.getSynergyStep(Synergy_1.Synergy.ROCK) > 0) {
                const rockCollected = Item_1.WeatherRocksByWeather.get(this.weather);
                if (rockCollected) {
                    this.redPlayer.weatherRocks.push(rockCollected);
                    if (this.redPlayer.weatherRocks.length > 3) {
                        this.redPlayer.weatherRocks.shift();
                    }
                    this.redPlayer.updateWeatherRocks();
                }
            }
        }
        if (this.bluePlayer && this.id === this.bluePlayer.simulationId) {
            this.bluePlayer.addBattleResult(this.bluePlayer.opponentId, this.bluePlayer.opponentName, this.winnerId === this.bluePlayerId
                ? Game_1.BattleResult.WIN
                : this.winnerId === this.redPlayerId
                    ? Game_1.BattleResult.DEFEAT
                    : Game_1.BattleResult.DRAW, this.bluePlayer.opponentAvatar, this.weather);
            const client = this.room.clients.find((cli) => cli.auth.uid === this.bluePlayerId);
            if (this.winnerId === this.bluePlayerId) {
                if (this.redPlayerId !== "pve") {
                    this.bluePlayer.addMoney(1, true, null);
                    client === null || client === void 0 ? void 0 : client.send(types_1.Transfer.PLAYER_INCOME, 1);
                }
            }
            else {
                const playerDamage = this.room.computeRoundDamage(this.redTeam, this.stageLevel);
                this.bluePlayer.life -= playerDamage;
                if (playerDamage > 0) {
                    client === null || client === void 0 ? void 0 : client.send(types_1.Transfer.PLAYER_DAMAGE, playerDamage);
                }
                if (this.redPlayer) {
                    this.redPlayer.totalPlayerDamageDealt += playerDamage;
                }
            }
            if (this.weather !== Weather_1.Weather.NEUTRAL &&
                this.bluePlayer.synergies.getSynergyStep(Synergy_1.Synergy.ROCK) > 0) {
                const rockCollected = Item_1.WeatherRocksByWeather.get(this.weather);
                if (rockCollected) {
                    this.bluePlayer.weatherRocks.push(rockCollected);
                    if (this.bluePlayer.weatherRocks.length > 3) {
                        this.bluePlayer.weatherRocks.shift();
                    }
                    this.bluePlayer.updateWeatherRocks();
                }
            }
        }
        this.room.rankPlayers();
    }
    applyCurse(effect, opponentTeamNumber) {
        const opponentTeam = opponentTeamNumber === Game_1.Team.BLUE_TEAM ? this.blueTeam : this.redTeam;
        const opponentsCursable = (0, random_1.shuffleArray)([...opponentTeam.values()]).filter((p) => p.life > 0);
        if (effect === Effect_1.EffectEnum.CURSE_OF_VULNERABILITY) {
            const highestDef = Math.max(...opponentsCursable.map((p) => p.def + p.speDef));
            const enemyWithHighestDef = (0, random_1.pickRandomIn)(opponentsCursable.filter((p) => p.def + p.speDef === highestDef));
            if (enemyWithHighestDef) {
                enemyWithHighestDef.addDefense(-5, enemyWithHighestDef, 0, false);
                enemyWithHighestDef.addSpecialDefense(-5, enemyWithHighestDef, 0, false);
                enemyWithHighestDef.status.curseVulnerability = true;
                enemyWithHighestDef.status.triggerFlinch(30000, enemyWithHighestDef, undefined);
            }
        }
        if (effect === Effect_1.EffectEnum.CURSE_OF_WEAKNESS) {
            const highestAtk = Math.max(...opponentsCursable.map((p) => p.atk));
            const enemyWithHighestAtk = (0, random_1.pickRandomIn)(opponentsCursable.filter((p) => p.atk === highestAtk));
            if (enemyWithHighestAtk) {
                enemyWithHighestAtk.addAttack(Math.round(-0.3 * enemyWithHighestAtk.atk), enemyWithHighestAtk, 0, false);
                enemyWithHighestAtk.status.curseWeakness = true;
                enemyWithHighestAtk.status.triggerParalysis(30000, enemyWithHighestAtk, null);
            }
        }
        if (effect === Effect_1.EffectEnum.CURSE_OF_TORMENT) {
            const highestAP = Math.max(...opponentsCursable.map((p) => p.ap));
            const enemyWithHighestAP = (0, random_1.pickRandomIn)(opponentsCursable.filter((p) => p.ap === highestAP));
            if (enemyWithHighestAP) {
                enemyWithHighestAP.addAbilityPower(-50, enemyWithHighestAP, 0, false);
                enemyWithHighestAP.status.curseTorment = true;
                enemyWithHighestAP.status.triggerFatigue(30000, enemyWithHighestAP);
            }
        }
        if (effect === Effect_1.EffectEnum.CURSE_OF_FATE) {
            const strongestEnemy = (0, pokemon_entity_1.getStrongestUnit)(opponentsCursable);
            if (strongestEnemy) {
                strongestEnemy.status.curseFate = true;
                strongestEnemy.status.triggerCurse(7000);
            }
        }
    }
    addPikachuSurferToBoard(team) {
        const pikachuSurfer = pokemon_factory_1.default.createPokemonFromName(Pokemon_1.Pkm.PIKACHU_SURFER, team === Game_1.Team.RED_TEAM ? this.redPlayer : this.bluePlayer);
        const coord = this.getFirstAvailablePlaceOnBoard(team);
        if (coord) {
            this.addPokemon(pikachuSurfer, coord.x, coord.y, team, true);
        }
    }
    handleTidalWaveForTeam(team) {
        const effects = team === Game_1.Team.RED_TEAM ? this.redEffects : this.blueEffects;
        const tidalWaveLevel = effects.has(Effect_1.EffectEnum.WATER_VEIL) ||
            effects.has(Effect_1.EffectEnum.SURGE_SURFER)
            ? 3
            : effects.has(Effect_1.EffectEnum.HYDRATION)
                ? 2
                : effects.has(Effect_1.EffectEnum.SWIFT_SWIM)
                    ? 1
                    : 0;
        const shouldTrigger = (tidalWaveLevel > 0 && this.tidalWaveCounter === 1) ||
            (tidalWaveLevel === 3 && this.tidalWaveCounter === 2) ||
            effects.has(Effect_1.EffectEnum.SURGE_SURFER);
        if (shouldTrigger) {
            this.triggerTidalWave(team, tidalWaveLevel);
            if (effects.has(Effect_1.EffectEnum.SURGE_SURFER) &&
                this.tidalWaveCounter === 1) {
                this.addPikachuSurferToBoard(team);
            }
        }
    }
    triggerTidalWave(team, tidalWaveLevel, healAll = false) {
        const isRed = team === Game_1.Team.RED_TEAM;
        const orientation = isRed ? Game_1.Orientation.DOWN : Game_1.Orientation.UP;
        this.room.broadcast(types_1.Transfer.ABILITY, {
            id: this.id,
            skill: "TIDAL_WAVE",
            positionX: 0,
            positionY: 0,
            targetX: 0,
            targetY: tidalWaveLevel - 1,
            orientation
        });
        this.room.broadcast(types_1.Transfer.CLEAR_BOARD, {
            simulationId: this.id
        });
        const rowRange = isRed
            ? [...Array(this.board.rows).keys()]
            : [...Array(this.board.rows).keys()].reverse();
        for (const y of rowRange) {
            for (let x = 0; x < this.board.columns; x++) {
                const pokemonHit = this.board.getEntityOnCell(x, y);
                this.board.effects[y * this.board.columns + x] = undefined;
                if (pokemonHit) {
                    if (pokemonHit.team === team) {
                        pokemonHit.status.clearNegativeStatus();
                        if (pokemonHit.types.has(Synergy_1.Synergy.AQUATIC) || healAll) {
                            pokemonHit.handleHeal(tidalWaveLevel * 0.1 * pokemonHit.hp, pokemonHit, 0, false);
                        }
                    }
                    else {
                        pokemonHit.handleDamage({
                            damage: tidalWaveLevel * 0.05 * pokemonHit.hp,
                            board: this.board,
                            attackType: Game_1.AttackType.TRUE,
                            attacker: null,
                            shouldTargetGainMana: false
                        });
                        let newY = y;
                        if (isRed) {
                            while (newY > 0 &&
                                this.board.getEntityOnCell(x, newY - 1) === undefined) {
                                newY--;
                            }
                        }
                        else {
                            while (newY < this.board.rows - 1 &&
                                this.board.getEntityOnCell(x, newY + 1) === undefined) {
                                newY++;
                            }
                        }
                        if (newY !== y) {
                            pokemonHit.moveTo(x, newY, this.board);
                            pokemonHit.cooldown = 500;
                        }
                    }
                    if (pokemonHit.items.has(Item_1.Item.SURFBOARD)) {
                        const surf = abilities_1.AbilityStrategies[Ability_1.Ability.SURF];
                        surf.process(pokemonHit, this.board, pokemonHit, false, false, tidalWaveLevel);
                    }
                    if (pokemonHit.passive === Passive_1.Passive.PIKACHU_SURFER) {
                        pokemonHit.addPP(pokemonHit.maxPP, pokemonHit, 0, false);
                    }
                }
            }
        }
    }
}
exports.default = Simulation;
__decorate([
    (0, schema_1.type)("string")
], Simulation.prototype, "weather", void 0);
__decorate([
    (0, schema_1.type)("string")
], Simulation.prototype, "winnerId", void 0);
__decorate([
    (0, schema_1.type)({ map: pokemon_entity_1.PokemonEntity })
], Simulation.prototype, "blueTeam", void 0);
__decorate([
    (0, schema_1.type)({ map: pokemon_entity_1.PokemonEntity })
], Simulation.prototype, "redTeam", void 0);
__decorate([
    (0, schema_1.type)({ map: dps_1.default })
], Simulation.prototype, "blueDpsMeter", void 0);
__decorate([
    (0, schema_1.type)({ map: dps_1.default })
], Simulation.prototype, "redDpsMeter", void 0);
__decorate([
    (0, schema_1.type)("string")
], Simulation.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)("string")
], Simulation.prototype, "bluePlayerId", void 0);
__decorate([
    (0, schema_1.type)("string")
], Simulation.prototype, "redPlayerId", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], Simulation.prototype, "isGhostBattle", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], Simulation.prototype, "started", void 0);
//# sourceMappingURL=simulation.js.map