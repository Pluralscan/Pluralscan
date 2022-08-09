<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    DataTable,
    Tile,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";

  import type { AnalyzerList } from "../../../libs/pluralscan-api/types";

  export let analyzers: AnalyzerList;
  export let selectedRowIds: any[] = [];

  onMount(async () => {});
</script>

<Tile class="bg-slate-200">
  <div>
    <h4 class="font-bold">Schedule Package Analysis</h4>
  </div>

  <div class="mt-2 text-base">Select the analyzers used to perform analysis.</div>

  <div>
    <Accordion align="end" class="mt-4">
      {#each analyzers as analyzer}
        <AccordionItem open class="analyzers-selection-accordion">
          <svelte:fragment slot="title">
            <span class="text-lg">{analyzer.name}</span><br>
            <span class="text-sm">{analyzer.description}</span>
          </svelte:fragment>
          <DataTable
            class="flex flex-grow"
            selectable
            size="short"
            bind:selectedRowIds
            headers={[
              {
                key: "name",
                value: "Name",
              },
              {
                key: "version",
                value: "Version",
              },
            ]}
            rows={analyzer.executables.map((ex) => {
              ex["id"] = analyzer.id + ";;" + ex.version;
              return ex;
            })} />
        </AccordionItem>
      {/each}
    </Accordion>
  </div>
</Tile>

<style lang="scss">
  :global(.analyzers-selection-accordion > .bx--accordion__content) {
    padding: 1rem !important;
  }

  :global(.analyzers-selection-accordion) {
    background-color: white;
    border-radius: 4px;
  }

  :global(.analyzers-selection-accordion:nth-child(2)) {
    margin-top: 8px;
  }
</style>
