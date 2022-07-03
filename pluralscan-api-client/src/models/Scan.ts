import { ScanState } from "./ScanState";

export interface Scan {
    id: string;
    package_id: string;
    executable_id: string;
    created_at: string;
    started_at: string;
    ended_at: string;
    working_directory: string;
    state: ScanState;
    batch: string;
}