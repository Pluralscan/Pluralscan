<script lang="ts">
    import { Grid, Row, Column } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { RestClient } from "../../libs/dist/RestClient";
    import OverlayLoading from "../common/components/loader/OverlayLoading.svelte";
    import Wave from "../common/components/loader/Wave.svelte";
    import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
import PackageList from "./components/PackageList.svelte";

    let loading = false;
    let packages = [];

    async function getPackages() {
        const restClient = new RestClient({ apiUrl: "http://localhost:8000/" });
    }

    onMount(async () => {
        const restClient = new RestClient({ apiUrl: "http://localhost:8000/" });
        packages = await restClient.package.findAll();
    });
</script>

<DefaultLayout>
    <div slot="content">
        {#if loading}
            <OverlayLoading duration="400">
                <Wave />
            </OverlayLoading>
        {/if}
        <Grid fullWidth>
            <Row>
                <h1>Packages</h1>
            </Row>
            <Row padding>
                <Column noGutter>
                    <PackageList {packages} />
                </Column>
            </Row>
        </Grid>
    </div>
</DefaultLayout>
