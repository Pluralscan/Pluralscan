import { ProjectNameWithSource } from "../types";
export declare const GITHUB_URI_REGEX: RegExp;
export declare const GITLAB_URI_REGEX: RegExp;
export declare function extractProjectSource(uri: string): ProjectNameWithSource;
