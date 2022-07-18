<script lang="ts">
    import {
        DataTable,
        OverflowMenu,
        OverflowMenuItem,
        Pagination,
    } from "carbon-components-svelte";

    export let projects = [];
    export let pageNumber = 1;
    export let pageSize = 15;
    export let totalItems = 0;
    export let onPageChange = (event) => {};
    //$: onPageChange({ pageSize, pageNumber });

    const headers = [
        {
            key: "name",
            value: "Name",
        },
        {
            key: "source",
            value: "Source",
        },
        {
            key: "namespace",
            value: "Namespace",
        },
        {
            key: "homepage",
            value: "Homepage",
        },
        { key: "overflow", empty: true },
    ];
</script>

<DataTable
    title="Projects"
    description="Pluralscan source projects registry."
    size="medium"
    sortable
    expandable
    rows={projects}
    {headers}
>
    <svelte:fragment slot="expanded-row" let:row>
        <h5>Description</h5>
        <p>{row.description}</p>
    </svelte:fragment>
    <svelte:fragment slot="cell" let:cell>
        {#if cell.key === "overflow"}
            <OverflowMenu flipped>
                <OverflowMenuItem text="Show Details" />
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
