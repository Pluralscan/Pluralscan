import { IssueLocation } from "./IssueLocation";
import { IssueSeverity } from "./IssueSeverity";
export interface Issue {
    rule_id: string;
    message: string;
    severity: IssueSeverity;
    location: IssueLocation;
}
