import { IApiError } from "./ApiError";
import { IApiRequest } from "./ApiRequest";

export interface IApiResponse<T> {
    request?: IApiRequest;
    
    statusCode?: number

    data?: T;

    error?: IApiError

    success: boolean;
}

export class ApiResponse<T> implements IApiResponse<T> {
    request?: IApiRequest;
    statusCode?: number;
    data?: T;
    error?: IApiError;
    success: boolean = !this.error;

}