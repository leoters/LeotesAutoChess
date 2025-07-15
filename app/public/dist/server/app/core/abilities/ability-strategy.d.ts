import Board from "../board";
import { PokemonEntity } from "../pokemon-entity";
export declare class AbilityStrategy {
    copyable: boolean;
    canCritByDefault: boolean;
    process(pokemon: PokemonEntity, board: Board, target: PokemonEntity, crit: boolean, preventDefaultAnim?: boolean): void;
}
