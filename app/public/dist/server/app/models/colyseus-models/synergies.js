"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeSynergies = computeSynergies;
exports.addSynergiesGivenByItems = addSynergiesGivenByItems;
const schema_1 = require("@colyseus/schema");
const Config_1 = require("../../types/Config");
const Item_1 = require("../../types/enum/Item");
const Passive_1 = require("../../types/enum/Passive");
const Pokemon_1 = require("../../types/enum/Pokemon");
const Synergy_1 = require("../../types/enum/Synergy");
const schemas_1 = require("../../utils/schemas");
class Synergies extends schema_1.MapSchema {
    constructor() {
        super();
        Object.keys(Synergy_1.Synergy).forEach((key) => {
            this.set(key, 0);
        });
    }
    getSynergyStep(type) {
        return Config_1.SynergyTriggers[type].filter((n) => { var _a; return ((_a = this.get(type)) !== null && _a !== void 0 ? _a : 0) >= n; })
            .length;
    }
    countActiveSynergies() {
        let count = 0;
        this.forEach((value, key) => {
            if (value >= Config_1.SynergyTriggers[key][0]) {
                count++;
            }
        });
        return count;
    }
    getTopSynergies() {
        const synergiesSortedByLevel = [];
        this.forEach((value, key) => {
            synergiesSortedByLevel.push([key, value]);
        });
        synergiesSortedByLevel.sort(([s1, v1], [s2, v2]) => v2 - v1);
        const topSynergyCount = synergiesSortedByLevel[0][1];
        const topSynergies = synergiesSortedByLevel
            .filter(([s, v]) => v >= topSynergyCount)
            .map(([s, v]) => s);
        return topSynergies;
    }
    toMap() {
        const map = new Map();
        this.forEach((value, key) => {
            map.set(key, value);
        });
        return map;
    }
}
exports.default = Synergies;
function computeSynergies(board, bonusSynergies) {
    var _a;
    const synergies = new Map();
    Object.keys(Synergy_1.Synergy).forEach((key) => {
        var _a;
        synergies.set(key, (_a = bonusSynergies === null || bonusSynergies === void 0 ? void 0 : bonusSynergies.get(key)) !== null && _a !== void 0 ? _a : 0);
    });
    const typesPerFamily = new Map();
    board.forEach((pkm) => {
        var _a;
        if (pkm.passive === Passive_1.Passive.PROTEAN2 || pkm.passive === Passive_1.Passive.PROTEAN3) {
            pkm.types.forEach((type) => pkm.types.delete(type));
        }
        addSynergiesGivenByItems(pkm);
        if (pkm.positionY != 0) {
            const family = Pokemon_1.PkmFamily[pkm.name];
            if (!typesPerFamily.has(family))
                typesPerFamily.set(family, new Set());
            const types = typesPerFamily.get(family);
            pkm.types.forEach((type) => types.add(type));
            if (pkm.items.has(Item_1.Item.SHINY_STONE)) {
                synergies.set(Synergy_1.Synergy.LIGHT, ((_a = synergies.get(Synergy_1.Synergy.LIGHT)) !== null && _a !== void 0 ? _a : 0) + 1);
            }
        }
    });
    typesPerFamily.forEach((types) => {
        types.forEach((type, i) => {
            var _a;
            synergies.set(type, ((_a = synergies.get(type)) !== null && _a !== void 0 ? _a : 0) + 1);
        });
    });
    function applyDragonDoubleTypes() {
        const dragonDoubleTypes = new Map();
        board.forEach((pkm) => {
            if (pkm.positionY != 0 && pkm.types.has(Synergy_1.Synergy.DRAGON) && pkm.types.size > 1) {
                const family = Pokemon_1.PkmFamily[pkm.name];
                if (!dragonDoubleTypes.has(family))
                    dragonDoubleTypes.set(family, new Set());
                dragonDoubleTypes.get(family).add((0, schemas_1.values)(pkm.types)[1]);
            }
        });
        dragonDoubleTypes.forEach((types) => {
            types.forEach((type, i) => {
                var _a;
                synergies.set(type, ((_a = synergies.get(type)) !== null && _a !== void 0 ? _a : 0) + 1);
            });
        });
    }
    if (((_a = synergies.get(Synergy_1.Synergy.DRAGON)) !== null && _a !== void 0 ? _a : 0) >= Config_1.SynergyTriggers[Synergy_1.Synergy.DRAGON][0]) {
        applyDragonDoubleTypes();
    }
    board.forEach((pkm) => {
        var _a, _b;
        if (pkm.positionY !== 0 &&
            (pkm.passive === Passive_1.Passive.PROTEAN2 || pkm.passive === Passive_1.Passive.PROTEAN3)) {
            const nbDynamicSynergies = pkm.passive === Passive_1.Passive.PROTEAN3 ? 3 : 2;
            const synergiesSorted = [...synergies.keys()].sort((a, b) => +synergies.get(b) - +synergies.get(a));
            if (synergiesSorted.slice(0, nbDynamicSynergies).includes(Synergy_1.Synergy.DRAGON)) {
                const dragonIndex = synergiesSorted.indexOf(Synergy_1.Synergy.DRAGON);
                if (dragonIndex > 0) {
                    synergiesSorted.splice(dragonIndex, 1);
                    synergiesSorted.unshift(Synergy_1.Synergy.DRAGON);
                }
            }
            let shouldComputeDragonDoubleTypeAgain = false;
            for (let i = 0; i < nbDynamicSynergies; i++) {
                const type = synergiesSorted[i];
                if (type && !pkm.types.has(type) && synergies.get(type) > 0) {
                    pkm.types.add(type);
                    synergies.set(type, ((_a = synergies.get(type)) !== null && _a !== void 0 ? _a : 0) + 1);
                    if (type === Synergy_1.Synergy.DRAGON) {
                        if (synergies.get(Synergy_1.Synergy.DRAGON) === Config_1.SynergyTriggers[Synergy_1.Synergy.DRAGON][0]) {
                            shouldComputeDragonDoubleTypeAgain = true;
                        }
                        else if (synergies.get(Synergy_1.Synergy.DRAGON) > Config_1.SynergyTriggers[Synergy_1.Synergy.DRAGON][0]) {
                            const doubledType = synergiesSorted[1];
                            synergies.set(doubledType, ((_b = synergies.get(doubledType)) !== null && _b !== void 0 ? _b : 0) + 1);
                        }
                    }
                }
            }
            if (shouldComputeDragonDoubleTypeAgain) {
                applyDragonDoubleTypes();
            }
        }
    });
    return synergies;
}
function addSynergiesGivenByItems(pkm) {
    pkm.items.forEach((item) => {
        const synergy = Item_1.SynergyGivenByItem[item];
        if (synergy &&
            !(pkm.passive === Passive_1.Passive.RECYCLE && Item_1.ArtificialItems.includes(item))) {
            pkm.types.add(synergy);
        }
    });
}
//# sourceMappingURL=synergies.js.map