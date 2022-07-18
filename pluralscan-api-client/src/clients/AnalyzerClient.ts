
import { IApiClient } from "../http/ApiClient";
import { ApiRequest } from "../http/ApiRequest";
import { ApiResponse } from "../http/ApiResponse";
import { Technology } from "../models/Technology";
import { AnalyzerList, AnalyzerPage } from "../types";

const FIND_ALL_ROUTE: string = "api/analyzers?";
const FIND_BY_TECHNOLOGIES_ROUTE: string = "api/analyzers/technologies?"

export class AnalyzerClient {
    constructor(private client: IApiClient) {

    }

    public async list(page: number, limit: number): Promise<AnalyzerPage> {
        const request = new ApiRequest("GET", FIND_ALL_ROUTE, new URLSearchParams({ "page": page.toString(), "limit": limit.toString() }));
        const response: ApiResponse<AnalyzerPage> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }

    public async findByTechnologies(technologies: [Technology]): Promise<AnalyzerList> {
        if (!technologies || !technologies.length){
            throw 'At least one technology code must be defined.'
        }

        const request = new ApiRequest("GET", FIND_BY_TECHNOLOGIES_ROUTE, new URLSearchParams(technologies.map(t => ['code', t.code])) );
        const response: ApiResponse<AnalyzerList> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
    
        throw `Error: ${response.error}`
    }
}