import { Analyzer } from "./models/Analyzer";
import { Package } from "./models/Package";
import { Project } from "./models/Project";
import { ProjectSource } from "./models/ProjectSource";
import { Scan } from "./models/Scan";

export type ProjectNameWithSource = { name: string, source: ProjectSource }

export type CreateProjectResponse = { project: Project, package: Package }

export type SeachMetadata = {
    totalItems: number,
    pageNumber: number,
    totalPage: number,
    pageSize: number,
}

export type ListPackageResponse = {
    packages: Package[],
} & SeachMetadata

export type ListAnalyzerResponse = {
    analyzers: Analyzer[],
} & SeachMetadata
export type AnalyzersByTechnologiesResponse = {
    analyzers: Analyzer[],
}

export type ListProjectResponse = {
    projects: Project[],
} & SeachMetadata

export type ListScanResponse = {
    scans: Scan[],
} & SeachMetadata