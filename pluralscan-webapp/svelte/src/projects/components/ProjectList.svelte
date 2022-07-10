<script lang="ts">
    import {
        DataTable,
        Pagination,
        OverflowMenu,
        OverflowMenuItem,
    } from "carbon-components-svelte";

    export let projects = [];
    export let pageNumber = 1;
    export let pageSize = 15;
    export let totalItems = 0;

    const headers = [
        {
            key: "id",
            value: "Id",
        },
        {
            key: "name",
            value: "Name",
        },
        {
            key: "uri",
            value: "Homepage",
        },
        { key: "overflow", empty: true },
    ];
</script>

<DataTable
    title="Projects"
    description="Pluralscan source projects registry."
    size="medium"
    pageSize={pageSize}
    page={pageNumber}
    sortable
    expandable
    rows={projects}
    {headers}
>
    <svelte:fragment slot="cell" let:cell>
        {#if cell.key === "overflow"}
            <OverflowMenu flipped>
                <OverflowMenuItem text="Show Details" />
            </OverflowMenu>
        {:else}{cell.value}{/if} 
    </svelte:fragment>
</DataTable>
<Pagination
  bind:pageSize={pageSize}
  bind:page={pageNumber}
  totalItems={totalItems}
  pageSizeInputDisabled
/>