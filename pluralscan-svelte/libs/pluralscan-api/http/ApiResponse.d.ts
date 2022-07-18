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
    error?: IApiError;
    success: boolean;
}
/**
 *
 */
export declare class ApiResponse<T> implements IApiResponse<T> {
    request?: IApiRequest;
    statusCode?: number;
    data?: T;
    error?: IApiError;
    success: boolean;
    contentType?: string;
}
/**
 *
 */
export declare class SocketResponse<T> implements IApiResponse<T> {
    request?: IApiRequest | undefined;
    statusCode?: number | undefined;
    data?: T | undefined;
    error?: IApiError | undefined;
    success: boolean;
}
