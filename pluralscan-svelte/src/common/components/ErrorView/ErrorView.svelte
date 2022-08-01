<script lang="ts">
  import UndrawDeconstructed from "../Undraw/UndrawDeconstructed.svelte";

  export let message = "";
  export let active = true;
</script>

<div class="grid grid-cols-12 place-content-center" style="visibility: {active ? 'visible' : 'hidden'}">
    <div class="col-start-4 col-end-10 p-24 bg-gray-100">
        <div class="h-44 w-44 mx-auto">
            <slot name="illustration">
                <UndrawDeconstructed />
              </slot>
        </div>
        <div class="mt-4">
            <p class="text-xl text-center">{message}</p>
        </div>
    </div>
</div>
