import { ArraySchema } from "@colyseus/schema";
import { Emotion, Role, Title } from "../../types";
import { Language } from "../../types/enum/Language";
export interface IUserMetadata {
    uid: string;
    displayName: string;
    language: Language | "";
    avatar: string;
    wins: number;
    exp: number;
    level: number;
    elo: number;
    pokemonCollection: Map<string, IPokemonCollectionItem>;
    booster: number;
    titles: Title[];
    title: "" | Title;
    role: Role;
    banned?: boolean;
}
export interface IPokemonCollectionItem {
    dust: number;
    emotions: Emotion[] | ArraySchema<Emotion>;
    shinyEmotions: Emotion[] | ArraySchema<Emotion>;
    selectedEmotion: Emotion | null;
    selectedShiny: boolean;
    id: string;
    played: number;
}
declare const _default: import("mongoose").Model<IUserMetadata, {}, {}, {}, import("mongoose").Document<unknown, {}, IUserMetadata, {}> & IUserMetadata & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default _default;
