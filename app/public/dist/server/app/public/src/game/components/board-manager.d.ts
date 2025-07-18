import type { NonFunctionPropNames } from "../../../../types/HelperTypes";
import Player from "../../../../models/colyseus-models/player";
import GameState from "../../../../rooms/states/game-state";
import { IPokemon } from "../../../../types";
import { GameMode } from "../../../../types/enum/Game";
import { SpecialGameRule } from "../../../../types/enum/SpecialGameRule";
import AnimationManager from "../animation-manager";
import GameScene from "../scenes/game-scene";
import PokemonSprite from "./pokemon";
import PokemonAvatar from "./pokemon-avatar";
import { Item } from "../../../../types/enum/Item";
import { Portal } from "./portal";
import { PVEStage } from "../../../../models/pve-stages";
export declare enum BoardMode {
    PICK = "pick",
    BATTLE = "battle",
    TOWN = "town"
}
export default class BoardManager {
    pokemons: Map<string, PokemonSprite>;
    uid: string;
    scene: GameScene;
    state: GameState;
    player: Player;
    gameMode: GameMode;
    mode: BoardMode;
    animationManager: AnimationManager;
    playerAvatar: PokemonAvatar | null;
    opponentAvatar: PokemonAvatar | null;
    scoutingAvatars: PokemonAvatar[];
    pveChestGroup: Phaser.GameObjects.Group | null;
    pveChest: Phaser.GameObjects.Sprite | null;
    lightX: number;
    lightY: number;
    lightCell: Phaser.GameObjects.Sprite | null;
    berryTrees: Phaser.GameObjects.Sprite[];
    portal: Portal | undefined;
    smeargle: PokemonSprite | null;
    specialGameRule: SpecialGameRule | null;
    constructor(scene: GameScene, player: Player, animationManager: AnimationManager, uid: string, state: GameState);
    victoryAnimation(winnerId: string): void;
    addPokemonSprite(pokemon: IPokemon): PokemonSprite;
    removePokemon(pokemonToRemove: IPokemon): void;
    renderBoard(phaseChanged: boolean): void;
    showLightCell(): void;
    hideLightCell(): void;
    showBerryTrees(): void;
    hideBerryTrees(): void;
    displayText(x: number, y: number, label: string): void;
    updatePlayerAvatar(): void;
    updateOpponentAvatar(opponentId: string | null, opponentAvatarString: string | null): void;
    updateScoutingAvatars(resetAll?: boolean): void;
    updateAvatarLife(playerId: string, value: number): void;
    battleMode(phaseChanged: boolean): void;
    removePokemonsOnBoard(includingBench?: boolean): void;
    pickMode(): void;
    minigameMode(): void;
    setPlayer(player: Player): void;
    updatePokemonItems(playerId: string, pokemon: IPokemon, item: Item): void;
    changePokemon<F extends NonFunctionPropNames<IPokemon>>(pokemon: IPokemon, field: F, value: IPokemon[F], previousValue: IPokemon[F]): void;
    closeTooltips(): void;
    getBenchSize(): number;
    showEmote(playerId: string, emote?: string): void;
    addSmeargle(): void;
    addPvePokemons(pveStage: PVEStage, immediately: boolean): void;
    addPortal(): void;
    portalTransition(isRedPlayer: boolean): void;
}
