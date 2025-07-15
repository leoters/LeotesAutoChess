import { Pkm } from "./Pokemon";
export declare enum WandererBehavior {
    RUN_THROUGH = "RUN_THROUGH",
    SPECTATE = "SPECTATE",
    STEAL_ITEM = "STEAL_ITEM"
}
export declare enum WandererType {
    CATCHABLE = "CATCHABLE",
    UNOWN = "UNOWN",
    SABLEYE = "SABLEYE"
}
export interface Wanderer {
    id: string;
    pkm: Pkm;
    type: WandererType;
    behavior: WandererBehavior;
}
