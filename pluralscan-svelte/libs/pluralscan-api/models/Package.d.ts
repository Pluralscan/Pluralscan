import { Technology } from "./Technology";
export interface Package {
    id: string;
    name: string;
    author: string;
    licenses: string[];
    createdAt: string;
    version: string;
    system: string;
    storagePath: string;
    publishedAt: string;
    projectId: string;
    description: string;
    technologies: Technology[];
}
