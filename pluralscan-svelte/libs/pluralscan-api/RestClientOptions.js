"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestClientOptions = void 0;
/**
 * Options to be passed during api client initialization.
 */
class RestClientOptions {
    constructor(apiUrl, enabledCache = false) {
        this.apiUrl = apiUrl;
        this.enabledCache = enabledCache;
    }
}
exports.RestClientOptions = RestClientOptions;
