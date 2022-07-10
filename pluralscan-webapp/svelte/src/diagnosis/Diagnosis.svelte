<script lang="ts">
    import { Grid, Row, Column } from "carbon-components-svelte";
    import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
    import DiagnosisList from "./components/DiagnosisList.svelte";
</script>

<DefaultLayout>
    <div slot="content">
        <Grid fullWidth>
            <Row>
                <h1>Diagnosis</h1>
            </Row>
            <Row padding>
                <Column noGutter>
                    <DiagnosisList />
                </Column>
            </Row>
        </Grid>
    </div>
</DefaultLayout>
