"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pokemon_factory_1 = __importDefault(require("../../../../models/pokemon-factory"));
const Game_1 = require("../../../../types/enum/Game");
const number_1 = require("../../../../utils/number");
const preferences_1 = require("../../preferences");
const pokemon_1 = __importDefault(require("./pokemon"));
const game_dialog_1 = require("./game-dialog");
class PokemonSpecial extends pokemon_1.default {
    constructor({ scene, x, y, name, orientation = Game_1.Orientation.DOWN, animation = Game_1.PokemonActionState.IDLE, dialog, dialogTitle, shiny }) {
        var _a;
        super(scene, x + 24, y + 24, pokemon_factory_1.default.createPokemonFromName(name, { shiny }), "environment", false, false);
        this.detail = null;
        this.scene = scene;
        this.draggable = false;
        this.orientation = orientation;
        (_a = scene.animationManager) === null || _a === void 0 ? void 0 : _a.animatePokemon(this, animation, false);
        this.dialog = dialog;
        this.dialogTitle = dialogTitle;
    }
    onPointerDown(pointer, event) {
        var _a;
        super.onPointerDown(pointer, event);
        event.stopPropagation();
        (_a = this.scene.animationManager) === null || _a === void 0 ? void 0 : _a.animatePokemon(this, Game_1.PokemonActionState.EMOTE, false, false);
    }
    openDetail() {
        if (this.dialog) {
            const s = this.scene;
            if (s.lastPokemonDetail && s.lastPokemonDetail != this) {
                s.lastPokemonDetail.closeDetail();
                s.lastPokemonDetail = null;
            }
            this.detail = new game_dialog_1.GameDialog(this.scene, this.dialog, this.dialogTitle);
            this.detail.setPosition(this.detail.width / 2 + 40, (0, number_1.min)(0)(-this.detail.height / 2 - 40));
            this.detail.removeInteractive();
            this.add(this.detail);
            s.lastPokemonDetail = this;
        }
    }
    updateTooltipPosition() {
        if (this.detail) {
            if (this.input && (0, preferences_1.preference)("showDetailsOnHover")) {
                this.detail.setPosition(this.input.localX, this.input.localY);
                return;
            }
            const absX = this.x + this.detail.width / 2 + 40;
            const minX = this.detail.width / 2;
            const maxX = window.innerWidth - this.detail.width / 2;
            const absY = this.y - this.detail.height / 2 - 40;
            const minY = this.detail.height / 2;
            const maxY = window.innerHeight - this.detail.height / 2;
            const [x, y] = [
                (0, number_1.clamp)(absX, minX, maxX) - this.x,
                (0, number_1.clamp)(absY, minY, maxY) - this.y
            ];
            this.detail.setPosition(x, y);
        }
    }
}
exports.default = PokemonSpecial;
//# sourceMappingURL=pokemon-special.js.map