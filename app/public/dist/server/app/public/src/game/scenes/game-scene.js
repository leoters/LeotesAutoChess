"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("firebase/compat/app"));
const phaser_1 = require("phaser");
const pokemon_entity_1 = require("../../../../core/pokemon-entity");
const pokemon_1 = require("../../../../models/colyseus-models/pokemon");
const types_1 = require("../../../../types");
const Dungeon_1 = require("../../../../types/enum/Dungeon");
const Game_1 = require("../../../../types/enum/Game");
const Item_1 = require("../../../../types/enum/Item");
const function_1 = require("../../../../utils/function");
const logger_1 = require("../../../../utils/logger");
const schemas_1 = require("../../../../utils/schemas");
const window_1 = require("../../../../utils/window");
const audio_1 = require("../../pages/utils/audio");
const utils_1 = require("../../pages/utils/utils");
const preferences_1 = require("../../preferences");
const animation_manager_1 = __importDefault(require("../animation-manager"));
const battle_manager_1 = __importDefault(require("../components/battle-manager"));
const board_manager_1 = __importDefault(require("../components/board-manager"));
const item_container_1 = __importDefault(require("../components/item-container"));
const items_container_1 = __importDefault(require("../components/items-container"));
const loading_manager_1 = __importDefault(require("../components/loading-manager"));
const minigame_manager_1 = __importDefault(require("../components/minigame-manager"));
const pokemon_2 = __importDefault(require("../components/pokemon"));
const sell_zone_1 = require("../components/sell-zone");
const wanderers_manager_1 = __importDefault(require("../components/wanderers-manager"));
const weather_manager_1 = __importDefault(require("../components/weather-manager"));
const depths_1 = require("../depths");
const number_1 = require("../../../../utils/number");
class GameScene extends phaser_1.Scene {
    constructor() {
        super({
            key: "gameScene",
            active: false
        });
        this.tilemaps = new Map();
        this.pokemonHovered = null;
        this.pokemonDragged = null;
        this.shopIndexHovered = null;
        this.itemDragged = null;
        this.dropSpots = [];
        this.zones = [];
        this.lastPokemonDetail = null;
        this.minigameManager = null;
        this.loadingManager = null;
        this.started = false;
        this.spectate = false;
    }
    init(data) {
        var _a;
        this.tilemaps = new Map();
        this.room = data.room;
        this.spectate = data.spectate;
        this.uid = (_a = app_1.default.auth().currentUser) === null || _a === void 0 ? void 0 : _a.uid;
        this.started = false;
    }
    preload() {
        this.loadingManager = new loading_manager_1.default(this);
        this.load.on("progress", (value) => {
            var _a;
            (_a = this.room) === null || _a === void 0 ? void 0 : _a.send(types_1.Transfer.LOADING_PROGRESS, value * 100);
        });
        this.load.on("complete", () => {
            var _a;
            (_a = this.room) === null || _a === void 0 ? void 0 : _a.send(types_1.Transfer.LOADING_COMPLETE);
        });
        this.room.onMessage(types_1.Transfer.LOADING_COMPLETE, () => {
            if (!this.started) {
                this.started = true;
                this.startGame();
            }
        });
    }
    startGame() {
        var _a, _b;
        if (this.uid && this.room) {
            this.registerKeys();
            this.setupCamera();
            this.input.dragDistanceThreshold = 1;
            const playerUids = (0, schemas_1.values)(this.room.state.players).map((p) => p.id);
            const player = this.room.state.players.get(this.spectate ? playerUids[0] : this.uid);
            this.setMap(player.map);
            this.setupMouseEvents();
            this.battleGroup = this.add.group();
            this.animationManager = new animation_manager_1.default(this);
            this.minigameManager = new minigame_manager_1.default(this, this.animationManager, this.uid, this.room.state.avatars, this.room.state.floatingItems);
            this.itemsContainer = new items_container_1.default(this, player.items, 22 * 24 + 10, 5 * 24 + 10, null, this.uid);
            this.board = new board_manager_1.default(this, player, this.animationManager, this.uid, this.room.state);
            this.battle = new battle_manager_1.default(this, this.battleGroup, this.room.state.simulations.get(player.simulationId), this.animationManager, player);
            this.weatherManager = new weather_manager_1.default(this);
            (_a = this.weatherManager) === null || _a === void 0 ? void 0 : _a.setTownDaytime(0);
            this.wandererManager = new wanderers_manager_1.default(this);
            if (!this.music) {
                (0, audio_1.playMusic)(this, (_b = Dungeon_1.DungeonDetails[player.map].music) !== null && _b !== void 0 ? _b : Dungeon_1.DungeonMusic.TREASURE_TOWN);
            }
            (0, window_1.clearTitleNotificationIcon)();
        }
    }
    update(time, delta) {
        var _a, _b;
        super.update(time, delta);
        if (this.lastPokemonDetail) {
            this.lastPokemonDetail.updateTooltipPosition();
        }
        if (((_b = (_a = this.room) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.phase) === Game_1.GamePhaseState.TOWN &&
            this.minigameManager) {
            this.minigameManager.update();
        }
    }
    setupCamera() {
        var _a, _b, _c, _d;
        this.cameras.main.setBounds(0, 0, ((_b = (_a = this.map) === null || _a === void 0 ? void 0 : _a.widthInPixels) !== null && _b !== void 0 ? _b : 1200) * 2, ((_d = (_c = this.map) === null || _c === void 0 ? void 0 : _c.heightInPixels) !== null && _d !== void 0 ? _d : 768) * 2);
        this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.cameras.main.zoom = (0, number_1.clamp)(this.cameras.main.zoom - Math.sign(deltaY) * 0.1, 1, 2);
            if (deltaY < 0) {
                this.cameras.main.pan(pointer.worldX, pointer.worldY, 400, "Power2");
            }
            else if (this.cameras.main.zoom === 1) {
                this.cameras.main.pan(0, 0, 400, "Power2");
            }
        });
        this.input.on("pointermove", (pointer) => {
            if (!pointer.isDown || this.itemDragged || this.pokemonDragged)
                return;
            const cam = this.cameras.main;
            if (cam.zoom === 1)
                return;
            cam.scrollX -= (pointer.x - pointer.prevPosition.x) / cam.zoom;
            cam.scrollY -= (pointer.y - pointer.prevPosition.y) / cam.zoom;
        });
    }
    registerKeys() {
        const keybindings = (0, preferences_1.preference)("keybindings");
        this.input.keyboard.removeAllListeners();
        this.input.keyboard.on("keydown-" + keybindings.refresh, (0, function_1.throttle)(() => {
            (0, audio_1.playSound)(audio_1.SOUNDS.REFRESH, 0.5);
            this.refreshShop();
        }, 300));
        this.input.keyboard.on("keydown-" + keybindings.lock, () => {
            var _a;
            (_a = this.room) === null || _a === void 0 ? void 0 : _a.send(types_1.Transfer.LOCK);
        });
        this.input.keyboard.on("keydown-" + keybindings.buy_xp, () => {
            this.buyExperience();
        });
        this.input.keyboard.on("keydown-" + keybindings.sell, (e) => {
            if (this.pokemonDragged != null)
                return;
            if (this.shopIndexHovered !== null) {
                this.removeFromShop(this.shopIndexHovered);
                this.shopIndexHovered = null;
            }
            else if (this.pokemonHovered &&
                this.pokemonHovered
                    .getBounds()
                    .contains(this.game.input.activePointer.x, this.game.input.activePointer.y)) {
                this.sellPokemon(this.pokemonHovered);
                this.pokemonHovered = null;
            }
        });
        this.input.keyboard.on("keydown-" + keybindings.switch, () => {
            if (this.pokemonHovered) {
                this.switchBetweenBenchAndBoard(this.pokemonHovered);
            }
        });
    }
    refreshShop() {
        var _a, _b, _c, _d, _e;
        const player = (_a = this.room) === null || _a === void 0 ? void 0 : _a.state.players.get(this.uid);
        const rollCost = ((_b = player === null || player === void 0 ? void 0 : player.shopFreeRolls) !== null && _b !== void 0 ? _b : 0) > 0 ? 0 : 1;
        const canRoll = ((_c = player === null || player === void 0 ? void 0 : player.money) !== null && _c !== void 0 ? _c : 0) >= rollCost;
        if (player && player.alive && canRoll && player === ((_d = this.board) === null || _d === void 0 ? void 0 : _d.player)) {
            (_e = this.room) === null || _e === void 0 ? void 0 : _e.send(types_1.Transfer.REFRESH);
            (0, audio_1.playSound)(audio_1.SOUNDS.REFRESH, 0.5);
        }
    }
    buyExperience() {
        var _a;
        (_a = this.room) === null || _a === void 0 ? void 0 : _a.send(types_1.Transfer.LEVEL_UP);
    }
    sellPokemon(pokemon) {
        var _a;
        if (!pokemon)
            return;
        (_a = this.room) === null || _a === void 0 ? void 0 : _a.send(types_1.Transfer.SELL_POKEMON, pokemon.id);
    }
    removeFromShop(index) {
        var _a;
        (_a = this.room) === null || _a === void 0 ? void 0 : _a.send(types_1.Transfer.REMOVE_FROM_SHOP, index);
    }
    switchBetweenBenchAndBoard(pokemon) {
        var _a;
        if (!pokemon)
            return;
        (_a = this.room) === null || _a === void 0 ? void 0 : _a.send(types_1.Transfer.SWITCH_BENCH_AND_BOARD, pokemon.id);
    }
    updatePhase(newPhase, previousPhase) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        (_a = this.weatherManager) === null || _a === void 0 ? void 0 : _a.clearWeather();
        this.resetDragState();
        if (previousPhase === Game_1.GamePhaseState.TOWN) {
            (_b = this.minigameManager) === null || _b === void 0 ? void 0 : _b.dispose();
        }
        if (newPhase === Game_1.GamePhaseState.FIGHT) {
            (_c = this.board) === null || _c === void 0 ? void 0 : _c.battleMode(true);
        }
        else if (newPhase === Game_1.GamePhaseState.TOWN) {
            (_d = this.board) === null || _d === void 0 ? void 0 : _d.minigameMode();
            (_e = this.weatherManager) === null || _e === void 0 ? void 0 : _e.setTownDaytime((_g = (_f = this.room) === null || _f === void 0 ? void 0 : _f.state.stageLevel) !== null && _g !== void 0 ? _g : 0);
        }
        else {
            (_h = this.board) === null || _h === void 0 ? void 0 : _h.pickMode();
        }
    }
    preloadMaps(mapNames) {
        return Promise.all(mapNames.map((mapName) => fetch(`/tilemap/${mapName}`)
            .then((res) => res.json())
            .then((tilemap) => {
            this.tilemaps.set(mapName, tilemap);
            tilemap.tilesets.forEach((t) => {
                this.load.image(mapName + "/" + t.name, "/assets/tilesets/" + mapName + "/" + t.image);
            });
            this.load.tilemapTiledJSON("map_" + mapName, tilemap);
        })));
    }
    setMap(mapName) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (mapName === "town") {
                this.map = this.add.tilemap("town");
                const tileset = this.map.addTilesetImage("town_tileset", "town_tileset");
                (_a = this.map.createLayer("layer0", tileset, 0, 0)) === null || _a === void 0 ? void 0 : _a.setScale(2, 2);
                (_b = this.map.createLayer("layer1", tileset, 0, 0)) === null || _b === void 0 ? void 0 : _b.setScale(2, 2);
                (_c = this.map.createLayer("layer2", tileset, 0, 0)) === null || _c === void 0 ? void 0 : _c.setScale(2, 2);
                const sys = this.sys;
                if (sys.animatedTiles) {
                    sys.animatedTiles.pause();
                }
                return;
            }
            const tilemap = this.tilemaps.get(mapName);
            if (!tilemap)
                return logger_1.logger.error(`Tilemap not yet loaded for map ${mapName}`);
            const map = this.make.tilemap({ key: "map_" + mapName });
            if (this.map)
                this.map.destroy();
            this.map = map;
            tilemap.layers.forEach((layer) => {
                var _a, _b;
                const tileset = map.addTilesetImage(layer.name, mapName + "/" + layer.name);
                (_a = tileset.image) === null || _a === void 0 ? void 0 : _a.setFilter(Phaser.Textures.FilterMode.NEAREST);
                (_b = map.createLayer(layer.name, tileset, 0, 0)) === null || _b === void 0 ? void 0 : _b.setScale(2, 2);
            });
            const sys = this.sys;
            if (sys.animatedTiles) {
                sys.animatedTiles.init(map);
                if ((0, preferences_1.preference)("disableAnimatedTilemap")) {
                    sys.animatedTiles.pause();
                }
            }
        });
    }
    resetDragState() {
        if (this.pokemonDragged) {
            this.input.emit("dragend", this.input.activePointer, this.pokemonDragged, false);
            this.pokemonDragged = null;
        }
        else if (this.itemDragged) {
            this.itemDragged.closeDetail();
            if (this.itemDragged.input) {
                this.itemDragged.x = this.itemDragged.input.dragStartX;
                this.itemDragged.y = this.itemDragged.input.dragStartY;
            }
            this.input.emit("dragend", this.input.pointer1, this.itemDragged, false);
            this.itemDragged = null;
        }
        this.input.setDragState(this.input.pointer1, 0);
    }
    setupMouseEvents() {
        this.sellZone = new sell_zone_1.SellZone(this);
        this.dropSpots = [];
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 8; x++) {
                const coord = (0, utils_1.transformBoardCoordinates)(x, y);
                const zone = this.add.zone(coord[0], coord[1], 96, 96);
                zone.setRectangleDropZone(96, 96);
                zone.setName("board-zone");
                const spotSprite = this.add
                    .image(zone.x, zone.y, "board_cell", 0)
                    .setVisible(false)
                    .setData({ x, y })
                    .setDepth(depths_1.DEPTH.DROP_CELL)
                    .setScale(2, 2);
                zone.setData({ x, y, sprite: spotSprite });
                this.dropSpots.push(spotSprite);
            }
        }
        this.input.on("pointerdown", (pointer) => {
            var _a, _b;
            if (pointer.leftButtonDown() &&
                this.minigameManager &&
                ((_a = this.room) === null || _a === void 0 ? void 0 : _a.state.phase) === Game_1.GamePhaseState.TOWN &&
                !this.spectate) {
                const camera = this.cameras.main;
                const x = camera.worldView.left + pointer.x / camera.zoom;
                const y = camera.worldView.top + pointer.y / camera.zoom;
                const [minX, maxY] = (0, utils_1.transformBoardCoordinates)(-1, 0);
                const [maxX, minY] = (0, utils_1.transformBoardCoordinates)(8, 7);
                if (x < minX || x > maxX || y > maxY || y < minY)
                    return;
                const vector = this.minigameManager.getVector(x, y);
                (_b = this.room) === null || _b === void 0 ? void 0 : _b.send(types_1.Transfer.VECTOR, vector);
                const clickAnimation = this.add.sprite(x, y, "attacks", `WATER/cell/000.png`);
                clickAnimation.setDepth(depths_1.DEPTH.INDICATOR);
                clickAnimation.anims.play("WATER/cell");
                this.tweens.add({
                    targets: clickAnimation,
                    x,
                    y,
                    ease: "linear",
                    yoyo: true,
                    duration: 200,
                    onComplete: () => {
                        clickAnimation.destroy();
                    }
                });
            }
            if (this.board && !pointer.rightButtonDown()) {
                this.board.closeTooltips();
            }
        });
        this.input.on(Phaser.Input.Events.GAMEOBJECT_OVER, (pointer, gameObject) => {
            if (gameObject instanceof pokemon_2.default && gameObject.draggable) {
                this.setHovered(gameObject);
            }
        });
        this.input.on(Phaser.Input.Events.GAMEOBJECT_OUT, (pointer, gameObject) => {
            if (this.pokemonHovered === gameObject) {
                this.clearHovered(this.pokemonHovered);
                this.pokemonHovered = null;
            }
        });
        this.input.on("dragstart", (pointer, gameObject) => {
            var _a;
            if (gameObject instanceof pokemon_2.default) {
                this.pokemonDragged = gameObject;
                this.pokemonDragged.setDepth(depths_1.DEPTH.DRAGGED_POKEMON);
                this.dropSpots.forEach((spot) => {
                    var _a;
                    if (((_a = this.room) === null || _a === void 0 ? void 0 : _a.state.phase) === Game_1.GamePhaseState.PICK ||
                        spot.getData("y") === 0) {
                        spot.setFrame(0).setVisible(true);
                    }
                });
                if (this.sellZone &&
                    (0, pokemon_entity_1.canSell)(this.pokemonDragged.name, (_a = this.room) === null || _a === void 0 ? void 0 : _a.state.specialGameRule)) {
                    this.sellZone.showForPokemon(this.pokemonDragged);
                }
            }
            else if (gameObject instanceof item_container_1.default) {
                this.itemDragged = gameObject;
            }
        });
        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            var _a, _b;
            const g = gameObject;
            g.x = dragX;
            g.y = dragY;
            if (g && this.pokemonDragged != null) {
                const pokemon = new pokemon_1.PokemonClasses[this.pokemonDragged.name]();
                this.dropSpots.forEach((spot) => {
                    var _a;
                    const inBench = spot.getData("y") === 0;
                    let visible = false;
                    if (inBench) {
                        visible = pokemon.canBeBenched;
                    }
                    else if (((_a = this.room) === null || _a === void 0 ? void 0 : _a.state.phase) === Game_1.GamePhaseState.PICK) {
                        visible = true;
                    }
                    spot.setVisible(visible);
                });
                if (((_a = this.sellZone) === null || _a === void 0 ? void 0 : _a.visible) === false &&
                    (0, pokemon_entity_1.canSell)(this.pokemonDragged.name, (_b = this.room) === null || _b === void 0 ? void 0 : _b.state.specialGameRule)) {
                    this.sellZone.setVisible(true);
                }
            }
        });
        this.input.on("drop", (pointer, gameObject, dropZone) => {
            var _a, _b, _c, _d, _e, _f, _g;
            this.dropSpots.forEach((spot) => spot.setVisible(false));
            (_a = this.sellZone) === null || _a === void 0 ? void 0 : _a.hide();
            if (gameObject instanceof pokemon_2.default) {
                if (dropZone.name == "board-zone") {
                    const [x, y] = [dropZone.getData("x"), dropZone.getData("y")];
                    if (gameObject.positionX !== x || gameObject.positionY !== y) {
                        (_b = document.getElementById("game")) === null || _b === void 0 ? void 0 : _b.dispatchEvent(new CustomEvent(types_1.Transfer.DRAG_DROP, {
                            detail: { x, y, id: gameObject.id }
                        }));
                        this.lastDragDropPokemon = gameObject;
                    }
                    else {
                        gameObject.setPosition(...(0, utils_1.transformBoardCoordinates)(x, y));
                    }
                }
                else if (dropZone.name == "sell-zone") {
                    if (gameObject === this.pokemonDragged) {
                        this.sellPokemon(this.pokemonDragged);
                    }
                }
                else {
                    const [x, y] = (0, utils_1.transformBoardCoordinates)(gameObject.positionX, gameObject.positionY);
                    gameObject.setPosition(x, y);
                }
                gameObject.setDepth(depths_1.DEPTH.POKEMON);
                this.pokemonDragged = null;
            }
            else if (gameObject instanceof item_container_1.default &&
                this.itemDragged != null) {
                if (dropZone instanceof item_container_1.default) {
                    (_c = document.getElementById("game")) === null || _c === void 0 ? void 0 : _c.dispatchEvent(new CustomEvent(types_1.Transfer.DRAG_DROP_COMBINE, {
                        detail: {
                            itemA: dropZone.name,
                            itemB: gameObject.name
                        }
                    }));
                }
                else if (dropZone.name == "board-zone" &&
                    !(((_d = this.room) === null || _d === void 0 ? void 0 : _d.state.phase) == Game_1.GamePhaseState.FIGHT &&
                        dropZone.getData("y") != 0)) {
                    (_e = document.getElementById("game")) === null || _e === void 0 ? void 0 : _e.dispatchEvent(new CustomEvent(types_1.Transfer.DRAG_DROP_ITEM, {
                        detail: {
                            x: dropZone.getData("x"),
                            y: dropZone.getData("y"),
                            id: gameObject.name
                        }
                    }));
                }
                else {
                    const player = (_f = this.room) === null || _f === void 0 ? void 0 : _f.state.players.get(this.uid);
                    if (player)
                        (_g = this.itemsContainer) === null || _g === void 0 ? void 0 : _g.render(player.items);
                }
                this.itemDragged = null;
            }
        }, this);
        this.input.on("dragend", (pointer, gameObject, dropped) => {
            var _a;
            (_a = this.sellZone) === null || _a === void 0 ? void 0 : _a.hide();
            this.dropSpots.forEach((spot) => spot.setVisible(false));
            if (!dropped && (gameObject === null || gameObject === void 0 ? void 0 : gameObject.input)) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
            this.pokemonDragged = null;
            this.itemDragged = null;
        });
        this.input.on("dragenter", (pointer, gameObject, dropZone) => {
            var _a, _b, _c;
            if (gameObject instanceof item_container_1.default &&
                dropZone instanceof item_container_1.default) {
                for (const [key, value] of Object.entries(Item_1.ItemRecipe)) {
                    if ((value[0] == gameObject.name && value[1] == dropZone.name) ||
                        (value[0] == dropZone.name && value[1] == gameObject.name)) {
                        (_a = this.itemsContainer) === null || _a === void 0 ? void 0 : _a.sendToBack(dropZone);
                        gameObject.showTempDetail(key);
                        break;
                    }
                }
            }
            if (dropZone.name === "board-zone" &&
                gameObject instanceof pokemon_2.default) {
                (_b = dropZone.getData("sprite")) === null || _b === void 0 ? void 0 : _b.setFrame(1);
            }
            if (dropZone.name === "sell-zone" &&
                gameObject instanceof pokemon_2.default) {
                (_c = this.sellZone) === null || _c === void 0 ? void 0 : _c.onDragEnter();
            }
        }, this);
        this.input.on("dragleave", (pointer, gameObject, dropZone) => {
            var _a, _b;
            if (gameObject instanceof item_container_1.default &&
                dropZone instanceof item_container_1.default) {
                gameObject.closeDetail();
            }
            if (dropZone.name === "board-zone" &&
                gameObject instanceof pokemon_2.default) {
                (_a = dropZone.getData("sprite")) === null || _a === void 0 ? void 0 : _a.setFrame(0);
            }
            if (dropZone.name === "sell-zone" &&
                gameObject instanceof pokemon_2.default) {
                (_b = this.sellZone) === null || _b === void 0 ? void 0 : _b.onDragLeave();
            }
        }, this);
    }
    setHovered(gameObject) {
        const outline = this.plugins.get("rexOutline");
        if (!outline)
            return;
        if (this.pokemonHovered != null)
            this.clearHovered(this.pokemonHovered);
        this.pokemonHovered = gameObject;
        const thickness = Math.round(1 + Math.log(gameObject.def + gameObject.speDef));
        outline.add(gameObject.sprite, {
            thickness,
            outlineColor: 0xffffff
        });
    }
    clearHovered(gameObject) {
        const outline = this.plugins.get("rexOutline");
        if (!outline)
            return;
        outline.remove(gameObject.sprite);
    }
    displayMoneyGain(x, y, gain) {
        const textStyle = {
            fontSize: "25px",
            fontFamily: "Verdana",
            color: "#FFFF00",
            align: "center",
            strokeThickness: 2,
            stroke: "#000"
        };
        const text = this.add.existing(new phaser_1.GameObjects.Text(this, x - 40, y - 50, `${gain > 0 ? "+ " : ""}${gain} GOLD`, textStyle));
        text.setDepth(depths_1.DEPTH.TEXT_MAJOR);
        this.add.tween({
            targets: [text],
            ease: "Linear",
            duration: 1000,
            delay: 0,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },
            y: {
                getStart: () => y - 50,
                getEnd: () => y - 110
            },
            onComplete: () => {
                text.destroy();
            }
        });
    }
    shakeCamera(intensity, duration) {
        if ((0, preferences_1.preference)("disableCameraShake"))
            return;
        this.cameras.main.shake(duration, intensity);
    }
}
exports.default = GameScene;
//# sourceMappingURL=game-scene.js.map