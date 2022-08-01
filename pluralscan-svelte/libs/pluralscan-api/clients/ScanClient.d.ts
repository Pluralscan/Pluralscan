import { IApiClient } from "../http/ApiClient";
import { Scan } from "../models/Scan";
import { ScanPage, ScheduleScanResponse } from "../types";
export declare class ScanClient {
    private client;
    constructor(client: IApiClient);
    list(page: number, limit: number): Promise<ScanPage>;
    get(scan_id: string): Promise<Scan>;
    schedule(packageId: string, analyzers: Map<string, string[]>): Promise<ScheduleScanResponse>;
}
