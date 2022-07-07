<script lang="ts">
    import {
        DataTable,
        Pagination,
        OverflowMenu,
        OverflowMenuItem,
    } from "carbon-components-svelte";

    export let projects = [];
    export let pageNumber = 1;
    export let pageSize = 50;

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
    sortable
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
