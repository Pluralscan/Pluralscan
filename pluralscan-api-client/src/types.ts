import { Analyzer } from "./models/Analyzer";
import { Package } from "./models/Package";
import { Project } from "./models/Project";
import { ProjectSource } from "./models/ProjectSource";

export type ProjectNameWithSource = { name: string, source: ProjectSource }

export type CreateProjectResponse = { project: Project, package: Package }

export type FindAllPackageResponse = {
    packages: [Package],
    totalItems: number,
    pageNumber: number,
    totalPage: number,
    pageSize: number,
}

export type FindAllAnalyzerResponse = {
    analyzers: [Analyzer],
    totalItems: number,
    pageNumber: number,
    totalPage: number,
    pageSize: number,
}