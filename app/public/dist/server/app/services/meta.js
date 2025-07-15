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
exports.fetchMetaReports = fetchMetaReports;
exports.getMetaPokemons = getMetaPokemons;
exports.getMetaItems = getMetaItems;
exports.getMetadata = getMetadata;
const pokemons_statistic_v2_1 = __importDefault(require("../models/mongo-models/pokemons-statistic-v2"));
const report_metadata_1 = __importDefault(require("../models/mongo-models/report-metadata"));
const logger_1 = require("../utils/logger");
const items_statistic_v2_1 = __importDefault(require("../models/mongo-models/items-statistic-v2"));
function fetchMetaReports() {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.info("Refreshing meta reports...");
        const data = yield Promise.all([
            fetchMetadata(),
            fetchMetaItems(),
            fetchMetaPokemons()
        ]);
        logger_1.logger.info("Meta reports refreshed");
        return data;
    });
}
let metadata = new Array();
let metaItems = new Array();
let metaPokemons = new Array();
function fetchMetaItems() {
    return __awaiter(this, void 0, void 0, function* () {
        metaItems = yield items_statistic_v2_1.default.find().exec();
        return metaItems;
    });
}
function fetchMetaPokemons() {
    return __awaiter(this, void 0, void 0, function* () {
        metaPokemons = yield pokemons_statistic_v2_1.default.find().exec();
        return metaPokemons;
    });
}
function fetchMetadata() {
    return __awaiter(this, void 0, void 0, function* () {
        metadata = yield report_metadata_1.default.find().exec();
        return metadata;
    });
}
function getMetaPokemons() {
    return metaPokemons;
}
function getMetaItems() {
    return metaItems;
}
function getMetadata() {
    return metadata;
}
//# sourceMappingURL=meta.js.map