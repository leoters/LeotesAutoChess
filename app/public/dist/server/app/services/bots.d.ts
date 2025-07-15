import { mongo } from "mongoose";
import { IBot, IStep } from "../models/mongo-models/bot-v2";
import { IUserMetadata } from "../models/mongo-models/user-metadata";
export type IBotListItem = Omit<IBot, "steps">;
export declare function fetchBotsList(approved?: boolean): Promise<IBotListItem[]>;
export declare function fetchBot(id: string): Promise<IBot | null>;
export declare function addBotToDatabase(bot: {
    name: string;
    avatar: string;
    elo: number;
    author: string;
    steps: IStep[];
}): Promise<IBot>;
export declare function deleteBotFromDatabase(botId: string, user: IUserMetadata): Promise<mongo.DeleteResult>;
export declare function approveBot(botId: string, approved: boolean, user: IUserMetadata): Promise<mongo.UpdateResult>;
