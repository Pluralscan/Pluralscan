/**
 * Options to be passed during api client initialization.
 */
export declare class RestClientOptions {
    constructor(apiUrl: string, enabledCache?: boolean);
    apiUrl: string;
    enabledCache: boolean;
}
