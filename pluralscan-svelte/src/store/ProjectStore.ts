import { Writable, writable, derived } from "svelte/store";
import type { ProjectList } from "../../libs/pluralscan-api/types";
import type { Pagination } from "../types";

class ProjectStore {
    constructor(
        public projects: Writable<ProjectList> = writable([]),
        public pagination: Writable<Pagination> = writable()
    ) { }

    get currentPage(){
        return derived(this.pagination, ($pagination) => {
            if ($pagination){
                return $pagination;
            }
            return {
                pageIndex: 0,
                pageSize: 10,
                pageCount: 0,
                itemCount: 0
            }
        });
    }
}

// Export store as a singleton
export const projectStore = new ProjectStore();