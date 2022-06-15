/**
 * Options to be passed during api client initialization.
 */
export class RestClientOptions {

    constructor(apiUrl: string){
        this.apiUrl = apiUrl;
    }

    apiUrl: string;
}