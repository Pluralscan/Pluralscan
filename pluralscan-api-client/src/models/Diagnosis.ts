import { Issue } from "./Issue";

export interface Diagnosis {
    scan_id: string;
    created_at: string;
    issues: Issue[];
}