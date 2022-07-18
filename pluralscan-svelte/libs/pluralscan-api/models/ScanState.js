"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanState = void 0;
var ScanState;
(function (ScanState) {
    ScanState[ScanState["SCHEDULED"] = 0] = "SCHEDULED";
    ScanState[ScanState["RUNNING"] = 1] = "RUNNING";
    ScanState[ScanState["COMPLETED"] = 2] = "COMPLETED";
    ScanState[ScanState["CANCELLED"] = 3] = "CANCELLED";
    ScanState[ScanState["ERROR"] = 4] = "ERROR";
})(ScanState = exports.ScanState || (exports.ScanState = {}));
