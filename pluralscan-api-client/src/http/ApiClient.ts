import fetch from 'cross-fetch';
import { Analyzer } from '../models/Analyzer';
import { ApiError } from './ApiError';
import { IApiRequest } from "./ApiRequest";
import { ApiResponse, IApiResponse } from "./ApiResponse";

export interface IApiClient {
    sendRequest<T = IApiResponse<any>>(apiRequest: IApiRequest): Promise<T>;
    sendRequest(apiRequest: IApiRequest): Promise<void>;
}

export class ApiClient implements IApiClient {

    constructor(basePath: string) {
        this.basePath = basePath;
    }
    sendRequest<T = IApiResponse<any>>(request: IApiRequest): Promise<T>;
    sendRequest(apiRequest: IApiRequest): Promise<void>;
    async sendRequest<T = IApiResponse<any>>(apiRequest: IApiRequest): Promise<T | void | any> {
        const response = new ApiResponse<any>();
        response.request = apiRequest;
        
        try {
            console.log(apiRequest.getUrl(this.basePath))
            const result = await fetch(apiRequest.getUrl(this.basePath), {
                method: apiRequest.method,
                body: apiRequest.body ? JSON.stringify(apiRequest.body) : null,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!result.ok){
                throw new Error(result.statusText)
            }

            const jsonBody: any = await result.json();
            response.data = jsonBody;
            return response;
        } catch (err: unknown) {
            response.error = new ApiError((err as Error).message);
            return response;
        }
    }

    basePath: string;
}