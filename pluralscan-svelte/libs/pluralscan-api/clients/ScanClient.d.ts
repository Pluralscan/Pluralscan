import { IApiClient } from "../http/ApiClient";
import { ScanPage } from "../types";
export declare class ScanClient {
    private client;
    constructor(client: IApiClient);
    list(page: number, limit: number): Promise<ScanPage>;
}
