import Player from "../../models/colyseus-models/player";
import { Pokemon } from "../../models/colyseus-models/pokemon";
import GameRoom from "../../rooms/game-room";
import { Ability } from "../../types/enum/Ability";
import { EffectEnum } from "../../types/enum/Effect";
import { AttackType } from "../../types/enum/Game";
import { Item } from "../../types/enum/Item";
import { Passive } from "../../types/enum/Passive";
import Board from "../board";
import { PokemonEntity } from "../pokemon-entity";
type EffectOrigin = EffectEnum | Item | Passive | Ability;
export declare abstract class Effect {
    origin?: EffectOrigin;
    apply(...args: any[]): void;
    constructor(effect?: (...args: any[]) => void, origin?: EffectOrigin);
}
export declare class OnSpawnEffect extends Effect {
    constructor(effect?: (entity: PokemonEntity) => void);
    apply(entity: PokemonEntity): void;
}
export declare class OnItemGainedEffect extends Effect {
}
export declare class OnItemRemovedEffect extends Effect {
}
interface OnItemEquippedEffectArgs {
    pokemon: Pokemon;
    player: Player;
    item: Item;
    room: GameRoom;
}
export declare class OnItemEquippedEffect extends Effect {
    apply(args: OnItemEquippedEffectArgs): boolean;
    constructor(effect?: (args: OnItemEquippedEffectArgs) => boolean, origin?: EffectOrigin);
}
export declare class OnKillEffect extends Effect {
    apply(attacker: PokemonEntity, target: PokemonEntity, board: Board, attackType: AttackType): void;
    constructor(effect?: (entity: PokemonEntity, target: PokemonEntity, board: Board, attackType: AttackType) => void, origin?: EffectOrigin);
}
export declare class PeriodicEffect extends Effect {
    intervalMs: number;
    timer: number;
    count: number;
    constructor(effect: (entity: PokemonEntity, ...others: any[]) => void, origin: EffectOrigin, intervalMs: number);
    update(dt: number, entity: PokemonEntity): void;
}
interface OnHitEffectArgs {
    attacker: PokemonEntity;
    target: PokemonEntity;
    board: Board;
    totalTakenDamage: number;
    physicalDamage: number;
    specialDamage: number;
    trueDamage: number;
}
export declare class OnHitEffect extends Effect {
    apply(params: OnHitEffectArgs): void;
    constructor(effect?: (params: OnHitEffectArgs) => void, origin?: EffectOrigin);
}
interface OnAttackEffectArgs {
    pokemon: PokemonEntity;
    target: PokemonEntity | null;
    board: Board;
    physicalDamage: number;
    specialDamage: number;
    trueDamage: number;
    totalDamage: number;
    isTripleAttack?: boolean;
}
export declare class OnAttackEffect extends Effect {
    apply(args: OnAttackEffectArgs): void;
    constructor(effect?: (args: OnAttackEffectArgs) => void, origin?: EffectOrigin);
}
export declare class OnAbilityCastEffect extends Effect {
    apply(pokemon: PokemonEntity, board: Board, target: PokemonEntity, crit: boolean): void;
    constructor(effect?: (pokemon: PokemonEntity, board: Board, target: PokemonEntity, crit: boolean) => void, origin?: EffectOrigin);
}
export declare class OnDamageReceivedEffect extends Effect {
    apply(entity: PokemonEntity, attacker: PokemonEntity | null, board: Board, damage: number): void;
    constructor(effect?: (entity: PokemonEntity, attacker: PokemonEntity | null, board: Board, damage: number) => void, origin?: EffectOrigin);
}
export declare class OnMoveEffect extends Effect {
    apply(pokemon: PokemonEntity, board: Board, x: number, y: number): void;
    constructor(effect?: (pokemon: PokemonEntity, board: Board, x: number, y: number) => void, origin?: EffectOrigin);
}
export declare class MonsterKillEffect extends OnKillEffect {
    hpBoosted: number;
    count: number;
    synergyLevel: number;
    constructor(effect: EffectEnum);
    apply(pokemon: any, target: any, board: any, attackType: any): void;
}
export declare class GrowGroundEffect extends PeriodicEffect {
    synergyLevel: number;
    constructor(effect: EffectEnum);
}
export declare class ClearWingEffect extends PeriodicEffect {
    constructor();
}
export declare class SynchroEffect extends PeriodicEffect {
    constructor();
}
export declare class DrySkinEffect extends PeriodicEffect {
    constructor();
}
export declare class DarkHarvestEffect extends PeriodicEffect {
    duration: number;
    constructor(duration: number, pokemon: PokemonEntity);
}
export declare class FireHitEffect extends OnAttackEffect {
    count: number;
    synergyLevel: number;
    constructor(effect: EffectEnum);
    apply({ pokemon }: OnAttackEffectArgs): void;
}
export declare const electricTripleAttackEffect: OnAttackEffect;
export declare class SoundCryEffect extends OnAbilityCastEffect {
    count: number;
    synergyLevel: number;
    constructor(effect?: EffectEnum);
    apply(pokemon: any, board: any, target: any, crit: any): void;
}
export {};
