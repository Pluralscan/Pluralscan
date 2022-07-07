import { AnalyzerClient } from "./clients/AnalyzerClient"
import { PackageClient } from "./clients/PackageClient"
import { ProjectClient } from "./clients/ProjectClient"
import { ScanClient } from "./clients/ScanClient"
import { ApiClient, IApiClient } from "./http/ApiClient"
import { RestClientOptions } from "./RestClientOptions"

export class RestClient {
    constructor(options: RestClientOptions) {
        this.apiClient = new ApiClient(options.apiUrl)
        this.analyzer = new AnalyzerClient(this.apiClient)
        this.project = new ProjectClient(this.apiClient)
        this.package = new PackageClient(this.apiClient)
        this.scan = new ScanClient(this.apiClient)
    }

    private apiClient: IApiClient

    public analyzer: AnalyzerClient
    public project: ProjectClient
    public package: PackageClient
    public scan: ScanClient
}