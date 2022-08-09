import { derived, Writable, writable } from "svelte/store";
import type { Scan } from "../../libs/pluralscan-api/models/Scan";
import { RestClient } from "../../libs/pluralscan-api/RestClient";
import { RestClientOptions } from "../../libs/pluralscan-api/RestClientOptions";
import type { ScanList } from "../../libs/pluralscan-api/types";
import type { Pagination } from "../types";

class ScanStore {

    private apiOptions = new RestClientOptions(process.env.API_URI);
    private restClient = new RestClient(this.apiOptions);

    constructor(
        public loading: Writable<boolean> = writable(false),
        public error: Writable<string> = writable(),
        public currentScan: Writable<Scan> = writable(),
        public queuedScans: Writable<Map<string, Scan>> = writable(new Map<string, Scan>()),
        public scans: Writable<ScanList> = writable([]),
        public pagination: Writable<Pagination> = writable()
    ) {
        
    }

    get currentPage() {
        return derived(this.pagination, ($pagination) => {
            if ($pagination) {
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

    get scheduledScans() {
        return derived(this.queuedScans, ($scanMap) => {
            return [...$scanMap.values()]
        });
    }

    scheduleScan = async (packageId: string, analyzers: Map<string, string[]>) => {
        try {
            this.setLoading(true);
            const response = await this.restClient.scan.schedule(packageId, analyzers);
            if (response.scans != undefined && response.scans.length > 0) {
                response.scans.forEach(scan => {
                    this.addScheduledScan(scan);
                });
            }
        } catch (err) {
            console.log(err);
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(value: boolean) {
        this.loading.set(value);
    }

    addScheduledScan(scan: Scan) {
        this.queuedScans.update(items => {
            if (items.has(scan.id))
                return items;
            return items.set(scan.id, scan);
        });
    }

    updateScheduledScan(scan: Scan) {
        this.queuedScans.update(items => {
            if (items.has(scan.id))
                items.set(scan.id, scan)
            return items;
        });
    }

    getScanById = async(id: string) => {
        try {
            this.setLoading(true);
            const response = await this.restClient.scan.get(id);
            if (response != undefined) {
                this.currentScan.set(response)
            } else {
                this.error.set('Scan not found')
            }
        } catch (err: unknown) {
            this.error.set("Err:" + err)
        } finally {
            this.setLoading(false);
        }
    }


}

// Export store as singleton
export const scanStore = new ScanStore();