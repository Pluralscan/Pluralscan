<script lang="ts">
    import { Grid, Row, Column } from "carbon-components-svelte";
    import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
    import ScanList from "./components/ScanList.svelte";
</script>

<DefaultLayout>
    <div slot="content">
        <Grid fullWidth>
            <Row>
                <h1>Scans</h1>
            </Row>
            <Row padding>
                <Column noGutter>
                    <ScanList />
                </Column>
            </Row>
        </Grid>
    </div>
</DefaultLayout>
