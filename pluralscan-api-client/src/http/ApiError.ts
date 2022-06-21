export interface IApiError {
    status?: number;

    message: string;
}

export class ApiError implements IApiError {

    constructor(message: string, status?: number) {
        this.message = message;
        this.status = status;
    }

    message: string;
    status?: number;
}