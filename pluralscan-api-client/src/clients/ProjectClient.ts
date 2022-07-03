
import { IApiClient } from "../http/ApiClient";
import { ApiRequest } from "../http/ApiRequest";
import { ApiResponse } from "../http/ApiResponse";
import { Project } from "../models/Project";

const FIND_ALL_ROUTE: string = "api/projects";
const FIND_PROJECT_BY_URI_ROUTE: string = "api/projects/uri/";
const CREATE_PROJECT_ROUTE: string = "api/projects";

export class ProjectClient {
    constructor(private client: IApiClient){
        
    } 
    
    public async findAll(): Promise<Project[]> {
        const request = new ApiRequest("GET", FIND_ALL_ROUTE);
        const response: ApiResponse<Project[]> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }

    public async findProjectByUri(uri: string): Promise<Project>{
        const request = new ApiRequest("GET", FIND_PROJECT_BY_URI_ROUTE + uri);
        const response: ApiResponse<Project> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }

    public async createProject(uri: string): Promise<Project>{
        const request = new ApiRequest("POST", CREATE_PROJECT_ROUTE);
        request.body = { uri: uri }
        const response: ApiResponse<Project> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }
}