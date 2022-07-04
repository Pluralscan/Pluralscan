import { Package } from "./models/Package";
import { Project } from "./models/Project";
import { ProjectSource } from "./models/ProjectSource";

export type ProjectNameWithSource = { name: string, source: ProjectSource}

export type CreateProjectResponse = { project: Project, package: Package }