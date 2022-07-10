<script lang="ts">
    import { Column, Grid, Row } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { RestClient } from "../../libs/dist/RestClient";
    import OverlayLoading from "../common/components/loader/OverlayLoading.svelte";
    import Wave from "../common/components/loader/Wave.svelte";
    import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
    import AnalyzerList from "./components/AnalyzerList.svelte";

    let loading = false;
    let state = {
        analyzers: [],
        pageNumber: 1,
        pageSize: 15,
        totalItems: 0,
    };

    onMount(async () => {
        loading = true;
        const restClient = new RestClient({ apiUrl: process.env.API_URI });
        try {
            const result = await restClient.analyzer.list(
                state.pageNumber,
                state.pageSize
            );
            state = {
                ...result,
            };
        } catch {
        } finally {
            loading = false;
        }
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
                <h1>Analyzers Registry</h1>
            </Row>
            <Row padding>
                <Column noGutter>
                    <AnalyzerList
                        analyzers={state.analyzers}
                        pageNumber={state.pageNumber}
                        pageSize={state.pageSize}
                        totalItems={state.totalItems}
                    />
                </Column>
            </Row>
        </Grid>
    </div>
</DefaultLayout>
