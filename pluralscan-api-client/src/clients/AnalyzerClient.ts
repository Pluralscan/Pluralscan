
import { IApiClient } from "../http/ApiClient";
import { ApiRequest } from "../http/ApiRequest";
import { ApiResponse } from "../http/ApiResponse";
import { ListAnalyzerResponse } from "../types";

const FIND_ALL_ROUTE: string = "api/analyzers?";

export class AnalyzerClient {
    constructor(private client: IApiClient) {

    }

    public async list(page: number, limit: number): Promise<ListAnalyzerResponse> {
        const request = new ApiRequest("GET", FIND_ALL_ROUTE, new URLSearchParams({ "page": page.toString(), "limit": limit.toString() }));
        const response: ApiResponse<ListAnalyzerResponse> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }
}