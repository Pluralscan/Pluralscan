/**
 * Options to be passed during api client initialization.
 */
export class RestClientOptions {

    constructor(apiUrl: string, enabledCache: boolean = false) {
        this.apiUrl = apiUrl;
        this.enabledCache = enabledCache;
    }

    apiUrl: string;
    enabledCache: boolean
}