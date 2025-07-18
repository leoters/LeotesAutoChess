import GameState from "../rooms/states/game-state";
import { IPokemon, IPokemonEntity } from "../types";
import { Rarity } from "../types/enum/Game";
import { FishingRod } from "../types/enum/Item";
import { Pkm, PkmProposition } from "../types/enum/Pokemon";
import { SpecialGameRule } from "../types/enum/SpecialGameRule";
import { Synergy } from "../types/enum/Synergy";
import Player from "./colyseus-models/player";
export declare function getPoolSize(rarity: Rarity, maxStars: number): number;
export declare function getRegularsTier1(pokemons: Pkm[]): Pkm[];
export declare function getAdditionalsTier1(pokemons: Pkm[]): Pkm[];
export declare function getSellPrice(pokemon: IPokemon | IPokemonEntity, specialGameRule?: SpecialGameRule | null, ignoreRareCandy?: boolean): number;
export declare function getBuyPrice(name: Pkm, specialGameRule?: SpecialGameRule | null): number;
export default class Shop {
    commonPool: Pkm[];
    uncommonPool: Pkm[];
    rarePool: Pkm[];
    epicPool: Pkm[];
    ultraPool: Pkm[];
    constructor();
    getPool(rarity: Rarity): Pkm[] | undefined;
    getRegionalPool(rarity: Rarity, player: Player): Pkm[] | undefined;
    addAdditionalPokemon(pkmProposition: PkmProposition): void;
    addRegionalPokemon(pkm: Pkm, player: Player): void;
    resetRegionalPool(player: Player): void;
    releasePokemon(pkm: Pkm, player: Player, state: GameState): void;
    refillShop(player: Player, state: GameState): void;
    assignShop(player: Player, manualRefresh: boolean, state: GameState): void;
    assignUniquePropositions(player: Player, stageLevel: number, portalSynergies: Synergy[]): void;
    getRandomPokemonFromPool(rarity: Rarity, player: Player, finals?: Set<Pkm>, specificTypesWanted?: Synergy[]): Pkm;
    pickPokemon(player: Player, state: GameState, shopIndex?: number, noSpecial?: boolean): Pkm;
    pickSpecialPokemon(rarity: Rarity): Pkm;
    pickFish(player: Player, rod: FishingRod): Pkm;
    magnetPull(meltan: IPokemonEntity, player: Player): Pkm;
}
