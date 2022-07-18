import { ProjectSource } from "./ProjectSource";
export interface Project {
    id: string;
    name: string;
    source: ProjectSource;
    uri: string;
    lastSnapshot: string;
    description: string;
    createdAt: string;
}
