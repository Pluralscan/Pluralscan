import { Diagnosis } from "./Diagnosis";
import { ScanState } from "./ScanState";
export interface Scan {
    id: string;
    package_id: string;
    analyzer_id: string;
    executable_version: string;
    diagnosis: Diagnosis;
    created_at: string;
    started_at: string;
    endedAt: string;
    working_directory: string;
    state: ScanState;
    batch: string;
}
