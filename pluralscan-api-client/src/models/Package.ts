import { PackageLink } from "./PackageLink";
import { Technology } from "./Technology";

export interface Package {
    id: string;
    name: string;
    author: string;
    licenses: string[];
    created_at: string;
    version: string;
    system: string;
    storage_path: string;
    published_at: string;
    projectId: string;
    description: string;
    technologies: Technology[];
    links: PackageLink[];
}