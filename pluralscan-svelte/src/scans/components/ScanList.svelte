<script lang="ts">
    import {
        DataTable,
        OverflowMenu,
        OverflowMenuItem,
        Pagination,
    } from "carbon-components-svelte";
import { push } from "svelte-spa-router";

    export let scans = [];
    export let pageNumber = 1;
    export let pageSize = 10;
    export let totalItems = 0;
    export let onPageChange = (event) => {};

    const headers = [
        {
            key: "created_at",
            value: "Creation date",
        },
        {
            key: "package_id",
            value: "Package",
        },
        {
            key: "analyzer_id",
            value: "Analyzer",
        },
        {
            key: "executable_version",
            value: "Version",
        },
        {
            key: "state",
            value: "State",
        },
        { key: "overflow", empty: true },
    ];
</script>

<DataTable
    title="Scans"
    description="Pluralscan scans registry."
    size="medium"
    sortable
    expandable
    rows={scans}
    {headers}
>
    <svelte:fragment slot="expanded-row" let:row>
        <h5>Details</h5>
    </svelte:fragment>
    <svelte:fragment slot="cell" let:cell let:row>
        {#if cell.key === "overflow"}
            <OverflowMenu flipped>
                <OverflowMenuItem text="Show Details" on:click={() => push('/scans/' + row.id)} />
            </OverflowMenu>
        {:else}{cell.value}{/if}
    </svelte:fragment>
</DataTable>

<Pagination
    pageSize={pageSize}
    page={pageNumber}
    totalItems={totalItems}
    on:update={onPageChange}
    pageSizeInputDisabled
/>
