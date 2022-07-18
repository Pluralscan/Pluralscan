import { Analyzer } from "./models/Analyzer";
import { Package } from "./models/Package";
import { Project } from "./models/Project";
import { ProjectSource } from "./models/ProjectSource";
import { Scan } from "./models/Scan";
export declare type ProjectNameWithSource = {
    name: string;
    source: ProjectSource;
};
export declare type CreateProjectResponse = {
    project: Project;
    package: Package;
};
export declare type PageResponse = {
    searchMetadata: SearchMetadata;
};
export declare type SearchMetadata = {
    itemCount: number;
    pageIndex: number;
    pageCount: number;
    pageSize: number;
};
export declare type PackageList = Package[];
export declare type PackagePage = {
    packages: Package[];
} & PageResponse;
export declare type AnalyzerList = Analyzer[];
export declare type AnalyzerPage = {
    analyzers: Analyzer[];
} & PageResponse;
export declare type ProjectList = Project[];
export declare type ProjectPage = {
    projects: Project[];
} & PageResponse;
export declare type ScanList = Scan[];
export declare type ScanPage = {
    scans: Scan[];
} & PageResponse;
