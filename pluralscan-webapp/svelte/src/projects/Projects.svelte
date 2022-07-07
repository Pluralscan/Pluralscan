<script lang="ts">
    import { Grid, Row, Column } from "carbon-components-svelte";
import { onMount } from "svelte";
import { RestClient } from "../../libs/dist/RestClient";
    import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
    import ProjectList from "./components/ProjectList.svelte";

    let loading = false;
    let projects = [];

    onMount(async () => {
        loading = true
        const restClient = new RestClient({ apiUrl: "http://localhost:8000/" });
        try {
            projects = await restClient.project.findAll()
        } catch {

        } finally {
            loading = false
        }
    });
</script>

<DefaultLayout>
    <div slot="content">
        <Grid fullWidth>
            <Row>
                <h1>Projects Registry</h1>
            </Row>
            <Row padding>
                <Column noGutter>
                    <ProjectList {projects} />
                </Column>
            </Row>
        </Grid>
    </div>
</DefaultLayout>
