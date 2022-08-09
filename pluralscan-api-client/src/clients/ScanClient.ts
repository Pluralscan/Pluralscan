
import { IApiClient } from "../http/ApiClient";
import { ApiRequest } from "../http/ApiRequest";
import { ApiResponse } from "../http/ApiResponse";
import { Scan } from "../models/Scan";
import { ScanPage, ScheduleScanResponse } from "../types";

const FIND_ALL_ROUTE: string = "api/scans?";
const SCHEDULE_SCAN_ROUTE: string = "api/scans/schedule/package/";
const GET_BY_ID_ROUTE: string = "api/scans/";

export class ScanClient {
    constructor(private client: IApiClient){
        
    } 
    
    public async list(page: number, limit: number): Promise<ScanPage> {
        const request = new ApiRequest("GET", FIND_ALL_ROUTE, new URLSearchParams({ "page": page.toString(), "limit": limit.toString() }));
        const response: ApiResponse<ScanPage> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }

    public async get(scan_id: string): Promise<Scan>{
        const request = new ApiRequest("GET", GET_BY_ID_ROUTE + `${scan_id}`);
        const response: ApiResponse<Scan> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }

    public async schedule(packageId: string, analyzers: Map<string, string[]>): Promise<ScheduleScanResponse> {
        const request = new ApiRequest("POST", SCHEDULE_SCAN_ROUTE + packageId);
        request.body = { analyzers: Object.fromEntries(analyzers) }
        const response: ApiResponse<ScheduleScanResponse> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }
}