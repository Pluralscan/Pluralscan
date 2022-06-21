export interface IAuthenticationProvider {
    getAuthorizationHeader(): string;
}

export class BearerAuthenticationProvider implements IAuthenticationProvider {
    constructor(token: string){
        this.token = token;
    }

    token: string;

    getAuthorizationHeader(): string {
        throw new Error("Method not implemented.");
    }
}