import { IPokemonCollectionItem, IUserMetadata } from "../models/mongo-models/user-metadata";
import { PkmWithCustom } from "../types";
import { Booster, BoosterCard } from "../types/Booster";
export declare function createBooster(user: IUserMetadata): Booster;
export declare function pickRandomPokemonBooster(user: IUserMetadata, guarantedUnique: boolean): BoosterCard;
export declare function hasUnlocked(collection: Map<string, IPokemonCollectionItem>, card: PkmWithCustom): boolean;
