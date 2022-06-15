import { AnalyzerClient } from "./clients/AnalyzerClient";
import { ApiClient, IApiClient } from "./http/ApiClient";
import { RestClientOptions } from "./RestClientOptions";

export class RestClient {
    constructor(options: RestClientOptions){
        this.apiClient = new ApiClient(options.apiUrl);
        this.analyzer = new AnalyzerClient(this.apiClient);
    }

    private apiClient: IApiClient;

    public analyzer: AnalyzerClient;
}