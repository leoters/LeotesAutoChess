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
const command_1 = require("@colyseus/command");
const colyseus_1 = require("colyseus");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const nanoid_1 = require("nanoid");
const elo_1 = require("../core/elo");
const evolution_rules_1 = require("../core/evolution-rules");
const mini_game_1 = require("../core/matter/mini-game");
const pending_game_manager_1 = require("../core/pending-game-manager");
const player_1 = __importDefault(require("../models/colyseus-models/player"));
const bot_v2_1 = require("../models/mongo-models/bot-v2");
const detailled_statistic_v2_1 = __importDefault(require("../models/mongo-models/detailled-statistic-v2"));
const history_1 = __importDefault(require("../models/mongo-models/history"));
const user_metadata_1 = __importDefault(require("../models/mongo-models/user-metadata"));
const pokemon_factory_1 = __importDefault(require("../models/pokemon-factory"));
const precomputed_pokemon_data_1 = require("../models/precomputed/precomputed-pokemon-data");
const precomputed_rarity_1 = require("../models/precomputed/precomputed-rarity");
const shop_1 = require("../models/shop");
const types_1 = require("../types");
const Config_1 = require("../types/Config");
const CloseCodes_1 = require("../types/enum/CloseCodes");
const Game_1 = require("../types/enum/Game");
const Passive_1 = require("../types/enum/Passive");
const Pokemon_1 = require("../types/enum/Pokemon");
const SpecialGameRule_1 = require("../types/enum/SpecialGameRule");
const array_1 = require("../utils/array");
const avatar_1 = require("../utils/avatar");
const board_1 = require("../utils/board");
const date_1 = require("../utils/date");
const logger_1 = require("../utils/logger");
const random_1 = require("../utils/random");
const schemas_1 = require("../utils/schemas");
const game_commands_1 = require("./commands/game-commands");
const game_state_1 = __importDefault(require("./states/game-state"));
class GameRoom extends colyseus_1.Room {
    constructor() {
        super();
        this.dispatcher = new command_1.Dispatcher(this);
        this.additionalUncommonPool = new Array();
        this.additionalRarePool = new Array();
        this.additionalEpicPool = new Array();
        this.miniGame = new mini_game_1.MiniGame(this);
    }
    onCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info("Create Game ", this.roomId);
            this.onRoomDeleted = this.onRoomDeleted.bind(this);
            this.presence.subscribe("room-deleted", this.onRoomDeleted);
            this.setMetadata({
                name: options.name,
                ownerName: options.ownerName,
                gameMode: options.gameMode,
                playerIds: Object.keys(options.users).filter((id) => options.users[id].isBot === false),
                playersInfo: Object.keys(options.users).map((u) => `${options.users[u].name} [${options.users[u].elo}]`),
                stageLevel: 0,
                type: "game",
                tournamentId: options.tournamentId,
                bracketId: options.bracketId
            });
            this.setState(new game_state_1.default(options.preparationId, options.name, options.noElo, options.gameMode, options.minRank, options.maxRank, options.specialGameRule));
            this.miniGame.create(this.state.avatars, this.state.floatingItems, this.state.portals, this.state.symbols);
            this.additionalUncommonPool = (0, shop_1.getAdditionalsTier1)(precomputed_rarity_1.PRECOMPUTED_POKEMONS_PER_RARITY.UNCOMMON);
            this.additionalRarePool = (0, shop_1.getAdditionalsTier1)(precomputed_rarity_1.PRECOMPUTED_POKEMONS_PER_RARITY.RARE);
            this.additionalEpicPool = (0, shop_1.getAdditionalsTier1)(precomputed_rarity_1.PRECOMPUTED_POKEMONS_PER_RARITY.EPIC);
            (0, random_1.shuffleArray)(this.additionalUncommonPool);
            (0, random_1.shuffleArray)(this.additionalRarePool);
            (0, random_1.shuffleArray)(this.additionalEpicPool);
            if (this.state.specialGameRule === SpecialGameRule_1.SpecialGameRule.EVERYONE_IS_HERE) {
                this.additionalUncommonPool.forEach((p) => this.state.shop.addAdditionalPokemon(p));
                this.additionalRarePool.forEach((p) => this.state.shop.addAdditionalPokemon(p));
                this.additionalEpicPool.forEach((p) => this.state.shop.addAdditionalPokemon(p));
            }
            yield Promise.all(Object.keys(options.users).map((id) => __awaiter(this, void 0, void 0, function* () {
                const user = options.users[id];
                if (user.isBot) {
                    const player = new player_1.default(user.uid, user.name, user.elo, user.avatar, true, this.state.players.size + 1, new Map(), "", types_1.Role.BOT, this.state);
                    this.state.players.set(user.uid, player);
                    this.state.botManager.addBot(player);
                }
                else {
                    const user = yield user_metadata_1.default.findOne({ uid: id });
                    if (user) {
                        const player = new player_1.default(user.uid, user.displayName, user.elo, user.avatar, false, this.state.players.size + 1, user.pokemonCollection, user.title, user.role, this.state);
                        this.state.players.set(user.uid, player);
                        this.state.shop.assignShop(player, false, this.state);
                        if (this.state.specialGameRule === SpecialGameRule_1.SpecialGameRule.EVERYONE_IS_HERE) {
                            precomputed_pokemon_data_1.PRECOMPUTED_REGIONAL_MONS.forEach((p) => {
                                if ((0, precomputed_pokemon_data_1.getPokemonData)(p).stars === 1) {
                                    this.state.shop.addRegionalPokemon(p, player);
                                }
                            });
                        }
                    }
                }
            })));
            this.clock.setTimeout(() => {
                if (this.state.gameLoaded)
                    return;
                this.broadcast(types_1.Transfer.LOADING_COMPLETE);
                this.state.players.forEach((player) => {
                    (0, pending_game_manager_1.clearPendingGame)(this.presence, player.id);
                });
                this.startGame();
            }, 5 * 60 * 1000);
            this.onMessage(types_1.Transfer.ITEM, (client, item) => {
                if (!this.state.gameFinished && client.auth) {
                    try {
                        this.pickItemProposition(client.auth.uid, item);
                    }
                    catch (error) {
                        logger_1.logger.error(error);
                    }
                }
            });
            this.onMessage(types_1.Transfer.SHOP, (client, message) => {
                if (!this.state.gameFinished && client.auth) {
                    try {
                        this.dispatcher.dispatch(new game_commands_1.OnBuyPokemonCommand(), {
                            playerId: client.auth.uid,
                            index: message.id
                        });
                    }
                    catch (error) {
                        logger_1.logger.error("shop error", message, error);
                    }
                }
            });
            this.onMessage(types_1.Transfer.REMOVE_FROM_SHOP, (client, index) => {
                if (!this.state.gameFinished && client.auth) {
                    try {
                        this.dispatcher.dispatch(new game_commands_1.OnRemoveFromShopCommand(), {
                            playerId: client.auth.uid,
                            index
                        });
                    }
                    catch (error) {
                        logger_1.logger.error("remove from shop error", index, error);
                    }
                }
            });
            this.onMessage(types_1.Transfer.POKEMON_PROPOSITION, (client, pkm) => {
                if (!this.state.gameFinished && client.auth) {
                    try {
                        this.pickPokemonProposition(client.auth.uid, pkm);
                    }
                    catch (error) {
                        logger_1.logger.error(error);
                    }
                }
            });
            this.onMessage(types_1.Transfer.DRAG_DROP, (client, message) => {
                if (!this.state.gameFinished) {
                    try {
                        this.dispatcher.dispatch(new game_commands_1.OnDragDropPokemonCommand(), {
                            client: client,
                            detail: message
                        });
                    }
                    catch (error) {
                        const errorInformation = {
                            updateBoard: true,
                            updateItems: true
                        };
                        client.send(types_1.Transfer.DRAG_DROP_FAILED, errorInformation);
                        logger_1.logger.error("drag drop error", error);
                    }
                }
            });
            this.onMessage(types_1.Transfer.DRAG_DROP_ITEM, (client, message) => {
                if (!this.state.gameFinished) {
                    try {
                        this.dispatcher.dispatch(new game_commands_1.OnDragDropItemCommand(), {
                            client: client,
                            detail: message
                        });
                    }
                    catch (error) {
                        const errorInformation = {
                            updateBoard: true,
                            updateItems: true
                        };
                        client.send(types_1.Transfer.DRAG_DROP_FAILED, errorInformation);
                        logger_1.logger.error("drag drop error", error);
                    }
                }
            });
            this.onMessage(types_1.Transfer.DRAG_DROP_COMBINE, (client, message) => {
                if (!this.state.gameFinished) {
                    try {
                        this.dispatcher.dispatch(new game_commands_1.OnDragDropCombineCommand(), {
                            client: client,
                            detail: message
                        });
                    }
                    catch (error) {
                        const errorInformation = {
                            updateBoard: true,
                            updateItems: true
                        };
                        client.send(types_1.Transfer.DRAG_DROP_FAILED, errorInformation);
                        logger_1.logger.error("drag drop error", error);
                    }
                }
            });
            this.onMessage(types_1.Transfer.VECTOR, (client, message) => {
                try {
                    if (client.auth) {
                        this.miniGame.applyVector(client.auth.uid, message.x, message.y);
                    }
                }
                catch (error) {
                    logger_1.logger.error(error);
                }
            });
            this.onMessage(types_1.Transfer.SELL_POKEMON, (client, pokemonId) => {
                if (!this.state.gameFinished && client.auth) {
                    try {
                        this.dispatcher.dispatch(new game_commands_1.OnSellPokemonCommand(), {
                            client,
                            pokemonId
                        });
                    }
                    catch (error) {
                        logger_1.logger.error("sell drop error", pokemonId);
                    }
                }
            });
            this.onMessage(types_1.Transfer.REFRESH, (client, message) => {
                if (!this.state.gameFinished && client.auth) {
                    try {
                        this.dispatcher.dispatch(new game_commands_1.OnShopRerollCommand(), client.auth.uid);
                    }
                    catch (error) {
                        logger_1.logger.error("refresh error", message);
                    }
                }
            });
            this.onMessage(types_1.Transfer.LOCK, (client, message) => {
                if (!this.state.gameFinished && client.auth) {
                    try {
                        this.dispatcher.dispatch(new game_commands_1.OnLockCommand(), client.auth.uid);
                    }
                    catch (error) {
                        logger_1.logger.error("lock error", message);
                    }
                }
            });
            this.onMessage(types_1.Transfer.SWITCH_BENCH_AND_BOARD, (client, pokemonId) => {
                if (!this.state.gameFinished && client.auth) {
                    try {
                        this.dispatcher.dispatch(new game_commands_1.OnSwitchBenchAndBoardCommand(), {
                            client,
                            pokemonId
                        });
                    }
                    catch (error) {
                        logger_1.logger.error("sell drop error", pokemonId);
                    }
                }
            });
            this.onMessage(types_1.Transfer.SPECTATE, (client, spectatedPlayerId) => {
                if (client.auth) {
                    try {
                        this.dispatcher.dispatch(new game_commands_1.OnSpectateCommand(), {
                            id: client.auth.uid,
                            spectatedPlayerId
                        });
                    }
                    catch (error) {
                        logger_1.logger.error("spectate error", client.auth.uid, spectatedPlayerId);
                    }
                }
            });
            this.onMessage(types_1.Transfer.LEVEL_UP, (client, message) => {
                if (!this.state.gameFinished && client.auth) {
                    try {
                        this.dispatcher.dispatch(new game_commands_1.OnLevelUpCommand(), client.auth.uid);
                    }
                    catch (error) {
                        logger_1.logger.error("level up error", message);
                    }
                }
            });
            this.onMessage(types_1.Transfer.SHOW_EMOTE, (client, message) => {
                if (client.auth) {
                    this.broadcast(types_1.Transfer.SHOW_EMOTE, {
                        id: client.auth.uid,
                        emote: message
                    });
                }
            });
            this.onMessage(types_1.Transfer.WANDERER_CAUGHT, (client, msg) => __awaiter(this, void 0, void 0, function* () {
                if (client.auth) {
                    try {
                        this.dispatcher.dispatch(new game_commands_1.OnPokemonCatchCommand(), {
                            client,
                            playerId: client.auth.uid,
                            id: msg.id
                        });
                    }
                    catch (e) {
                        logger_1.logger.error("catch wandering error", e);
                    }
                }
            }));
            this.onMessage(types_1.Transfer.PICK_BERRY, (client, index) => __awaiter(this, void 0, void 0, function* () {
                if (!this.state.gameFinished && client.auth) {
                    try {
                        this.dispatcher.dispatch(new game_commands_1.OnPickBerryCommand(), {
                            playerId: client.auth.uid,
                            berryIndex: index
                        });
                    }
                    catch (error) {
                        logger_1.logger.error("error picking berry", error);
                    }
                }
            }));
            this.onMessage(types_1.Transfer.LOADING_PROGRESS, (client, progress) => {
                if (client.auth) {
                    const player = this.state.players.get(client.auth.uid);
                    if (player) {
                        player.loadingProgress = progress;
                    }
                }
            });
            this.onMessage(types_1.Transfer.LOADING_COMPLETE, (client) => {
                if (client.auth) {
                    const player = this.state.players.get(client.auth.uid);
                    if (player) {
                        player.loadingProgress = 100;
                        (0, pending_game_manager_1.clearPendingGame)(this.presence, client.auth.uid);
                    }
                    if (this.state.gameLoaded) {
                        client.send(types_1.Transfer.LOADING_COMPLETE);
                    }
                    else if ((0, schemas_1.values)(this.state.players).every((p) => p.loadingProgress === 100)) {
                        this.broadcast(types_1.Transfer.LOADING_COMPLETE);
                        this.startGame();
                    }
                }
            });
        });
    }
    startGame() {
        if (this.state.gameLoaded)
            return;
        this.state.gameLoaded = true;
        this.setSimulationInterval((deltaTime) => {
            deltaTime = Math.min(Config_1.MAX_SIMULATION_DELTA_TIME, deltaTime);
            if (!this.state.gameFinished && !this.state.simulationPaused) {
                try {
                    this.dispatcher.dispatch(new game_commands_1.OnUpdateCommand(), { deltaTime });
                }
                catch (error) {
                    logger_1.logger.error("update error", error);
                }
            }
        });
        this.state.botManager.updateBots();
        this.miniGame.initialize(this.state, this);
    }
    onAuth(client, options, context) {
        const _super = Object.create(null, {
            onAuth: { get: () => super.onAuth }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super.onAuth.call(this, client, options, context);
                const token = yield firebase_admin_1.default.auth().verifyIdToken(options.idToken);
                const user = yield firebase_admin_1.default.auth().getUser(token.uid);
                if (!user.displayName) {
                    logger_1.logger.error("No display name for this account", user.uid);
                    throw new Error("No display name for this account. Please report this error.");
                }
                return user;
            }
            catch (error) {
                logger_1.logger.error(error);
            }
        });
    }
    onJoin(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const userProfile = yield user_metadata_1.default.findOne({ uid: client.auth.uid });
            if (userProfile === null || userProfile === void 0 ? void 0 : userProfile.banned) {
                throw "Account banned";
            }
            client.send(types_1.Transfer.USER_PROFILE, userProfile);
            this.dispatcher.dispatch(new game_commands_1.OnJoinCommand(), { client });
            const pendingGame = yield (0, pending_game_manager_1.getPendingGame)(this.presence, client.auth.uid);
            if ((pendingGame === null || pendingGame === void 0 ? void 0 : pendingGame.gameId) === this.roomId) {
                (0, pending_game_manager_1.clearPendingGame)(this.presence, client.auth.uid);
            }
            else if (pendingGame != null && !pendingGame.isExpired) {
                client.leave(CloseCodes_1.CloseCodes.USER_IN_ANOTHER_GAME);
            }
        });
    }
    onLeave(client, consented) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (consented) {
                    throw new Error("consented leave");
                }
                (0, pending_game_manager_1.setPendingGame)(this.presence, client.auth.uid, this.roomId);
                yield this.allowReconnection(client, Config_1.ALLOWED_GAME_RECONNECTION_TIME);
                (0, pending_game_manager_1.clearPendingGame)(this.presence, client.auth.uid);
                const userProfile = yield user_metadata_1.default.findOne({ uid: client.auth.uid });
                client.send(types_1.Transfer.USER_PROFILE, userProfile);
                this.dispatcher.dispatch(new game_commands_1.OnJoinCommand(), { client });
            }
            catch (e) {
                if (client && client.auth && client.auth.displayName) {
                    const pendingGame = yield (0, pending_game_manager_1.getPendingGame)(this.presence, client.auth.uid);
                    if (!pendingGame && !consented)
                        return;
                    else if (pendingGame &&
                        (0, date_1.isValidDate)(pendingGame.reconnectionDeadline) &&
                        pendingGame.reconnectionDeadline.getTime() > Date.now()) {
                        return;
                    }
                    (0, pending_game_manager_1.clearPendingGame)(this.presence, client.auth.uid);
                    const player = this.state.players.get(client.auth.uid);
                    const hasLeftGameBeforeTheEnd = player && player.life > 0 && !this.state.gameFinished;
                    const otherHumans = (0, schemas_1.values)(this.state.players).filter((p) => !p.isBot && p.id !== client.auth.uid);
                    if (hasLeftGameBeforeTheEnd &&
                        otherHumans.length >= 1 &&
                        player.role !== types_1.Role.ADMIN) {
                        (0, pending_game_manager_1.givePlayerTimeout)(this.presence, client.auth.uid);
                    }
                    if (player && this.state.stageLevel <= 5 && !consented) {
                        this.state.players.delete(client.auth.uid);
                        this.setMetadata({
                            playerIds: (0, array_1.removeInArray)(this.metadata.playerIds, client.auth.uid)
                        });
                    }
                    else if (player && !player.hasLeftGame) {
                        player.hasLeftGame = true;
                        player.spectatedPlayerId = player.id;
                        const hasLeftBeforeEnd = player.life > 0 && !this.state.gameFinished;
                        if (hasLeftBeforeEnd) {
                            player.life = -99;
                            this.rankPlayers();
                        }
                        this.updatePlayerAfterGame(player, hasLeftBeforeEnd);
                    }
                }
                if (!this.state.gameLoaded &&
                    (0, schemas_1.values)(this.state.players).every((p) => p.loadingProgress === 100)) {
                    this.broadcast(types_1.Transfer.LOADING_COMPLETE);
                    this.startGame();
                }
            }
        });
    }
    onDispose() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            logger_1.logger.info("Dispose Game ", this.roomId);
            this.presence.unsubscribe("room-deleted", this.onRoomDeleted);
            const players = (0, schemas_1.values)(this.state.players);
            players.forEach((player) => {
                (0, pending_game_manager_1.clearPendingGamesOnRoomDispose)(this.presence, player.id, this.roomId);
            });
            const playersAlive = players.filter((p) => p.alive);
            const humansAlive = playersAlive.filter((p) => !p.isBot);
            if (playersAlive.length >= 2 && humansAlive.length >= 1) {
                if (humansAlive.length > 1) {
                    logger_1.logger.warn(`Game room has been disposed while they were still ${humansAlive.length} players alive.`);
                }
                return;
            }
            try {
                this.state.endTime = Date.now();
                const humans = [];
                const bots = [];
                this.state.players.forEach((player) => {
                    if (player.isBot) {
                        bots.push(player);
                    }
                    else {
                        humans.push(player);
                    }
                });
                const players = [...humans, ...bots].map((p) => this.transformToSimplePlayer(p));
                history_1.default.create({
                    id: this.state.preparationId,
                    name: this.state.name,
                    startTime: this.state.startTime,
                    endTime: this.state.endTime,
                    players: humans.map((p) => this.transformToSimplePlayer(p))
                });
                if (this.state.stageLevel >= Config_1.MinStageForGameToCount) {
                    const elligibleToXP = this.state.players.size >= 2;
                    if (elligibleToXP) {
                        for (let i = 0; i < bots.length; i++) {
                            const botPlayer = bots[i];
                            const bot = yield bot_v2_1.BotV2.findOne({ id: botPlayer.id });
                            if (bot) {
                                bot.elo = (0, elo_1.computeElo)(this.transformToSimplePlayer(botPlayer), botPlayer.rank, bot.elo, players, this.state.gameMode, true);
                                bot.save();
                            }
                        }
                        for (let i = 0; i < humans.length; i++) {
                            const player = humans[i];
                            if (!player.hasLeftGame) {
                                player.hasLeftGame = true;
                                this.updatePlayerAfterGame(player, false);
                            }
                        }
                    }
                }
                if (this.state.gameMode === Game_1.GameMode.TOURNAMENT) {
                    this.presence.publish("tournament-match-end", {
                        tournamentId: (_a = this.metadata) === null || _a === void 0 ? void 0 : _a.tournamentId,
                        bracketId: (_b = this.metadata) === null || _b === void 0 ? void 0 : _b.bracketId,
                        players: humans
                    });
                }
                this.dispatcher.stop();
            }
            catch (error) {
                logger_1.logger.error(error);
            }
        });
    }
    updatePlayerAfterGame(player, hasLeftBeforeEnd) {
        return __awaiter(this, void 0, void 0, function* () {
            const elligibleToXP = this.state.players.size >= 2 &&
                this.state.stageLevel >= Config_1.MinStageForGameToCount;
            const humans = [];
            const bots = [];
            this.state.players.forEach((player) => {
                if (player.isBot) {
                    bots.push(player);
                }
                else {
                    humans.push(player);
                }
            });
            const elligibleToELO = !this.state.noElo &&
                (this.state.stageLevel >= Config_1.MinStageForGameToCount || hasLeftBeforeEnd) &&
                humans.length >= 2;
            const rank = player.rank;
            const exp = Config_1.ExpPlace[rank - 1];
            const usr = yield user_metadata_1.default.findOne({ uid: player.id });
            if (usr) {
                if (elligibleToXP) {
                    const expThreshold = 1000;
                    if (usr.exp + exp >= expThreshold) {
                        usr.level += 1;
                        usr.booster += 1;
                        usr.exp = usr.exp + exp - expThreshold;
                    }
                    else {
                        usr.exp = usr.exp + exp;
                    }
                    usr.exp = !isNaN(usr.exp) ? usr.exp : 0;
                }
                if (rank === 1) {
                    usr.wins += 1;
                    if (this.state.gameMode === Game_1.GameMode.RANKED) {
                        player.titles.add(types_1.Title.VANQUISHER);
                        const minElo = Math.min(...(0, schemas_1.values)(this.state.players).map((p) => p.elo));
                        if (usr.elo === minElo && humans.length >= 8) {
                            player.titles.add(types_1.Title.OUTSIDER);
                        }
                    }
                }
                if (usr.level >= 10) {
                    player.titles.add(types_1.Title.ROOKIE);
                }
                if (usr.level >= 20) {
                    player.titles.add(types_1.Title.AMATEUR);
                    player.titles.add(types_1.Title.BOT_BUILDER);
                }
                if (usr.level >= 30) {
                    player.titles.add(types_1.Title.VETERAN);
                }
                if (usr.level >= 50) {
                    player.titles.add(types_1.Title.PRO);
                }
                if (usr.level >= 100) {
                    player.titles.add(types_1.Title.EXPERT);
                }
                if (usr.level >= 150) {
                    player.titles.add(types_1.Title.ELITE);
                }
                if (usr.level >= 200) {
                    player.titles.add(types_1.Title.MASTER);
                }
                if (usr.level >= 300) {
                    player.titles.add(types_1.Title.GRAND_MASTER);
                }
                if (usr.elo != null && elligibleToELO) {
                    const elo = (0, elo_1.computeElo)(this.transformToSimplePlayer(player), rank, usr.elo, humans.map((p) => this.transformToSimplePlayer(p)), this.state.gameMode, false);
                    if (elo) {
                        if (elo >= 1100) {
                            player.titles.add(types_1.Title.GYM_TRAINER);
                        }
                        if (elo >= 1200) {
                            player.titles.add(types_1.Title.GYM_CHALLENGER);
                        }
                        if (elo >= 1400) {
                            player.titles.add(types_1.Title.GYM_LEADER);
                        }
                        usr.elo = elo;
                    }
                    const dbrecord = this.transformToSimplePlayer(player);
                    const synergiesMap = new Map();
                    player.synergies.forEach((v, k) => {
                        v > 0 && synergiesMap.set(k, v);
                    });
                    detailled_statistic_v2_1.default.create({
                        time: Date.now(),
                        name: dbrecord.name,
                        pokemons: dbrecord.pokemons,
                        rank: dbrecord.rank,
                        nbplayers: humans.length + bots.length,
                        avatar: dbrecord.avatar,
                        playerId: dbrecord.id,
                        elo: elo,
                        synergies: synergiesMap,
                        gameMode: this.state.gameMode
                    });
                }
                if (player.life >= 100 && rank === 1) {
                    player.titles.add(types_1.Title.TYRANT);
                }
                if (player.life === 1 && rank === 1) {
                    player.titles.add(types_1.Title.SURVIVOR);
                }
                if (player.rerollCount > 60) {
                    player.titles.add(types_1.Title.GAMBLER);
                }
                else if (player.rerollCount < 20 && rank === 1) {
                    player.titles.add(types_1.Title.NATURAL);
                }
                player.pokemonsPlayed.forEach((pkm) => {
                    const index = Pokemon_1.PkmIndex[pkm];
                    const pokemonCollectionItem = usr.pokemonCollection.get(index);
                    if (pokemonCollectionItem) {
                        pokemonCollectionItem.played = pokemonCollectionItem.played + 1;
                        usr.markModified(`pokemonCollection.${index}.played`);
                    }
                    else {
                        const newConfig = {
                            dust: 0,
                            id: index,
                            emotions: [],
                            shinyEmotions: [],
                            selectedEmotion: null,
                            selectedShiny: false,
                            played: 1
                        };
                        usr.pokemonCollection.set(index, newConfig);
                    }
                });
                if (player.titles.has(types_1.Title.COLLECTOR) === false &&
                    Object.values(Pokemon_1.PkmIndex).every((pkmIndex) => {
                        const pokemonCollectionItem = usr.pokemonCollection.get(pkmIndex);
                        return pokemonCollectionItem && pokemonCollectionItem.played > 0;
                    })) {
                    player.titles.add(types_1.Title.COLLECTOR);
                }
                if (usr.titles === undefined) {
                    usr.titles = [];
                }
                player.titles.forEach((t) => {
                    if (!usr.titles.includes(t)) {
                        usr.titles.push(t);
                    }
                });
                usr.save();
            }
        });
    }
    transformToSimplePlayer(player) {
        const simplePlayer = {
            name: player.name,
            id: player.id,
            rank: player.rank,
            avatar: player.avatar,
            pokemons: new Array(),
            elo: player.elo,
            synergies: [],
            title: player.title,
            role: player.role
        };
        player.synergies.forEach((v, k) => {
            simplePlayer.synergies.push({ name: k, value: v });
        });
        player.board.forEach((pokemon) => {
            if (pokemon.positionY != 0 && pokemon.passive !== Passive_1.Passive.INANIMATE) {
                const avatar = (0, avatar_1.getAvatarString)(pokemon.index, pokemon.shiny, pokemon.emotion);
                const s = {
                    name: pokemon.name,
                    avatar: avatar,
                    items: new Array(),
                    inventory: new Array()
                };
                pokemon.items.forEach((i) => {
                    s.items.push(i);
                    s.inventory.push(i);
                });
                simplePlayer.pokemons.push(s);
            }
        });
        return simplePlayer;
    }
    spawnOnBench(player, pkm, anim = "spawn") {
        const pokemon = pokemon_factory_1.default.createPokemonFromName(pkm, player);
        const x = (0, board_1.getFirstAvailablePositionInBench)(player.board);
        if (x !== undefined) {
            pokemon.positionX = x;
            pokemon.positionY = 0;
            if (anim === "fishing") {
                pokemon.action = Game_1.PokemonActionState.FISH;
            }
            player.board.set(pokemon.id, pokemon);
            this.clock.setTimeout(() => {
                pokemon.action = Game_1.PokemonActionState.IDLE;
                this.checkEvolutionsAfterPokemonAcquired(player.id);
            }, 1000);
        }
    }
    checkEvolutionsAfterPokemonAcquired(playerId) {
        const player = this.state.players.get(playerId);
        if (!player)
            return false;
        let hasEvolved = false;
        player.board.forEach((pokemon) => {
            if (pokemon.hasEvolution &&
                pokemon.evolutionRule instanceof evolution_rules_1.CountEvolutionRule) {
                const pokemonEvolved = pokemon.evolutionRule.tryEvolve(pokemon, player, this.state.stageLevel);
                if (pokemonEvolved) {
                    hasEvolved = true;
                }
            }
        });
        player.boardSize = this.getTeamSize(player.board);
        return hasEvolved;
    }
    checkEvolutionsAfterItemAcquired(playerId, pokemon) {
        const player = this.state.players.get(playerId);
        if (!player)
            return;
        if (pokemon.evolutionRule &&
            pokemon.evolutionRule instanceof evolution_rules_1.ItemEvolutionRule) {
            const pokemonEvolved = pokemon.evolutionRule.tryEvolve(pokemon, player, this.state.stageLevel);
            return pokemonEvolved;
        }
    }
    getNumberOfPlayersAlive(players) {
        let numberOfPlayersAlive = 0;
        players.forEach((player, key) => {
            if (player.alive) {
                numberOfPlayersAlive++;
            }
        });
        return numberOfPlayersAlive;
    }
    getTeamSize(board) {
        let size = 0;
        board.forEach((pokemon, key) => {
            if (pokemon.positionY != 0 && pokemon.doesCountForTeamSize) {
                size++;
            }
        });
        return size;
    }
    pickPokemonProposition(playerId, pkm, bypassLackOfSpace = false) {
        var _a, _b;
        const player = this.state.players.get(playerId);
        if (!player || player.pokemonsProposition.length === 0)
            return;
        if (this.state.additionalPokemons.includes(pkm))
            return;
        if (Config_1.UniquePool.includes(pkm) &&
            this.state.stageLevel !== Config_1.PortalCarouselStages[1])
            return;
        if (Config_1.LegendaryPool.includes(pkm) &&
            this.state.stageLevel !== Config_1.PortalCarouselStages[2])
            return;
        const pokemonsObtained = (pkm in Pokemon_1.PkmDuos ? Pokemon_1.PkmDuos[pkm] : [pkm]).map((p) => pokemon_factory_1.default.createPokemonFromName(p, player));
        const freeSpace = (0, board_1.getFreeSpaceOnBench)(player.board);
        if (freeSpace < pokemonsObtained.length && !bypassLackOfSpace)
            return;
        const selectedIndex = player.pokemonsProposition.indexOf(pkm);
        player.pokemonsProposition.clear();
        if (Config_1.AdditionalPicksStages.includes(this.state.stageLevel)) {
            if ((_a = pokemonsObtained[0]) === null || _a === void 0 ? void 0 : _a.regional) {
                const basePkm = ((_b = Object.keys(Pokemon_1.PkmRegionalVariants).find((p) => Pokemon_1.PkmRegionalVariants[p].includes(pokemonsObtained[0].name))) !== null && _b !== void 0 ? _b : pokemonsObtained[0].name);
                this.state.additionalPokemons.push(basePkm);
                this.state.shop.addAdditionalPokemon(basePkm);
                player.regionalPokemons.push(pkm);
            }
            else {
                this.state.additionalPokemons.push(pkm);
                this.state.shop.addAdditionalPokemon(pkm);
            }
            this.state.players.forEach((p) => p.updateRegionalPool(this.state, false));
            const selectedItem = player.itemsProposition[selectedIndex];
            if (player.itemsProposition.length > 0 && selectedItem != null) {
                player.items.push(selectedItem);
                player.itemsProposition.clear();
            }
        }
        if (this.state.specialGameRule === SpecialGameRule_1.SpecialGameRule.FIRST_PARTNER &&
            this.state.stageLevel <= 1) {
            player.firstPartner = pokemonsObtained[0].name;
        }
        pokemonsObtained.forEach((pokemon) => {
            const freeCellX = (0, board_1.getFirstAvailablePositionInBench)(player.board);
            if (freeCellX !== undefined) {
                pokemon.positionX = freeCellX;
                pokemon.positionY = 0;
                player.board.set(pokemon.id, pokemon);
                pokemon.onAcquired(player);
            }
        });
    }
    pickItemProposition(playerId, item) {
        const player = this.state.players.get(playerId);
        if (player && player.itemsProposition.includes(item)) {
            player.items.push(item);
            player.itemsProposition.clear();
        }
    }
    computeRoundDamage(opponentTeam, stageLevel) {
        let damage = Math.ceil(stageLevel / 2);
        if (opponentTeam.size > 0) {
            opponentTeam.forEach((pokemon) => {
                if (!pokemon.isSpawn && pokemon.passive !== Passive_1.Passive.INANIMATE) {
                    damage += 1;
                }
            });
        }
        return damage;
    }
    rankPlayers() {
        const rankArray = new Array();
        this.state.players.forEach((player) => {
            if (!player.alive) {
                return;
            }
            rankArray.push({
                id: player.id,
                life: player.life,
                level: player.experienceManager.level
            });
        });
        const sortPlayers = (a, b) => {
            let diff = b.life - a.life;
            if (diff == 0) {
                diff = b.level - a.level;
            }
            return diff;
        };
        rankArray.sort(sortPlayers);
        rankArray.forEach((rankPlayer, index) => {
            const player = this.state.players.get(rankPlayer.id);
            if (player) {
                player.rank = index + 1;
            }
        });
    }
    onRoomDeleted(roomId) {
        if (this.roomId === roomId) {
            this.disconnect(CloseCodes_1.CloseCodes.ROOM_DELETED);
        }
    }
    spawnWanderingPokemon(wandererNoId, player) {
        const client = this.clients.find((cli) => cli.auth.uid === player.id);
        if (!client)
            return;
        const id = (0, nanoid_1.nanoid)();
        const wanderer = Object.assign(Object.assign({}, wandererNoId), { id });
        this.state.wanderers.set(id, wanderer);
        client.send(types_1.Transfer.WANDERER, wanderer);
    }
}
exports.default = GameRoom;
//# sourceMappingURL=game-room.js.map