import { AnalyzerClient } from "./clients/AnalyzerClient"
import { ProjectClient } from "./clients/ProjectClient"
import { ApiClient, IApiClient } from "./http/ApiClient"
import { RestClientOptions } from "./RestClientOptions"

export class RestClient {
    constructor(options: RestClientOptions) {
        this.apiClient = new ApiClient(options.apiUrl)
        this.analyzer = new AnalyzerClient(this.apiClient)
        this.project = new ProjectClient(this.apiClient)
    }

    private apiClient: IApiClient

    public analyzer: AnalyzerClient
    public project: ProjectClient
}