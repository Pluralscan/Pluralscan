<script lang="ts">
    import { Grid, Row, Column, Breadcrumb, BreadcrumbItem } from "carbon-components-svelte";
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
        <Grid fullWidth>
            <Row>
                <Breadcrumb>
                    <BreadcrumbItem href="/">Breadcrumb 1</BreadcrumbItem>
                    <BreadcrumbItem href="/">Breadcrumb 2</BreadcrumbItem>
                    <BreadcrumbItem href="/">Breadcrumb 3</BreadcrumbItem>
                  </Breadcrumb>                 
            </Row>
            <Row>
                <h1>Analyzers</h1>
            </Row>
            <Row>

            </Row>
        </Grid>
    </div>
</DefaultLayout>
