export interface IApiError {
    status?: number;
    message: string;
}
export declare class ApiError implements IApiError {
    constructor(message: string, status?: number);
    message: string;
    status?: number;
}
