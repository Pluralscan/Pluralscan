import { Analyzer } from "./models/Analyzer";
import { Package } from "./models/Package";
import { Project } from "./models/Project";
import { ProjectSource } from "./models/ProjectSource";
import { Scan } from "./models/Scan";

export type PageResponse = {
    searchMetadata: SearchMetadata
}

export type SearchMetadata = {
    itemCount: number;
    pageIndex: number;
    pageCount: number;
    pageSize: number;
}

// Packages
export type PackageList = Package[]
export type PackagePage = {
    packages: Package[]
} & PageResponse

// Analyzers
export type AnalyzerList = Analyzer[]
export type AnalyzerPage = {
    analyzers: Analyzer[]
} & PageResponse

// Projects
export type ProjectList = Project[]
export type ProjectPage = {
    projects: Project[]
} & PageResponse
export type ProjectNameWithSource = { name: string, source: ProjectSource }
export type CreateProjectResponse = { project: Project, package: Package }


// Scans
export type ScanList = Scan[]
export type ScanPage = {
    scans: Scan[],
} & PageResponse
export type ScheduleScanResponse = { scans: Scan[] }