import Player from "../models/colyseus-models/player";
import { IPokemonEntity } from "../types";
import { AttackType } from "../types/enum/Game";
import Board, { Cell } from "./board";
import { PokemonEntity } from "./pokemon-entity";
export default abstract class PokemonState {
    name: string;
    attack(pokemon: PokemonEntity, board: Board, target: PokemonEntity | null, isTripleAttack?: boolean): void;
    handleHeal(pokemon: PokemonEntity, heal: number, caster: PokemonEntity, apBoost: number, crit: boolean): void;
    addShield(pokemon: IPokemonEntity, shield: number, caster: IPokemonEntity, apBoost: number, crit: boolean): void;
    handleDamage({ target: pokemon, damage, board, attackType, attacker, shouldTargetGainMana }: {
        target: PokemonEntity;
        damage: number;
        board: Board;
        attackType: AttackType;
        attacker: PokemonEntity | null;
        shouldTargetGainMana: boolean;
    }): {
        death: boolean;
        takenDamage: number;
    };
    updateCommands(pokemon: PokemonEntity, dt: number): void;
    update(pokemon: PokemonEntity, dt: number, board: Board, player: Player | undefined): void;
    updateEachSecond(pokemon: PokemonEntity, board: Board): void;
    onEnter(pokemon: PokemonEntity): void;
    onExit(pokemon: PokemonEntity): void;
    getTargetsAtRange(pokemon: PokemonEntity, board: Board): PokemonEntity[];
    getNearestTargetAtRange(pokemon: PokemonEntity, board: Board): PokemonEntity | undefined;
    getNearestTargetAtSight(pokemon: PokemonEntity, board: Board): {
        x: number;
        y: number;
        target: PokemonEntity;
    } | null;
    getFarthestTarget(pokemon: PokemonEntity, board: Board, targettableBy?: PokemonEntity): PokemonEntity | undefined;
    getNearestAllies(pokemon: PokemonEntity, board: Board): PokemonEntity[];
    getMostSurroundedCoordinateAvailablePlace(pokemon: PokemonEntity, board: Board): {
        x: number;
        y: number;
    } | undefined;
    getNearestAvailablePlaceCoordinates(pokemon: PokemonEntity, board: Board, maxRange?: number | undefined): Cell | null;
    getTargetWhenConfused(pokemon: PokemonEntity, board: Board): PokemonEntity | undefined;
}
