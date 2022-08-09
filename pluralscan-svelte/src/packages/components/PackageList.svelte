<script lang="ts">
    import {
        DataTable,
        OverflowMenu,
        OverflowMenuItem,
        Pagination,
    } from "carbon-components-svelte";
    import {push} from 'svelte-spa-router'

    export let packages = [];
    export let pageNumber = 1;
    export let pageSize = 15;
    export let totalItems = 0;
    export let onPageChange = (event) => {};

    const headers = [
        {
            key: "name",
            value: "Name",
        },
        {
            key: "version",
            value: "Version",
        },
        {
            key: "system",
            value: "System",
        },
        {
            key: "author",
            value: "Author",
        },
        {
            key: "published_at",
            value: "Published at",
        },
        { key: "overflow", empty: true },
    ];
</script>

<DataTable
    title="Packages"
    description="Pluralscan package registry."
    size="medium"
    sortable
    expandable
    rows={packages}
    {headers}
>
    <svelte:fragment slot="expanded-row" let:row>
        <h4>Description</h4>
        <p>{row.description}</p>
    </svelte:fragment>

    <svelte:fragment slot="cell" let:cell let:row>
        {#if cell.key === "overflow"}
            <OverflowMenu flipped>
                <OverflowMenuItem text="Show Details" />
                <OverflowMenuItem text="Schedule Scan" on:click={() => push('/scans/schedule/packages/' + row.id)} />
            </OverflowMenu>
        {:else}{cell.value}{/if}
    </svelte:fragment>
</DataTable>

<Pagination
    {pageSize}
    page={pageNumber}
    {totalItems}
    on:update={onPageChange}
    pageSizeInputDisabled
/>
