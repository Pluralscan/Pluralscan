<script lang="ts">
    import { Grid, Row, Column } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { RestClient } from "../../libs/dist/RestClient";
    import DefaultLayout from "../common/layouts/DefaultLayout.svelte";

    let analyzers = [];

    onMount(async () => {
		const restClient = new RestClient({ apiUrl: "http://localhost:8000/"});
		analyzers = restClient.analyzer.getAnalyzers();
	});
   
</script>

<DefaultLayout>
    <div slot="content">
        <Grid>
            <Row>
                <Column>
                    <h1>Dashboard</h1>
                </Column>
            </Row>
        </Grid>
    </div>
</DefaultLayout>
