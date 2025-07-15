import { IPokemon, IPokemonEntity } from "../types";
export declare function chance(probability: number, pokemon?: IPokemonEntity | IPokemon, cap?: number): boolean;
export declare function randomWeighted<T extends string>(weights: {
    [item in T]?: number;
}, totalWeight?: number): T | null;
export declare function randomBetween(min: number, max: number): number;
export declare function pickRandomIn<T>(list: T[] | Record<string, T>): T;
export declare function pickNRandomIn<T>(array: T[], number: number): T[];
export declare function shuffleArray<T extends Array<unknown>>(array: T): T;
export declare function simpleHashSeededCoinFlip(seed: string): boolean;
