<script lang="ts">
    import { DataTable, OverflowMenu, OverflowMenuItem, Pagination } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { RestClient } from "../../../libs/dist/RestClient";
    import OverlayLoading from "../../common/components/loader/OverlayLoading.svelte";
    import Wave from "../../common/components/loader/Wave.svelte";

    export let packages = [];
    export let pageNumber = 1;
    export let pageSize = 15;
    export let totalItems = 0;

    let loading = false;

    onMount(async () => {
        const restClient = new RestClient({ apiUrl: process.env.API_URI });
        try {
            loading = true;
            const result = await restClient.package.list(pageNumber, pageSize);
            packages = result.packages;
            totalItems = result.totalItems;
            pageNumber = result.pageNumber;
            pageSize = result.pageSize;
        } catch {
        } finally {
            loading = false;
        }
    });

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
            key: "registry",
            value: "Registry",
        },
        {
            key: "published_at",
            value: "Published at",
        },
        { key: "overflow", empty: true },
    ];
</script>

{#if loading}
    <OverlayLoading duration="400">
        <Wave />
    </OverlayLoading>
{/if}

<DataTable
    title="Packages"
    description="Pluralscan package registry."
    size="medium"
    {pageSize}
    page={pageNumber}
    sortable
    expandable
    rows={packages}
    {headers}
>
    <svelte:fragment slot="expanded-row" let:row>
        <h4>Description</h4>
        <p>{row.description}</p>
    </svelte:fragment>

    <svelte:fragment slot="cell" let:cell>
        {#if cell.key === "overflow"}
            <OverflowMenu flipped>
                <OverflowMenuItem text="Show Details" />
                <OverflowMenuItem text="Schedule Scan" />
            </OverflowMenu>
        {:else}{cell.value}{/if} 
    </svelte:fragment>
</DataTable>
<Pagination
    bind:pageSize
    bind:page={pageNumber}
    {totalItems}
    pageSizeInputDisabled
/>

<style lang="scss">
    // :global(tr.bx--parent-row.bx--expandable-row + tr[data-child-row] td) {
    //     padding-left: 1rem;
    // }
</style>
