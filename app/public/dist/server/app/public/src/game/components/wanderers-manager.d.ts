import { Wanderer } from "../../../../types/enum/Wanderer";
import GameScene from "../scenes/game-scene";
import PokemonSprite from "./pokemon";
export default class WanderersManager {
    scene: GameScene;
    constructor(scene: GameScene);
    addWanderer(wanderer: Wanderer): void;
    addWanderingUnown(wanderer: Wanderer): void;
    addCatchableWanderer(wanderer: Wanderer): void;
    addSableye(wanderer: Wanderer): void;
    addWandererPokemonSprite({ wanderer, onClick }: {
        wanderer: Wanderer;
        onClick: (wanderer: Wanderer, pokemon: PokemonSprite, pointer: Phaser.Input.Pointer, tween: Phaser.Tweens.Tween) => void;
    }): PokemonSprite;
    displayShardGain(coordinates: number[], index: string): void;
}
