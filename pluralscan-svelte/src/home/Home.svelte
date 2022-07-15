<script lang="ts">
    import {
        Grid,
        Row,
        Column,
        Button,
        Tile,
        TextInput,
Accordion,
AccordionItem,
    } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { RestClient } from "../../libs/dist/RestClient";
    import { extractProjectSource } from "../../libs/dist/utils/uri";
    import OverlayLoading from "../common/components/loader/OverlayLoading.svelte";
    import Wave from "../common/components/loader/Wave.svelte";
    import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
    import { delay, getErrorMessage } from "../utils";

    const searchData = {
        uri: "",
    };
    let state = {
        analyzers: [],
        project: null,
        package: null
    }
    let loadingMessage =
        "Verify if project is already registred in Pluralscan repository...";
    let title = "Pluralscan";
    let isLoading = false;

    function refreshTitle(value: string) {
        if (!value) {
            title = "Pluralscan";
            return;
        }
        title = value;
    }

    async function search_project() {
        const restClient = new RestClient({ apiUrl: process.env.API_URI });
        loadingMessage =
            "Verify if project is already registred in Pluralscan repository...";
        isLoading = true;

        try {
            const projectNameAndSource = extractProjectSource(searchData.uri);
            let response = await restClient.project.findProject(
                projectNameAndSource.name,
                projectNameAndSource.source
            );

            if (!response) {
                loadingMessage = "No project found, try to create a new one...";
                await delay(1000);
                response = await restClient.project.createProject(
                    searchData.uri
                );
                console.log(response);
                loadingMessage =
                    "Project synchronized with new snapshot package...";
                state.project = response.project;
                state.package = response.package;
                await delay(1000);
            } else {
                state.project = response.project;                
                loadingMessage =
                    "Fetch latest snapshot package...";
                response = await restClient.package.latestSnapshot(state.project['id'])
                state.package = response.package;
                await delay(1000);
            }

            loadingMessage = "Retrieve analyzers...";
            response = await restClient.analyzer.findByTechnologies(state.package['technologies'])
            state.analyzers = response.analyzers;
            await delay(1000);
        } catch (error) {
            reportError({ message: getErrorMessage(error) });
        } finally {
            isLoading = false;
        }
    }

    onMount(async () => {
        const restClient = new RestClient({ apiUrl: process.env.API_URI });
    });
</script>

<DefaultLayout>
    <div slot="content">
        {#if isLoading}
            <OverlayLoading duration="400" message={loadingMessage}>
                <Wave />
            </OverlayLoading>
        {/if}
        <Grid>
            <Row>
                <h1>Pluralscan</h1>
            </Row>

            {#if !state.project}
                <Row>
                    <Column noGutter padding>
                        <Tile class="repo-input-tile">
                            <h5>
                                Search for an open-source projet or package to analize
                            </h5>
                            <Row>
                                <Column>
                                    <TextInput
                                        light
                                        labelText="Source"
                                        helperText="Exemple: https://github.com/gromatluidgi/Cast.RestClient"
                                        placeholder="Enter project or package url...."
                                        bind:value={searchData.uri}
                                    />
                                </Column>
                            </Row>
                            <Button
                                on:click={search_project}
                                class="load-repo-button">Search</Button
                            >
                        </Tile>
                    </Column>
                </Row>
            {/if}

            {#if state.project}
                <Row>
                    <Column noGutter padding>
                        <h5>Homepage: </h5>
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
                                        <AccordionItem title="{analyzer.name}">
                                            <p>
                                              Translate text, documents, and websites from one language to another.
                                              Create industry or region-specific translations via the service's
                                              customization capability.
                                            </p>
                                          </AccordionItem>
                                        {/each}
                                    </Accordion>
                                </Tile>
                                <Button
                                    on:click={search_project}
                                    class="load-repo-button">Scan</Button
                                >
                            </Column>
                        </Row>
                    </Column>
                </Row>
            {/if}
        </Grid>
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
