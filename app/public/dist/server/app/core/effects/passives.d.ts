import { Passive } from "../../types/enum/Passive";
import Board from "../board";
import { PokemonEntity } from "../pokemon-entity";
import { Effect, OnAbilityCastEffect, OnMoveEffect } from "./effect";
export declare function drumBeat(pokemon: PokemonEntity, board: Board): void;
export declare function stenchJump(pokemon: PokemonEntity, board: Board, x: number, y: number): void;
export declare function partingShot(pokemon: PokemonEntity, target: PokemonEntity, x: number, y: number): void;
export declare const WaterSpringEffect: OnAbilityCastEffect;
export declare const SlowStartEffect: OnAbilityCastEffect;
export declare class AccelerationEffect extends OnMoveEffect {
    accelerationStacks: number;
    constructor();
}
export declare const PassiveEffects: Partial<Record<Passive, (Effect | (() => Effect))[]>>;
