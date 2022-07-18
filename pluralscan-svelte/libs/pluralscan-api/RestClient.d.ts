import { AnalyzerClient } from "./clients/AnalyzerClient";
import { PackageClient } from "./clients/PackageClient";
import { ProjectClient } from "./clients/ProjectClient";
import { ScanClient } from "./clients/ScanClient";
import { RestClientOptions } from "./RestClientOptions";
export declare class RestClient {
    constructor(options: RestClientOptions);
    private apiClient;
    analyzer: AnalyzerClient;
    project: ProjectClient;
    package: PackageClient;
    scan: ScanClient;
}
