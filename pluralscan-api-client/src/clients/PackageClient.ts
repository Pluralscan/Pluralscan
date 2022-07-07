
import { IApiClient } from "../http/ApiClient";
import { ApiRequest } from "../http/ApiRequest";
import { ApiResponse } from "../http/ApiResponse";
import { Package } from "../models/Package";

const FIND_ALL_ROUTE: string = "api/packages";

export class PackageClient {
    constructor(private client: IApiClient){
        
    } 
    
    public async findAll(): Promise<Package[]> {
        const request = new ApiRequest("GET", FIND_ALL_ROUTE);
        const response: ApiResponse<Package[]> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }
    
}