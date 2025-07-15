import { Item } from "../../types/enum/Item";
import { Effect, OnAttackEffect, PeriodicEffect } from "./effect";
export declare const blueOrbOnAttackEffect: OnAttackEffect;
export declare const choiceScarfOnAttackEffect: OnAttackEffect;
export declare class SoulDewEffect extends PeriodicEffect {
    constructor();
}
export declare const ItemEffects: {
    [i in Item]?: Effect[];
};
