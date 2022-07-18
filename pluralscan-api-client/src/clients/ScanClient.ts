
import { IApiClient } from "../http/ApiClient";
import { ApiRequest } from "../http/ApiRequest";
import { ApiResponse } from "../http/ApiResponse";
import { ScanPage } from "../types";

const FIND_ALL_ROUTE: string = "api/scans?";

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
}