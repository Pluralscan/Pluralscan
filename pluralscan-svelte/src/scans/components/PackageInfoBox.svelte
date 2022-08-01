<script lang="ts">
  import { Tile } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import type { Package } from "../../../libs/pluralscan-api/models/Package";

  export let packageToScan: Package;

  onMount(async () => {
    console.log(packageToScan);
  });
</script>

<Tile>
  <div class="text-base font-bold">Package Informations</div>
  <div class="mt-2 details-list">
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
        <dt>Published At</dt>
        <dd>
          {packageToScan.publishedAt}
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
          {packageToScan.licenses.length > 0 ? packageToScan.licenses.join(", ") : "Unknown"}
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
