<script lang="ts">
  import {
    Button,
    Column,
    Grid,
    Row,
  } from "carbon-components-svelte";

  import { onMount } from "svelte";
  import { location, push } from "svelte-spa-router";
  import { RestClient } from "../../libs/pluralscan-api/RestClient";
  import { RestClientOptions } from "../../libs/pluralscan-api/RestClientOptions";
  import OverlayLoading from "../common/components/loader/OverlayLoading.svelte";
  import Wave from "../common/components/loader/Wave.svelte";
  import DefaultLayout from "../common/layouts/DefaultLayout.svelte";
  import ScanCard from "./components/ScheduledScanBox.svelte";
  import { scanStore } from "../store/ScanStore";
  import AnalyzerSelectionBox from "./components/AnalyzerSelectionBox.svelte";
  import PackageInfoBox from "./components/PackageInfoBox.svelte";
  import type { Package } from "../../libs/pluralscan-api/models/Package";

  const { scheduleScan, loading, scheduledScans } = scanStore;
  const API_OPTIONS = new RestClientOptions(process.env.API_URI);
  const restClient = new RestClient(API_OPTIONS);

  let state = {
    analyzers: [],
    scans: [],
  };
  let packageToScan: Package = null;
  let loadingMessage = "";
  let selectedRowIds = [];

  function parseSelectedExecutables() {
    let selectedAnalyzers = new Map<string, string[]>();
    selectedRowIds.map((raw) => {
      let analyzer = raw.split(";;");
      if (selectedAnalyzers.has(analyzer[0])) {
        selectedAnalyzers.get(analyzer[0]).push(analyzer[1]);
      } else {
        selectedAnalyzers.set(analyzer[0], [analyzer[1]]);
      }
    });
    return selectedAnalyzers;
  }

  onMount(async () => {
    try {
      $loading = true;
      const package_id = $location.split("/").pop();
      packageToScan = await restClient.package.get(package_id);
      console.log(packageToScan)
      state.analyzers = await restClient.analyzer.findByTechnologies(
        packageToScan.technologies
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      $loading = false;
    }
  });
</script>

<DefaultLayout>
  <div slot="content">
    <OverlayLoading duration="400" message={loadingMessage} active={$loading}>
      <Wave />
    </OverlayLoading>

    <Grid>
      {#if packageToScan !== null}
        <Row>
          <h1>Schedule a scan for {packageToScan.name}</h1>
        </Row>

        <Row>
          <Column noGutter padding>
            <Row>
              <Column>
                <PackageInfoBox packageToScan={packageToScan} />
              </Column>

              <Column>
                {#if $scheduledScans.length > 0}
                  {#each $scheduledScans as scan}
                    <ScanCard analyzerName={scan.analyzer_id} {scan} />
                  {/each}
                {:else}
                  <AnalyzerSelectionBox
                    analyzers={state.analyzers}
                    bind:selectedRowIds={selectedRowIds} />
                  <Button
                    disabled={selectedRowIds.length === 0 ? true : false}
                    on:click={async () =>
                      await scheduleScan(
                        packageToScan.id,
                        parseSelectedExecutables()
                      )}>Scan</Button>
                {/if}
              </Column>
            </Row>
          </Column>
        </Row>
      {/if}
    </Grid>
  </div>
</DefaultLayout>