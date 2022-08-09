import { IssueLocation } from "./IssueLocation";
import { IssueSeverity } from "./IssueSeverity";

export interface RuleId {
    code: string;
    analyzer_id: string;
}

export interface Issue {
    rule_id: string;
    analyzer_id: string;
    message: string;
    severity: IssueSeverity;
    location: IssueLocation;
}