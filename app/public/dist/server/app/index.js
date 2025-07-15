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
const tools_1 = require("@colyseus/tools");
const colyseus_1 = require("colyseus");
const cron_1 = require("cron");
const app_config_1 = __importDefault(require("./app.config"));
const metrics_1 = require("./metrics");
const cronjobs_1 = require("./services/cronjobs");
const leaderboard_1 = require("./services/leaderboard");
const meta_1 = require("./services/meta");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (process.env.NODE_APP_INSTANCE) {
            const processNumber = Number((_a = process.env.NODE_APP_INSTANCE) !== null && _a !== void 0 ? _a : "0");
            const port = ((_b = Number(process.env.PORT)) !== null && _b !== void 0 ? _b : 2569) + processNumber;
            (0, metrics_1.initializeMetrics)();
            yield (0, tools_1.listen)(app_config_1.default);
            if (port === 2569) {
                yield colyseus_1.matchMaker.createRoom("lobby", {});
                checkLobby();
                (0, cronjobs_1.initCronJobs)();
            }
        }
        else {
            yield (0, tools_1.listen)(app_config_1.default, process.env.PORT ? parseInt(process.env.PORT) : 9000);
            yield colyseus_1.matchMaker.createRoom("lobby", {});
            (0, cronjobs_1.initCronJobs)();
        }
        colyseus_1.logger.info("Fetching leaderboards...");
        (0, leaderboard_1.fetchLeaderboards)();
        setInterval(() => (0, leaderboard_1.fetchLeaderboards)(), 1000 * 60 * 10);
        colyseus_1.logger.info("Fetching meta reports...");
        (0, meta_1.fetchMetaReports)();
        setInterval(() => (0, meta_1.fetchMetaReports)(), 1000 * 60 * 60 * 24);
    });
}
function checkLobby() {
    colyseus_1.logger.info("checkLobby cron job");
    cron_1.CronJob.from({
        cronTime: "* * * * *",
        timeZone: "Europe/Paris",
        onTick: () => __awaiter(this, void 0, void 0, function* () {
            const lobbies = yield colyseus_1.matchMaker.query({ name: "lobby" });
            if (lobbies.length === 0) {
                colyseus_1.logger.warn(`Lobby room has not been found, automatically remaking one`);
                colyseus_1.matchMaker.createRoom("lobby", {});
            }
        }),
        start: true
    });
}
main();
//# sourceMappingURL=index.js.map