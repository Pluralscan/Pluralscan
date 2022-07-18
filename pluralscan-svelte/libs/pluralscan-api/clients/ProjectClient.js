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
exports.ProjectClient = void 0;
const ApiRequest_1 = require("../http/ApiRequest");
const FIND_ALL_ROUTE = "api/projects?";
const FIND_PROJECT_ROUTE = "api/projects/";
const CREATE_PROJECT_ROUTE = "api/projects";
class ProjectClient {
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
    findProject(name, source) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new ApiRequest_1.ApiRequest("GET", FIND_PROJECT_ROUTE + `${source}/${name}`);
            const response = yield this.client.sendRequest(request);
            if (response.success)
                return response.data;
            throw `Error: ${response.error}`;
        });
    }
    createProject(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new ApiRequest_1.ApiRequest("POST", CREATE_PROJECT_ROUTE);
            request.body = { uri: uri };
            const response = yield this.client.sendRequest(request);
            if (response.success)
                return response.data;
            throw `Error: ${response.error}`;
        });
    }
}
exports.ProjectClient = ProjectClient;
