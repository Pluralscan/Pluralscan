"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRequest = void 0;
class ApiRequest {
    constructor(method, path, parameters, body) {
        this.method = method;
        this.path = path;
        this.parameters = parameters;
        this.body = body;
    }
    getUrl(basePath) {
        this.url = basePath;
        let path = `${this.url}${this.path}`;
        if (this.parameters)
            path += this.parameters.toString();
        return path;
    }
}
exports.ApiRequest = ApiRequest;
