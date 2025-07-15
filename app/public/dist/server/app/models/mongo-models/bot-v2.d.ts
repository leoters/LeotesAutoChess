import { Emotion, PkmWithCustom } from "../../types";
import { Item } from "../../types/enum/Item";
import { Pkm } from "../../types/enum/Pokemon";
export interface IDetailledPokemon extends PkmWithCustom {
    name: Pkm;
    x: number;
    y: number;
    items: Item[];
    emotion?: Emotion;
    shiny?: boolean;
}
export interface IStep {
    board: IDetailledPokemon[];
    roundsRequired: number;
}
export interface IBot {
    avatar: string;
    author: string;
    elo: number;
    steps: IStep[];
    name: string;
    id: string;
    approved: boolean;
}
export type IBotLight = Omit<IBot, "steps"> & {
    valid: boolean;
};
declare const BotV2: import("mongoose").Model<IBot, {}, {}, {}, import("mongoose").Document<unknown, {}, IBot, {}> & IBot & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export { BotV2 };
