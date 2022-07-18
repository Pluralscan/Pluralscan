"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractProjectSource = exports.GITLAB_URI_REGEX = exports.GITHUB_URI_REGEX = void 0;
const ProjectSource_1 = require("../models/ProjectSource");
exports.GITHUB_URI_REGEX = RegExp("(http(s)?)(:(//)?)(github.com/)([-_a-zA-Z0-9.]*)(/)([-_a-zA-Z0-9.]*)(/)?");
exports.GITLAB_URI_REGEX = RegExp("(http(s)?)(:(//)?)(gitlab.com/)([a-zA-Z0-9.]*)(/)([a-zA-Z0-9.]*)(/)?");
function extractProjectSource(uri) {
    const match_github = exports.GITHUB_URI_REGEX.exec(uri);
    if (match_github) {
        return {
            name: `${match_github[6]}/${match_github[8]}`,
            source: ProjectSource_1.ProjectSource.GITHUB
        };
    }
    const match_gitlab = exports.GITLAB_URI_REGEX.exec(uri);
    if (match_gitlab) {
        return {
            name: `${match_gitlab[6]}/${match_gitlab[8]}`,
            source: ProjectSource_1.ProjectSource.GITLAB
        };
    }
    throw new Error("Not supported project source.");
}
exports.extractProjectSource = extractProjectSource;
