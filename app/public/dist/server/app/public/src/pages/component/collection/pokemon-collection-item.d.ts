import { Dispatch, SetStateAction } from "react";
import { IPokemonCollectionItem } from "../../../../../models/mongo-models/user-metadata";
import { Pkm } from "../../../../../types/enum/Pokemon";
import { CollectionFilterState } from "./pokemon-collection";
import "./pokemon-collection-item.css";
export default function PokemonCollectionItem(props: {
    name: Pkm;
    index: string;
    config: IPokemonCollectionItem | undefined;
    filterState: CollectionFilterState;
    setPokemon: Dispatch<SetStateAction<Pkm | "">>;
}): import("react/jsx-runtime").JSX.Element | null;
