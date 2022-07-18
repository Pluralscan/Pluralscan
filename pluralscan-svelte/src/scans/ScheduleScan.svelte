<script lang="ts">
    import {
        Accordion,
        AccordionItem,
        Button,
        Column,
        Grid,
        Row,
        Tile,
    } from "carbon-components-svelte";

    import { onMount } from "svelte";
    import { location } from "svelte-spa-router";
    import { RestClient } from "../../libs/pluralscan-api/RestClient";
    import { RestClientOptions } from "../../libs/pluralscan-api/RestClientOptions";
    import OverlayLoading from "../common/components/loader/OverlayLoading.svelte";
    import Wave from "../common/components/loader/Wave.svelte";
    import DefaultLayout from "../common/layouts/DefaultLayout.svelte";

    const API_OPTIONS = new RestClientOptions(process.env.API_URI);

    let state = {
        analyzers: [],
        project: null,
        package: null,
    };
    let loadingMessage = "";
    let loading = true;

    async function getPackage(package_id) {
        const restClient = new RestClient(API_OPTIONS);
        const response = await restClient.package.get(package_id);
        return response;
    }

    async function getAnalyzers(technologies) {
        const restClient = new RestClient(API_OPTIONS);
        const response = await restClient.analyzer.findByTechnologies(
            technologies
        );
        return response;
    }

    onMount(async () => {
        try {
            loading = true;
            const package_id = $location.split("/").pop();
            state.package = await getPackage(package_id);
            console.log(state.package);
            state.analyzers = await getAnalyzers(state.package.technologies);
            console.log(state.analyzers);
        } catch {
        } finally {
            loading = false;
        }
    });
</script>

<DefaultLayout>
    <div slot="content">
        {#if loading}
            <OverlayLoading duration="400" message={loadingMessage}>
                <Wave />
            </OverlayLoading>
        {:else}
            <Grid>
                <Row>
                    <h1>Schedule a scan for {state.package["name"]}</h1>
                </Row>

                {#if state.project}
                    <Row>
                        <Column noGutter padding>
                            <h5>Homepage:</h5>
                            <Row>
                                <Column>
                                    <Tile><h6>Project Informations</h6></Tile>
                                    <Tile><h6>Package Informations</h6></Tile>
                                </Column>

                                <Column>
                                    <Tile>
                                        <h6>Scan Package</h6>
                                        <Accordion align="start">
                                            {#each state.analyzers as analyzer}
                                                <AccordionItem
                                                    title={analyzer.name}
                                                >
                                                    <p />
                                                </AccordionItem>
                                            {/each}
                                        </Accordion>
                                    </Tile>
                                    <Button class="load-repo-button">Scan</Button>
                                </Column>
                            </Row>
                        </Column>
                    </Row>
                {/if}
            </Grid>
        {/if}
    </div>
</DefaultLayout>

<style lang="scss">
    h5 {
        margin-bottom: var(--cds-spacing-05);
    }

    :global(.load-repo-button) {
        margin-top: var(--cds-spacing-05) !important;
    }
</style>
