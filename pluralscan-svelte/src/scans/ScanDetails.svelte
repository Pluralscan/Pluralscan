<script lang="ts">
  import { Grid, Row, Column } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import OverlayLoading from "../common/components/loader/OverlayLoading.svelte";
  import Wave from "../common/components/loader/Wave.svelte";
  import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
  import { scanStore } from "../store/ScanStore";
  import { location } from "svelte-spa-router";
  import ScheduledScanBox from "./components/ScheduledScanBox.svelte";
  import ErrorView from "../common/components/ErrorView/ErrorView.svelte";

  const { currentScan, getScanById, error } = scanStore;

  let loading = false;

  onMount(async () => {
    const scanId = $location.split("/").pop();
    await getScanById(scanId);
  });

  $: console.log($error);
</script>

<DefaultLayout>
  <div slot="content">
    <OverlayLoading duration="400" active={loading}>
      <Wave />
    </OverlayLoading>

    <ErrorView active={$error != undefined} message={$error} />

    {#if $currentScan}
      <Grid fullWidth>
        <Row>
          <h1>Analysis report for {$currentScan.package_id}</h1>
        </Row>
        <Row padding>
          <Column noGutter>
            <ScheduledScanBox
              packageName={$currentScan.package_id}
              analyzerName={$currentScan.analyzer_id}
              scan={$currentScan} />
          </Column>
        </Row>
      </Grid>
    {/if}
  </div>
</DefaultLayout>
