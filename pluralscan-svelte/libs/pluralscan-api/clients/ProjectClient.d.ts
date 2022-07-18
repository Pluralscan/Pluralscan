import { IApiClient } from "../http/ApiClient";
import { Project } from "../models/Project";
import { ProjectSource } from "../models/ProjectSource";
import { CreateProjectResponse, ProjectPage } from "../types";
export declare class ProjectClient {
    private client;
    constructor(client: IApiClient);
    list(page: number, limit: number): Promise<ProjectPage>;
    findProject(name: string, source: ProjectSource): Promise<Project>;
    createProject(uri: string): Promise<CreateProjectResponse>;
}
