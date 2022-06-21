import { ExecutablePlatform } from "./ExecutablePlatform";

export interface Executable {
    platform: ExecutablePlatform,
    name: string,
    location: string,
    version: string
    semantic_version: string,
    arguments: any
}