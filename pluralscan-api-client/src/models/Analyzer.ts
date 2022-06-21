export interface Analyzer {
    id: string;
    name: string;
    fullname: string;
    targets: Set<AnalyzerTarget>;
    localization: string;
}