"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const ApiError_1 = require("./ApiError");
const ApiResponse_1 = require("./ApiResponse");
class ApiClient {
    constructor(basePath) {
        this.basePath = basePath;
    }
    sendRequest(apiRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new ApiResponse_1.ApiResponse();
            response.request = apiRequest;
            try {
                console.log(apiRequest.getUrl(this.basePath));
                const result = yield (0, cross_fetch_1.default)(apiRequest.getUrl(this.basePath), {
                    method: apiRequest.method,
                    body: apiRequest.body ? JSON.stringify(apiRequest.body) : null,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!result.ok) {
                    throw new Error(result.statusText);
                }
                const jsonBody = yield result.json();
                response.data = jsonBody;
                return response;
            }
            catch (err) {
                response.error = new ApiError_1.ApiError(err.message);
                return response;
            }
        });
    }
}
exports.ApiClient = ApiClient;
