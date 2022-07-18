
import { IApiClient } from "../http/ApiClient";
import { ApiRequest } from "../http/ApiRequest";
import { ApiResponse } from "../http/ApiResponse";
import { Project } from "../models/Project";
import { ProjectSource } from "../models/ProjectSource";
import { CreateProjectResponse, ProjectPage } from "../types";

const FIND_ALL_ROUTE: string = "api/projects?";
const FIND_PROJECT_ROUTE: string = "api/projects/";
const CREATE_PROJECT_ROUTE: string = "api/projects";

export class ProjectClient {
    constructor(private client: IApiClient) {

    }

    public async list(page: number, limit: number): Promise<ProjectPage> {
        const request = new ApiRequest("GET", FIND_ALL_ROUTE, new URLSearchParams({ "page": page.toString(), "limit": limit.toString() }));
        const response: ApiResponse<ProjectPage> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }

    public async findProject(name: string, source: ProjectSource): Promise<Project> {
        const request = new ApiRequest("GET", FIND_PROJECT_ROUTE + `${source}/${name}`);
        const response: ApiResponse<Project> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }

    public async createProject(uri: string): Promise<CreateProjectResponse> {
        const request = new ApiRequest("POST", CREATE_PROJECT_ROUTE);
        request.body = { uri: uri }
        const response: ApiResponse<CreateProjectResponse> = await this.client.sendRequest(request);
        if (response.success)
            return response.data!;
        throw `Error: ${response.error}`
    }
}