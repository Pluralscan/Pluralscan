<script lang="ts">
    import { Column, Grid, Row } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { RestClient } from "../../libs/pluralscan-api/RestClient";
    import { RestClientOptions } from "../../libs/pluralscan-api/RestClientOptions";

    import OverlayLoading from "../common/components/loader/OverlayLoading.svelte";
    import Wave from "../common/components/loader/Wave.svelte";
    import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
    import ProjectList from "./components/ProjectList.svelte";
    import { projectStore } from "../store/ProjectStore";

    const apiOptions = new RestClientOptions(process.env.API_URI);
    const apiClient = new RestClient(apiOptions);
    const { projects, currentPage, pagination } = projectStore;

    let loading = false;

    onMount(async () => {
        if ($currentPage.itemCount == 0){
            await fetchProjects($currentPage.pageIndex, $currentPage.pageSize);
        }
    });

    async function fetchProjects(pageIndex, pageSize) {
        loading = true;
        
        const response = await apiClient.project.list(pageIndex, pageSize);
        // Sync backend pagination index with front
        response.searchMetadata.pageIndex += 1;
        projects.set(response.projects)
        pagination.set(response.searchMetadata);

        loading = false;
    }

    function onPageChange(event) {
        const paginationInfo = event.detail;
        console.log(paginationInfo)
        if (paginationInfo && paginationInfo.pageSize && paginationInfo.page) {
            fetchProjects(paginationInfo.page-1, paginationInfo.pageSize);
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
                    <h1>Projects Registry</h1>
                </Row>
                <Row padding>
                    <Column noGutter>
                        <ProjectList
                            pageNumber={$currentPage.pageIndex}
                            pageSize={$currentPage.pageSize}
                            projects={$projects}
                            totalItems={$currentPage.itemCount}
                            {onPageChange}
                        />
                    </Column>
                </Row>
            </Grid>
        {/if}
    </div>
</DefaultLayout>
