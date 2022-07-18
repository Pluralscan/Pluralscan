import { derived, Writable, writable } from "svelte/store";
import type { ScanList } from "../../libs/pluralscan-api/types";
import type { Pagination } from "../types";

class ScanStore {
    constructor(
        public scans: Writable<ScanList> = writable([]),
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

// Export store as singleton
export const scanStore = new ScanStore();