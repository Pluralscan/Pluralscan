import { Language } from "./Language";

export interface Technology {
    code: string;
    display_name: string;
    languages: Language[]
    compilers: any[]
}