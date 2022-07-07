
import { IApiClient } from "../http/ApiClient";
import { ApiRequest } from "../http/ApiRequest";
import { ApiResponse } from "../http/ApiResponse";
import { FindAllAnalyzerResponse } from "../types";

const FIND_ALL_ROUTE: string = "api/analyzers";

export class AnalyzerClient {
    constructor(private client: IApiClient){
        
    } 
    
    public async findAll(): Promise<FindAllAnalyzerResponse> {
        const request = new ApiRequest("GET", FIND_ALL_ROUTE);
        const response: ApiResponse<FindAllAnalyzerResponse> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }
}