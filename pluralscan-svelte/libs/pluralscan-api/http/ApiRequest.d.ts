export interface IApiRequest {
    /**
     * Full url for target api endpoint.
     */
    url?: string;
    /**
     * Path of the remote resource. Ex: /analyzers
     */
    path: string;
    /**
     * Request http method.
     */
    method: string;
    /**
     * Request query parameters.
     */
    parameters?: any;
    /**
     * Request body.
     */
    body?: any;
    /**
     *
     * @param basePath target host base url path
     */
    getUrl(basePath: string): string;
}
export declare class ApiRequest implements IApiRequest {
    constructor(method: string, path: string, parameters?: URLSearchParams, body?: any);
    parameters?: URLSearchParams;
    url?: string;
    path: string;
    method: string;
    body?: any;
    getUrl(basePath: string): string;
}
