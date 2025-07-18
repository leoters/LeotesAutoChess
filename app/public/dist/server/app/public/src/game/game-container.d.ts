import { Room } from "colyseus.js";
import Phaser from "phaser";
import { PokemonEntity } from "../../../core/pokemon-entity";
import Simulation from "../../../core/simulation";
import Player from "../../../models/colyseus-models/player";
import GameState from "../../../rooms/states/game-state";
import { IDragDropCombineMessage, IDragDropItemMessage, IDragDropMessage, IPlayer, IPokemon } from "../../../types";
import { Ability } from "../../../types/enum/Ability";
import { AttackType, HealType, Orientation } from "../../../types/enum/Game";
import { Weather } from "../../../types/enum/Weather";
import GameScene from "./scenes/game-scene";
declare class GameContainer {
    room: Room<GameState>;
    div: HTMLDivElement;
    game: Phaser.Game | undefined;
    player: Player | undefined;
    simulation: Simulation | undefined;
    uid: string;
    spectate: boolean;
    constructor(div: HTMLDivElement, uid: string, room: Room<GameState>);
    resetSimulation(): void;
    initializeSimulation(simulation: Simulation): void;
    initializePokemon(pokemon: PokemonEntity, simulation: Simulation): void;
    initializeGame(): void;
    resize(): void;
    initializeEvents(): void;
    initializePlayer(player: Player): void;
    initializeSpectactor(uid: string): void;
    get gameScene(): GameScene | undefined;
    get spectatedPlayerId(): string;
    get simulationId(): string;
    handleWeatherChange(simulation: Simulation, value: Weather): void;
    handleDisplayHeal(message: {
        type: HealType;
        id: string;
        x: number;
        y: number;
        index: string;
        amount: number;
    }): void;
    handleDisplayDamage(message: {
        type: AttackType;
        id: string;
        x: number;
        y: number;
        index: string;
        amount: number;
    }): void;
    handleDisplayAbility(message: {
        id: string;
        skill: Ability;
        orientation: Orientation;
        positionX: number;
        positionY: number;
        targetX?: number;
        targetY?: number;
        delay?: number;
    }): void;
    handleBoardPokemonAdd(player: IPlayer, pokemon: IPokemon): void;
    handleDragDropFailed(message: {
        updateBoard: boolean;
        updateItems: boolean;
        text?: string;
        pokemonId?: string;
    }): void;
    setPlayer(player: Player): void;
    setSimulation(simulation: Simulation): void;
    onDragDrop(event: CustomEvent<IDragDropMessage>): void;
    onDragDropCombine(event: CustomEvent<IDragDropCombineMessage>): void;
    onDragDropItem(event: CustomEvent<IDragDropItemMessage>): void;
}
export default GameContainer;
