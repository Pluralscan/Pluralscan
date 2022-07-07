
import { IApiClient } from "../http/ApiClient";
import { ApiRequest } from "../http/ApiRequest";
import { ApiResponse } from "../http/ApiResponse";
import { Scan } from "../models/Scan";

const FIND_ALL_ROUTE: string = "api/scans";

export class ScanClient {
    constructor(private client: IApiClient){
        
    } 
    
    public async findAll(): Promise<Scan[]> {
        const request = new ApiRequest("GET", FIND_ALL_ROUTE);
        const response: ApiResponse<Scan[]> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }
}