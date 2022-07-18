<script lang="ts">
    import { Column, Grid, Row } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { RestClient } from "../../libs/pluralscan-api/RestClient";
    import { RestClientOptions } from "../../libs/pluralscan-api/RestClientOptions";
    import OverlayLoading from "../common/components/loader/OverlayLoading.svelte";
    import Wave from "../common/components/loader/Wave.svelte";
    import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
    import { analyzerStore } from "../store/AnalyzerStore";
    import AnalyzerList from "./components/AnalyzerList.svelte";

    const apiOptions = new RestClientOptions(process.env.API_URI);
    const apiClient = new RestClient(apiOptions);
    const { analyzers, currentPage, pagination } = analyzerStore;

    let loading = false;

    onMount(async () => {
        if ($currentPage.itemCount == 0){
            await fetchAnalyzers($currentPage.pageIndex, $currentPage.pageSize);
        }
    });

    async function fetchAnalyzers(pageIndex, pageSize) {
        loading = true;

        const response = await apiClient.analyzer.list(pageIndex, pageSize);
        // Sync backend pagination index with front
        response.searchMetadata.pageIndex += 1;
        analyzers.set(response.analyzers);
        pagination.set(response.searchMetadata);

        loading = false;
    }

    function onPageChange(event) {
        const paginationInfo = event.detail;
        if (paginationInfo && paginationInfo.pageSize && paginationInfo.page) {
            fetchAnalyzers(paginationInfo.page - 1, paginationInfo.pageSize);
        }
    }
</script>

<DefaultLayout>
    <div slot="content">
        {#if loading}
            <OverlayLoading duration="400">
                <Wave />
            </OverlayLoading>
        {:else}
            <Grid fullWidth>
                <Row>
                    <h1>Analyzers Registry</h1>
                </Row>
                <Row padding>
                    <Column noGutter>
                        <AnalyzerList
                            pageNumber={$currentPage.pageIndex}
                            pageSize={$currentPage.pageSize}
                            analyzers={$analyzers}
                            totalItems={$currentPage.itemCount}
                            {onPageChange}
                        />
                    </Column>
                </Row>
            </Grid>
        {/if}
    </div>
</DefaultLayout>
