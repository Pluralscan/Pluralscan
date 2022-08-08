<script lang="ts">
  import {
    Tile,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from "carbon-components-svelte";
  import { url } from "inspector";
  import { onMount } from "svelte";
  import type { Package } from "../../../libs/pluralscan-api/models/Package";

  export let packageToScan: Package;

  onMount(async () => {
    console.log(packageToScan);
  });
</script>

<Tile>
  <div class="text-base font-bold">Package Informations</div>

  <div class="mt-4 details-list">
    <dl class="grid grid-cols-2 gap-x-8">
      <div class="flex justify-between">
        <dt>Name</dt>
        <dd>
          {packageToScan.name}
        </dd>
      </div>
      <div class="flex justify-between">
        <dt>Author</dt>
        <dd>
          {packageToScan.author}
        </dd>
      </div>
      <div class="flex justify-between">
        <dt>Version</dt>
        <dd>
          {packageToScan.version}
        </dd>
      </div>
      <div class="flex justify-between">
        <dt>Package Manager</dt>
        <dd>
          {packageToScan.system}
        </dd>
      </div>
      <div class="flex justify-between">
        <dt>Created At</dt>
        <dd>
          {packageToScan.created_at}
        </dd>
      </div>
      <div class="flex justify-between">
        <dt>Published At</dt>
        <dd>
          {packageToScan.published_at}
        </dd>
      </div>
      <div class="flex justify-between">
        <dt>Technologies</dt>
        <dd>
          {packageToScan.technologies.map((t) => t["display_name"]).join(", ")}
        </dd>
      </div>
      <div class="flex justify-between">
        <dt>Licenses</dt>
        <dd>
          {packageToScan.licenses.length > 0
            ? packageToScan.licenses.join(", ")
            : "Unknown"}
        </dd>
      </div>
      <div class="col-span-2">
        <dt>Description</dt>
        <dd>
          {packageToScan.description}
        </dd>
      </div>
    </dl>
  </div>

  <div class="mt-4 text-base font-bold">Links</div>

  <div class="mt-4 bg-white pr-4 pl-4">
    <StructuredList flush>
      <StructuredListHead>
        <StructuredListRow head>
          <StructuredListCell head>Label</StructuredListCell>
          <StructuredListCell head>Url</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        {#each packageToScan.links as link}
          <StructuredListRow>
            <StructuredListCell noWrap>{link.label}</StructuredListCell>
            <StructuredListCell>{link.url}</StructuredListCell>
          </StructuredListRow>
        {/each}
      </StructuredListBody>
    </StructuredList>
  </div>
</Tile>

<style lang="scss">
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
