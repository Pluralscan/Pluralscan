export interface IAuthenticationProvider {
    getAuthorizationHeader(): string;
}
export declare class BearerAuthenticationProvider implements IAuthenticationProvider {
    constructor(token: string);
    token: string;
    getAuthorizationHeader(): string;
}
