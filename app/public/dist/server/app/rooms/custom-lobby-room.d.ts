import { Dispatcher } from "@colyseus/command";
import { Client, IRoomListingData, Room } from "colyseus";
import { CronJob } from "cron";
import { IUserMetadata } from "../models/mongo-models/user-metadata";
import { ITournament } from "../types/interfaces/Tournament";
import LobbyState from "./states/lobby-state";
export default class CustomLobbyRoom extends Room<LobbyState> {
    unsubscribeLobby: (() => void) | undefined;
    rooms: IRoomListingData[] | undefined;
    dispatcher: Dispatcher<this>;
    tournamentCronJobs: Map<string, CronJob>;
    cleanUpCronJobs: CronJob[];
    users: Map<string, IUserMetadata>;
    constructor();
    removeRoom(index: number, roomId: string): void;
    addRoom(roomId: string, data: IRoomListingData): void;
    changeRoom(index: number, roomId: string, data: IRoomListingData): void;
    onCreate(): Promise<void>;
    onAuth(client: Client, options: any, context: any): Promise<import("firebase-admin/lib/auth/user-record").UserRecord>;
    onJoin(client: Client, options: any, auth: any): Promise<void>;
    onLeave(client: Client, consented: boolean): Promise<void>;
    onDispose(): void;
    fetchChat(): Promise<void>;
    fetchTournaments(): Promise<void>;
    startTournament(tournament: ITournament): void;
    initCronJobs(): void;
}
