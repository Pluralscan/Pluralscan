<script lang="ts">
  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import type { Scan } from "../../../libs/pluralscan-api/models/Scan";
  import UndrawNotFound from "../../common/components/Undraw/UndrawNotFound.svelte";

  export let scan: Scan;
  export let packageName: string;
  export let show: boolean = false;

  onMount(async () => {});
</script>

<ComposedModal
  size={"lg"}
  open={show}
  danger={true}
  preventCloseOnClickOutside={true}
  on:click:button--primary={() => {
    console.log("close");
    show = false;
  }}>
  <ModalHeader label="Package Analysis" title={packageName} />
  <ModalBody hasScrollingContent={true}>
    <StructuredList flush>
      <StructuredListHead>
        <StructuredListRow head>
          <StructuredListCell head>Rule ID</StructuredListCell>
          <StructuredListCell head>Message</StructuredListCell>
          <StructuredListCell head>Severity</StructuredListCell>
          <StructuredListCell head>Path</StructuredListCell>
          <StructuredListCell head>Location</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        {#if scan.diagnosis.issues}
          {#each scan.diagnosis.issues as issue}
            <StructuredListRow>
              <StructuredListCell noWrap>{issue.rule_id}</StructuredListCell>
              <StructuredListCell>{issue.message}</StructuredListCell>
              <StructuredListCell>{issue.severity}</StructuredListCell>
              <StructuredListCell>{issue.location.path}</StructuredListCell>
              <StructuredListCell
                >Line: {issue.location.line} Col: {issue.location
                  .column}</StructuredListCell>
            </StructuredListRow>
          {/each}
          {#if scan.diagnosis.issues.length == 0}
            <div class="grid grid-cols-12 place-content-center">
              <div class="col-start-4 col-end-10 p-24 bg-gray-100">
                <div class="h-44 w-44 mx-auto">
                  <slot name="illustration">
                    <UndrawNotFound />
                  </slot>
                </div>
                <div class="mt-4">
                  <p class="text-xl text-center">No issues found.</p>
                </div>
              </div>
            </div>
          {/if}
        {/if}
      </StructuredListBody>
    </StructuredList>
  </ModalBody>
  <ModalFooter primaryButtonText="Close" />
</ComposedModal>

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
