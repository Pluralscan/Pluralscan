
import { IApiClient } from "../http/ApiClient";
import { ApiRequest } from "../http/ApiRequest";
import { ApiResponse } from "../http/ApiResponse";
import { Analyzer } from "../models/Analyzer";

const GET_ALL_ANALYZERS_ROUTE: string = "api/analyzers/";

export class AnalyzerClient {
    constructor(private client: IApiClient){
        
    } 
    
    public async getAnalyzers(): Promise<Analyzer[]> {
        const request = new ApiRequest("GET", GET_ALL_ANALYZERS_ROUTE);
        const response: ApiResponse<Analyzer[]> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }
}