<script lang="ts">
    import { DataTable } from "carbon-components-svelte";

    export let packages;

    const headers = [
        {
            key: "name",
            value: "Name",
        },
    ];
</script>

<DataTable
    title="Packages"
    description="Pluralscan package registry."
    size="medium"
    rows={packages}
    {headers}
/>
