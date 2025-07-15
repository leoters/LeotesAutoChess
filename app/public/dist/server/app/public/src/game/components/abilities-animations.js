"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayAbility = displayAbility;
exports.hiddenPowerAnimation = hiddenPowerAnimation;
const phaser_1 = require("phaser");
const pokemon_factory_1 = __importDefault(require("../../../../models/pokemon-factory"));
const types_1 = require("../../../../types");
const Animation_1 = require("../../../../types/Animation");
const Config_1 = require("../../../../types/Config");
const Ability_1 = require("../../../../types/enum/Ability");
const Game_1 = require("../../../../types/enum/Game");
const Item_1 = require("../../../../types/enum/Item");
const Pokemon_1 = require("../../../../types/enum/Pokemon");
const distance_1 = require("../../../../utils/distance");
const logger_1 = require("../../../../utils/logger");
const orientation_1 = require("../../../../utils/orientation");
const random_1 = require("../../../../utils/random");
const utils_1 = require("../../pages/utils/utils");
const depths_1 = require("../depths");
const pokemon_1 = __importDefault(require("./pokemon"));
function displayAbility(scene, pokemonsOnBoard, skill, orientation, positionX, positionY, targetX, targetY, flip, delay) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99, _100, _101, _102, _103, _104, _105, _106, _107, _108, _109, _110, _111, _112, _113, _114, _115, _116, _117, _118, _119, _120, _121, _122, _123, _124, _125, _126, _127, _128, _129, _130, _131, _132, _133, _134, _135, _136, _137, _138, _139, _140, _141, _142, _143, _144, _145, _146, _147, _148, _149, _150, _151, _152, _153, _154, _155, _156, _157, _158, _159, _160, _161, _162, _163, _164, _165, _166, _167, _168, _169, _170, _171, _172, _173, _174, _175, _176, _177, _178, _179, _180, _181, _182, _183, _184, _185, _186, _187, _188, _189, _190, _191, _192, _193, _194, _195, _196, _197, _198, _199, _200, _201, _202, _203, _204, _205, _206, _207, _208, _209, _210, _211, _212, _213, _214, _215, _216, _217, _218, _219, _220, _221, _222, _223, _224, _225, _226, _227, _228, _229, _230, _231, _232, _233, _234, _235, _236, _237, _238, _239, _240, _241, _242, _243, _244, _245, _246, _247, _248, _249, _250, _251, _252, _253, _254, _255, _256, _257, _258, _259, _260, _261, _262, _263, _264, _265, _266, _267, _268, _269, _270, _271, _272, _273, _274, _275, _276, _277, _278, _279, _280, _281, _282, _283, _284, _285, _286, _287, _288, _289, _290, _291, _292, _293, _294, _295, _296, _297, _298, _299, _300, _301, _302, _303, _304, _305, _306, _307, _308, _309, _310, _311, _312, _313, _314, _315, _316, _317, _318, _319, _320, _321, _322, _323, _324, _325, _326, _327, _328, _329, _330, _331, _332, _333, _334, _335, _336, _337, _338, _339, _340, _341, _342, _343, _344, _345, _346;
    const coordinates = (0, utils_1.transformEntityCoordinates)(positionX, positionY, flip);
    const coordinatesTarget = (0, utils_1.transformEntityCoordinates)(targetX, targetY, flip);
    function addAbilitySprite(skill, coordinates, destroyOnComplete) {
        const frame = `${skill}/000.png`;
        if (!scene.textures.exists("abilities") ||
            !scene.textures.get("abilities").has(frame)) {
            logger_1.logger.warn(`Missing frame: ${frame} in abilities texture`);
            return null;
        }
        if (!scene.anims.exists(skill)) {
            logger_1.logger.warn(`Missing animation: ${skill}`);
            return null;
        }
        const abilityFx = scene.add.sprite(coordinates[0], coordinates[1], "abilities", frame);
        abilityFx.setOrigin(0.5, 0.5).setDepth(depths_1.DEPTH.ABILITY).play(skill);
        if (destroyOnComplete) {
            abilityFx.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                abilityFx.destroy();
            });
        }
        return abilityFx;
    }
    switch (skill) {
        case Ability_1.Ability.AGILITY:
            (_a = addAbilitySprite(skill, coordinatesTarget, true)) === null || _a === void 0 ? void 0 : _a.setScale(3);
            break;
        case Ability_1.Ability.FIRE_BLAST:
            (_b = addAbilitySprite(skill, coordinatesTarget, true)) === null || _b === void 0 ? void 0 : _b.setScale(3);
            break;
        case Ability_1.Ability.FIERY_DANCE:
            (_c = addAbilitySprite(Ability_1.Ability.FIRE_BLAST, coordinatesTarget, true)) === null || _c === void 0 ? void 0 : _c.setScale(2);
            break;
        case Ability_1.Ability.FIRE_SPIN:
            (_d = addAbilitySprite(Ability_1.Ability.MAGMA_STORM, coordinatesTarget, true)) === null || _d === void 0 ? void 0 : _d.setScale(2);
            break;
        case Ability_1.Ability.CRABHAMMER:
            (_e = addAbilitySprite(skill, coordinatesTarget, true)) === null || _e === void 0 ? void 0 : _e.setScale(2);
            break;
        case Ability_1.Ability.DIAMOND_STORM:
            (_f = addAbilitySprite(skill, coordinates, true)) === null || _f === void 0 ? void 0 : _f.setScale(2);
            break;
        case Ability_1.Ability.DRACO_ENERGY:
            (_g = addAbilitySprite(skill, coordinatesTarget, true)) === null || _g === void 0 ? void 0 : _g.setScale(2);
            break;
        case Ability_1.Ability.DYNAMAX_CANNON:
        case Ability_1.Ability.MOONGEIST_BEAM:
            (_h = addAbilitySprite(skill, coordinates, true)) === null || _h === void 0 ? void 0 : _h.setScale(2).setOrigin(0.5, 0).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            break;
        case Ability_1.Ability.FREEZING_GLARE:
            (_j = addAbilitySprite(skill, [coordinates[0], coordinates[1] - 50], true)) === null || _j === void 0 ? void 0 : _j.setScale(2).setOrigin(0.5, 0.98).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) +
                Math.PI / 2);
            break;
        case Ability_1.Ability.BLOOD_MOON: {
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoordinates = [
                coordinates[0] + dx * 16,
                coordinates[1] - dy * 16 - 24
            ];
            (_k = addAbilitySprite(Ability_1.Ability.DYNAMAX_CANNON, finalCoordinates, true)) === null || _k === void 0 ? void 0 : _k.setScale(2).setTint(0xff5060).setOrigin(0.5, 0).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            (_l = addAbilitySprite("COSMIC_POWER", coordinates, true)) === null || _l === void 0 ? void 0 : _l.setTint(0xff5060).setOrigin(0.5, 1).setScale(2);
            break;
        }
        case Ability_1.Ability.DYNAMIC_PUNCH:
            (_m = addAbilitySprite(skill, coordinatesTarget, true)) === null || _m === void 0 ? void 0 : _m.setScale(2);
            break;
        case Ability_1.Ability.ELECTRO_WEB:
            (_o = addAbilitySprite(skill, coordinatesTarget, true)) === null || _o === void 0 ? void 0 : _o.setScale(2);
            break;
        case Ability_1.Ability.MYSTICAL_FIRE:
            (_p = addAbilitySprite(skill, [coordinatesTarget[0], coordinatesTarget[1] - 25], true)) === null || _p === void 0 ? void 0 : _p.setScale(2);
            break;
        case Ability_1.Ability.FLAME_CHARGE:
            (_q = addAbilitySprite(skill, coordinates, true)) === null || _q === void 0 ? void 0 : _q.setScale(2).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON).setOrigin(1, 1).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) +
                Math.PI / 2);
            break;
        case Ability_1.Ability.PASTEL_VEIL:
            (_r = addAbilitySprite(skill, coordinates, true)) === null || _r === void 0 ? void 0 : _r.setScale(2).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON).setOrigin(1, 1).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) + Math.PI);
            break;
        case Ability_1.Ability.AQUA_JET:
            (_s = addAbilitySprite(skill, coordinates, true)) === null || _s === void 0 ? void 0 : _s.setScale(2).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            break;
        case Ability_1.Ability.EXTREME_SPEED:
            (_t = addAbilitySprite(skill, coordinates, true)) === null || _t === void 0 ? void 0 : _t.setScale(2);
            (_u = addAbilitySprite(skill, coordinatesTarget, true)) === null || _u === void 0 ? void 0 : _u.setScale(2);
            break;
        case Ability_1.Ability.SILVER_WIND: {
            const specialProjectile = (_v = addAbilitySprite(Ability_1.Ability.EXTREME_SPEED, coordinates)) === null || _v === void 0 ? void 0 : _v.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: Phaser.Math.Easing.Linear,
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.PSYSHIELD_BASH:
            (_w = addAbilitySprite(skill, coordinatesTarget, true)) === null || _w === void 0 ? void 0 : _w.setScale(2);
            break;
        case Ability_1.Ability.POWER_WHIP:
            (_x = addAbilitySprite(skill, coordinates, true)) === null || _x === void 0 ? void 0 : _x.setScale(2);
            break;
        case "POWER_WHIP/hit":
            (_y = addAbilitySprite("POWER_WHIP/hit", coordinates, true)) === null || _y === void 0 ? void 0 : _y.setScale(3);
            break;
        case Ability_1.Ability.LANDS_WRATH:
            (_z = addAbilitySprite(skill, coordinates, true)) === null || _z === void 0 ? void 0 : _z.setScale(2);
            break;
        case "LANDS_WRATH/hit":
            (_0 = addAbilitySprite("LANDS_WRATH/hit", coordinates, true)) === null || _0 === void 0 ? void 0 : _0.setScale(2);
            break;
        case Ability_1.Ability.CORE_ENFORCER:
            {
                const topLeft = (0, utils_1.transformEntityCoordinates)(targetX - 1, targetY + 1, flip);
                const topRight = (0, utils_1.transformEntityCoordinates)(targetX + 1, targetY + 1, flip);
                const bottomLeft = (0, utils_1.transformEntityCoordinates)(targetX - 1, targetY - 1, flip);
                (_1 = addAbilitySprite(skill, topLeft, true)) === null || _1 === void 0 ? void 0 : _1.setOrigin(0, 0.5).setScale(2);
                setTimeout(() => {
                    var _a;
                    return (_a = addAbilitySprite(skill, topRight, true)) === null || _a === void 0 ? void 0 : _a.setScale(2).setOrigin(0, 0.5).setRotation((Math.PI * 3) / 4);
                }, 100);
                setTimeout(() => {
                    var _a;
                    return (_a = addAbilitySprite(skill, bottomLeft, true)) === null || _a === void 0 ? void 0 : _a.setOrigin(0, 0.5).setScale(2);
                }, 200);
            }
            break;
        case Ability_1.Ability.LEECH_SEED:
            (_2 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _2 === void 0 ? void 0 : _2.setScale(2);
            break;
        case Ability_1.Ability.LOCK_ON:
            (_3 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _3 === void 0 ? void 0 : _3.setScale(2);
            break;
        case Ability_1.Ability.PSYCH_UP:
            (_4 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _4 === void 0 ? void 0 : _4.setScale(2);
            break;
        case Ability_1.Ability.MAGIC_POWDER:
            (_5 = addAbilitySprite(skill, coordinates, true)) === null || _5 === void 0 ? void 0 : _5.setScale(2);
            break;
        case Ability_1.Ability.SALT_CURE:
            (_6 = addAbilitySprite(Ability_1.Ability.MAGIC_POWDER, coordinates, true)) === null || _6 === void 0 ? void 0 : _6.setScale(2).setTint(0xb0ff80);
            break;
        case Ability_1.Ability.SPICY_EXTRACT:
            (_7 = addAbilitySprite(Ability_1.Ability.MAGIC_POWDER, coordinates, true)) === null || _7 === void 0 ? void 0 : _7.setScale(3).setTint(0xff9000);
            break;
        case Ability_1.Ability.SWEET_SCENT:
            (_8 = addAbilitySprite(Ability_1.Ability.MAGIC_POWDER, coordinates, true)) === null || _8 === void 0 ? void 0 : _8.setScale(3).setTint(0xffc0c0);
            break;
        case Ability_1.Ability.RAZOR_WIND:
            (_9 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _9 === void 0 ? void 0 : _9.setScale(2);
            break;
        case Ability_1.Ability.TWISTING_NETHER:
            (_10 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _10 === void 0 ? void 0 : _10.setScale(4).setOrigin(0.5);
            break;
        case Ability_1.Ability.DARK_VOID:
            (_11 = addAbilitySprite(Ability_1.Ability.TWISTING_NETHER, coordinatesTarget, true)) === null || _11 === void 0 ? void 0 : _11.setScale(4);
            break;
        case Ability_1.Ability.WHEEL_OF_FIRE: {
            const specialProjectile = (_12 = addAbilitySprite(skill, coordinates)) === null || _12 === void 0 ? void 0 : _12.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "Power2",
                yoyo: true,
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.INFERNAL_PARADE: {
            const specialProjectile = (_13 = addAbilitySprite(skill, coordinates)) === null || _13 === void 0 ? void 0 : _13.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "Power2",
                yoyo: true,
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.BLUE_FLARE: {
            const specialProjectile = (_14 = addAbilitySprite(skill, coordinates)) === null || _14 === void 0 ? void 0 : _14.setScale(3);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.GLACIATE: {
            const specialProjectile = (_15 = addAbilitySprite(skill, coordinates)) === null || _15 === void 0 ? void 0 : _15.setScale(3);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SHADOW_BALL: {
            const specialProjectile = (_16 = addAbilitySprite(skill, coordinates)) === null || _16 === void 0 ? void 0 : _16.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.FUSION_BOLT: {
            const specialProjectile = (_17 = addAbilitySprite(skill, coordinates)) === null || _17 === void 0 ? void 0 : _17.setScale(3);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ICY_WIND: {
            const specialProjectile = (_18 = addAbilitySprite(skill, coordinates)) === null || _18 === void 0 ? void 0 : _18.setScale(1);
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoordinates = (0, utils_1.transformEntityCoordinates)(positionX + dx * 8, positionY + dy * 8, flip);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoordinates[0],
                y: finalCoordinates[1],
                ease: "linear",
                yoyo: false,
                duration: 2000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SOLAR_BEAM: {
            const specialProjectile = (_19 = addAbilitySprite(skill, (0, utils_1.transformEntityCoordinates)(targetX, targetY - 3, flip))) === null || _19 === void 0 ? void 0 : _19.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ORIGIN_PULSE: {
            const startCoords = (0, utils_1.transformEntityCoordinates)(0, targetY, flip);
            const finalCoords = (0, utils_1.transformEntityCoordinates)(8, targetY, flip);
            const specialProjectile = (_20 = addAbilitySprite(skill, startCoords)) === null || _20 === void 0 ? void 0 : _20.setScale(4);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoords[0],
                y: finalCoords[1],
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SPACIAL_REND: {
            const coords = (0, utils_1.transformEntityCoordinates)(4, targetY, flip);
            (_21 = addAbilitySprite(skill, coords, true)) === null || _21 === void 0 ? void 0 : _21.setScale(4);
            break;
        }
        case Ability_1.Ability.SEED_FLARE:
            (_22 = addAbilitySprite(skill, coordinates, true)) === null || _22 === void 0 ? void 0 : _22.setScale(3, 3);
            break;
        case Ability_1.Ability.MULTI_ATTACK:
            (_23 = addAbilitySprite(skill, coordinates, true)) === null || _23 === void 0 ? void 0 : _23.setScale(4);
            break;
        case Ability_1.Ability.SEISMIC_TOSS:
            (_24 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _24 === void 0 ? void 0 : _24.setScale(2);
            break;
        case Ability_1.Ability.GUILLOTINE:
            (_25 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _25 === void 0 ? void 0 : _25.setScale(3);
            break;
        case Ability_1.Ability.ROCK_SLIDE:
            (_26 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _26 === void 0 ? void 0 : _26.setScale(2).setOrigin(0.5, 0.9);
            break;
        case Ability_1.Ability.FLAMETHROWER:
            (_27 = addAbilitySprite(skill, coordinates, true)) === null || _27 === void 0 ? void 0 : _27.setScale(2).setOrigin(0.5, 1).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) +
                Math.PI / 2);
            break;
        case Ability_1.Ability.FIERY_WRATH:
            (_28 = addAbilitySprite(Ability_1.Ability.FLAMETHROWER, coordinates, true)) === null || _28 === void 0 ? void 0 : _28.setScale(2).setTint(0xc000c0);
            break;
        case Ability_1.Ability.PSYBEAM:
        case Ability_1.Ability.TWIN_BEAM:
            (_29 = addAbilitySprite(Ability_1.Ability.PSYBEAM, coordinates, true)) === null || _29 === void 0 ? void 0 : _29.setScale(1, 2).setOrigin(0.5, 0).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            break;
        case Ability_1.Ability.THUNDER_SHOCK:
            (_30 = addAbilitySprite(Ability_1.Ability.THUNDER, coordinatesTarget, true)) === null || _30 === void 0 ? void 0 : _30.setScale(2).setOrigin(0.5, 1);
            break;
        case Ability_1.Ability.HYDRO_PUMP:
            (_31 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _31 === void 0 ? void 0 : _31.setScale(2).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) +
                Math.PI / 2);
            break;
        case Ability_1.Ability.SWALLOW:
            (_32 = addAbilitySprite(Ability_1.Ability.HYDRO_PUMP, coordinates, true)) === null || _32 === void 0 ? void 0 : _32.setScale(2).setTint(0x60ff60).setOrigin(0.5, 1).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) +
                Math.PI / 2);
            break;
        case Ability_1.Ability.DRACO_METEOR:
            (_33 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _33 === void 0 ? void 0 : _33.setOrigin(0.5, 0.9).setScale(2);
            break;
        case Ability_1.Ability.BLAZE_KICK:
            (_34 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _34 === void 0 ? void 0 : _34.setScale(2);
            break;
        case Ability_1.Ability.WISH:
            (_35 = addAbilitySprite(skill, coordinates, true)) === null || _35 === void 0 ? void 0 : _35.setScale(3);
            break;
        case Ability_1.Ability.LUNAR_BLESSING:
            (_36 = addAbilitySprite(skill, coordinates, true)) === null || _36 === void 0 ? void 0 : _36.setScale(2);
            break;
        case Ability_1.Ability.MEDITATE:
            (_37 = addAbilitySprite(skill, coordinates, true)) === null || _37 === void 0 ? void 0 : _37.setScale(2);
            break;
        case Ability_1.Ability.GRAVITY:
            (_38 = addAbilitySprite(Ability_1.Ability.MEDITATE, coordinates, true)) === null || _38 === void 0 ? void 0 : _38.setScale(3).setTint(0xccff33).setDepth(depths_1.DEPTH.ABILITY_GROUND_LEVEL);
            break;
        case Ability_1.Ability.COSMIC_POWER_MOON:
            (_39 = addAbilitySprite("COSMIC_POWER", coordinates, true)) === null || _39 === void 0 ? void 0 : _39.setScale(2).setTint(0xccb0ff).setOrigin(0.5, 1);
            break;
        case Ability_1.Ability.COSMIC_POWER_SUN:
            (_40 = addAbilitySprite("COSMIC_POWER", coordinates, true)) === null || _40 === void 0 ? void 0 : _40.setScale(2).setTint(0xffffd0).setOrigin(0.5, 1);
            break;
        case Ability_1.Ability.FORECAST:
            (_41 = addAbilitySprite(skill, coordinates, true)) === null || _41 === void 0 ? void 0 : _41.setScale(2).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            break;
        case Ability_1.Ability.FOLLOW_ME:
        case Ability_1.Ability.AFTER_YOU: {
            const sprite = (_42 = addAbilitySprite(skill, [coordinates[0], coordinates[1] - 50], true)) === null || _42 === void 0 ? void 0 : _42.setScale(0.5).setDepth(depths_1.DEPTH.ABILITY);
            scene.tweens.add({
                targets: sprite,
                ease: Phaser.Math.Easing.Sine.InOut,
                alpha: { from: 0, to: 1 },
                yoyo: true,
                duration: 500,
                onComplete: () => {
                    sprite === null || sprite === void 0 ? void 0 : sprite.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.CHATTER:
        case Ability_1.Ability.BOOMBURST:
            (_43 = addAbilitySprite(Ability_1.Ability.CHATTER, coordinates, true)) === null || _43 === void 0 ? void 0 : _43.setScale(2);
            break;
        case Ability_1.Ability.DEFENSE_CURL:
            (_44 = addAbilitySprite(skill, coordinates, true)) === null || _44 === void 0 ? void 0 : _44.setScale(2);
            break;
        case Ability_1.Ability.RECOVER:
            (_45 = addAbilitySprite(skill, coordinates, true)) === null || _45 === void 0 ? void 0 : _45.setScale(2);
            break;
        case Ability_1.Ability.METRONOME:
            (_46 = addAbilitySprite(skill, coordinates, true)) === null || _46 === void 0 ? void 0 : _46.setScale(2);
            break;
        case Ability_1.Ability.SOAK:
            (_47 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _47 === void 0 ? void 0 : _47.setScale(2);
            break;
        case Ability_1.Ability.IRON_TAIL:
            (_48 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _48 === void 0 ? void 0 : _48.setScale(2);
            break;
        case Ability_1.Ability.BLAST_BURN:
            (_49 = addAbilitySprite(skill, coordinates, true)) === null || _49 === void 0 ? void 0 : _49.setScale(3);
            break;
        case Ability_1.Ability.CHARGE:
            (_50 = addAbilitySprite(skill, coordinates, true)) === null || _50 === void 0 ? void 0 : _50.setScale(4).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON).setOrigin(0.5, 0.8);
            break;
        case Ability_1.Ability.DISCHARGE:
            (_51 = addAbilitySprite(skill, coordinates, true)) === null || _51 === void 0 ? void 0 : _51.setScale(3);
            break;
        case Ability_1.Ability.OVERDRIVE:
            (_52 = addAbilitySprite(skill, coordinates, true)) === null || _52 === void 0 ? void 0 : _52.setScale(2).setOrigin(0.5);
            break;
        case Ability_1.Ability.SMOG:
            (_53 = addAbilitySprite(skill, coordinates, true)) === null || _53 === void 0 ? void 0 : _53.setScale(4).setDepth(depths_1.DEPTH.ABILITY_MINOR);
            break;
        case Ability_1.Ability.SLUDGE:
            (_54 = addAbilitySprite(Ability_1.Ability.SMOG, coordinatesTarget, true)) === null || _54 === void 0 ? void 0 : _54.setScale(3, 3).setTint(0xa0c020);
            break;
        case Ability_1.Ability.BITE:
            (_55 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _55 === void 0 ? void 0 : _55.setScale(2);
            break;
        case Ability_1.Ability.CRUNCH:
            (_56 = addAbilitySprite(Ability_1.Ability.BITE, coordinatesTarget, true)) === null || _56 === void 0 ? void 0 : _56.setScale(3);
            break;
        case Ability_1.Ability.DRAGON_TAIL:
            (_57 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _57 === void 0 ? void 0 : _57.setScale(2);
            break;
        case Ability_1.Ability.DRAGON_BREATH: {
            const specialProjectile = (_58 = addAbilitySprite(skill, coordinates)) === null || _58 === void 0 ? void 0 : _58.setScale(2).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoordinates = (0, utils_1.transformEntityCoordinates)(positionX + dx * 1.5, positionY + dy * 1.5, flip);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoordinates[0],
                y: finalCoordinates[1],
                ease: "linear",
                yoyo: false,
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case "SCALE_SHOT_CHARGE": {
            const charge = (_59 = scene.add
                .sprite(coordinates[0], coordinates[1], "abilities", `${Ability_1.Ability.SCALE_SHOT}/000.png`)) === null || _59 === void 0 ? void 0 : _59.setScale(2).setDepth(depths_1.DEPTH.ABILITY);
            charge.anims.play({
                key: Ability_1.Ability.SCALE_SHOT,
                duration: 300,
                repeat: -1
            });
            scene.tweens.add({
                targets: charge,
                duration: delay,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                onComplete: () => {
                    charge.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SCALE_SHOT: {
            const specialProjectile = (_60 = addAbilitySprite(skill, coordinates)) === null || _60 === void 0 ? void 0 : _60.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: 400,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case "SOLAR_BLADE_CHARGE": {
            const charge = (_61 = scene.add
                .sprite(coordinates[0], coordinates[1], "abilities", `${Ability_1.Ability.RECOVER}/000.png`)) === null || _61 === void 0 ? void 0 : _61.setScale(3).setDepth(depths_1.DEPTH.ABILITY);
            charge.anims.play({
                key: Ability_1.Ability.RECOVER,
                duration: 500,
                repeat: -1
            });
            scene.tweens.add({
                targets: charge,
                duration: 2000,
                x: coordinates[0],
                y: coordinates[1],
                onComplete: () => {
                    charge.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SOLAR_BLADE: {
            const specialProjectile = (_62 = addAbilitySprite(skill, coordinates)) === null || _62 === void 0 ? void 0 : _62.setScale(3).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) +
                Math.PI / 2);
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoordinates = (0, utils_1.transformEntityCoordinates)(positionX + dx * 1.5, positionY + dy * 1.5, flip);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoordinates[0],
                y: finalCoordinates[1],
                ease: "linear",
                yoyo: false,
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.FROST_BREATH:
            (_63 = addAbilitySprite(skill, [coordinates[0], coordinates[1] - 30], true)) === null || _63 === void 0 ? void 0 : _63.setScale(4).setOrigin(-0.1, 0.5).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]));
            break;
        case Ability_1.Ability.ICICLE_CRASH:
            (_64 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _64 === void 0 ? void 0 : _64.setScale(3);
            break;
        case Ability_1.Ability.INGRAIN:
            (_65 = addAbilitySprite(skill, coordinates, true)) === null || _65 === void 0 ? void 0 : _65.setScale(2);
            break;
        case Ability_1.Ability.TORMENT:
        case Ability_1.Ability.RAGE:
            (_66 = addAbilitySprite(Ability_1.Ability.TORMENT, [coordinates[0], coordinates[1] - 50], true)) === null || _66 === void 0 ? void 0 : _66.setScale(2);
            break;
        case Ability_1.Ability.STOMP:
            (_67 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _67 === void 0 ? void 0 : _67.setScale(3);
            break;
        case Ability_1.Ability.NIGHT_SLASH:
        case Ability_1.Ability.KOWTOW_CLEAVE:
            (_68 = addAbilitySprite(Ability_1.Ability.NIGHT_SLASH, coordinatesTarget, true)) === null || _68 === void 0 ? void 0 : _68.setScale(2);
            break;
        case Ability_1.Ability.BUG_BUZZ:
            (_69 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _69 === void 0 ? void 0 : _69.setScale(2);
            break;
        case Ability_1.Ability.VENOSHOCK:
            (_70 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _70 === void 0 ? void 0 : _70.setScale(2);
            break;
        case Ability_1.Ability.FELL_STINGER:
            (_71 = addAbilitySprite(Ability_1.Ability.VENOSHOCK, coordinatesTarget, true)) === null || _71 === void 0 ? void 0 : _71.setScale(2);
            break;
        case Ability_1.Ability.LEECH_LIFE:
            (_72 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _72 === void 0 ? void 0 : _72.setScale(2);
            break;
        case Ability_1.Ability.HAPPY_HOUR:
            (_73 = addAbilitySprite(skill, coordinates, true)) === null || _73 === void 0 ? void 0 : _73.setScale(2);
            break;
        case Ability_1.Ability.TELEPORT:
            (_74 = addAbilitySprite(skill, coordinates, true)) === null || _74 === void 0 ? void 0 : _74.setScale(2);
            break;
        case Ability_1.Ability.NASTY_PLOT:
            (_75 = addAbilitySprite(skill, [coordinates[0], coordinates[1] - 50], true)) === null || _75 === void 0 ? void 0 : _75.setScale(2);
            break;
        case Ability_1.Ability.THIEF:
            (_76 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _76 === void 0 ? void 0 : _76.setScale(2);
            break;
        case Ability_1.Ability.STUN_SPORE:
            (_77 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _77 === void 0 ? void 0 : _77.setScale(2);
            break;
        case Ability_1.Ability.HURRICANE: {
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoordinates = (0, utils_1.transformEntityCoordinates)(positionX + dx * 8, positionY + dy * 8, flip);
            const specialProjectile = (_78 = addAbilitySprite(skill, coordinates)) === null || _78 === void 0 ? void 0 : _78.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoordinates[0],
                y: finalCoordinates[1],
                ease: "linear",
                yoyo: false,
                duration: 2000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ROAR: {
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoordinates = (0, utils_1.transformEntityCoordinates)(positionX + dx * 8, positionY + dy * 8, flip);
            const specialProjectile = (_79 = addAbilitySprite(Ability_1.Ability.WHIRLWIND, coordinates)) === null || _79 === void 0 ? void 0 : _79.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoordinates[0],
                y: finalCoordinates[1],
                ease: "linear",
                yoyo: false,
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.FLEUR_CANNON: {
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoordinates = (0, utils_1.transformEntityCoordinates)(positionX + dx * 8, positionY + dy * 8, flip);
            const specialProjectile = (_80 = addAbilitySprite(skill, coordinates)) === null || _80 === void 0 ? void 0 : _80.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoordinates[0],
                y: finalCoordinates[1],
                ease: "linear",
                yoyo: false,
                duration: 2000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SANDSEAR_STORM:
        case Ability_1.Ability.WILDBOLT_STORM:
        case Ability_1.Ability.BLEAKWIND_STORM:
        case Ability_1.Ability.SPRINGTIDE_STORM: {
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoordinates = (0, utils_1.transformEntityCoordinates)(positionX + dx * 8, positionY + dy * 8, flip);
            const specialProjectile = (_81 = addAbilitySprite(skill, coordinates)) === null || _81 === void 0 ? void 0 : _81.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoordinates[0],
                y: finalCoordinates[1],
                ease: "linear",
                yoyo: false,
                duration: 2000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ROAR_OF_TIME:
            (_82 = addAbilitySprite(skill, coordinates, true)) === null || _82 === void 0 ? void 0 : _82.setScale(2);
            break;
        case Ability_1.Ability.ROCK_TOMB:
            (_83 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _83 === void 0 ? void 0 : _83.setScale(1).setOrigin(0.5, 0.9);
            break;
        case Ability_1.Ability.ILLUSION:
            (_84 = addAbilitySprite(skill, coordinates, true)) === null || _84 === void 0 ? void 0 : _84.setScale(2);
            break;
        case Ability_1.Ability.SLACK_OFF:
            (_85 = addAbilitySprite(Ability_1.Ability.ILLUSION, coordinates, true)) === null || _85 === void 0 ? void 0 : _85.setScale(1);
            break;
        case Ability_1.Ability.ROCK_SMASH:
            (_86 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _86 === void 0 ? void 0 : _86.setScale(2);
            break;
        case Ability_1.Ability.LIQUIDATION:
            (_87 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _87 === void 0 ? void 0 : _87.setScale(2);
            break;
        case Ability_1.Ability.FISHIOUS_REND:
            (_88 = addAbilitySprite(skill, coordinates, true)) === null || _88 === void 0 ? void 0 : _88.setScale(2).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            break;
        case Ability_1.Ability.CUT:
            (_89 = addAbilitySprite(Ability_1.Ability.FISHIOUS_REND, coordinates, true)) === null || _89 === void 0 ? void 0 : _89.setScale(2).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            (_90 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _90 === void 0 ? void 0 : _90.setScale(3);
            break;
        case Ability_1.Ability.GOLD_RUSH:
        case Ability_1.Ability.MAKE_IT_RAIN: {
            const specialProjectile = (_91 = addAbilitySprite(Ability_1.Ability.GOLD_RUSH, coordinates)) === null || _91 === void 0 ? void 0 : _91.setScale(skill === Ability_1.Ability.MAKE_IT_RAIN ? 3 : 2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.MUD_SHOT: {
            const specialProjectile = (_92 = addAbilitySprite(skill, coordinates)) === null || _92 === void 0 ? void 0 : _92.setScale(4);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: 350,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.POLTERGEIST: {
            const specialProjectile = (_93 = addAbilitySprite(skill, coordinates)) === null || _93 === void 0 ? void 0 : _93.setScale(3);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ZAP_CANNON: {
            const specialProjectile = (_94 = addAbilitySprite(skill, coordinates)) === null || _94 === void 0 ? void 0 : _94.setScale(3);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SPARKLING_ARIA: {
            const specialProjectile = (_95 = addAbilitySprite(skill, coordinates)) === null || _95 === void 0 ? void 0 : _95.setScale(3);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SKY_ATTACK: {
            const startCoords = (0, utils_1.transformEntityCoordinates)(targetX, 9, false);
            const specialProjectile = (_96 = addAbilitySprite(skill, startCoords)) === null || _96 === void 0 ? void 0 : _96.setScale(1.5);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SKY_ATTACK_SHADOW: {
            const startCoords = (0, utils_1.transformEntityCoordinates)(targetX, 9, false);
            const specialProjectile = (_97 = addAbilitySprite(skill, startCoords)) === null || _97 === void 0 ? void 0 : _97.setScale(1.5);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.FLYING_PRESS: {
            const startCoords = (0, utils_1.transformEntityCoordinates)(targetX, 9, false);
            const specialProjectile = (_98 = addAbilitySprite(skill, startCoords)) === null || _98 === void 0 ? void 0 : _98.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                    addAbilitySprite(Ability_1.Ability.HEAVY_SLAM, coordinatesTarget, true);
                }
            });
            break;
        }
        case Ability_1.Ability.SUNSTEEL_STRIKE: {
            const startCoords = (0, utils_1.transformEntityCoordinates)(targetX, 9, false);
            const specialProjectile = addAbilitySprite(skill, startCoords);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                    scene.shakeCamera(250, 0.01);
                }
            });
            break;
        }
        case Ability_1.Ability.HEAT_CRASH: {
            const angle = Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]);
            const specialProjectile = (_99 = addAbilitySprite(Ability_1.Ability.SUNSTEEL_STRIKE, coordinates)) === null || _99 === void 0 ? void 0 : _99.setScale(0.5).setRotation(angle - Math.PI / 2).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 300,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case "COMET_CRASH": {
            const startCoords = (0, utils_1.transformEntityCoordinates)(targetX, 9, false);
            const specialProjectile = (_100 = addAbilitySprite(Ability_1.Ability.SUNSTEEL_STRIKE, startCoords)) === null || _100 === void 0 ? void 0 : _100.setScale(0.5).setTint(0x2020ff);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ACROBATICS: {
            const startCoords = (0, utils_1.transformEntityCoordinates)(targetX + 1, targetY + 1, flip);
            const specialProjectile = (_101 = addAbilitySprite(skill, startCoords)) === null || _101 === void 0 ? void 0 : _101.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 300,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ROLLOUT: {
            const specialProjectile = (_102 = addAbilitySprite(skill, coordinates)) === null || _102 === void 0 ? void 0 : _102.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ICE_BALL: {
            const specialProjectile = (_103 = addAbilitySprite(skill, coordinates)) === null || _103 === void 0 ? void 0 : _103.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: (8 * 1000) / 15,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.PRESENT: {
            const specialProjectile = (_104 = addAbilitySprite(skill, coordinates)) === null || _104 === void 0 ? void 0 : _104.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.TOPSY_TURVY: {
            const specialProjectile = (_105 = addAbilitySprite(skill, coordinates)) === null || _105 === void 0 ? void 0 : _105.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.WHIRLWIND: {
            const specialProjectile = (_106 = addAbilitySprite(skill, coordinates)) === null || _106 === void 0 ? void 0 : _106.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ACID_SPRAY: {
            const specialProjectile = (_107 = addAbilitySprite(skill, coordinates)) === null || _107 === void 0 ? void 0 : _107.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.WATER_PULSE: {
            const specialProjectile = (_108 = addAbilitySprite(skill, coordinates)) === null || _108 === void 0 ? void 0 : _108.setScale(3);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.GRAV_APPLE: {
            const aboveTargetCoordinates = (0, utils_1.transformEntityCoordinates)(targetX, targetY, flip);
            aboveTargetCoordinates[1] -= 400;
            const apple = (_109 = addAbilitySprite("NUTRIENTS", aboveTargetCoordinates)) === null || _109 === void 0 ? void 0 : _109.setScale(3);
            scene.tweens.add({
                targets: apple,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 400,
                onComplete: () => {
                    var _a;
                    apple === null || apple === void 0 ? void 0 : apple.destroy();
                    (_a = addAbilitySprite("PUFF_RED", coordinatesTarget, true)) === null || _a === void 0 ? void 0 : _a.setScale(2);
                }
            });
            break;
        }
        case Ability_1.Ability.NUTRIENTS: {
            const specialProjectile = (_110 = addAbilitySprite(skill, coordinates)) === null || _110 === void 0 ? void 0 : _110.setScale(3);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 400,
                onComplete: () => {
                    var _a;
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                    (_a = addAbilitySprite("PUFF_GREEN", coordinatesTarget, true)) === null || _a === void 0 ? void 0 : _a.setScale(2);
                }
            });
            break;
        }
        case Ability_1.Ability.SYRUP_BOMB: {
            const specialProjectile = (_111 = addAbilitySprite("NUTRIENTS", coordinates)) === null || _111 === void 0 ? void 0 : _111.setScale(3);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 400,
                onComplete: () => {
                    var _a;
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                    (_a = addAbilitySprite("PUFF_RED", coordinatesTarget, true)) === null || _a === void 0 ? void 0 : _a.setScale(2);
                }
            });
            break;
        }
        case Ability_1.Ability.APPLE_ACID: {
            const specialProjectile = (_112 = addAbilitySprite("NUTRIENTS", coordinates)) === null || _112 === void 0 ? void 0 : _112.setScale(3);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 400,
                onComplete: () => {
                    var _a;
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                    (_a = addAbilitySprite("PUFF_RED", coordinatesTarget, true)) === null || _a === void 0 ? void 0 : _a.setScale(2);
                }
            });
            break;
        }
        case Ability_1.Ability.FICKLE_BEAM: {
            const specialProjectile = (_113 = addAbilitySprite(Ability_1.Ability.FICKLE_BEAM, coordinates)) === null || _113 === void 0 ? void 0 : _113.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 400,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.POLLEN_PUFF: {
            const specialProjectile = (_114 = addAbilitySprite(Ability_1.Ability.HEAL_ORDER, coordinates)) === null || _114 === void 0 ? void 0 : _114.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.PSYSTRIKE: {
            const specialProjectile = (_115 = addAbilitySprite(Ability_1.Ability.PSYSTRIKE, coordinates)) === null || _115 === void 0 ? void 0 : _115.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.EGG_BOMB: {
            const specialProjectile = (_116 = addAbilitySprite(skill, coordinates)) === null || _116 === void 0 ? void 0 : _116.setScale(3);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SPARK: {
            const specialProjectile = (_117 = addAbilitySprite(skill, coordinates)) === null || _117 === void 0 ? void 0 : _117.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 300,
                delay: (delay || 0) * 400,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SUCTION_HEAL: {
            const specialProjectile = (_118 = addAbilitySprite(skill, coordinatesTarget)) === null || _118 === void 0 ? void 0 : _118.setScale(3);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinates[0],
                y: coordinates[1],
                ease: "linear",
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.PAYDAY:
            (_119 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _119 === void 0 ? void 0 : _119.setScale(2);
            (_120 = addAbilitySprite(Ability_1.Ability.FACADE, coordinatesTarget, true)) === null || _120 === void 0 ? void 0 : _120.setScale(1);
            break;
        case Ability_1.Ability.AIR_SLASH:
            (_121 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _121 === void 0 ? void 0 : _121.setScale(2);
            break;
        case Ability_1.Ability.DREAM_EATER:
            (_122 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _122 === void 0 ? void 0 : _122.setScale(2);
            break;
        case Ability_1.Ability.VINE_WHIP:
            (_123 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _123 === void 0 ? void 0 : _123.setScale(3);
            break;
        case Ability_1.Ability.VOLT_SWITCH:
            (_124 = addAbilitySprite(skill, coordinates, true)) === null || _124 === void 0 ? void 0 : _124.setScale(2).setOrigin(0.5, 0).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            break;
        case Ability_1.Ability.BEHEMOTH_BLADE:
            (_125 = addAbilitySprite(Ability_1.Ability.VOLT_SWITCH, coordinates, true)) === null || _125 === void 0 ? void 0 : _125.setScale(2).setOrigin(0.5, 0).setTint(0x87ceeb).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            break;
        case Ability_1.Ability.MUDDY_WATER:
            (_126 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _126 === void 0 ? void 0 : _126.setScale(2).setOrigin(0.5, 1);
            break;
        case Ability_1.Ability.ANCIENT_POWER: {
            const rock = (_127 = addAbilitySprite(skill, coordinates)) === null || _127 === void 0 ? void 0 : _127.setScale(2);
            scene.tweens.add({
                targets: rock,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 1000,
                onComplete: () => {
                    rock === null || rock === void 0 ? void 0 : rock.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.MOON_DREAM: {
            const aboveTargetCoordinates = (0, utils_1.transformEntityCoordinates)(positionX, positionY, flip);
            aboveTargetCoordinates[1] -= 100;
            const moon = (_128 = addAbilitySprite(skill, aboveTargetCoordinates)) === null || _128 === void 0 ? void 0 : _128.setScale(1.5);
            scene.tweens.add({
                targets: moon,
                scale: 0.5,
                x: coordinates[0],
                y: coordinates[1],
                ease: "linear",
                duration: 500,
                onComplete: () => {
                    moon === null || moon === void 0 ? void 0 : moon.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.FAIRY_LOCK:
            (_129 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _129 === void 0 ? void 0 : _129.setScale(1);
            break;
        case Ability_1.Ability.STEAM_ERUPTION:
            (_130 = addAbilitySprite(skill, coordinates, true)) === null || _130 === void 0 ? void 0 : _130.setScale(2).setDepth(1);
            break;
        case Ability_1.Ability.SEARING_SHOT:
            (_131 = addAbilitySprite(Ability_1.Ability.STEAM_ERUPTION, coordinates, true)) === null || _131 === void 0 ? void 0 : _131.setScale(3, 3).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            break;
        case Ability_1.Ability.POWER_HUG:
            (_132 = addAbilitySprite(Ability_1.Ability.ANCHOR_SHOT, coordinatesTarget, true)) === null || _132 === void 0 ? void 0 : _132.setScale(2);
            break;
        case Ability_1.Ability.BURN_UP:
            (_133 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _133 === void 0 ? void 0 : _133.setScale(2);
            break;
        case Ability_1.Ability.IVY_CUDGEL:
            (_134 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _134 === void 0 ? void 0 : _134.setScale(2);
            break;
        case Ability_1.Ability.PSYCHO_BOOST:
            (_135 = addAbilitySprite(skill, coordinates, true)) === null || _135 === void 0 ? void 0 : _135.setScale(2);
            break;
        case Ability_1.Ability.HEAVY_SLAM:
            (_136 = addAbilitySprite(skill, coordinates, true)) === null || _136 === void 0 ? void 0 : _136.setScale(2);
            scene.shakeCamera(250, 0.01);
            break;
        case Ability_1.Ability.BODY_SLAM:
            scene.shakeCamera(250, 0.01);
            break;
        case Ability_1.Ability.BULLDOZE:
            (_137 = addAbilitySprite(Ability_1.Ability.HEAVY_SLAM, coordinates, true)) === null || _137 === void 0 ? void 0 : _137.setScale(2);
            scene.shakeCamera(250, 0.01);
            break;
        case Ability_1.Ability.FACADE:
            (_138 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _138 === void 0 ? void 0 : _138.setScale(2);
            break;
        case Ability_1.Ability.FAKE_OUT:
            (_139 = addAbilitySprite(Ability_1.Ability.FACADE, coordinates, true)) === null || _139 === void 0 ? void 0 : _139.setScale(2);
            break;
        case Ability_1.Ability.ICE_HAMMER:
            (_140 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _140 === void 0 ? void 0 : _140.setScale(2);
            break;
        case Ability_1.Ability.MANTIS_BLADES:
            (_141 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _141 === void 0 ? void 0 : _141.setScale(2);
            break;
        case Ability_1.Ability.PSYCHIC_FANGS:
            (_142 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _142 === void 0 ? void 0 : _142.setScale(2);
            break;
        case Ability_1.Ability.THUNDER_FANG:
            (_143 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _143 === void 0 ? void 0 : _143.setScale(2);
            break;
        case Ability_1.Ability.ICE_FANG:
            (_144 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _144 === void 0 ? void 0 : _144.setScale(2);
            break;
        case Ability_1.Ability.FIRE_FANG:
            (_145 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _145 === void 0 ? void 0 : _145.setScale(2);
            break;
        case Ability_1.Ability.POPULATION_BOMB:
            (_146 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _146 === void 0 ? void 0 : _146.setScale(2);
            break;
        case Ability_1.Ability.SCREECH:
            (_147 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _147 === void 0 ? void 0 : _147.setScale(2);
            break;
        case Ability_1.Ability.SAND_TOMB:
            (_148 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _148 === void 0 ? void 0 : _148.setScale(2);
            break;
        case Ability_1.Ability.MAGICAL_LEAF: {
            (_149 = addAbilitySprite("MAGICAL_LEAF_CHARGE", coordinates, true)) === null || _149 === void 0 ? void 0 : _149.setScale(2);
            const leaf = (_150 = addAbilitySprite(skill, coordinates)) === null || _150 === void 0 ? void 0 : _150.setScale(2);
            scene.tweens.add({
                targets: leaf,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 500,
                onComplete: () => {
                    leaf === null || leaf === void 0 ? void 0 : leaf.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SHIELDS_DOWN:
            (_151 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _151 === void 0 ? void 0 : _151.setScale(2);
            break;
        case Ability_1.Ability.SHIELDS_UP:
            (_152 = addAbilitySprite(skill, coordinates, true)) === null || _152 === void 0 ? void 0 : _152.setScale(2);
            break;
        case Ability_1.Ability.FILLET_AWAY:
            (_153 = addAbilitySprite(Ability_1.Ability.SHIELDS_UP, coordinates, true)) === null || _153 === void 0 ? void 0 : _153.setScale(2);
            break;
        case Ability_1.Ability.BRAVE_BIRD:
            (_154 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _154 === void 0 ? void 0 : _154.setScale(2);
            break;
        case Ability_1.Ability.AQUA_RING:
            (_155 = addAbilitySprite(skill, coordinates, true)) === null || _155 === void 0 ? void 0 : _155.setScale(2);
            break;
        case Ability_1.Ability.NATURAL_GIFT: {
            const specialProjectile = (_156 = addAbilitySprite(skill, coordinates)) === null || _156 === void 0 ? void 0 : _156.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.NIGHT_SHADE: {
            const specialProjectile = (_157 = addAbilitySprite(skill, coordinates)) === null || _157 === void 0 ? void 0 : _157.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ARMOR_CANNON: {
            const specialProjectile = (_158 = addAbilitySprite(skill, coordinates)) === null || _158 === void 0 ? void 0 : _158.setScale(2 - (delay !== null && delay !== void 0 ? delay : 0) * 0.5);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                duration: 400,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.BITTER_BLADE:
            (_159 = addAbilitySprite(skill, coordinates, true)) === null || _159 === void 0 ? void 0 : _159.setScale(3);
            break;
        case Ability_1.Ability.ASSURANCE:
            (_160 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _160 === void 0 ? void 0 : _160.setScale(2);
            break;
        case Ability_1.Ability.MIND_BEND:
            addAbilitySprite(Ability_1.Ability.ASSURANCE, [coordinatesTarget[0], coordinatesTarget[1] - 20], true);
            break;
        case Ability_1.Ability.CRUSH_GRIP:
            (_161 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _161 === void 0 ? void 0 : _161.setScale(2);
            break;
        case Ability_1.Ability.FISSURE: {
            const specialProjectile = (_162 = addAbilitySprite(skill, coordinatesTarget)) === null || _162 === void 0 ? void 0 : _162.setScale(1).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            scene.tweens.add({
                targets: specialProjectile,
                scaleX: 3,
                scaleY: 3,
                yoyo: true,
                ease: Phaser.Math.Easing.Sine.InOut,
                duration: 800,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            scene.shakeCamera(250, 0.01);
            break;
        }
        case Ability_1.Ability.CLOSE_COMBAT:
            (_163 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _163 === void 0 ? void 0 : _163.setScale(3);
            break;
        case Ability_1.Ability.SUPER_FANG:
            (_164 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _164 === void 0 ? void 0 : _164.setScale(3);
            break;
        case Ability_1.Ability.PARABOLIC_CHARGE: {
            const specialProjectile = addAbilitySprite(skill, coordinates);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.PLAY_ROUGH:
            (_165 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _165 === void 0 ? void 0 : _165.setScale(2);
            break;
        case Ability_1.Ability.ATTRACT:
            (_166 = addAbilitySprite(skill, [coordinates[0], coordinates[1] - 70], true)) === null || _166 === void 0 ? void 0 : _166.setScale(2);
            break;
        case Ability_1.Ability.MAGNET_RISE:
            (_167 = addAbilitySprite(Ability_1.Ability.ELECTRO_BOOST, coordinates, true)) === null || _167 === void 0 ? void 0 : _167.setScale(2);
            break;
        case Ability_1.Ability.ANCHOR_SHOT:
            (_168 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _168 === void 0 ? void 0 : _168.setScale(2);
            break;
        case Ability_1.Ability.FORCE_PALM:
            (_169 = addAbilitySprite(Ability_1.Ability.ANCHOR_SHOT, coordinatesTarget, true)) === null || _169 === void 0 ? void 0 : _169.setScale(2);
            break;
        case Ability_1.Ability.HYPERSPACE_FURY: {
            const nbHits = Number(orientation);
            for (let i = 0; i < nbHits; i++) {
                setTimeout(() => {
                    var _a;
                    (_a = addAbilitySprite(Ability_1.Ability.HYPERSPACE_FURY, [
                        coordinatesTarget[0] + (0, random_1.randomBetween)(-30, +30),
                        coordinatesTarget[1] + (0, random_1.randomBetween)(-30, +30)
                    ], true)) === null || _a === void 0 ? void 0 : _a.setScale(1).setRotation(-Math.PI / 2).setTint(0xc080ff);
                }, i * 150);
            }
            break;
        }
        case Ability_1.Ability.FLORAL_HEALING:
            (_170 = addAbilitySprite(skill, coordinates, true)) === null || _170 === void 0 ? void 0 : _170.setScale(2);
            break;
        case Ability_1.Ability.LEAF_BLADE:
            (_171 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _171 === void 0 ? void 0 : _171.setScale(2);
            break;
        case Ability_1.Ability.WATERFALL:
            (_172 = addAbilitySprite(skill, coordinates, true)) === null || _172 === void 0 ? void 0 : _172.setScale(2).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            break;
        case Ability_1.Ability.HELPING_HAND:
            (_173 = addAbilitySprite(skill, coordinates, true)) === null || _173 === void 0 ? void 0 : _173.setScale(2);
            break;
        case Ability_1.Ability.MUD_BUBBLE:
            (_174 = addAbilitySprite(skill, coordinates, true)) === null || _174 === void 0 ? void 0 : _174.setScale(2);
            break;
        case Ability_1.Ability.ERUPTION: {
            const startCoords = (0, utils_1.transformEntityCoordinates)(targetX + 3, targetY + 3, flip);
            const specialProjectile = addAbilitySprite(skill, startCoords);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.THOUSAND_ARROWS: {
            const specialProjectile = (_175 = addAbilitySprite(skill, [
                coordinatesTarget[0],
                Config_1.BOARD_HEIGHT - 1
            ])) === null || _175 === void 0 ? void 0 : _175.setScale(4);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 300,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SLASHING_CLAW:
            (_176 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _176 === void 0 ? void 0 : _176.setScale(2);
            break;
        case Ability_1.Ability.MAGMA_STORM:
            (_177 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _177 === void 0 ? void 0 : _177.setScale(1);
            break;
        case Ability_1.Ability.THRASH:
            (_178 = addAbilitySprite(skill, coordinates, true)) === null || _178 === void 0 ? void 0 : _178.setScale(2);
            break;
        case Ability_1.Ability.ABSORB:
            (_179 = addAbilitySprite(skill, coordinates, true)) === null || _179 === void 0 ? void 0 : _179.setScale(2).setDepth(depths_1.DEPTH.ABILITY_GROUND_LEVEL);
            break;
        case Ability_1.Ability.GIGATON_HAMMER:
            (_180 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _180 === void 0 ? void 0 : _180.setScale(2);
            scene.shakeCamera(250, 0.01);
            break;
        case Ability_1.Ability.COUNTER:
            (_181 = addAbilitySprite(skill, coordinates, true)) === null || _181 === void 0 ? void 0 : _181.setScale(3);
            break;
        case Ability_1.Ability.HEX:
            (_182 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _182 === void 0 ? void 0 : _182.setScale(2);
            break;
        case Ability_1.Ability.SPECTRAL_THIEF:
            (_183 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _183 === void 0 ? void 0 : _183.setScale(2);
            (_184 = addAbilitySprite(skill, coordinates, true)) === null || _184 === void 0 ? void 0 : _184.setScale(2);
            break;
        case Ability_1.Ability.PLASMA_FIST:
            (_185 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _185 === void 0 ? void 0 : _185.setScale(2);
            break;
        case Ability_1.Ability.SACRED_SWORD_IRON:
            (_186 = addAbilitySprite("SACRED_SWORD", coordinatesTarget, true)) === null || _186 === void 0 ? void 0 : _186.setScale(2).setOrigin(0.5, 0.2).setRotation(Math.PI);
            break;
        case Ability_1.Ability.SACRED_SWORD_GRASS:
            (_187 = addAbilitySprite("SACRED_SWORD", coordinatesTarget, true)) === null || _187 === void 0 ? void 0 : _187.setScale(2).setOrigin(0.5, 0.2).setRotation(Math.PI).setTint(0xb0ffa0);
            break;
        case Ability_1.Ability.SACRED_SWORD_CAVERN:
            (_188 = addAbilitySprite("SACRED_SWORD", coordinatesTarget, true)) === null || _188 === void 0 ? void 0 : _188.setScale(2).setOrigin(0.5, 0.2).setRotation(Math.PI).setTint(0xe0c0a0);
            break;
        case Ability_1.Ability.SECRET_SWORD: {
            const specialProjectile = (_189 = addAbilitySprite("SACRED_SWORD", [coordinatesTarget[0], coordinatesTarget[1] - 30], true)) === null || _189 === void 0 ? void 0 : _189.setScale(2).setOrigin(0.5, 0.5).setTint(0xfff0b0);
            scene.tweens.add({
                targets: specialProjectile,
                angle: 540,
                duration: 400
            });
            break;
        }
        case Ability_1.Ability.METAL_BURST:
            (_190 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _190 === void 0 ? void 0 : _190.setScale(2);
            break;
        case Ability_1.Ability.JUDGEMENT:
            (_191 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _191 === void 0 ? void 0 : _191.setScale(2).setOrigin(0.5, 1);
            break;
        case Ability_1.Ability.SHADOW_SNEAK:
            (_192 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _192 === void 0 ? void 0 : _192.setScale(2);
            break;
        case Ability_1.Ability.DIVE:
            (_193 = addAbilitySprite(skill, coordinates, true)) === null || _193 === void 0 ? void 0 : _193.setScale(3).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            break;
        case Ability_1.Ability.SMOKE_SCREEN:
            (_194 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _194 === void 0 ? void 0 : _194.setScale(3);
            break;
        case Ability_1.Ability.BARB_BARRAGE:
            (_195 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _195 === void 0 ? void 0 : _195.setScale(2);
            break;
        case Ability_1.Ability.OUTRAGE:
            (_196 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _196 === void 0 ? void 0 : _196.setScale(2);
            break;
        case Ability_1.Ability.KNOCK_OFF:
            (_197 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _197 === void 0 ? void 0 : _197.setScale(2);
            break;
        case Ability_1.Ability.SLASH:
            (_198 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _198 === void 0 ? void 0 : _198.setScale(2);
            break;
        case Ability_1.Ability.HYPER_VOICE: {
            const startCoords = (0, utils_1.transformEntityCoordinates)(0, targetY, flip);
            const finalCoords = (0, utils_1.transformEntityCoordinates)(8, targetY, flip);
            const specialProjectile = (_199 = addAbilitySprite(skill, startCoords)) === null || _199 === void 0 ? void 0 : _199.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoords[0],
                y: finalCoords[1],
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SHADOW_CLONE:
            (_200 = addAbilitySprite(skill, coordinates, true)) === null || _200 === void 0 ? void 0 : _200.setScale(2);
            break;
        case Ability_1.Ability.ECHO:
            (_201 = addAbilitySprite(skill, coordinates, true)) === null || _201 === void 0 ? void 0 : _201.setScale(2).setOrigin(0.5, 0.7);
            break;
        case Ability_1.Ability.EXPLOSION:
            (_202 = addAbilitySprite(skill, coordinates, true)) === null || _202 === void 0 ? void 0 : _202.setScale(2);
            scene.shakeCamera(250, 0.01);
            break;
        case Ability_1.Ability.CHLOROBLAST:
            (_203 = addAbilitySprite(Ability_1.Ability.EXPLOSION, coordinates, true)) === null || _203 === void 0 ? void 0 : _203.setScale(2).setTint(0x90ffd0);
            scene.shakeCamera(250, 0.01);
            break;
        case Ability_1.Ability.CLANGOROUS_SOUL:
            (_204 = addAbilitySprite(skill, coordinates, true)) === null || _204 === void 0 ? void 0 : _204.setScale(2);
            break;
        case Ability_1.Ability.GROWL:
            (_205 = addAbilitySprite(skill, coordinates, true)) === null || _205 === void 0 ? void 0 : _205.setScale(2).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            break;
        case Ability_1.Ability.FAIRY_WIND:
            (_206 = addAbilitySprite(skill, coordinates, true)) === null || _206 === void 0 ? void 0 : _206.setScale(2);
            break;
        case Ability_1.Ability.RELIC_SONG:
        case Ability_1.Ability.SING:
        case Ability_1.Ability.DISARMING_VOICE:
            (_207 = addAbilitySprite(Ability_1.Ability.RELIC_SONG, coordinates, true)) === null || _207 === void 0 ? void 0 : _207.setScale(2);
            break;
        case Ability_1.Ability.HIGH_JUMP_KICK:
        case Ability_1.Ability.LUNGE:
            (_208 = addAbilitySprite(Ability_1.Ability.HIGH_JUMP_KICK, coordinatesTarget, true)) === null || _208 === void 0 ? void 0 : _208.setScale(2);
            break;
        case Ability_1.Ability.TROP_KICK:
            (_209 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _209 === void 0 ? void 0 : _209.setScale(2);
            break;
        case Ability_1.Ability.SHELL_TRAP:
            (_210 = addAbilitySprite(Ability_1.Ability.COUNTER, coordinates, true)) === null || _210 === void 0 ? void 0 : _210.setScale(2);
            break;
        case Ability_1.Ability.SHELL_SMASH:
            (_211 = addAbilitySprite(Ability_1.Ability.COUNTER, coordinates, true)) === null || _211 === void 0 ? void 0 : _211.setScale(2);
            break;
        case Ability_1.Ability.TRI_ATTACK: {
            const specialProjectile = addAbilitySprite(skill, coordinates);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.PSYCHIC: {
            const specialProjectile = (_212 = addAbilitySprite(skill, coordinates)) === null || _212 === void 0 ? void 0 : _212.setScale(3);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.PYRO_BALL: {
            const specialProjectile = (_213 = addAbilitySprite(skill, coordinates)) === null || _213 === void 0 ? void 0 : _213.setScale(1);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                duration: 500,
                scale: 2,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SLUDGE_WAVE: {
            const specialProjectile = (_214 = addAbilitySprite(skill, coordinates)) === null || _214 === void 0 ? void 0 : _214.setScale(1);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                duration: 800,
                scale: 2,
                onComplete: () => {
                    var _a;
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                    (_a = addAbilitySprite(Ability_1.Ability.DIVE, coordinatesTarget, true)) === null || _a === void 0 ? void 0 : _a.setScale(3).setTint(0xf060a0).setDepth(depths_1.DEPTH.ABILITY_GROUND_LEVEL);
                }
            });
            break;
        }
        case Ability_1.Ability.LAVA_PLUME: {
            const specialProjectile = (_215 = addAbilitySprite(Ability_1.Ability.SLUDGE_WAVE, coordinates)) === null || _215 === void 0 ? void 0 : _215.setScale(1).setTint(0xffc020);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                duration: 800,
                scale: 2,
                onComplete: () => {
                    var _a;
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                    (_a = addAbilitySprite("FLAME_HIT", coordinatesTarget, true)) === null || _a === void 0 ? void 0 : _a.setScale(2);
                }
            });
            break;
        }
        case Ability_1.Ability.WHIRLPOOL: {
            for (let i = 0; i < 4; i++) {
                const whirlpool = addAbilitySprite(skill, coordinates);
                scene.tweens.add({
                    targets: whirlpool,
                    x: coordinatesTarget[0],
                    y: coordinatesTarget[1],
                    duration: 1000,
                    scale: 2,
                    delay: i * 100,
                    ease: "Power1",
                    onComplete: () => {
                        whirlpool === null || whirlpool === void 0 ? void 0 : whirlpool.destroy();
                    }
                });
            }
            break;
        }
        case Ability_1.Ability.BONEMERANG: {
            const startCoords = (0, utils_1.transformEntityCoordinates)(positionX, positionY, flip);
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoords = (0, utils_1.transformEntityCoordinates)(positionX + dx * 5, positionY + dy * 5, flip);
            const specialProjectile = (_216 = addAbilitySprite(skill, startCoords)) === null || _216 === void 0 ? void 0 : _216.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoords[0],
                y: finalCoords[1],
                ease: "Power2",
                yoyo: true,
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SHADOW_BONE: {
            const startCoords = (0, utils_1.transformEntityCoordinates)(positionX, positionY, flip);
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoords = (0, utils_1.transformEntityCoordinates)(positionX + dx * 5, positionY + dy * 5, flip);
            const specialProjectile = (_217 = addAbilitySprite(Ability_1.Ability.BONEMERANG, startCoords)) === null || _217 === void 0 ? void 0 : _217.setScale(2).setTint(0x301030);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoords[0],
                y: finalCoords[1],
                ease: "linear",
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.PRISMATIC_LASER: {
            const startCoords = (0, utils_1.transformEntityCoordinates)(targetX, flip ? 6 : 0, flip);
            const finalCoords = (0, utils_1.transformEntityCoordinates)(targetX, flip ? 0 : 6, flip);
            const specialProjectile = (_218 = addAbilitySprite(skill, startCoords)) === null || _218 === void 0 ? void 0 : _218.setScale(5);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoords[0],
                y: finalCoords[1],
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case "GULP_MISSILE/pikachu": {
            const duration = (0, distance_1.distanceM)(positionX, positionY, targetX, targetY) * 150;
            const specialProjectile = (_219 = addAbilitySprite(skill, coordinates)) === null || _219 === void 0 ? void 0 : _219.setScale(2).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: duration,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case "GULP_MISSILE/arrokuda": {
            const duration = (0, distance_1.distanceM)(positionX, positionY, targetX, targetY) * 150;
            const specialProjectile = (_220 = addAbilitySprite(skill, coordinates)) === null || _220 === void 0 ? void 0 : _220.setScale(2).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: duration,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.AURORA_BEAM: {
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoords = (0, utils_1.transformEntityCoordinates)(positionX + dx * 8, positionY + dy * 8, flip);
            const specialProjectile = (_221 = addAbilitySprite(skill, coordinates)) === null || _221 === void 0 ? void 0 : _221.setScale(2).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoords[0],
                y: finalCoords[1],
                ease: "linear",
                yoyo: false,
                duration: 1500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SONG_OF_DESIRE:
            (_222 = addAbilitySprite(skill, [coordinatesTarget[0], coordinatesTarget[1] - 60], true)) === null || _222 === void 0 ? void 0 : _222.setScale(2);
            break;
        case Ability_1.Ability.CONFUSING_MIND:
            (_223 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _223 === void 0 ? void 0 : _223.setScale(2);
            (_224 = addAbilitySprite(skill, coordinates, true)) === null || _224 === void 0 ? void 0 : _224.setScale(2);
            break;
        case Ability_1.Ability.DOUBLE_SHOCK:
            (_225 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _225 === void 0 ? void 0 : _225.setScale(2);
            (_226 = addAbilitySprite(skill, coordinates, true)) === null || _226 === void 0 ? void 0 : _226.setScale(2);
            break;
        case Ability_1.Ability.MIND_BLOWN:
            (_227 = addAbilitySprite(skill, coordinates, true)) === null || _227 === void 0 ? void 0 : _227.setScale(2).setOrigin(0.5, 0.8);
            (_228 = addAbilitySprite("MIND_BLOWN/hit", coordinatesTarget, true)) === null || _228 === void 0 ? void 0 : _228.setScale(3);
            break;
        case Ability_1.Ability.FIRE_LASH:
            (_229 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _229 === void 0 ? void 0 : _229.setScale(4);
            break;
        case Ability_1.Ability.DRAIN_PUNCH:
            (_230 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _230 === void 0 ? void 0 : _230.setScale(2);
            break;
        case Ability_1.Ability.SOFT_BOILED:
            (_231 = addAbilitySprite(skill, coordinates, true)) === null || _231 === void 0 ? void 0 : _231.setScale(2);
            break;
        case Ability_1.Ability.FAKE_TEARS:
            (_232 = addAbilitySprite(skill, coordinates, true)) === null || _232 === void 0 ? void 0 : _232.setScale(2);
            break;
        case Ability_1.Ability.TEA_TIME:
            (_233 = addAbilitySprite(skill, coordinates, true)) === null || _233 === void 0 ? void 0 : _233.setScale(2);
            break;
        case Ability_1.Ability.DRAGON_DARTS: {
            const specialProjectile = (_234 = addAbilitySprite(skill, coordinates)) === null || _234 === void 0 ? void 0 : _234.setScale(1).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SPIRIT_SHACKLE: {
            const specialProjectile = (_235 = addAbilitySprite(skill, coordinates)) === null || _235 === void 0 ? void 0 : _235.setScale(1).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]));
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoordinates = (0, utils_1.transformEntityCoordinates)(positionX + dx * 8, positionY + dy * 8, flip);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoordinates[0],
                y: finalCoordinates[1],
                ease: "linear",
                yoyo: false,
                duration: 2000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ASTRAL_BARRAGE: {
            const specialProjectile = (_236 = addAbilitySprite(skill, coordinates)) === null || _236 === void 0 ? void 0 : _236.setScale(1).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) - Math.PI);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.WATER_SHURIKEN: {
            const orientations = [
                orientation,
                orientation_1.OrientationArray[(orientation_1.OrientationArray.indexOf(orientation) + 1) % 8],
                orientation_1.OrientationArray[(orientation_1.OrientationArray.indexOf(orientation) + 7) % 8]
            ];
            orientations.forEach((orientation) => {
                var _a;
                const [dx, dy] = orientation_1.OrientationVector[orientation];
                const finalCoordinates = (0, utils_1.transformEntityCoordinates)(positionX + dx * 8, positionY + dy * 8, flip);
                const projectile = (_a = addAbilitySprite(skill, coordinates)) === null || _a === void 0 ? void 0 : _a.setScale(2);
                scene.tweens.add({
                    targets: projectile,
                    x: finalCoordinates[0],
                    y: finalCoordinates[1],
                    ease: "linear",
                    yoyo: false,
                    duration: 2000,
                    onComplete: () => {
                        projectile === null || projectile === void 0 ? void 0 : projectile.destroy();
                    }
                });
            });
            break;
        }
        case Ability_1.Ability.RAZOR_LEAF: {
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoordinates = (0, utils_1.transformEntityCoordinates)(positionX + dx * 8, positionY + dy * 8, flip);
            const projectile = (_237 = addAbilitySprite(skill, coordinates)) === null || _237 === void 0 ? void 0 : _237.setScale(2);
            scene.tweens.add({
                targets: projectile,
                x: finalCoordinates[0],
                y: finalCoordinates[1],
                ease: "linear",
                yoyo: false,
                duration: 2000,
                onComplete: () => {
                    projectile === null || projectile === void 0 ? void 0 : projectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.PSYCHO_CUT: {
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoordinates = (0, utils_1.transformEntityCoordinates)(positionX + dx * 8, positionY + dy * 8, flip);
            for (let i = 0; i < 3; i++) {
                const projectile = (_238 = addAbilitySprite(skill, coordinates)) === null || _238 === void 0 ? void 0 : _238.setScale(2).setAlpha(0).setRotation(Math.atan2(finalCoordinates[1] - coordinates[1], finalCoordinates[0] - coordinates[0]) -
                    Math.PI / 2);
                scene.tweens.add({
                    targets: projectile,
                    x: finalCoordinates[0],
                    y: finalCoordinates[1],
                    alpha: { from: 1, to: 1 },
                    ease: "linear",
                    yoyo: false,
                    duration: 1000,
                    delay: i * 100,
                    onComplete: () => {
                        projectile === null || projectile === void 0 ? void 0 : projectile.destroy();
                    }
                });
            }
            break;
        }
        case Ability_1.Ability.SPIKY_SHIELD:
            orientation_1.OrientationArray.forEach((orientation) => {
                var _a;
                const [dx, dy] = orientation_1.OrientationVector[orientation];
                const finalCoordinates = (0, utils_1.transformEntityCoordinates)(positionX + dx * 8, positionY + dy * 8, flip);
                const spike = (_a = addAbilitySprite("SPIKE", coordinates)) === null || _a === void 0 ? void 0 : _a.setRotation(Math.atan2(finalCoordinates[1] - coordinates[1], finalCoordinates[0] - coordinates[0]) +
                    Math.PI / 2);
                scene.tweens.add({
                    targets: spike,
                    x: finalCoordinates[0],
                    y: finalCoordinates[1],
                    ease: "linear",
                    duration: 1000,
                    onComplete: () => {
                        spike === null || spike === void 0 ? void 0 : spike.destroy();
                    }
                });
            });
            break;
        case Ability_1.Ability.MACH_PUNCH:
        case Ability_1.Ability.MEGA_PUNCH: {
            const specialProjectile = (_239 = addAbilitySprite("FIGHTING/FIST", coordinatesTarget)) === null || _239 === void 0 ? void 0 : _239.setScale(0.25);
            scene.tweens.add({
                targets: specialProjectile,
                scale: 3,
                ease: Phaser.Math.Easing.Cubic.Out,
                yoyo: false,
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.MAWASHI_GERI:
        case Ability_1.Ability.THUNDEROUS_KICK: {
            const specialProjectile = (_240 = addAbilitySprite("FIGHTING/FOOT", coordinatesTarget)) === null || _240 === void 0 ? void 0 : _240.setScale(0.25);
            scene.tweens.add({
                targets: specialProjectile,
                scale: 3,
                ease: Phaser.Math.Easing.Cubic.Out,
                yoyo: false,
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.TRIPLE_KICK:
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    var _a;
                    const projectile = (_a = addAbilitySprite("FIGHTING/PAW", [
                        coordinates[0] + Math.round(50 * Math.cos((Math.PI * 2 * i) / 3)),
                        coordinates[1] + Math.round(50 * Math.sin((Math.PI * 2 * i) / 3))
                    ])) === null || _a === void 0 ? void 0 : _a.setScale(1.5);
                    setTimeout(() => projectile === null || projectile === void 0 ? void 0 : projectile.destroy(), 500);
                }, i * 250);
            }
            break;
        case Ability_1.Ability.STRING_SHOT: {
            const specialProjectile = (_241 = addAbilitySprite(skill, coordinatesTarget)) === null || _241 === void 0 ? void 0 : _241.setScale(0.25);
            scene.tweens.add({
                targets: specialProjectile,
                scale: 2,
                alpha: 0.9,
                ease: Phaser.Math.Easing.Cubic.Out,
                yoyo: false,
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ENTANGLING_THREAD: {
            const specialProjectile = (_242 = addAbilitySprite("STRING_SHOT", coordinates)) === null || _242 === void 0 ? void 0 : _242.setScale(0.25).setTint(0x80a080);
            scene.tweens.add({
                targets: specialProjectile,
                scale: 3,
                alpha: 0.9,
                ease: Phaser.Math.Easing.Cubic.Out,
                yoyo: false,
                duration: 1200,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.WONDER_GUARD:
            (_243 = addAbilitySprite(skill, coordinates, true)) === null || _243 === void 0 ? void 0 : _243.setScale(2).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            break;
        case Ability_1.Ability.X_SCISSOR:
            (_244 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _244 === void 0 ? void 0 : _244.setScale(2);
            break;
        case Ability_1.Ability.DEATH_WING:
            (_245 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _245 === void 0 ? void 0 : _245.setScale(2);
            break;
        case Ability_1.Ability.GEOMANCY:
            (_246 = addAbilitySprite(skill, [coordinates[0], coordinates[1] - 50], true)) === null || _246 === void 0 ? void 0 : _246.setScale(2).setDepth(depths_1.DEPTH.ABILITY_GROUND_LEVEL);
            break;
        case Ability_1.Ability.BLIZZARD:
            (_247 = addAbilitySprite(Ability_1.Ability.BLIZZARD, coordinates, true)) === null || _247 === void 0 ? void 0 : _247.setScale(2).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            break;
        case Ability_1.Ability.OVERHEAT:
            (_248 = addAbilitySprite(Ability_1.Ability.FIRE_BLAST, coordinates, true)) === null || _248 === void 0 ? void 0 : _248.setScale(3).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            break;
        case Ability_1.Ability.MIST_BALL: {
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoords = (0, utils_1.transformEntityCoordinates)(positionX + dx * 4, positionY + dy * 4, flip);
            const specialProjectile = (_249 = addAbilitySprite(skill, coordinates)) === null || _249 === void 0 ? void 0 : _249.setScale(1);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoords[0],
                y: finalCoords[1],
                ease: "Power2",
                yoyo: true,
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.LUSTER_PURGE: {
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoords = (0, utils_1.transformEntityCoordinates)(positionX + dx * 5, positionY + dy * 5, flip);
            const specialProjectile = (_250 = addAbilitySprite(skill, coordinates)) === null || _250 === void 0 ? void 0 : _250.setScale(1);
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoords[0],
                y: finalCoords[1],
                ease: "Power2",
                yoyo: true,
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.AERIAL_ACE: {
            const startCoords = (0, utils_1.transformEntityCoordinates)(targetX, 8, false);
            const specialProjectile = (_251 = addAbilitySprite(skill, startCoords)) === null || _251 === void 0 ? void 0 : _251.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.STEALTH_ROCKS:
            (_252 = addAbilitySprite(skill, coordinates, true)) === null || _252 === void 0 ? void 0 : _252.setScale(2).setDepth(depths_1.DEPTH.ABILITY_GROUND_LEVEL);
            break;
        case Ability_1.Ability.SPIKES: {
            const specialProjectile = (_253 = addAbilitySprite(skill, coordinates)) === null || _253 === void 0 ? void 0 : _253.setScale(1).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case "TOXIC_SPIKES": {
            const specialProjectile = (_254 = addAbilitySprite(skill, coordinates)) === null || _254 === void 0 ? void 0 : _254.setScale(2).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                yoyo: false,
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case "LINK_CABLE_link": {
            const distance = (0, distance_1.distanceE)(positionX, positionY, targetX, targetY);
            (_255 = addAbilitySprite(Ability_1.Ability.LINK_CABLE, coordinates, true)) === null || _255 === void 0 ? void 0 : _255.setScale(2, distance * 0.36).setOrigin(0.5, 0).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            break;
        }
        case "LINK_CABLE_discharge":
            setTimeout(() => { var _a; return (_a = addAbilitySprite(Ability_1.Ability.DISCHARGE, coordinates, true)) === null || _a === void 0 ? void 0 : _a.setScale(2); }, delay);
            break;
        case "GRASS_HEAL":
            (_256 = addAbilitySprite("GRASS_HEAL", coordinates, true)) === null || _256 === void 0 ? void 0 : _256.setScale(2).setDepth(depths_1.DEPTH.BOOST_BACK);
            break;
        case "FLAME_HIT":
            (_257 = addAbilitySprite("FLAME_HIT", coordinates, true)) === null || _257 === void 0 ? void 0 : _257.setScale(2).setDepth(depths_1.DEPTH.HIT_FX_BELOW_POKEMON);
            break;
        case Ability_1.Ability.TORCH_SONG: {
            const specialProjectile = (_258 = addAbilitySprite(skill, coordinates, true)) === null || _258 === void 0 ? void 0 : _258.setScale(2).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 500
            });
            break;
        }
        case Ability_1.Ability.HIDDEN_POWER_A:
        case Ability_1.Ability.HIDDEN_POWER_B:
        case Ability_1.Ability.HIDDEN_POWER_C:
        case Ability_1.Ability.HIDDEN_POWER_D:
        case Ability_1.Ability.HIDDEN_POWER_E:
        case Ability_1.Ability.HIDDEN_POWER_F:
        case Ability_1.Ability.HIDDEN_POWER_G:
        case Ability_1.Ability.HIDDEN_POWER_H:
        case Ability_1.Ability.HIDDEN_POWER_I:
        case Ability_1.Ability.HIDDEN_POWER_J:
        case Ability_1.Ability.HIDDEN_POWER_K:
        case Ability_1.Ability.HIDDEN_POWER_L:
        case Ability_1.Ability.HIDDEN_POWER_M:
        case Ability_1.Ability.HIDDEN_POWER_N:
        case Ability_1.Ability.HIDDEN_POWER_O:
        case Ability_1.Ability.HIDDEN_POWER_P:
        case Ability_1.Ability.HIDDEN_POWER_Q:
        case Ability_1.Ability.HIDDEN_POWER_R:
        case Ability_1.Ability.HIDDEN_POWER_S:
        case Ability_1.Ability.HIDDEN_POWER_T:
        case Ability_1.Ability.HIDDEN_POWER_U:
        case Ability_1.Ability.HIDDEN_POWER_V:
        case Ability_1.Ability.HIDDEN_POWER_W:
        case Ability_1.Ability.HIDDEN_POWER_X:
        case Ability_1.Ability.HIDDEN_POWER_Y:
        case Ability_1.Ability.HIDDEN_POWER_Z:
        case Ability_1.Ability.HIDDEN_POWER_QM:
        case Ability_1.Ability.HIDDEN_POWER_EM:
            hiddenPowerAnimation(scene, skill, positionX, positionY, flip);
            break;
        case Ability_1.Ability.ENTRAINMENT: {
            const target = pokemonsOnBoard.find((pkmUI) => pkmUI.positionX === targetX && pkmUI.positionY === targetY);
            if (target)
                target.emoteAnimation();
            break;
        }
        case Ability_1.Ability.TEETER_DANCE:
            pokemonsOnBoard.forEach((pkmUI) => {
                var _a;
                const coordinates = (0, utils_1.transformEntityCoordinates)(pkmUI.positionX, pkmUI.positionY, flip);
                (_a = addAbilitySprite(skill, coordinates, true)) === null || _a === void 0 ? void 0 : _a.setScale(2).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            });
            break;
        case Ability_1.Ability.STRUGGLE_BUG:
            (_259 = addAbilitySprite(Ability_1.Ability.PSYCHIC, coordinates, true)) === null || _259 === void 0 ? void 0 : _259.setScale(2);
            break;
        case Ability_1.Ability.SNIPE_SHOT: {
            const targetAngle = Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]);
            const specialProjectile = (_260 = addAbilitySprite("SNIPE_SHOT/projectile", coordinates)) === null || _260 === void 0 ? void 0 : _260.setScale(3).setRotation(targetAngle - Math.PI / 2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinates[0] + Math.round(Math.cos(targetAngle) * 1000),
                y: coordinates[1] + Math.round(Math.sin(targetAngle) * 1000),
                ease: "linear",
                duration: 1000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            (_261 = addAbilitySprite("SNIPE_SHOT/shoot", [
                coordinates[0] + Math.round(Math.cos(targetAngle) * 50),
                coordinates[1] + Math.round(Math.sin(targetAngle) * 50)
            ], true)) === null || _261 === void 0 ? void 0 : _261.setScale(1, 1).setRotation(targetAngle + Math.PI / 2);
            break;
        }
        case "CURSE_EFFECT": {
            const effect = scene.add.sprite(coordinates[0], coordinates[1], "status", "CURSE_EFFECT/000.png");
            effect.anims.play("CURSE_EFFECT");
            scene.tweens.add({
                targets: effect,
                y: coordinates[1] - 80,
                ease: "linear",
                duration: 1500,
                onComplete: () => {
                    effect.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.AURASPHERE: {
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoordinates = (0, utils_1.transformEntityCoordinates)(positionX + dx * 8, positionY + dy * 8, flip);
            const specialProjectile = (_262 = addAbilitySprite(skill, coordinates)) === null || _262 === void 0 ? void 0 : _262.setScale(2).setRotation(Math.atan2(finalCoordinates[1] - coordinates[1], finalCoordinates[0] - coordinates[0]));
            scene.tweens.add({
                targets: specialProjectile,
                x: finalCoordinates[0],
                y: finalCoordinates[1],
                ease: "linear",
                yoyo: false,
                duration: 2000,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SPIN_OUT: {
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const finalCoordinates = (0, utils_1.transformEntityCoordinates)(positionX + dx * 0.5, positionY + dy * 0.5, flip);
            (_263 = addAbilitySprite(skill, finalCoordinates, true)) === null || _263 === void 0 ? void 0 : _263.setScale(4).setRotation(Math.atan2(finalCoordinates[1] - coordinates[1], finalCoordinates[0] - coordinates[0]) - Math.PI);
            break;
        }
        case Ability_1.Ability.ULTRA_THRUSTERS: {
            (_264 = addAbilitySprite(Ability_1.Ability.LANDS_WRATH, coordinates, true)) === null || _264 === void 0 ? void 0 : _264.setScale(2);
            const [dx, dy] = orientation_1.OrientationVector[orientation];
            const coordinatesThrusters = [
                coordinates[0] + dx * 32,
                coordinates[1] + dy * 32
            ];
            const thrusters = (_265 = addAbilitySprite(Ability_1.Ability.MYSTICAL_FIRE, coordinatesThrusters, true)) === null || _265 === void 0 ? void 0 : _265.setScale(2).setOrigin(0.5, 1).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            scene.tweens.add({
                targets: thrusters,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                duration: 750
            });
            break;
        }
        case Ability_1.Ability.FUTURE_SIGHT:
            (_266 = addAbilitySprite(skill, coordinates, true)) === null || _266 === void 0 ? void 0 : _266.setScale(2);
            break;
        case Ability_1.Ability.LICK:
            (_267 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _267 === void 0 ? void 0 : _267.setScale(2);
            break;
        case Ability_1.Ability.SPIRIT_BREAK:
            (_268 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _268 === void 0 ? void 0 : _268.setScale(2);
            break;
        case Ability_1.Ability.AURA_WHEEL: {
            const specialProjectile = (_269 = addAbilitySprite(skill, coordinates)) === null || _269 === void 0 ? void 0 : _269.setScale(1);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.CROSS_POISON:
            (_270 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _270 === void 0 ? void 0 : _270.setScale(3);
            break;
        case Ability_1.Ability.PSYSHOCK:
            (_271 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _271 === void 0 ? void 0 : _271.setScale(2);
            break;
        case Ability_1.Ability.PETAL_DANCE:
            (_272 = addAbilitySprite(skill, coordinates, true)) === null || _272 === void 0 ? void 0 : _272.setScale(2);
            break;
        case Ability_1.Ability.PETAL_BLIZZARD:
            (_273 = addAbilitySprite(skill, coordinates, true)) === null || _273 === void 0 ? void 0 : _273.setScale(3);
            break;
        case Ability_1.Ability.NIGHTMARE:
            (_274 = addAbilitySprite(skill, coordinates, true)) === null || _274 === void 0 ? void 0 : _274.setScale(2).setOrigin(0.5, 1);
            break;
        case Ability_1.Ability.AROMATHERAPY:
            (_275 = addAbilitySprite(skill, coordinates, true)) === null || _275 === void 0 ? void 0 : _275.setScale(2);
            break;
        case Ability_1.Ability.SHEER_COLD:
            (_276 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _276 === void 0 ? void 0 : _276.setScale(2);
            break;
        case Ability_1.Ability.DARK_HARVEST:
            {
                const darkHarvestGroup = scene.add.group();
                const [x, y] = (0, utils_1.transformEntityCoordinates)(positionX, positionY, flip);
                for (let i = 0; i < 5; i++) {
                    const darkHarvestSprite = (_277 = scene.add
                        .sprite(0, 0, "abilities", `${Ability_1.Ability.DARK_HARVEST}/000.png`)) === null || _277 === void 0 ? void 0 : _277.setScale(2);
                    darkHarvestSprite.anims.play({
                        key: Ability_1.Ability.DARK_HARVEST,
                        frameRate: 8
                    });
                    darkHarvestGroup.add(darkHarvestSprite);
                }
                const circle = new phaser_1.Geom.Circle(x, y, 48);
                Phaser.Actions.PlaceOnCircle(darkHarvestGroup.getChildren(), circle);
                scene.tweens.add({
                    targets: circle,
                    radius: 96,
                    ease: Phaser.Math.Easing.Quartic.Out,
                    duration: 1000,
                    onUpdate: function (tween) {
                        Phaser.Actions.RotateAroundDistance(darkHarvestGroup.getChildren(), { x, y }, 0.08, circle.radius);
                    },
                    onComplete: function () {
                        darkHarvestGroup.destroy(true, true);
                    }
                });
            }
            break;
        case Ability_1.Ability.DECORATE:
            {
                const decorateGroup = scene.add.group();
                const [x, y] = (0, utils_1.transformEntityCoordinates)(targetX, targetY, flip);
                Item_1.Sweets.forEach((sweet) => {
                    var _a;
                    const sweetSprite = (_a = scene.add
                        .sprite(0, 0, "item", `${sweet}.png`)) === null || _a === void 0 ? void 0 : _a.setScale(0.3);
                    decorateGroup.add(sweetSprite);
                });
                const circle = new phaser_1.Geom.Circle(x, y, 30);
                Phaser.Actions.PlaceOnCircle(decorateGroup.getChildren(), circle);
                scene.tweens.add({
                    targets: circle,
                    radius: 60,
                    ease: Phaser.Math.Easing.Quartic.Out,
                    duration: 1000,
                    onUpdate: function (tween) {
                        Phaser.Actions.RotateAroundDistance(decorateGroup.getChildren(), { x, y }, 0.08, circle.radius);
                    },
                    onComplete: function () {
                        decorateGroup.destroy(true, true);
                    }
                });
            }
            break;
        case Ability_1.Ability.AQUA_TAIL:
            (_278 = addAbilitySprite(types_1.AttackSprite.WATER_MELEE, coordinatesTarget, true)) === null || _278 === void 0 ? void 0 : _278.setScale(2);
            break;
        case "HAIL_PROJECTILE": {
            const specialProjectile = (_279 = addAbilitySprite(skill, [
                coordinatesTarget[0] + 60,
                coordinatesTarget[1] - 240
            ])) === null || _279 === void 0 ? void 0 : _279.setScale(1);
            const randomDelay = (0, random_1.randomBetween)(0, 300);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                duration: 800,
                delay: randomDelay,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            setTimeout(() => {
                var _a;
                return (_a = addAbilitySprite(Ability_1.Ability.SHEER_COLD, coordinatesTarget, true)) === null || _a === void 0 ? void 0 : _a.setScale(1);
            }, 800 + randomDelay);
            break;
        }
        case Ability_1.Ability.RAPID_SPIN:
            (_280 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _280 === void 0 ? void 0 : _280.setScale(1.5);
            break;
        case Ability_1.Ability.COTTON_SPORE:
            (_281 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _281 === void 0 ? void 0 : _281.setScale(2);
            break;
        case Ability_1.Ability.COTTON_GUARD:
            (_282 = addAbilitySprite(Ability_1.Ability.COTTON_SPORE, coordinates, true)) === null || _282 === void 0 ? void 0 : _282.setScale(3);
            break;
        case Ability_1.Ability.BOUNCE:
            (_283 = addAbilitySprite(skill, coordinates, true)) === null || _283 === void 0 ? void 0 : _283.setScale(2);
            break;
        case Ability_1.Ability.MAGNET_BOMB: {
            const bomb = (_284 = addAbilitySprite(skill, coordinates, true)) === null || _284 === void 0 ? void 0 : _284.setScale(2);
            scene.tweens.add({
                targets: bomb,
                duration: 400,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                onComplete: () => {
                    bomb === null || bomb === void 0 ? void 0 : bomb.destroy();
                }
            });
            break;
        }
        case "ELECTRO_SHOT_CHARGE": {
            const charge = (_285 = addAbilitySprite(Ability_1.Ability.MAGNET_BOMB, coordinates)) === null || _285 === void 0 ? void 0 : _285.setScale(2);
            scene.tweens.add({
                targets: charge,
                duration: 2000,
                x: coordinates[0],
                y: coordinates[1],
                onComplete: () => {
                    charge === null || charge === void 0 ? void 0 : charge.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ELECTRO_SHOT:
            {
                const shot = (_286 = addAbilitySprite(skill, coordinates)) === null || _286 === void 0 ? void 0 : _286.setScale(4).setOrigin(0, 0.5).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]));
                scene.tweens.add({
                    targets: shot,
                    duration: 1000,
                    x: coordinates[0],
                    y: coordinates[1],
                    onComplete: () => {
                        shot === null || shot === void 0 ? void 0 : shot.destroy();
                    }
                });
            }
            break;
        case "FLOWER_TRICK_EXPLOSION":
            (_287 = addAbilitySprite("PUFF_PINK", coordinates, true)) === null || _287 === void 0 ? void 0 : _287.setScale(3);
            break;
        case Ability_1.Ability.FLOWER_TRICK:
            {
                const target = pokemonsOnBoard.find((pkmUI) => pkmUI.positionX === targetX && pkmUI.positionY === targetY);
                target === null || target === void 0 ? void 0 : target.addFlowerTrick();
            }
            break;
        case Ability_1.Ability.GUNK_SHOT: {
            const specialProjectile = (_288 = addAbilitySprite(skill, coordinates)) === null || _288 === void 0 ? void 0 : _288.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "Power2",
                duration: 700,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.SCHOOLING:
            (_289 = addAbilitySprite(skill, coordinates, true)) === null || _289 === void 0 ? void 0 : _289.setScale(4).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            break;
        case Ability_1.Ability.STONE_AXE:
            (_290 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _290 === void 0 ? void 0 : _290.setScale(2);
            break;
        case Ability_1.Ability.CRUSH_CLAW:
        case Ability_1.Ability.METAL_CLAW:
            (_291 = addAbilitySprite(Ability_1.Ability.CRUSH_CLAW, coordinatesTarget, true)) === null || _291 === void 0 ? void 0 : _291.setScale(2);
            break;
        case Ability_1.Ability.DRAGON_CLAW:
            (_292 = addAbilitySprite(Ability_1.Ability.DRAGON_CLAW, coordinatesTarget, true)) === null || _292 === void 0 ? void 0 : _292.setScale(1);
            break;
        case Ability_1.Ability.EARTHQUAKE:
            (_293 = addAbilitySprite(skill, coordinates, true)) === null || _293 === void 0 ? void 0 : _293.setScale(3);
            scene.shakeCamera(350, 0.01);
            break;
        case Ability_1.Ability.OCTAZOOKA:
            (_294 = addAbilitySprite(Ability_1.Ability.SMOKE_SCREEN, coordinatesTarget, true)) === null || _294 === void 0 ? void 0 : _294.setScale(3);
            break;
        case Ability_1.Ability.WOOD_HAMMER:
            (_295 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _295 === void 0 ? void 0 : _295.setScale(1).setOrigin(0.5, 1);
            break;
        case Ability_1.Ability.TRICK_OR_TREAT:
            (_296 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _296 === void 0 ? void 0 : _296.setScale(2).setOrigin(0.5, 1);
            break;
        case Ability_1.Ability.INFESTATION:
            {
                if (positionY === 8 || positionY === 0) {
                    const duration = (0, distance_1.distanceM)(positionX, positionY, targetX, targetY) * 150;
                    const projectile = (_297 = addAbilitySprite("HEAL_ORDER", coordinates, true)) === null || _297 === void 0 ? void 0 : _297.setScale(3);
                    scene.tweens.add({
                        targets: projectile,
                        x: coordinatesTarget[0],
                        y: coordinatesTarget[1],
                        ease: "linear",
                        yoyo: false,
                        duration: duration,
                        onComplete: () => {
                            projectile === null || projectile === void 0 ? void 0 : projectile.destroy();
                        }
                    });
                }
                else {
                    (_298 = addAbilitySprite("ATTACK_ORDER", coordinatesTarget, true)) === null || _298 === void 0 ? void 0 : _298.setScale(2);
                }
            }
            break;
        case "FIELD_DEATH":
            (_299 = addAbilitySprite("FIELD_DEATH", coordinates, true)) === null || _299 === void 0 ? void 0 : _299.setScale(2);
            break;
        case "GROUND_GROW":
            (_300 = addAbilitySprite(skill, coordinates, true)) === null || _300 === void 0 ? void 0 : _300.setScale(1.5);
            break;
        case "FIGHTING_KNOCKBACK":
            (_301 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _301 === void 0 ? void 0 : _301.setScale(2);
            break;
        case Ability_1.Ability.HEADBUTT:
            (_302 = addAbilitySprite("FIGHTING_KNOCKBACK", coordinatesTarget, true)) === null || _302 === void 0 ? void 0 : _302.setScale(2);
            break;
        case "FAIRY_CRIT":
            (_303 = addAbilitySprite(skill, coordinates, true)) === null || _303 === void 0 ? void 0 : _303.setScale(2);
            break;
        case "POWER_LENS":
            (_304 = addAbilitySprite(skill, coordinates, true)) === null || _304 === void 0 ? void 0 : _304.setScale(2);
            break;
        case "STAR_DUST":
            (_305 = addAbilitySprite(skill, coordinates, true)) === null || _305 === void 0 ? void 0 : _305.setScale(2);
            break;
        case "HEAL_ORDER":
        case "ATTACK_ORDER":
            (_306 = addAbilitySprite(skill, coordinates, true)) === null || _306 === void 0 ? void 0 : _306.setScale(2);
            break;
        case "FISHING":
            (_307 = addAbilitySprite(Ability_1.Ability.DIVE, coordinates, true)) === null || _307 === void 0 ? void 0 : _307.setScale(1).setOrigin(0.5, -2).setDepth(depths_1.DEPTH.ABILITY_GROUND_LEVEL);
            break;
        case "SPAWN":
            (_308 = addAbilitySprite("SPAWN", coordinates, true)) === null || _308 === void 0 ? void 0 : _308.setScale(2).setOrigin(0.5, -0.5).setDepth(depths_1.DEPTH.BOOST_BACK);
            break;
        case "EVOLUTION":
            (_309 = addAbilitySprite("EVOLUTION", coordinates, true)) === null || _309 === void 0 ? void 0 : _309.setScale(2).setOrigin(0.5, 0.4).setDepth(depths_1.DEPTH.BOOST_BACK);
            break;
        case "HATCH":
            (_310 = addAbilitySprite("SOFT_BOILED", coordinates, true)) === null || _310 === void 0 ? void 0 : _310.setScale(2).setOrigin(0.5, 0.4).setDepth(depths_1.DEPTH.BOOST_BACK);
            break;
        case "FLYING_TAKEOFF":
            (_311 = addAbilitySprite("FLYING_TAKEOFF", coordinates, true)) === null || _311 === void 0 ? void 0 : _311.setScale(2).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            break;
        case "FLYING_SKYDIVE":
            {
                const startCoords = (0, utils_1.transformEntityCoordinates)(targetX, 9, false);
                const specialProjectile = (_312 = addAbilitySprite(skill, startCoords)) === null || _312 === void 0 ? void 0 : _312.setScale(2);
                scene.tweens.add({
                    targets: specialProjectile,
                    x: coordinatesTarget[0],
                    y: coordinatesTarget[1],
                    ease: "linear",
                    duration: 500,
                    onComplete: () => {
                        specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                    }
                });
            }
            break;
        case "TIDAL_WAVE":
            {
                const down = orientation === (flip ? Game_1.Orientation.UP : Game_1.Orientation.DOWN);
                const startCoords = (0, utils_1.transformEntityCoordinates)(3.6, -4, down);
                const endCoords = (0, utils_1.transformEntityCoordinates)(3.6, 10, down);
                const wave = (_313 = scene.add
                    .sprite(startCoords[0], startCoords[1], "abilities", `TIDAL_WAVE/00${targetY}.png`)
                    .setOrigin(0.5, 0.5)
                    .setDepth(depths_1.DEPTH.ABILITY_MINOR)) === null || _313 === void 0 ? void 0 : _313.setScale(3).setAlpha(0).setRotation(down ? Math.PI : 0);
                scene.tweens.add({
                    targets: wave,
                    x: endCoords[0],
                    y: endCoords[1],
                    ease: "linear",
                    duration: 1800,
                    onComplete: () => {
                        wave.destroy();
                    },
                    onUpdate: function (tween) {
                        if (tween.progress < 0.2) {
                            wave.setAlpha(tween.progress * 5);
                        }
                        else if (tween.progress > 0.8) {
                            wave.setAlpha((1 - tween.progress) * 5);
                        }
                    }
                });
            }
            break;
        case Ability_1.Ability.PURIFY:
            (_314 = addAbilitySprite(Ability_1.Ability.SMOG, coordinatesTarget, true)) === null || _314 === void 0 ? void 0 : _314.setScale(1);
            (_315 = addAbilitySprite(Ability_1.Ability.MUD_BUBBLE, coordinates, true)) === null || _315 === void 0 ? void 0 : _315.setScale(1);
            break;
        case Ability_1.Ability.PSYCHO_SHIFT:
            {
                const pkmSprite = (_316 = addAbilitySprite(Ability_1.Ability.PRESENT, coordinates)) === null || _316 === void 0 ? void 0 : _316.setScale(2);
                if (targetX !== undefined && targetY !== undefined) {
                    const targetSprite = (_317 = addAbilitySprite(Ability_1.Ability.PRESENT, coordinatesTarget)) === null || _317 === void 0 ? void 0 : _317.setScale(2);
                    scene.tweens.add({
                        targets: pkmSprite,
                        x: coordinatesTarget[0],
                        y: coordinatesTarget[1],
                        ease: "linear",
                        duration: 300,
                        repeat: 1,
                        yoyo: true,
                        onComplete: () => {
                            pkmSprite === null || pkmSprite === void 0 ? void 0 : pkmSprite.destroy();
                        }
                    });
                    scene.tweens.add({
                        targets: targetSprite,
                        x: coordinates[0],
                        y: coordinates[1],
                        ease: "linear",
                        duration: 300,
                        repeat: 1,
                        yoyo: true,
                        onComplete: () => {
                            targetSprite === null || targetSprite === void 0 ? void 0 : targetSprite.destroy();
                        }
                    });
                }
            }
            break;
        case Ability_1.Ability.GLAIVE_RUSH: {
            const specialProjectile = (_318 = addAbilitySprite(skill, coordinates)) === null || _318 === void 0 ? void 0 : _318.setScale(3).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON).setRotation(Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]) -
                Math.PI / 2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 500,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.STEEL_WING:
            (_319 = addAbilitySprite(Ability_1.Ability.STEEL_WING, coordinates, true)) === null || _319 === void 0 ? void 0 : _319.setScale(2);
            break;
        case Ability_1.Ability.FOUL_PLAY:
            (_320 = addAbilitySprite(Ability_1.Ability.NIGHT_SLASH, coordinatesTarget, true)) === null || _320 === void 0 ? void 0 : _320.setScale(2);
            break;
        case Ability_1.Ability.WONDER_ROOM:
            (_321 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _321 === void 0 ? void 0 : _321.setScale(4);
            break;
        case Ability_1.Ability.DOUBLE_IRON_BASH:
            (_322 = addAbilitySprite(Ability_1.Ability.DRAIN_PUNCH, coordinatesTarget, true)) === null || _322 === void 0 ? void 0 : _322.setScale(2);
            break;
        case Ability_1.Ability.STONE_EDGE:
            (_323 = addAbilitySprite(Ability_1.Ability.TORMENT, coordinates, true)) === null || _323 === void 0 ? void 0 : _323.setScale(2);
            break;
        case Ability_1.Ability.THUNDER_CAGE:
            (_324 = addAbilitySprite(Ability_1.Ability.THUNDER_CAGE, coordinatesTarget, true)) === null || _324 === void 0 ? void 0 : _324.setScale(2);
            break;
        case Ability_1.Ability.MAGNET_PULL:
            (_325 = addAbilitySprite(Ability_1.Ability.THUNDER_CAGE, coordinates, true)) === null || _325 === void 0 ? void 0 : _325.setScale(2).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            break;
        case Ability_1.Ability.BIDE:
            (_326 = addAbilitySprite(Ability_1.Ability.COUNTER, coordinates, true)) === null || _326 === void 0 ? void 0 : _326.setScale(3);
            break;
        case Ability_1.Ability.SHORE_UP:
            (_327 = addAbilitySprite(Ability_1.Ability.EARTHQUAKE, coordinates, true)) === null || _327 === void 0 ? void 0 : _327.setScale(2);
            break;
        case Ability_1.Ability.BONE_ARMOR: {
            const startCoords = (0, utils_1.transformEntityCoordinates)(targetX, targetY, flip);
            Object.values(Game_1.Orientation).forEach((o) => {
                var _a;
                const [dx, dy] = orientation_1.OrientationVector[o];
                const finalCoords = (0, utils_1.transformEntityCoordinates)(positionX + dx * 1, positionY + dy * 1, flip);
                const specialProjectile = (_a = addAbilitySprite(Ability_1.Ability.BONEMERANG, startCoords)) === null || _a === void 0 ? void 0 : _a.setScale(2);
                scene.tweens.add({
                    targets: specialProjectile,
                    x: finalCoords[0],
                    y: finalCoords[1],
                    yoyo: false,
                    duration: 1000,
                    onComplete: () => {
                        specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                    }
                });
            });
            break;
        }
        case Ability_1.Ability.FIRESTARTER: {
            const abilitySprite = (_328 = addAbilitySprite(skill, [
                coordinatesTarget[0],
                coordinatesTarget[1] - 25
            ])) === null || _328 === void 0 ? void 0 : _328.setScale(2);
            scene.tweens.add({
                targets: abilitySprite,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1] + 25,
                ease: "linear",
                duration: 800,
                onComplete: () => {
                    abilitySprite === null || abilitySprite === void 0 ? void 0 : abilitySprite.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.DARK_LARIAT: {
            const abilitySprite = (_329 = addAbilitySprite(skill, coordinates, true)) === null || _329 === void 0 ? void 0 : _329.setScale(2).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            scene.tweens.add({
                targets: abilitySprite,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 500
            });
            break;
        }
        case Ability_1.Ability.BOLT_BEAK: {
            const abilitySprite = (_330 = addAbilitySprite(skill, coordinates, true)) === null || _330 === void 0 ? void 0 : _330.setScale(2).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            scene.tweens.add({
                targets: abilitySprite,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 250
            });
            break;
        }
        case Ability_1.Ability.FREEZE_DRY: {
            const abilitySprite = (_331 = addAbilitySprite(skill, coordinates, true)) === null || _331 === void 0 ? void 0 : _331.setScale(2).setDepth(depths_1.DEPTH.ABILITY_GROUND_LEVEL);
            scene.tweens.add({
                targets: abilitySprite,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 250
            });
            break;
        }
        case Ability_1.Ability.DRAGON_PULSE: {
            const abilitySprite = (_332 = addAbilitySprite(skill, coordinates, true)) === null || _332 === void 0 ? void 0 : _332.setScale(2).setDepth(depths_1.DEPTH.ABILITY_BELOW_POKEMON);
            scene.tweens.add({
                targets: abilitySprite,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 500,
                scaleX: 4,
                scaleY: 4
            });
            break;
        }
        case Ability_1.Ability.DRUM_BEATING:
            (_333 = addAbilitySprite(Ability_1.Ability.DRUM_BEATING, [coordinates[0] - 20, coordinates[1] - 40], true)) === null || _333 === void 0 ? void 0 : _333.setScale(2).setAngle(-45);
            break;
        case Ability_1.Ability.BRICK_BREAK:
        case Ability_1.Ability.BULK_UP:
        case Ability_1.Ability.FLASH:
            (_334 = addAbilitySprite(skill, coordinates, true)) === null || _334 === void 0 ? void 0 : _334.setScale(2);
            break;
        case Ability_1.Ability.TAUNT:
            (_335 = addAbilitySprite(skill, [coordinates[0], coordinates[1] - 30], true)) === null || _335 === void 0 ? void 0 : _335.setScale(2);
            break;
        case "TAUNT_HIT":
            (_336 = addAbilitySprite(skill, [coordinatesTarget[0], coordinatesTarget[1] - 30], true)) === null || _336 === void 0 ? void 0 : _336.setScale(2);
            break;
        case "SMOKE_BALL":
            (_337 = addAbilitySprite(skill, coordinates, true)) === null || _337 === void 0 ? void 0 : _337.setScale(3);
            break;
        case "FOSSIL_RESURRECT":
            (_338 = addAbilitySprite(skill, coordinates, true)) === null || _338 === void 0 ? void 0 : _338.setScale(2);
            break;
        case Ability_1.Ability.RETALIATE:
            (_339 = addAbilitySprite(skill, coordinatesTarget, true)) === null || _339 === void 0 ? void 0 : _339.setScale(2);
            break;
        case Ability_1.Ability.TAILWIND: {
            const angle = Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]);
            (_340 = addAbilitySprite(skill, coordinates, true)) === null || _340 === void 0 ? void 0 : _340.setScale(2).setRotation(angle - Math.PI / 2);
            break;
        }
        case Ability_1.Ability.STRENGTH: {
            const specialProjectile = (_341 = addAbilitySprite(skill, [coordinatesTarget[0], coordinatesTarget[1] - 150], true)) === null || _341 === void 0 ? void 0 : _341.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                y: coordinatesTarget[1],
                ease: Phaser.Math.Easing.Quadratic.In,
                duration: 450
            });
            break;
        }
        case Ability_1.Ability.SURF: {
            const angle = Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]);
            const specialProjectile = (_342 = addAbilitySprite(skill, coordinates)) === null || _342 === void 0 ? void 0 : _342.setScale(2).setRotation(angle - (3 / 4) * Math.PI);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                ease: "linear",
                duration: 600,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.COLUMN_CRUSH: {
            const distance = (0, distance_1.distanceE)(coordinates[0], coordinates[1], coordinatesTarget[0], coordinatesTarget[1]);
            const pillarType = (_343 = [Pokemon_1.Pkm.PILLAR_WOOD, Pokemon_1.Pkm.PILLAR_IRON, Pokemon_1.Pkm.PILLAR_CONCRETE][orientation]) !== null && _343 !== void 0 ? _343 : Pokemon_1.Pkm.PILLAR_WOOD;
            const animKey = `${Pokemon_1.PkmIndex[pillarType]}/${Game_1.PokemonTint.NORMAL}/${Animation_1.AnimationType.Idle}/${Game_1.SpriteType.ANIM}/${Game_1.Orientation.DOWN}`;
            const specialProjectile = (_344 = addAbilitySprite(animKey, coordinates)) === null || _344 === void 0 ? void 0 : _344.setScale(2);
            scene.tweens.add({
                targets: specialProjectile,
                x: coordinatesTarget[0],
                y: coordinatesTarget[1],
                angle: 270,
                ease: "linear",
                duration: distance * 2,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.MALIGNANT_CHAIN: {
            const angle = Math.atan2(coordinatesTarget[1] - coordinates[1], coordinatesTarget[0] - coordinates[0]);
            const distance = (0, distance_1.distanceE)(coordinates[0], coordinates[1], coordinatesTarget[0], coordinatesTarget[1]);
            const specialProjectile = (_345 = addAbilitySprite(skill, coordinates)) === null || _345 === void 0 ? void 0 : _345.setScale(1, 0).setOrigin(0.5, 0).setRotation(angle - Math.PI / 2);
            scene.tweens.add({
                targets: specialProjectile,
                scaleY: distance / 80,
                ease: "linear",
                duration: 600,
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ICICLE_MISSILE: {
            const specialProjectile = (_346 = addAbilitySprite(skill, coordinates)) === null || _346 === void 0 ? void 0 : _346.setScale(2);
            const dx = delay === 1 ? -3 : delay === 2 ? +3 : 0;
            const topCoords = (0, utils_1.transformEntityCoordinates)(targetX + dx, positionY + 5, false);
            const angle1 = Math.atan2(topCoords[1] - coordinates[1], topCoords[0] - coordinates[0]) -
                Math.PI / 2;
            const angle2 = Math.atan2(coordinatesTarget[1] - topCoords[1], coordinatesTarget[0] - topCoords[0]) -
                Math.PI / 2;
            specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.setRotation(angle1);
            scene.tweens.chain({
                targets: specialProjectile,
                tweens: [
                    {
                        x: topCoords[0],
                        y: topCoords[1],
                        rotation: angle2,
                        duration: 750,
                        ease: Phaser.Math.Easing.Quadratic.Out
                    },
                    {
                        x: coordinatesTarget[0],
                        y: coordinatesTarget[1],
                        duration: 750,
                        ease: Phaser.Math.Easing.Quadratic.In
                    }
                ],
                onComplete: () => {
                    specialProjectile === null || specialProjectile === void 0 ? void 0 : specialProjectile.destroy();
                }
            });
            break;
        }
        case Ability_1.Ability.ARM_THRUST: {
            for (let i = 0; i < (delay !== null && delay !== void 0 ? delay : 2); i++) {
                setTimeout(() => {
                    const anim = addAbilitySprite(Ability_1.Ability.BRICK_BREAK, [
                        coordinatesTarget[0] + (0, random_1.randomBetween)(-30, 30),
                        coordinatesTarget[1] + (0, random_1.randomBetween)(-30, 30)
                    ], true);
                    scene.tweens.add({
                        targets: anim,
                        alpha: 0,
                        ease: "linear",
                        onComplete: () => {
                            anim === null || anim === void 0 ? void 0 : anim.destroy();
                        }
                    });
                }, i * 250);
            }
            break;
        }
        case "PARTING_SHOT": {
            setTimeout(() => {
                const anim = addAbilitySprite(skill, coordinates, true);
                scene.tweens.chain({
                    targets: anim,
                    tweens: [
                        {
                            scaleX: 1.2,
                            scaleY: 1.2,
                            ease: Phaser.Math.Easing.Quadratic.Out,
                            duration: 100
                        },
                        {
                            scaleX: 1,
                            scaleY: 1,
                            ease: Phaser.Math.Easing.Quadratic.In,
                            duration: 200
                        },
                        {
                            alpha: 0,
                            duration: 200
                        }
                    ],
                    onComplete: () => {
                        anim === null || anim === void 0 ? void 0 : anim.destroy();
                    }
                });
            }, 750);
            break;
        }
        default:
            break;
    }
}
const UNOWNS_PER_ABILITY = new Map([
    [
        Ability_1.Ability.HIDDEN_POWER_A,
        [Pokemon_1.Pkm.UNOWN_A, Pokemon_1.Pkm.UNOWN_B, Pokemon_1.Pkm.UNOWN_R, Pokemon_1.Pkm.UNOWN_A]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_B,
        [Pokemon_1.Pkm.UNOWN_B, Pokemon_1.Pkm.UNOWN_U, Pokemon_1.Pkm.UNOWN_R, Pokemon_1.Pkm.UNOWN_N]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_C,
        [Pokemon_1.Pkm.UNOWN_C, Pokemon_1.Pkm.UNOWN_O, Pokemon_1.Pkm.UNOWN_I, Pokemon_1.Pkm.UNOWN_N]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_D,
        [Pokemon_1.Pkm.UNOWN_D, Pokemon_1.Pkm.UNOWN_I, Pokemon_1.Pkm.UNOWN_T, Pokemon_1.Pkm.UNOWN_O]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_E,
        [Pokemon_1.Pkm.UNOWN_E, Pokemon_1.Pkm.UNOWN_G, Pokemon_1.Pkm.UNOWN_G, Pokemon_1.Pkm.UNOWN_S]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_F,
        [Pokemon_1.Pkm.UNOWN_F, Pokemon_1.Pkm.UNOWN_I, Pokemon_1.Pkm.UNOWN_S, Pokemon_1.Pkm.UNOWN_H]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_G,
        [Pokemon_1.Pkm.UNOWN_G, Pokemon_1.Pkm.UNOWN_O, Pokemon_1.Pkm.UNOWN_L, Pokemon_1.Pkm.UNOWN_D]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_H,
        [Pokemon_1.Pkm.UNOWN_H, Pokemon_1.Pkm.UNOWN_E, Pokemon_1.Pkm.UNOWN_A, Pokemon_1.Pkm.UNOWN_L]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_I,
        [Pokemon_1.Pkm.UNOWN_I, Pokemon_1.Pkm.UNOWN_T, Pokemon_1.Pkm.UNOWN_E, Pokemon_1.Pkm.UNOWN_M]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_J,
        [Pokemon_1.Pkm.UNOWN_J, Pokemon_1.Pkm.UNOWN_A, Pokemon_1.Pkm.UNOWN_W, Pokemon_1.Pkm.UNOWN_S]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_K,
        [Pokemon_1.Pkm.UNOWN_K, Pokemon_1.Pkm.UNOWN_I, Pokemon_1.Pkm.UNOWN_C, Pokemon_1.Pkm.UNOWN_K]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_L,
        [Pokemon_1.Pkm.UNOWN_L, Pokemon_1.Pkm.UNOWN_O, Pokemon_1.Pkm.UNOWN_C, Pokemon_1.Pkm.UNOWN_K]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_M,
        [Pokemon_1.Pkm.UNOWN_M, Pokemon_1.Pkm.UNOWN_A, Pokemon_1.Pkm.UNOWN_N, Pokemon_1.Pkm.UNOWN_A]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_N,
        [Pokemon_1.Pkm.UNOWN_N, Pokemon_1.Pkm.UNOWN_U, Pokemon_1.Pkm.UNOWN_K, Pokemon_1.Pkm.UNOWN_E]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_O,
        [Pokemon_1.Pkm.UNOWN_O, Pokemon_1.Pkm.UNOWN_V, Pokemon_1.Pkm.UNOWN_E, Pokemon_1.Pkm.UNOWN_N]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_P,
        [Pokemon_1.Pkm.UNOWN_P, Pokemon_1.Pkm.UNOWN_E, Pokemon_1.Pkm.UNOWN_S, Pokemon_1.Pkm.UNOWN_T]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_Q,
        [Pokemon_1.Pkm.UNOWN_Q, Pokemon_1.Pkm.UNOWN_U, Pokemon_1.Pkm.UNOWN_I, Pokemon_1.Pkm.UNOWN_T]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_R,
        [Pokemon_1.Pkm.UNOWN_R, Pokemon_1.Pkm.UNOWN_O, Pokemon_1.Pkm.UNOWN_L, Pokemon_1.Pkm.UNOWN_L]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_S,
        [Pokemon_1.Pkm.UNOWN_S, Pokemon_1.Pkm.UNOWN_U, Pokemon_1.Pkm.UNOWN_R, Pokemon_1.Pkm.UNOWN_F]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_T,
        [Pokemon_1.Pkm.UNOWN_T, Pokemon_1.Pkm.UNOWN_R, Pokemon_1.Pkm.UNOWN_E, Pokemon_1.Pkm.UNOWN_E]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_U,
        [Pokemon_1.Pkm.UNOWN_U, Pokemon_1.Pkm.UNOWN_X, Pokemon_1.Pkm.UNOWN_I, Pokemon_1.Pkm.UNOWN_E]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_V,
        [Pokemon_1.Pkm.UNOWN_V, Pokemon_1.Pkm.UNOWN_O, Pokemon_1.Pkm.UNOWN_L, Pokemon_1.Pkm.UNOWN_T]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_W,
        [Pokemon_1.Pkm.UNOWN_W, Pokemon_1.Pkm.UNOWN_I, Pokemon_1.Pkm.UNOWN_S, Pokemon_1.Pkm.UNOWN_H]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_X,
        [Pokemon_1.Pkm.UNOWN_X, Pokemon_1.Pkm.UNOWN_R, Pokemon_1.Pkm.UNOWN_A, Pokemon_1.Pkm.UNOWN_Y]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_Y,
        [Pokemon_1.Pkm.UNOWN_Y, Pokemon_1.Pkm.UNOWN_O, Pokemon_1.Pkm.UNOWN_G, Pokemon_1.Pkm.UNOWN_A]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_Z,
        [Pokemon_1.Pkm.UNOWN_Z, Pokemon_1.Pkm.UNOWN_E, Pokemon_1.Pkm.UNOWN_R, Pokemon_1.Pkm.UNOWN_O]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_EM,
        [
            Pokemon_1.Pkm.UNOWN_EXCLAMATION,
            Pokemon_1.Pkm.UNOWN_EXCLAMATION,
            Pokemon_1.Pkm.UNOWN_EXCLAMATION,
            Pokemon_1.Pkm.UNOWN_EXCLAMATION
        ]
    ],
    [
        Ability_1.Ability.HIDDEN_POWER_QM,
        [
            Pokemon_1.Pkm.UNOWN_QUESTION,
            Pokemon_1.Pkm.UNOWN_QUESTION,
            Pokemon_1.Pkm.UNOWN_QUESTION,
            Pokemon_1.Pkm.UNOWN_QUESTION
        ]
    ]
]);
function hiddenPowerAnimation(scene, skill, originX, originY, flip) {
    const [x, y] = (0, utils_1.transformEntityCoordinates)(originX, originY, flip);
    const unownsGroup = scene.add.group();
    const letters = UNOWNS_PER_ABILITY.get(skill);
    for (let n = 0; n < 8; n++) {
        letters === null || letters === void 0 ? void 0 : letters.forEach((letter, i) => {
            var _a;
            const unown = new pokemon_1.default(scene, x, y, pokemon_factory_1.default.createPokemonFromName(letter), "unown", false, flip);
            unown.draggable = false;
            unownsGroup.add(unown);
            (_a = scene.animationManager) === null || _a === void 0 ? void 0 : _a.animatePokemon(unown, Game_1.PokemonActionState.IDLE, flip);
        });
    }
    const circle = new Phaser.Geom.Circle(x, y, 10);
    Phaser.Actions.PlaceOnCircle(unownsGroup.getChildren(), circle);
    scene.tweens.add({
        targets: circle,
        radius: 500,
        ease: Phaser.Math.Easing.Quartic.Out,
        duration: 2500,
        onUpdate: function (tween) {
            Phaser.Actions.RotateAroundDistance(unownsGroup.getChildren(), { x, y }, -0.02 * (1 - tween.progress), circle.radius);
            if (tween.progress > 0.8) {
                unownsGroup.setAlpha((1 - tween.progress) * 5);
            }
        },
        onComplete() {
            unownsGroup.destroy(true, true);
        }
    });
}
//# sourceMappingURL=abilities-animations.js.map