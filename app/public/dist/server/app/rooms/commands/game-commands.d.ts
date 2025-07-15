import { Command } from "@colyseus/command";
import { Client } from "colyseus";
import Player from "../../models/colyseus-models/player";
import { Pokemon } from "../../models/colyseus-models/pokemon";
import { IClient, IDragDropCombineMessage, IDragDropItemMessage, IDragDropMessage } from "../../types";
import { SpecialGameRule } from "../../types/enum/SpecialGameRule";
import GameRoom from "../game-room";
export declare class OnBuyPokemonCommand extends Command<GameRoom, {
    playerId: string;
    index: number;
}> {
    execute({ playerId, index }: {
        playerId: any;
        index: any;
    }): void;
}
export declare class OnRemoveFromShopCommand extends Command<GameRoom, {
    playerId: string;
    index: number;
}> {
    execute({ playerId, index }: {
        playerId: any;
        index: any;
    }): void;
}
export declare class OnPokemonCatchCommand extends Command<GameRoom, {
    client: Client;
    playerId: string;
    id: string;
}> {
    execute({ client, playerId, id }: {
        client: any;
        playerId: any;
        id: any;
    }): Promise<void>;
}
export declare class OnDragDropPokemonCommand extends Command<GameRoom, {
    client: IClient;
    detail: IDragDropMessage;
}> {
    execute({ client, detail }: {
        client: any;
        detail: any;
    }): never[] | undefined;
    swapPokemonPositions(player: Player, pokemon: Pokemon, x: number, y: number): void;
}
export declare class OnSwitchBenchAndBoardCommand extends Command<GameRoom, {
    client: Client;
    pokemonId: string;
}> {
    execute({ client, pokemonId }: {
        client: any;
        pokemonId: any;
    }): void;
}
export declare class OnDragDropCombineCommand extends Command<GameRoom, {
    client: Client;
    detail: IDragDropCombineMessage;
}> {
    execute({ client, detail }: {
        client: any;
        detail: any;
    }): void;
}
export declare class OnDragDropItemCommand extends Command<GameRoom, {
    client: Client;
    detail: IDragDropItemMessage;
}> {
    execute({ client, detail }: {
        client: any;
        detail: any;
    }): void;
}
export declare class OnSellPokemonCommand extends Command<GameRoom, {
    client: Client;
    pokemonId: string;
}> {
    execute({ client, pokemonId }: {
        client: any;
        pokemonId: any;
    }): void;
}
export declare class OnShopRerollCommand extends Command<GameRoom, string> {
    execute(id: any): void;
}
export declare class OnLockCommand extends Command<GameRoom, string> {
    execute(id: any): void;
}
export declare class OnSpectateCommand extends Command<GameRoom, {
    id: string;
    spectatedPlayerId: string;
}> {
    execute({ id, spectatedPlayerId }: {
        id: any;
        spectatedPlayerId: any;
    }): void;
}
export declare class OnLevelUpCommand extends Command<GameRoom, {
    id: string;
}> {
    execute(id: any): void;
}
export declare class OnPickBerryCommand extends Command<GameRoom, {
    playerId: string;
    berryIndex: number;
}> {
    execute({ playerId, berryIndex }: {
        playerId: any;
        berryIndex: any;
    }): void;
}
export declare class OnJoinCommand extends Command<GameRoom, {
    client: Client;
}> {
    execute({ client }: {
        client: any;
    }): Promise<void>;
}
export declare class OnUpdateCommand extends Command<GameRoom, {
    deltaTime: number;
}> {
    execute({ deltaTime }: {
        deltaTime: any;
    }): OnUpdatePhaseCommand[] | undefined;
}
export declare class OnUpdatePhaseCommand extends Command<GameRoom> {
    execute(): void;
    computeAchievements(): void;
    checkSuccess(player: Player): void;
    checkEndGame(): boolean;
    computeStreak(isPVE: boolean): void;
    computeIncome(isPVE: boolean, specialGameRule: SpecialGameRule | null): void;
    checkDeath(): void;
    initializePickingPhase(): Command<import("colyseus").Room<any, any>, unknown>[];
    checkForLazyTeam(): void;
    stopPickingPhase(): void;
    stopFightingPhase(): void;
    initializeTownPhase(): void;
    initializeFightingPhase(): void;
    spawnWanderingPokemons(): void;
    spawnBabyEggs(player: Player, isPVE: boolean): void;
}
