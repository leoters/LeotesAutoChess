import { IPokemonEntity } from "../types";
import { BoardEffect, EffectEnum } from "../types/enum/Effect";
import { Orientation, Team } from "../types/enum/Game";
import { PokemonEntity } from "./pokemon-entity";
import Simulation from "./simulation";
export type Cell = {
    x: number;
    y: number;
    value: PokemonEntity | undefined;
};
export default class Board {
    rows: number;
    columns: number;
    cells: Array<PokemonEntity | undefined>;
    effects: Array<EffectEnum | undefined>;
    constructor(rows: number, colums: number);
    getEntityOnCell(x: number, y: number): PokemonEntity | undefined;
    setEntityOnCell(x: number, y: number, entity: PokemonEntity | undefined): void;
    moveEntity(x0: number, y0: number, x1: number, y1: number): void;
    swapCells(x0: number, y0: number, x1: number, y1: number): void;
    forEach(callback: (x: number, y: number, tg: PokemonEntity | undefined) => void): void;
    find(predicate: (x: number, y: number, entity: PokemonEntity) => boolean): PokemonEntity | null;
    orientation(x0: number, y0: number, x1: number, y1: number, pokemon: IPokemonEntity, target: IPokemonEntity | undefined): Orientation;
    getAdjacentCells(cellX: number, cellY: number, includesCenter?: boolean): Cell[];
    getOuterRangeCells(cellX: number, cellY: number, range?: number, includesCenter?: boolean): Cell[];
    getCellsInFront(pokemon: PokemonEntity, target: PokemonEntity, range?: number): Cell[];
    getCellsInRange(cellX: number, cellY: number, range: number): Cell[];
    getCellsInRadius(cellX: number, cellY: number, radius: number): Cell[];
    getAllPokemonCoordinates(): {
        x: number;
        y: number;
    }[];
    getCellsBetween(x0: number, y0: number, x1: number, y1: number): Cell[];
    getTeleportationCell(x: number, y: number, boardSide: Team): Cell | undefined;
    getFlyAwayCell(x: number, y: number): Cell | null;
    getClosestAvailablePlace(targetX: number, targetY: number): {
        x: number;
        y: number;
        distance: number;
    } | null;
    getFarthestTargetCoordinateAvailablePlace(pokemon: IPokemonEntity, targetAlly?: boolean): {
        x: number;
        y: number;
        distance: number;
        target: PokemonEntity;
    } | undefined;
    addBoardEffect(x: number, y: number, effect: BoardEffect, simulation: Simulation): void;
    clearBoardEffect(x: number, y: number, simulation: Simulation): void;
    getKnockBackPlace(x: number, y: number, knockBackOrientation: Orientation): {
        x: number;
        y: number;
    } | null;
}
