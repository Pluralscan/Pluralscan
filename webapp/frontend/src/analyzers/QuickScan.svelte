<script lang="ts">
    import {
        Grid,
        Row,
        Column,
        Tile,
        TextInput,
    } from "carbon-components-svelte";
    import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
</script>

<DefaultLayout>
    <div slot="content">
        <Grid fullWidth={true}>
            <Row>
                <Column>
                    <h1>Analyze a remote project</h1>

                    <Tile>
                        <p>Source</p>
                        <TextInput
                            light
                            labelText="Remote Repository URL"
                            helperText="Exemple: https://github.com/gromatluidgi/Cast.RestClient"
                            placeholder="Enter repository url...."
                        />
                    </Tile>

                    <Tile>Content 2</Tile>
                </Column>
            </Row>
        </Grid>
    </div>
</DefaultLayout>

<style lang="scss">
    div > :global(*) {
        color: blue;
    }
</style>
