"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestClient = void 0;
const AnalyzerClient_1 = require("./clients/AnalyzerClient");
const PackageClient_1 = require("./clients/PackageClient");
const ProjectClient_1 = require("./clients/ProjectClient");
const ScanClient_1 = require("./clients/ScanClient");
const ApiClient_1 = require("./http/ApiClient");
class RestClient {
    constructor(options) {
        this.apiClient = new ApiClient_1.ApiClient(options.apiUrl);
        this.analyzer = new AnalyzerClient_1.AnalyzerClient(this.apiClient);
        this.project = new ProjectClient_1.ProjectClient(this.apiClient);
        this.package = new PackageClient_1.PackageClient(this.apiClient);
        this.scan = new ScanClient_1.ScanClient(this.apiClient);
    }
}
exports.RestClient = RestClient;
