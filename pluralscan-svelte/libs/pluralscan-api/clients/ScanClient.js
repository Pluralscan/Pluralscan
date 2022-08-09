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
exports.ScanClient = void 0;
const ApiRequest_1 = require("../http/ApiRequest");
const FIND_ALL_ROUTE = "api/scans?";
const SCHEDULE_SCAN_ROUTE = "api/scans/schedule/package/";
const GET_BY_ID_ROUTE = "api/scans/";
class ScanClient {
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
    get(scan_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new ApiRequest_1.ApiRequest("GET", GET_BY_ID_ROUTE + `${scan_id}`);
            const response = yield this.client.sendRequest(request);
            if (response.success)
                return response.data;
            throw `Error: ${response.error}`;
        });
    }
    schedule(packageId, analyzers) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new ApiRequest_1.ApiRequest("POST", SCHEDULE_SCAN_ROUTE + packageId);
            request.body = { analyzers: Object.fromEntries(analyzers) };
            const response = yield this.client.sendRequest(request);
            if (response.success)
                return response.data;
            throw `Error: ${response.error}`;
        });
    }
}
exports.ScanClient = ScanClient;
