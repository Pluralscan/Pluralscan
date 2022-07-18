import { IApiRequest } from "./ApiRequest";
import { IApiResponse } from "./ApiResponse";
export interface IApiClient {
    sendRequest<T = IApiResponse<any>>(apiRequest: IApiRequest): Promise<T>;
    sendRequest(apiRequest: IApiRequest): Promise<void>;
}
export declare class ApiClient implements IApiClient {
    constructor(basePath: string);
    sendRequest<T = IApiResponse<any>>(request: IApiRequest): Promise<T>;
    sendRequest(apiRequest: IApiRequest): Promise<void>;
    basePath: string;
}
