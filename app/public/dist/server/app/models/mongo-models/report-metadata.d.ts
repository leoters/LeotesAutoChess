export interface IReportMetadata {
    created_at: string;
    count: number;
    time_limit: string;
}
declare const _default: import("mongoose").Model<IReportMetadata, {}, {}, {}, import("mongoose").Document<unknown, {}, IReportMetadata, {}> & IReportMetadata & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default _default;
export declare function fetchMetadata(): Promise<IReportMetadata[]>;
