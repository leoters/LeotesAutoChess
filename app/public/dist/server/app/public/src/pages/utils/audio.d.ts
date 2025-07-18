import { type Scene } from "phaser";
import { DungeonMusic } from "../../../../types/enum/Dungeon";
export declare const SOUNDS: {
    readonly BUTTON_CLICK: "buttonclick.ogg";
    readonly BUTTON_HOVER: "buttonhover.ogg";
    readonly CAROUSEL_UNLOCK: "carouselunlock.ogg";
    readonly EVOLUTION_T2: "evolutiont2.ogg";
    readonly EVOLUTION_T3: "evolutiont3.ogg";
    readonly FINISH1: "finish1.ogg";
    readonly FINISH2: "finish2.ogg";
    readonly FINISH3: "finish3.ogg";
    readonly FINISH4: "finish4.ogg";
    readonly FINISH5: "finish5.ogg";
    readonly FINISH6: "finish6.ogg";
    readonly FINISH7: "finish7.ogg";
    readonly FINISH8: "finish8.ogg";
    readonly JOIN_ROOM: "joinroom.ogg";
    readonly LEAVE_ROOM: "leaveroom.ogg";
    readonly REFRESH: "refresh.ogg";
    readonly SET_READY: "setready.ogg";
    readonly START_GAME: "startgame.ogg";
};
type Soundkey = (typeof SOUNDS)[keyof typeof SOUNDS];
export declare function preloadSounds(): void;
export declare function preloadMusic(scene: Scene, dungeonMusic: DungeonMusic): void;
export declare function playSound(key: Soundkey, volume?: number): void;
interface SceneWithMusic extends Phaser.Scene {
    music?: Phaser.Sound.WebAudioSound;
}
export declare function playMusic(scene: SceneWithMusic, name: string): void;
export {};
