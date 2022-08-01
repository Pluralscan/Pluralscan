<script lang="ts">
  import { Button, InlineLoading, Tile } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  import type { Scan } from "../../../libs/pluralscan-api/models/Scan";
  import type { ScanState } from "../../../libs/pluralscan-api/models/ScanState";

  export let analyzerName: string;
  export let scan: Scan;

  onMount(async () => {
    const eventSource = new EventSource(
      `http://localhost:5400/api/scans/stream/${scan.id}`
    );

    eventSource.addEventListener("scan_state", function (evt) {
      let scanUpdate: Scan = JSON.parse(evt.data);
      if (scanUpdate.state == "Completed") {
        console.log("Closing event source");
        eventSource.close();
      }
      scan = scanUpdate;
    });

    eventSource.onerror = (err) => {
      console.log(err);
      if (eventSource.readyState === EventSource.CLOSED) {
      }
      if (eventSource.readyState === EventSource.CONNECTING) {
        eventSource.close();
      }
    };
  });

  function mapStateToStatus(state: ScanState) {
    switch (state) {
      case "Completed":
        return "finished";
      case "Running":
        return "active";
      case "Paused":
        return "inactive";
    }
  }

  function getStateDescription(state: ScanState) {
    switch (state) {
      case "Completed":
        return "Success";
      case "Running":
        return "Analyzing package...";
      case "Paused":
        return "Paused...";
    }
  }
</script>

<Tile>
  <div class="text-base font-bold">
    {analyzerName} Analysis
  </div>
  <div class="mt-2 details-list">
    <dl class="grid grid-cols-2 gap-x-8">
      <div class="flex justify-between">
        <dt>Created At</dt>
        <dd>
          {scan.created_at}
        </dd>
      </div>
      <div class="flex justify-between">
        <dt>Analyzer Version</dt>
        <dd>
          {scan.executable_version}
        </dd>
      </div>
      <div class="flex justify-between">
        <dt>Started At</dt>
        <dd>
          {scan.created_at}
        </dd>
      </div>
      <div class="flex justify-between">
        <dt>Ended At</dt>
        <dd>
          {scan.created_at}
        </dd>
      </div>
      <div class="flex justify-between">
        <dt>State</dt>
        <dd>
          <InlineLoading
            class="scan-state-inline-loading align-middle"
            status={mapStateToStatus(scan.state)}
            description={getStateDescription(scan.state)} />
        </dd>
      </div>
      <div class="col-span-2">
        <dt>Working Directory</dt>
        <dd>
          {scan["working_directory"]}
        </dd>
      </div>
    </dl>
  </div>
  {#if scan.state === "Completed"}
    <div class="mt-4 text-right">
      <Button on:click={() => push("/scans/" + scan["id"])}
        >Show Diagnosis</Button>
    </div>
  {/if}
</Tile>

<style lang="scss">
  :global(.scan-state-inline-loading) {
    min-height: inherit;
  }

  .details-list {
    div {
      @apply items-center pt-1 pb-1;
      dt {
        @apply text-sm grayscale font-medium;
      }
      dd {
        @apply text-sm;
      }
    }
  }
</style>
