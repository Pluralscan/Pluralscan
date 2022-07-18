"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearerAuthenticationProvider = void 0;
class BearerAuthenticationProvider {
    constructor(token) {
        this.token = token;
    }
    getAuthorizationHeader() {
        throw new Error("Method not implemented.");
    }
}
exports.BearerAuthenticationProvider = BearerAuthenticationProvider;
