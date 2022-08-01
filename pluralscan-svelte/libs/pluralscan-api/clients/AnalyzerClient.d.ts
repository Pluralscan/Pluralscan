import { IApiClient } from "../http/ApiClient";
import { Technology } from "../models/Technology";
import { AnalyzerList, AnalyzerPage } from "../types";
export declare class AnalyzerClient {
    private client;
    constructor(client: IApiClient);
    list(page: number, limit: number): Promise<AnalyzerPage>;
    findByTechnologies(technologies: Technology[]): Promise<AnalyzerList>;
}
