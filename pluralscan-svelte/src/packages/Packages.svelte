<script lang="ts">
    import { Column,Grid,Row } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { RestClient } from "../../libs/pluralscan-api/RestClient";
    import { RestClientOptions } from "../../libs/pluralscan-api/RestClientOptions";
    import OverlayLoading from "../common/components/loader/OverlayLoading.svelte";
    import Wave from "../common/components/loader/Wave.svelte";
    import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
    import { packageStore } from "../store/PackageStore";
    import PackageList from "./components/PackageList.svelte";

    const apiOptions = new RestClientOptions(process.env.API_URI);
    const apiClient = new RestClient(apiOptions);
    const { packages, currentPage, pagination } = packageStore;

    let loading = false;

    onMount(async () => {
        if ($currentPage.itemCount == 0){
            await fetchPackages($currentPage.pageIndex, $currentPage.pageSize);
        }
    });

    async function fetchPackages(pageIndex, pageSize) {
        loading = true;

        const response = await apiClient.package.list(pageIndex, pageSize);
        // Sync backend pagination index with front
        response.searchMetadata.pageIndex += 1;
        packages.set(response.packages);
        pagination.set(response.searchMetadata);

        loading = false;
    }

    function onPageChange(event) {
        const paginationInfo = event.detail;
        if (paginationInfo && paginationInfo.pageSize && paginationInfo.page) {
            fetchPackages(paginationInfo.page - 1, paginationInfo.pageSize);
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
                    <h1>Packages</h1>
                </Row>
                <Row padding>
                    <Column noGutter>
                        <PackageList
                            pageNumber={$currentPage.pageIndex}
                            pageSize={$currentPage.pageSize}
                            packages={$packages}
                            totalItems={$currentPage.itemCount}
                            {onPageChange}
                        />
                    </Column>
                </Row>
            </Grid>
        {/if}
    </div>
</DefaultLayout>
