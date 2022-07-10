<script lang="ts">
    import {
        Grid,
        Row,
        Column,
        Button,
        Tile,
        TextInput,
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
    let loadingMessage =
        "Verify if project is already registred in Pluralscan repository...";
    let title = "Pluralscan";
    let isLoading = false;
    let project = {};
    let packages = [];
    let analyzers = [];

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
                project = response.project;
                packages.push(response.package);
                await delay(1000);

                loadingMessage = "Retrieve analyzers...";
                await delay(1000);

                isLoading = false;
                return;
            }
            project = response;
        } catch (error) {
            reportError({ message: getErrorMessage(error) });
        }
        isLoading = false;
    }

    onMount(async () => {});
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

            {#if project}
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

            {#if !project}
                <Row>
                    <Column noGutter padding>
                        <h5>Location: {project.uri}</h5>
                        <Row>
                            <Column>
                                <Tile><h6>Project Informations</h6></Tile>
                                <Tile><h6>Package Informations</h6></Tile>
                            </Column>

                            <Column>
                                <Tile>
                                    <h6>Scan Package</h6>
                                    {#each analyzers as analyzer}{/each}
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
