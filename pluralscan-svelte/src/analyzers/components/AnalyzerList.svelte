<script lang="ts">
    import {
        DataTable,
        Pagination,
        OverflowMenu,
        OverflowMenuItem,
        Tile,
    } from "carbon-components-svelte";

    export let analyzers = [];
    export let pageNumber = 1;
    export let pageSize = 15;
    export let totalItems = 0;
    export let onPageChange = (event) => {};

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
            key: "technologies",
            value: "Supported Technology",
        },
        { key: "overflow", empty: true },
    ];
</script>

<DataTable
    title="Analyzers"
    description="Pluralscan supported analyzers."
    size="medium"
    sortable
    expandable
    rows={analyzers}
    {headers}
>
    <svelte:fragment slot="cell" let:cell>
        {#if cell.key === "overflow"}
            <OverflowMenu flipped>
                <OverflowMenuItem text="Show Details" />
            </OverflowMenu>
        {:else if cell.key === "technologies"}
            {cell.value.map((tech) => tech.display_name).join(" / ")}
            <!-- {console.log(JSON.stringify(cell))} -->
        {:else}
            {cell.value}
        {/if}
    </svelte:fragment>

    <svelte:fragment slot="expanded-row" let:row>
        {#each row.executables as executable}
            <Tile>
                <h4>
                    {executable.name}
                    {executable.version}
                </h4>
                <p><strong>Platform:</strong> {executable.platform}</p>
                <p>
                    <strong>Commands:</strong>
                    {executable.commands
                        .map((command) => command.action)
                        .join(", ")}
                </p>
            </Tile>
            <hr />
        {/each}
    </svelte:fragment>
</DataTable>

<Pagination
    {pageSize}
    page={pageNumber}
    {totalItems}
    on:update={onPageChange}
    pageSizeInputDisabled
/>

<style lang="scss">
    :global(tr.bx--parent-row.bx--expandable-row + tr[data-child-row] td) {
        padding-left: 1rem;
    }
</style>
