import { ProjectSource } from "../models/ProjectSource"
import { ProjectNameWithSource } from "../types"

export const GITHUB_URI_REGEX: RegExp = RegExp("(http(s)?)(:(//)?)(github.com/)([-_a-zA-Z0-9.]*)(/)([-_a-zA-Z0-9.]*)(/)?")
export const GITLAB_URI_REGEX: RegExp = RegExp("(http(s)?)(:(//)?)(gitlab.com/)([a-zA-Z0-9.]*)(/)([a-zA-Z0-9.]*)(/)?")


export function extractProjectSource(uri: string): ProjectNameWithSource {
    const match_github = GITHUB_URI_REGEX.exec(uri)
    if (match_github){
        return {
            name: `${match_github[6]}/${match_github[8]}`,
            source: ProjectSource.GITHUB
        }
    }

    const match_gitlab = GITLAB_URI_REGEX.exec(uri)
    if (match_gitlab){
        return {
            name: `${match_gitlab[6]}/${match_gitlab[8]}`,
            source: ProjectSource.GITLAB
        }       
    }

    throw new Error("Not supported project source.")
}