import { ExecutablePlatform } from "./ExecutablePlatform";

export interface Executable {
    analyzer_id: string
    platform: ExecutablePlatform,
    name: string,
    path: string,
    version: string
    semantic_version: string,
    commands: any
}