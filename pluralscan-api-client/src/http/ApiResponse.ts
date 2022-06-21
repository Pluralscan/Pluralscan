import { IApiError } from "./ApiError";
import { IApiRequest } from "./ApiRequest";

/**
 * This interface defines an http response that allows its data to
 * be rendered into an arbitrary media types.
 */
export interface IApiResponse<T> {
    request?: IApiRequest;
    
    statusCode?: number;

    data?: T;

    error?: IApiError

    success: boolean;
}

/**
 * 
 */
export class ApiResponse<T> implements IApiResponse<T> {
    request?: IApiRequest;
    statusCode?: number;
    data?: T;
    error?: IApiError;
    success: boolean = !this.error;
    contentType?: string;
}

/**
 * 
 */
export class SocketResponse<T> implements IApiResponse<T> {
    request?: IApiRequest | undefined;
    statusCode?: number | undefined;
    data?: T | undefined;
    error?: IApiError | undefined;
    success: boolean = !this.error;
}