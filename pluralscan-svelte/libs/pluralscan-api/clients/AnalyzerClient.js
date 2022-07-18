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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerClient = void 0;
const ApiRequest_1 = require("../http/ApiRequest");
const FIND_ALL_ROUTE = "api/analyzers?";
const FIND_BY_TECHNOLOGIES_ROUTE = "api/analyzers/technologies?";
class AnalyzerClient {
    constructor(client) {
        this.client = client;
    }
    list(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new ApiRequest_1.ApiRequest("GET", FIND_ALL_ROUTE, new URLSearchParams({ "page": page.toString(), "limit": limit.toString() }));
            const response = yield this.client.sendRequest(request);
            if (response.success)
                return response.data;
            throw `Error: ${response.error}`;
        });
    }
    findByTechnologies(technologies) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!technologies || !technologies.length) {
                throw 'At least one technology code must be defined.';
            }
            const request = new ApiRequest_1.ApiRequest("GET", FIND_BY_TECHNOLOGIES_ROUTE, new URLSearchParams(technologies.map(t => ['code', t.code])));
            const response = yield this.client.sendRequest(request);
            if (response.success)
                return response.data;
            throw `Error: ${response.error}`;
        });
    }
}
exports.AnalyzerClient = AnalyzerClient;
