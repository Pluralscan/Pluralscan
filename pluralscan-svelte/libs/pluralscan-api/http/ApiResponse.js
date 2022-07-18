"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketResponse = exports.ApiResponse = void 0;
/**
 *
 */
class ApiResponse {
    constructor() {
        this.success = !this.error;
    }
}
exports.ApiResponse = ApiResponse;
/**
 *
 */
class SocketResponse {
    constructor() {
        this.success = !this.error;
    }
}
exports.SocketResponse = SocketResponse;
