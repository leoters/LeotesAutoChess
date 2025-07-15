import { Item } from "../../types/enum/Item";
import { Pkm } from "../../types/enum/Pokemon";
export interface IItemsStatisticV2 {
    tier: string;
    items: Map<string, IItemV2>;
}
export interface IItemV2 {
    rank: number;
    count: number;
    name: Item;
    pokemons: Pkm[];
}
declare const _default: import("mongoose").Model<IItemsStatisticV2, {}, {}, {}, import("mongoose").Document<unknown, {}, IItemsStatisticV2, {}> & IItemsStatisticV2 & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default _default;
export declare function fetchMetaItems(): Promise<IItemsStatisticV2[]>;
