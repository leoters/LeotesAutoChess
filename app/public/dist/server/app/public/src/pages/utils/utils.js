"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIREBASE_CONFIG = void 0;
exports.transformBoardCoordinates = transformBoardCoordinates;
exports.transformEntityCoordinates = transformEntityCoordinates;
exports.transformMiniGameXCoordinate = transformMiniGameXCoordinate;
exports.transformMiniGameYCoordinate = transformMiniGameYCoordinate;
const Config_1 = require("../../../../types/Config");
exports.FIREBASE_CONFIG = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};
function transformBoardCoordinates(x, y) {
    if (y === 0) {
        return [
            Config_1.BOARD_X_START + Config_1.CELL_WIDTH * x,
            Config_1.BOARD_Y_START
        ];
    }
    else {
        return [
            Config_1.BOARD_X_START + Config_1.CELL_WIDTH * x,
            Config_1.BOARD_Y_START - Config_1.CELL_HEIGHT * (y + 1) + Config_1.CELL_HEIGHT / 2
        ];
    }
}
function transformEntityCoordinates(x, y, flip) {
    return [
        Config_1.BOARD_X_START + Config_1.CELL_WIDTH * x,
        Config_1.CELL_HEIGHT / 2 + (flip ?
            Config_1.BOARD_Y_START + Config_1.CELL_HEIGHT * (y - 7) :
            Config_1.BOARD_Y_START - Config_1.CELL_HEIGHT * (y + 2))
    ];
}
function transformMiniGameXCoordinate(x) {
    return Config_1.BOARD_X_START + x;
}
function transformMiniGameYCoordinate(y) {
    return Config_1.BOARD_Y_START - y - Config_1.CELL_HEIGHT * 1.5;
}
//# sourceMappingURL=utils.js.map