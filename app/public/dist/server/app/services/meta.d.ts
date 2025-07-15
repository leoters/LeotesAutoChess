import { IPokemonsStatisticV2 } from "../models/mongo-models/pokemons-statistic-v2";
import { IReportMetadata } from "../models/mongo-models/report-metadata";
import { IItemsStatisticV2 } from "../models/mongo-models/items-statistic-v2";
export declare function fetchMetaReports(): Promise<[IReportMetadata[], IItemsStatisticV2[], IPokemonsStatisticV2[]]>;
export declare function getMetaPokemons(): IPokemonsStatisticV2[];
export declare function getMetaItems(): IItemsStatisticV2[];
export declare function getMetadata(): IReportMetadata[];
