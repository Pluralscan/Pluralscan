import { IssueLocationKind } from "./IssueLocationKind";

export interface IssueLocation {
    path: string;
    absolute_path: string;
    line: number;
    column: number;
    end_line: number;
    end_column: number;
    kind: IssueLocationKind
}