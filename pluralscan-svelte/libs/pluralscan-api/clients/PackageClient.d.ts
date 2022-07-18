import { IApiClient } from "../http/ApiClient";
import { Package } from "../models/Package";
import { PackagePage } from "../types";
export declare class PackageClient {
    private client;
    constructor(client: IApiClient);
    list(page: number, limit: number): Promise<PackagePage>;
    get(package_id: string): Promise<Package>;
    latestSnapshot(project_id: string): Promise<Package>;
}
