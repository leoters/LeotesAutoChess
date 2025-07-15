import { SetSchema } from "@colyseus/schema";
import { Stat } from "../types/enum/Game";
import { Item } from "../types/enum/Item";
export declare function getWonderboxItems(existingItems: SetSchema<Item>): Item[];
export declare const ItemStats: {
    [item in Item]?: {
        [stat in Stat]?: number;
    };
};
