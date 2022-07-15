
import { IApiClient } from "../http/ApiClient";
import { ApiRequest } from "../http/ApiRequest";
import { ApiResponse } from "../http/ApiResponse";
import { Package } from "../models/Package";
import { ListPackageResponse } from "../types";

const FIND_ALL_ROUTE: string = "api/packages?";
const GET_BY_ID_ROUTE: string = "api/packages/";
const GET_LATEST_SNAPSHOT_ROUTE: string = "api/projects/";

export class PackageClient {
    constructor(private client: IApiClient) {

    }

    public async list(page: number, limit: number): Promise<ListPackageResponse> {
        const request = new ApiRequest("GET", FIND_ALL_ROUTE, new URLSearchParams({ "page": page.toString(), "limit": limit.toString() }));
        const response: ApiResponse<ListPackageResponse> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }

    public async get(package_id: string): Promise<Package>{
        const request = new ApiRequest("GET", GET_BY_ID_ROUTE + `${package_id}`);
        const response: ApiResponse<Package> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }

    public async latestSnapshot(project_id: string): Promise<Package>{
        const request = new ApiRequest("GET", GET_LATEST_SNAPSHOT_ROUTE + `${project_id}/packages/latest`);
        const response: ApiResponse<Package> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }
}