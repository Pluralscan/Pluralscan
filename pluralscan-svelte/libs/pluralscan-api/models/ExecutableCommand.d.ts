import { ExecutableAction } from "./ExecutableAction";
export interface ExecutableCommand {
    action: ExecutableAction;
    arguments: string[];
}
