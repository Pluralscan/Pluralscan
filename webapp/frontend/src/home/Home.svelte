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
    import DefaultLayout from "../common/layouts/DefaultLayout.svelte";

    let analyzers = [];
    let repositoryInfo = {};

    onMount(async () => {
        const restClient = new RestClient({ apiUrl: "http://localhost:8000/" });
        analyzers = restClient.analyzer.getAnalyzers();
    });
</script>

<DefaultLayout>
    <div slot="content">
        <Grid>
            <Row>
                <h1>Home</h1>
            </Row>
            
            <Row>
                <Column noGutter padding>
                    <Tile class="repo-input-tile">
                        <h5>Analyze a remote source registry</h5>
                        <Row>
                            <Column>
                                <TextInput
                                    light
                                    labelText="Remote Repository URL"
                                    helperText="Exemple: https://github.com/gromatluidgi/Cast.RestClient"
                                    placeholder="Enter repository url...."
                                />
                            </Column>
                        </Row>
                        <Button class="load-repo-button">Load</Button>
                    </Tile>
                </Column>
            </Row>

            <Row>
                <h5>Package Infomations</h5>
                
            </Row>
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
