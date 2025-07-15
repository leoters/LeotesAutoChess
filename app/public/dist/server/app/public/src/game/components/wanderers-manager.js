"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = require("i18next");
const phaser_1 = require("phaser");
const pokemon_factory_1 = __importDefault(require("../../../../models/pokemon-factory"));
const types_1 = require("../../../../types");
const Game_1 = require("../../../../types/enum/Game");
const Wanderer_1 = require("../../../../types/enum/Wanderer");
const board_1 = require("../../../../utils/board");
const number_1 = require("../../../../utils/number");
const random_1 = require("../../../../utils/random");
const depths_1 = require("../depths");
const pokemon_1 = __importDefault(require("./pokemon"));
const SHARDS_PER_UNOWN_WANDERER = 50;
const DEFAULT_WANDERER_SPEED = 0.25;
class WanderersManager {
    constructor(scene) {
        this.scene = scene;
    }
    addWanderer(wanderer) {
        console.log(`Adding wanderer`, wanderer);
        if (wanderer.type === Wanderer_1.WandererType.SABLEYE) {
            this.addSableye(wanderer);
        }
        else if (wanderer.type === Wanderer_1.WandererType.UNOWN) {
            this.addWanderingUnown(wanderer);
        }
        else if (wanderer.type === Wanderer_1.WandererType.CATCHABLE) {
            this.addCatchableWanderer(wanderer);
        }
    }
    addWanderingUnown(wanderer) {
        this.addWandererPokemonSprite({
            wanderer,
            onClick: (wanderer, unownSprite, pointer, tween) => {
                var _a;
                (_a = this.scene.room) === null || _a === void 0 ? void 0 : _a.send(types_1.Transfer.WANDERER_CAUGHT, { id: wanderer.id });
                this.displayShardGain([pointer.x, pointer.y], unownSprite.index);
                unownSprite.destroy();
                tween.destroy();
            }
        });
    }
    addCatchableWanderer(wanderer) {
        this.addWandererPokemonSprite({
            wanderer,
            onClick: (wanderer, sprite, pointer, tween) => {
                var _a;
                if (this.scene.board &&
                    (0, board_1.getFreeSpaceOnBench)(this.scene.board.player.board) > 0) {
                    console.log(`clicked wanderer`, wanderer);
                    (_a = this.scene.room) === null || _a === void 0 ? void 0 : _a.send(types_1.Transfer.WANDERER_CAUGHT, { id: wanderer.id });
                    sprite.destroy();
                    tween.destroy();
                }
                else if (this.scene.board) {
                    this.scene.board.displayText(pointer.x, pointer.y, (0, i18next_1.t)("full"));
                }
            }
        });
    }
    addSableye(wanderer) {
        this.addWandererPokemonSprite({
            wanderer,
            onClick: (wanderer, sprite, pointer) => {
                var _a, _b;
                this.scene.displayMoneyGain(sprite.x, sprite.y, 1);
                (_a = this.scene.room) === null || _a === void 0 ? void 0 : _a.send(types_1.Transfer.WANDERER_CAUGHT, { id: wanderer.id });
                (_b = this.scene.animationManager) === null || _b === void 0 ? void 0 : _b.animatePokemon(sprite, Game_1.PokemonActionState.HURT, false);
                this.scene.add.tween({
                    targets: [sprite],
                    ease: "linear",
                    duration: 1000,
                    alpha: 0,
                    onComplete: () => {
                        sprite.destroy();
                    }
                });
            }
        });
    }
    addWandererPokemonSprite({ wanderer, onClick }) {
        var _a;
        let startX = -100, startY = 350, endX = window.innerWidth + 100, endY = 350;
        let duration = (0, number_1.clamp)(window.innerWidth / DEFAULT_WANDERER_SPEED, 4000, 6000);
        let clicked = false;
        const tweens = [];
        switch (wanderer.behavior) {
            case Wanderer_1.WandererBehavior.STEAL_ITEM:
                startX = -100;
                startY = 700;
                endX = 484;
                endY = 686;
                duration = 6000;
                break;
            case Wanderer_1.WandererBehavior.SPECTATE: {
                startX = -100;
                startY = 100 + Math.round(Math.random() * 500);
                endX = 580;
                endY = 300 + Math.round(Math.random() * 200);
                duration = 4000;
                break;
            }
            case Wanderer_1.WandererBehavior.RUN_THROUGH:
            default: {
                const fromLeft = (0, random_1.chance)(1 / 2);
                startX = (fromLeft ? -100 : +window.innerWidth + 100);
                startY = 100 + Math.round(Math.random() * 500);
                endX = (fromLeft ? +window.innerWidth + 100 : -100);
                endY = 100 + Math.round(Math.random() * 500);
                break;
            }
        }
        const sprite = new pokemon_1.default(this.scene, startX, startY, pokemon_factory_1.default.createPokemonFromName(wanderer.pkm), "wanderer", false, false);
        sprite.orientation = startX < endX ? Game_1.Orientation.RIGHT : Game_1.Orientation.LEFT;
        (_a = this.scene.animationManager) === null || _a === void 0 ? void 0 : _a.animatePokemon(sprite, Game_1.PokemonActionState.WALK, false);
        const tween = this.scene.tweens.add({
            targets: sprite,
            x: endX,
            y: endY,
            ease: "Linear",
            duration,
            onComplete: () => {
                var _a, _b;
                if (wanderer.behavior === Wanderer_1.WandererBehavior.STEAL_ITEM) {
                    if (!clicked) {
                        sprite.orientation = Game_1.Orientation.LEFT;
                        (_a = this.scene.animationManager) === null || _a === void 0 ? void 0 : _a.animatePokemon(sprite, Game_1.PokemonActionState.WALK, false);
                        tweens.push(this.scene.add.tween({
                            targets: [sprite],
                            ease: "linear",
                            duration: 2000,
                            x: -100,
                            y: 700,
                            onComplete: () => {
                                sprite.destroy();
                            }
                        }));
                    }
                }
                else if (wanderer.behavior === Wanderer_1.WandererBehavior.SPECTATE) {
                    (_b = this.scene.animationManager) === null || _b === void 0 ? void 0 : _b.animatePokemon(sprite, Game_1.PokemonActionState.IDLE, false);
                    tweens.push(this.scene.add.tween({
                        targets: [sprite],
                        ease: "linear",
                        duration: 5000,
                        delay: 5000,
                        x: startX,
                        y: startY,
                        onComplete: () => {
                            sprite.destroy();
                        },
                        onStart: () => {
                            var _a;
                            sprite.orientation = Game_1.Orientation.LEFT;
                            (_a = this.scene.animationManager) === null || _a === void 0 ? void 0 : _a.animatePokemon(sprite, Game_1.PokemonActionState.WALK, false);
                        }
                    }));
                }
                else {
                    sprite.destroy();
                }
            }
        });
        tweens.push(tween);
        sprite.draggable = false;
        sprite.sprite.setInteractive();
        sprite.sprite.on("pointerdown", (pointer) => {
            if (clicked)
                return;
            clicked = true;
            tweens.forEach((tween) => tween.destroy());
            onClick(wanderer, sprite, pointer, tween);
        });
        return sprite;
    }
    displayShardGain(coordinates, index) {
        const textStyle = {
            fontSize: "25px",
            fontFamily: "Verdana",
            color: "#fff",
            align: "center",
            strokeThickness: 2,
            stroke: "#000"
        };
        const image = this.scene.add.existing(new phaser_1.GameObjects.Image(this.scene, 0, 0, `portrait-${index}`)
            .setScale(0.5, 0.5)
            .setOrigin(0, 0));
        const text = this.scene.add.existing(new phaser_1.GameObjects.Text(this.scene, 25, 0, SHARDS_PER_UNOWN_WANDERER.toString(), textStyle));
        image.setDepth(depths_1.DEPTH.TEXT_MINOR);
        text.setDepth(depths_1.DEPTH.TEXT);
        const container = this.scene.add.existing(new phaser_1.GameObjects.Container(this.scene, coordinates[0], coordinates[1] - 50, [text, image]));
        this.scene.add.tween({
            targets: [container],
            ease: "linear",
            duration: 1500,
            delay: 0,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },
            y: {
                getStart: () => coordinates[1] - 50,
                getEnd: () => coordinates[1] - 110
            },
            onComplete: () => {
                container.destroy();
            }
        });
    }
}
exports.default = WanderersManager;
//# sourceMappingURL=wanderers-manager.js.map