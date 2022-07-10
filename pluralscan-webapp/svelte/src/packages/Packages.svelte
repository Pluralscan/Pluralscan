<script lang="ts">
    import { Grid, Row, Column } from "carbon-components-svelte";
    import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
    import PackageList from "./components/PackageList.svelte";
</script>

<DefaultLayout>
    <div slot="content">
        <Grid fullWidth>
            <Row>
                <h1>Packages</h1>
            </Row>
            <Row padding>
                <Column noGutter>
                    <PackageList />
                </Column>
            </Row>
        </Grid>
    </div>
</DefaultLayout>
