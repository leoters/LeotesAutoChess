"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardMode = void 0;
const i18next_1 = require("i18next");
const phaser_1 = require("phaser");
const pokemon_avatar_1 = require("../../../../models/colyseus-models/pokemon-avatar");
const precomputed_pokemon_data_1 = require("../../../../models/precomputed/precomputed-pokemon-data");
const types_1 = require("../../../../types");
const Config_1 = require("../../../../types/Config");
const Game_1 = require("../../../../types/enum/Game");
const Pokemon_1 = require("../../../../types/enum/Pokemon");
const Synergy_1 = require("../../../../types/enum/Synergy");
const board_1 = require("../../../../utils/board");
const schemas_1 = require("../../../../utils/schemas");
const utils_1 = require("../../pages/utils/utils");
const stores_1 = __importDefault(require("../../stores"));
const pokemon_1 = __importDefault(require("./pokemon"));
const pokemon_avatar_2 = __importDefault(require("./pokemon-avatar"));
const pokemon_special_1 = __importDefault(require("./pokemon-special"));
const Item_1 = require("../../../../types/enum/Item");
const audio_1 = require("../../pages/utils/audio");
const depths_1 = require("../depths");
const Dungeon_1 = require("../../../../types/enum/Dungeon");
const GameStore_1 = require("../../stores/GameStore");
const portal_1 = require("./portal");
const logger_1 = require("../../../../utils/logger");
const pve_stages_1 = require("../../../../models/pve-stages");
const pokemon_factory_1 = __importDefault(require("../../../../models/pokemon-factory"));
const random_1 = require("../../../../utils/random");
var BoardMode;
(function (BoardMode) {
    BoardMode["PICK"] = "pick";
    BoardMode["BATTLE"] = "battle";
    BoardMode["TOWN"] = "town";
})(BoardMode || (exports.BoardMode = BoardMode = {}));
class BoardManager {
    constructor(scene, player, animationManager, uid, state) {
        this.scoutingAvatars = [];
        this.berryTrees = [];
        this.smeargle = null;
        this.specialGameRule = null;
        this.pokemons = new Map();
        this.uid = uid;
        this.scene = scene;
        this.state = state;
        this.player = player;
        this.mode = BoardMode.PICK;
        this.animationManager = animationManager;
        this.lightX = state.lightX;
        this.lightY = state.lightY;
        this.gameMode = state.gameMode;
        this.specialGameRule = state.specialGameRule;
        this.playerAvatar = null;
        this.opponentAvatar = null;
        this.lightCell = null;
        this.pveChest = null;
        this.pveChestGroup = null;
        if (state.phase == Game_1.GamePhaseState.FIGHT) {
            this.battleMode(false);
        }
        else if (state.phase === Game_1.GamePhaseState.TOWN) {
            this.renderBoard(true);
            this.minigameMode();
        }
        else {
            this.pickMode();
        }
    }
    victoryAnimation(winnerId) {
        var _a;
        if (winnerId === this.player.id) {
            if (this.playerAvatar) {
                this.animationManager.animatePokemon(this.playerAvatar, Game_1.PokemonActionState.HOP, false);
            }
            if (this.opponentAvatar) {
                this.animationManager.animatePokemon(this.opponentAvatar, Game_1.PokemonActionState.HURT, false);
            }
            if (this.pveChest) {
                this.pveChest.anims.play("open_chest");
                const rewards = (0, schemas_1.values)(this.player.pveRewards).concat((0, schemas_1.values)(this.player.pveRewardsPropositions));
                rewards.forEach((item, i) => {
                    var _a;
                    const itemSprite = this.scene.add.sprite(1512, 122, "item", item + ".png");
                    itemSprite.setScale(0.5);
                    const shinyEffect = this.scene.add.sprite(1512, 122, "shine");
                    shinyEffect.setScale(2);
                    shinyEffect.play("shine");
                    (_a = this.pveChestGroup) === null || _a === void 0 ? void 0 : _a.addMultiple([itemSprite, shinyEffect]);
                    this.scene.tweens.add({
                        targets: [itemSprite, shinyEffect],
                        ease: Phaser.Math.Easing.Quadratic.Out,
                        duration: 1000,
                        y: 75,
                        x: 1512 + (i - (rewards.length - 1) / 2) * 70
                    });
                });
            }
        }
        else if (winnerId === ((_a = this.opponentAvatar) === null || _a === void 0 ? void 0 : _a.playerId)) {
            this.animationManager.animatePokemon(this.opponentAvatar, Game_1.PokemonActionState.HOP, false);
            this.playerAvatar &&
                this.animationManager.animatePokemon(this.playerAvatar, Game_1.PokemonActionState.HURT, false);
        }
        else {
            this.playerAvatar &&
                this.animationManager.animatePokemon(this.playerAvatar, Game_1.PokemonActionState.IDLE, false);
            if (this.opponentAvatar) {
                this.animationManager.animatePokemon(this.opponentAvatar, Game_1.PokemonActionState.IDLE, false);
            }
        }
    }
    addPokemonSprite(pokemon) {
        if (this.pokemons.has(pokemon.id)) {
            return this.pokemons.get(pokemon.id);
        }
        const coordinates = (0, utils_1.transformBoardCoordinates)(pokemon.positionX, pokemon.positionY);
        const pokemonUI = new pokemon_1.default(this.scene, coordinates[0], coordinates[1], pokemon, this.player.id, false, false);
        this.animationManager.animatePokemon(pokemonUI, pokemon.action, false);
        this.pokemons.set(pokemonUI.id, pokemonUI);
        return pokemonUI;
    }
    removePokemon(pokemonToRemove) {
        const pokemonUI = this.pokemons.get(pokemonToRemove.id);
        if (pokemonUI) {
            pokemonUI.destroy();
        }
        this.pokemons.delete(pokemonToRemove.id);
    }
    renderBoard(phaseChanged) {
        this.showBerryTrees();
        this.pokemons.forEach((p) => p.destroy());
        this.pokemons.clear();
        if (this.mode === BoardMode.PICK) {
            this.showLightCell();
        }
        this.player.board.forEach((pokemon) => {
            if (this.mode === BoardMode.PICK || (0, board_1.isOnBench)(pokemon)) {
                this.addPokemonSprite(pokemon);
            }
        });
        if (this.specialGameRule != null) {
            if (this.smeargle) {
                this.smeargle.destroy();
                this.smeargle = null;
            }
            this.addSmeargle();
        }
        if (this.state.stageLevel in pve_stages_1.PVEStages) {
            if (phaseChanged) {
                setTimeout(() => this.addPvePokemons(pve_stages_1.PVEStages[this.state.stageLevel], false), 1500);
            }
            else if (this.mode === BoardMode.PICK) {
                this.addPvePokemons(pve_stages_1.PVEStages[this.state.stageLevel], true);
            }
        }
    }
    showLightCell() {
        this.hideLightCell();
        const lightCount = this.player.synergies.get(Synergy_1.Synergy.LIGHT);
        if (lightCount && lightCount >= Config_1.SynergyTriggers[Synergy_1.Synergy.LIGHT][0]) {
            const coordinates = (0, utils_1.transformBoardCoordinates)(this.lightX, this.lightY);
            this.lightCell = this.scene.add.sprite(coordinates[0], coordinates[1], "abilities", "LIGHT_CELL/000.png");
            this.lightCell.setDepth(depths_1.DEPTH.LIGHT_CELL);
            this.lightCell.setScale(2, 2);
            this.lightCell.anims.play("LIGHT_CELL");
        }
    }
    hideLightCell() {
        var _a;
        (_a = this.lightCell) === null || _a === void 0 ? void 0 : _a.destroy();
        this.lightCell = null;
    }
    showBerryTrees() {
        var _a;
        this.berryTrees.forEach((tree) => tree.destroy());
        this.berryTrees = [];
        const grassLevel = (_a = this.player.synergies.get(Synergy_1.Synergy.GRASS)) !== null && _a !== void 0 ? _a : 0;
        const nbTrees = Config_1.SynergyTriggers[Synergy_1.Synergy.GRASS].filter((n) => n <= grassLevel).length;
        const treePositions = [
            [408, 710],
            [360, 710],
            [312, 710]
        ];
        for (let i = 0; i < nbTrees; i++) {
            const tree = this.scene.add.sprite(treePositions[i][0], treePositions[i][1], "berry_trees", this.player.berryTreesType[i] + "_1");
            tree.setDepth(depths_1.DEPTH.INANIMATE_OBJECTS).setScale(2, 2).setOrigin(0.5, 1);
            if (this.player.berryTreesStage[i] === 0) {
                tree.anims.play("CROP");
            }
            else {
                tree.anims.play(`${this.player.berryTreesType[i]}_TREE_STEP_${this.player.berryTreesStage[i]}`);
            }
            tree.setInteractive();
            tree.on("pointerdown", (pointer) => {
                if (this.player.id !== this.scene.uid)
                    return;
                if (this.scene.room && this.player.berryTreesStage[i] >= 3) {
                    this.scene.room.send(types_1.Transfer.PICK_BERRY, i);
                    this.displayText(pointer.x, pointer.y, (0, i18next_1.t)("berry_gained"));
                    tree.play("CROP");
                }
                else {
                    this.displayText(pointer.x, pointer.y, (0, i18next_1.t)("berry_unripe"));
                }
            });
            this.berryTrees.push(tree);
        }
    }
    hideBerryTrees() {
        this.berryTrees.forEach((tree) => tree.destroy());
    }
    displayText(x, y, label) {
        const textStyle = {
            fontSize: "25px",
            fontFamily: "Verdana",
            color: "#fff",
            align: "center",
            strokeThickness: 2,
            stroke: "#000"
        };
        const text = this.scene.add.existing(new phaser_1.GameObjects.Text(this.scene, x, y, label, textStyle).setOrigin(0.5, 0.5));
        text.setDepth(depths_1.DEPTH.TEXT);
        this.scene.add.tween({
            targets: [text],
            ease: "linear",
            duration: 1500,
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
    updatePlayerAvatar() {
        if (this.playerAvatar) {
            this.playerAvatar.destroy();
        }
        if (this.player.life <= 0)
            return;
        if (this.state.phase === Game_1.GamePhaseState.TOWN)
            return;
        const playerAvatar = new pokemon_avatar_1.PokemonAvatarModel(this.player.id, this.player.avatar, 0, 0, 0);
        this.playerAvatar = new pokemon_avatar_2.default(this.scene, 504, 696, playerAvatar, this.player.id);
        this.playerAvatar.orientation = Game_1.Orientation.UPRIGHT;
        this.playerAvatar.updateLife(this.player.life);
        this.animationManager.animatePokemon(this.playerAvatar, this.playerAvatar.action, false);
    }
    updateOpponentAvatar(opponentId, opponentAvatarString) {
        if (this.opponentAvatar) {
            this.opponentAvatar.destroy();
            this.opponentAvatar = null;
        }
        if (this.pveChestGroup) {
            this.pveChestGroup.destroy(true, true);
            this.pveChest = null;
            this.pveChestGroup = null;
        }
        if (this.mode === BoardMode.BATTLE && opponentId === "pve") {
            this.pveChestGroup = this.scene.add.group();
            this.pveChest = this.scene.add.sprite(1512, 122, "chest", "1.png");
            this.pveChest.setScale(2);
            this.pveChestGroup.add(this.pveChest);
        }
        else if (this.mode === BoardMode.BATTLE &&
            opponentAvatarString &&
            opponentId) {
            let opponentLife = 0;
            this.state.players.forEach((p) => {
                if (p.id === opponentId)
                    opponentLife = p.life;
            });
            if (opponentLife <= 0)
                return;
            const opponentAvatar = new pokemon_avatar_1.PokemonAvatarModel(this.player.opponentId, opponentAvatarString, 0, 0, 0);
            this.opponentAvatar = new pokemon_avatar_2.default(this.scene, 1512, 122, opponentAvatar, opponentId);
            this.opponentAvatar.orientation = Game_1.Orientation.DOWNLEFT;
            this.opponentAvatar.updateLife(opponentLife);
            this.animationManager.animatePokemon(this.opponentAvatar, this.opponentAvatar.action, false);
            this.updateScoutingAvatars();
        }
    }
    updateScoutingAvatars(resetAll = false) {
        const players = this.state.players;
        if (!players)
            return;
        const scoutingPlayers = (0, schemas_1.values)(players).filter((p) => {
            var _a;
            const spectatedPlayer = players.get(p.spectatedPlayerId);
            if (!spectatedPlayer ||
                spectatedPlayer.id === p.id ||
                this.mode === BoardMode.TOWN ||
                p.id === ((_a = this.opponentAvatar) === null || _a === void 0 ? void 0 : _a.playerId))
                return false;
            const isSpectatingBoard = spectatedPlayer.id === this.player.id;
            const isSpectatingBattle = this.mode === BoardMode.BATTLE &&
                spectatedPlayer.simulationId === this.player.simulationId;
            return isSpectatingBoard || isSpectatingBattle;
        });
        this.scoutingAvatars = this.scoutingAvatars.filter((avatar) => {
            if (resetAll ||
                scoutingPlayers.some((p) => p.id === avatar.playerId) === false) {
                avatar.destroy();
                return false;
            }
            return true;
        });
        const newScoutingAvatars = scoutingPlayers.filter((p) => this.scoutingAvatars.some((a) => a.playerId === p.id) === false);
        newScoutingAvatars.forEach((player) => {
            const playerIndex = (0, schemas_1.values)(players).findIndex((p) => p.id === player.id);
            const scoutAvatarModel = new pokemon_avatar_1.PokemonAvatarModel(player.id, player.avatar, 0, 0, 0);
            const scoutAvatar = new pokemon_avatar_2.default(this.scene, 1512, 218 + 48 * playerIndex, scoutAvatarModel, player.id, true);
            scoutAvatar.orientation = Game_1.Orientation.DOWNLEFT;
            this.animationManager.animatePokemon(scoutAvatar, scoutAvatar.action, false);
            this.scoutingAvatars.push(scoutAvatar);
        });
    }
    updateAvatarLife(playerId, value) {
        if (this.playerAvatar && this.playerAvatar.scene && this.player.id === playerId) {
            this.playerAvatar.updateLife(value);
        }
        if (this.opponentAvatar && this.opponentAvatar.scene && this.opponentAvatar.playerId === playerId) {
            this.opponentAvatar.updateLife(value);
        }
    }
    battleMode(phaseChanged) {
        this.mode = BoardMode.BATTLE;
        this.hideLightCell();
        if (!phaseChanged)
            this.removePokemonsOnBoard(false);
        this.closeTooltips();
        this.scene.input.setDragState(this.scene.input.activePointer, 0);
        setTimeout(() => {
            const gameState = stores_1.default.getState().game;
            const currentPlayer = gameState.players.find((p) => p.id === gameState.currentPlayerId);
            if (currentPlayer) {
                const isPVERound = currentPlayer.opponentId === "pve";
                const isRedPlayer = gameState.currentTeam === Game_1.Team.RED_TEAM;
                if (!isPVERound && phaseChanged) {
                    this.portalTransition(isRedPlayer);
                }
                else {
                    this.updateOpponentAvatar(currentPlayer.opponentId, currentPlayer.opponentAvatar);
                }
            }
        }, 0);
    }
    removePokemonsOnBoard(includingBench = false) {
        this.pokemons.forEach((pokemon) => {
            if (includingBench === true || !(0, board_1.isOnBench)(pokemon)) {
                pokemon.destroy();
                this.pokemons.delete(pokemon.id);
            }
        });
    }
    pickMode() {
        this.mode = BoardMode.PICK;
        this.scene.setMap(this.player.map);
        if (this.scene.cache.audio.has("music_" + Dungeon_1.DungeonDetails[this.player.map].music) &&
            Config_1.PortalCarouselStages.includes(this.state.stageLevel)) {
            (0, audio_1.playMusic)(this.scene, Dungeon_1.DungeonDetails[this.player.map].music);
        }
        this.renderBoard(true);
        this.updatePlayerAvatar();
        this.updateOpponentAvatar(null, null);
        this.updateScoutingAvatars(true);
    }
    minigameMode() {
        var _a, _b, _c;
        this.mode = BoardMode.TOWN;
        this.scene.setMap("town");
        if (this.state.stageLevel === Config_1.PortalCarouselStages[0])
            (0, audio_1.playMusic)(this.scene, Dungeon_1.DungeonMusic.TREASURE_TOWN_STAGE_0);
        if (this.state.stageLevel === Config_1.PortalCarouselStages[1])
            (0, audio_1.playMusic)(this.scene, Dungeon_1.DungeonMusic.TREASURE_TOWN_STAGE_10);
        if (this.state.stageLevel === Config_1.PortalCarouselStages[2])
            (0, audio_1.playMusic)(this.scene, Dungeon_1.DungeonMusic.TREASURE_TOWN_STAGE_20);
        this.hideLightCell();
        this.hideBerryTrees();
        this.removePokemonsOnBoard();
        this.closeTooltips();
        this.scene.input.setDragState(this.scene.input.activePointer, 0);
        if (this.playerAvatar) {
            this.playerAvatar.destroy();
        }
        this.updateOpponentAvatar(null, null);
        this.updateScoutingAvatars(true);
        (_a = this.scene.minigameManager) === null || _a === void 0 ? void 0 : _a.addVillagers((_c = (_b = this.scene.room) === null || _b === void 0 ? void 0 : _b.state.townEncounter) !== null && _c !== void 0 ? _c : null, stores_1.default.getState().game.podium);
    }
    setPlayer(player) {
        if (player.id != this.player.id) {
            this.player = player;
            this.renderBoard(false);
            this.updatePlayerAvatar();
            this.updateOpponentAvatar(this.player.opponentId, this.player.opponentAvatar);
            this.updateScoutingAvatars(true);
        }
    }
    updatePokemonItems(playerId, pokemon, item) {
        if (this.player.id === playerId) {
            const pkm = this.pokemons.get(pokemon.id);
            if (pkm) {
                pkm.itemsContainer.render(pokemon.items);
            }
            if (item === Item_1.Item.SHINY_STONE) {
                pkm === null || pkm === void 0 ? void 0 : pkm.addLight();
            }
            if (item === Item_1.Item.BERSERK_GENE) {
                pkm === null || pkm === void 0 ? void 0 : pkm.addBerserkEffect();
            }
            if (item === Item_1.Item.AIR_BALLOON) {
                pkm === null || pkm === void 0 ? void 0 : pkm.addFloatingAnimation();
            }
        }
    }
    changePokemon(pokemon, field, value, previousValue) {
        const pokemonUI = this.pokemons.get(pokemon.id);
        let coordinates;
        if (pokemonUI) {
            switch (field) {
                case "positionX":
                    pokemonUI.positionX = value;
                    pokemonUI.positionY = pokemon.positionY;
                    coordinates = (0, utils_1.transformBoardCoordinates)(pokemon.positionX, pokemon.positionY);
                    pokemonUI.x = coordinates[0];
                    pokemonUI.y = coordinates[1];
                    stores_1.default.dispatch((0, GameStore_1.refreshShopUI)());
                    break;
                case "positionY":
                    pokemonUI.positionY = value;
                    pokemonUI.positionX = pokemon.positionX;
                    coordinates = (0, utils_1.transformBoardCoordinates)(pokemon.positionX, pokemon.positionY);
                    pokemonUI.x = coordinates[0];
                    pokemonUI.y = coordinates[1];
                    if (this.mode === BoardMode.BATTLE && !(0, board_1.isOnBench)(pokemonUI)) {
                        pokemonUI.destroy();
                        this.pokemons.delete(pokemonUI.id);
                    }
                    stores_1.default.dispatch((0, GameStore_1.refreshShopUI)());
                    break;
                case "action":
                    this.animationManager.animatePokemon(pokemonUI, value, false);
                    break;
                case "hp": {
                    const baseHP = (0, precomputed_pokemon_data_1.getPokemonData)(pokemon.name).hp;
                    const sizeBuff = (pokemon.hp - baseHP) / baseHP;
                    pokemonUI.sprite.setScale(2 + sizeBuff);
                    pokemonUI.hp = value;
                    if (value > previousValue)
                        pokemonUI.displayBoost(Game_1.Stat.HP);
                    break;
                }
                case "atk":
                    pokemonUI.atk = value;
                    if (value > previousValue)
                        pokemonUI.displayBoost(Game_1.Stat.ATK);
                    break;
                case "def":
                    pokemonUI.def = value;
                    if (value > previousValue)
                        pokemonUI.displayBoost(Game_1.Stat.DEF);
                    break;
                case "speed":
                    pokemonUI.speed = value;
                    if (value > previousValue)
                        pokemonUI.displayBoost(Game_1.Stat.SPEED);
                    break;
                case "ap":
                    pokemonUI.ap = value;
                    if (value > previousValue)
                        pokemonUI.displayBoost(Game_1.Stat.AP);
                    break;
                case "shiny":
                    pokemonUI.shiny = value;
                    this.animationManager.animatePokemon(pokemonUI, pokemonUI.action, false);
                    break;
                case "skill":
                    if (pokemonUI.skill !== value) {
                        pokemonUI.skill = value;
                        pokemonUI.evolutionAnimation();
                    }
                    break;
                case "types":
                    pokemonUI.types = new Set((0, schemas_1.values)(value));
                    break;
                case "meal":
                    if (pokemonUI.meal !== value) {
                        pokemonUI.updateMeal(value);
                    }
                    break;
            }
        }
    }
    closeTooltips() {
        this.pokemons.forEach((pokemon) => {
            if (pokemon.detail) {
                pokemon.closeDetail();
            }
            if (pokemon.itemsContainer) {
                pokemon.itemsContainer.closeDetails();
            }
        });
    }
    getBenchSize() {
        let benchSize = 0;
        this.pokemons.forEach((pokemon) => {
            if ((0, board_1.isOnBench)(pokemon)) {
                benchSize++;
            }
        });
        return benchSize;
    }
    showEmote(playerId, emote) {
        const avatars = [
            this.playerAvatar,
            this.opponentAvatar,
            ...this.scoutingAvatars
        ];
        const player = avatars.find((a) => (a === null || a === void 0 ? void 0 : a.playerId) === playerId);
        if (player) {
            this.animationManager.play(player, Pokemon_1.AnimationConfig[player.name].emote);
            if (emote) {
                player.drawSpeechBubble(emote, player === this.opponentAvatar);
            }
        }
    }
    addSmeargle() {
        this.smeargle = new pokemon_special_1.default({
            scene: this.scene,
            x: 1512,
            y: 396,
            name: Pokemon_1.Pkm.SMEARGLE,
            orientation: Game_1.Orientation.DOWNLEFT,
            dialog: (0, i18next_1.t)(`scribble_description.${this.specialGameRule}`),
            dialogTitle: (0, i18next_1.t)(`scribble.${this.specialGameRule}`)
        });
    }
    addPvePokemons(pveStage, immediately) {
        pveStage.board.forEach(([pkm, boardX, boardY], i) => {
            var _a, _b;
            const [x, y] = (0, utils_1.transformEntityCoordinates)(boardX, boardY - 1, true);
            const id = `pve_${this.state.stageLevel}_${i}`;
            const pkmSprite = new pokemon_1.default(this.scene, x, y, pokemon_factory_1.default.createPokemonFromName(pkm, {
                shiny: this.state.shinyEncounter
            }), id, false, true);
            this.pokemons.set(id, pkmSprite);
            pkmSprite.setDepth(depths_1.DEPTH.POKEMON);
            if (immediately) {
                pkmSprite.orientation = Game_1.Orientation.DOWNLEFT;
                (_a = this.scene.animationManager) === null || _a === void 0 ? void 0 : _a.animatePokemon(pkmSprite, Game_1.PokemonActionState.IDLE, false);
            }
            else {
                pkmSprite.y -= 500;
                pkmSprite.orientation = Game_1.Orientation.DOWN;
                (_b = this.scene.animationManager) === null || _b === void 0 ? void 0 : _b.animatePokemon(pkmSprite, Game_1.PokemonActionState.WALK, false);
                this.scene.tweens.add({
                    targets: pkmSprite,
                    y,
                    ease: "Linear",
                    duration: 3000,
                    onComplete: () => {
                        var _a;
                        if (pkmSprite) {
                            pkmSprite.orientation = Game_1.Orientation.DOWNLEFT;
                            (_a = this.scene.animationManager) === null || _a === void 0 ? void 0 : _a.animatePokemon(pkmSprite, Game_1.PokemonActionState.IDLE, false);
                        }
                    }
                });
            }
        });
    }
    addPortal() {
        if (this.portal)
            this.portal.destroy();
        const [x, y] = (0, utils_1.transformBoardCoordinates)(3.5, 5);
        this.portal = new portal_1.Portal(this.scene, "portal", x, y).setScale(0);
        this.scene.tweens.add({
            targets: this.portal,
            scale: 1.5,
            duration: 5000,
            ease: Phaser.Math.Easing.Sine.Out
        });
    }
    portalTransition(isRedPlayer) {
        const [portalX, portalY] = (0, utils_1.transformBoardCoordinates)(3.5, 5);
        const opponent = (0, schemas_1.values)(this.state.players).find((p) => p.id === this.player.opponentId);
        if (!opponent) {
            logger_1.logger.error("No opponent found for portal transition");
            return;
        }
        if (isRedPlayer) {
            this.scene.tweens.add({
                targets: this.playerAvatar,
                ease: Phaser.Math.Easing.Quadratic.In,
                duration: 700,
                scale: 0,
                x: portalX,
                y: portalY
            });
            const pokemonsToTeleport = [...this.pokemons.values()];
            for (const pokemon of pokemonsToTeleport) {
                const delay = (0, random_1.randomBetween)(0, 300);
                this.scene.tweens.add({
                    targets: pokemon,
                    ease: Phaser.Math.Easing.Quadratic.In,
                    delay,
                    duration: 700,
                    scale: 0,
                    x: portalX,
                    y: portalY
                });
            }
            this.scene.tweens.add({
                targets: this.portal,
                ease: Phaser.Math.Easing.Quadratic.In,
                delay: 700,
                duration: 300,
                scale: 0,
                onComplete: () => {
                    var _a;
                    this.scene.setMap(opponent.map);
                    const [x, y] = (0, utils_1.transformBoardCoordinates)(3.5, 2);
                    (_a = this.portal) === null || _a === void 0 ? void 0 : _a.setPosition(x, y).setScale(1);
                    opponent.board.forEach((pokemon) => {
                        if ((0, board_1.isOnBench)(pokemon))
                            return;
                        const [x, y] = (0, utils_1.transformEntityCoordinates)(pokemon.positionX, pokemon.positionY - 1, true);
                        const pokemonSprite = new pokemon_1.default(this.scene, x, y, pokemon, this.player.opponentId, false, false);
                        this.animationManager.animatePokemon(pokemonSprite, Game_1.PokemonActionState.IDLE, false);
                        this.pokemons.set(pokemonSprite.id, pokemonSprite);
                    });
                    this.updateOpponentAvatar(opponent.id, opponent.avatar);
                    if (this.playerAvatar) {
                        this.playerAvatar.x = x;
                        this.playerAvatar.y = y;
                        this.scene.tweens.add({
                            targets: this.playerAvatar,
                            ease: Phaser.Math.Easing.Quadratic.Out,
                            duration: 1000,
                            scale: 1,
                            x: 504,
                            y: 696,
                            onStart: () => {
                                if (this.playerAvatar) {
                                    this.animationManager.animatePokemon(this.playerAvatar, Game_1.PokemonActionState.HOP, false, false);
                                }
                            }
                        });
                    }
                    pokemonsToTeleport.forEach((pokemon) => {
                        const [originalX, originalY] = (0, utils_1.transformBoardCoordinates)(pokemon.positionX, pokemon.positionY);
                        pokemon.x = x;
                        pokemon.y = y;
                        const delay = (0, random_1.randomBetween)(0, 300);
                        this.scene.tweens.add({
                            targets: pokemon,
                            ease: Phaser.Math.Easing.Quadratic.Out,
                            delay,
                            duration: 700,
                            scale: 1,
                            x: originalX,
                            y: originalY,
                            onStart: () => {
                                this.animationManager.animatePokemon(pokemon, Game_1.PokemonActionState.HOP, false, false);
                            }
                        });
                    });
                    this.scene.tweens.add({
                        targets: this.portal,
                        ease: Phaser.Math.Easing.Cubic.In,
                        delay: 700,
                        duration: 300,
                        scale: 0,
                        onComplete: () => {
                            var _a;
                            (_a = this.portal) === null || _a === void 0 ? void 0 : _a.destroy();
                            this.portal = undefined;
                        }
                    });
                }
            });
        }
        else {
            this.updateOpponentAvatar(opponent.id, opponent.avatar);
            if (this.opponentAvatar) {
                this.opponentAvatar.x = portalX;
                this.opponentAvatar.y = portalY;
                this.opponentAvatar.setScale(0);
                this.scene.tweens.add({
                    targets: this.opponentAvatar,
                    ease: Phaser.Math.Easing.Quadratic.Out,
                    duration: 1500,
                    scale: 1,
                    x: 1512,
                    y: 122,
                    onStart: () => {
                        if (this.opponentAvatar) {
                            this.animationManager.animatePokemon(this.opponentAvatar, Game_1.PokemonActionState.HOP, false, false);
                        }
                    }
                });
            }
            setTimeout(() => {
                const opponent = (0, schemas_1.values)(this.state.players).find((p) => p.id === this.player.opponentId);
                if (!opponent)
                    return;
                opponent.board.forEach((pokemon) => {
                    if ((0, board_1.isOnBench)(pokemon))
                        return;
                    const pokemonSprite = new pokemon_1.default(this.scene, portalX, portalY, pokemon, this.player.opponentId, false, false);
                    pokemonSprite.setScale(0);
                    this.pokemons.set(pokemonSprite.id, pokemonSprite);
                    const [originalX, originalY] = (0, utils_1.transformEntityCoordinates)(pokemon.positionX, pokemon.positionY - 1, true);
                    const delay = (0, random_1.randomBetween)(0, 300);
                    this.scene.tweens.add({
                        targets: pokemonSprite,
                        ease: Phaser.Math.Easing.Quadratic.Out,
                        delay,
                        duration: 700,
                        scale: 1,
                        x: originalX,
                        y: originalY,
                        onStart: () => {
                            this.animationManager.animatePokemon(pokemonSprite, Game_1.PokemonActionState.HOP, false, false);
                        }
                    });
                });
            }, 1000);
            this.scene.tweens.add({
                targets: this.portal,
                ease: Phaser.Math.Easing.Cubic.In,
                delay: 1700,
                duration: 300,
                scale: 0,
                onComplete: () => {
                    var _a;
                    (_a = this.portal) === null || _a === void 0 ? void 0 : _a.destroy();
                    this.portal = undefined;
                }
            });
        }
    }
}
exports.default = BoardManager;
//# sourceMappingURL=board-manager.js.map