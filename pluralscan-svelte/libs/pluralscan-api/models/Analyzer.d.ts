import { Executable } from "./Executable";
import { Technology } from "./Technology";
export interface Analyzer {
    id: string;
    name: string;
    technologies: Technology[];
    description: string;
    executables: Executable[];
}
