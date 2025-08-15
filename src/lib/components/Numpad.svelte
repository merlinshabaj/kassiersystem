<script lang='ts'>
  import { get_app_context } from "$lib/app.svelte";

  let app = get_app_context();

  const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '00', ','];
</script>

<div class="grid grid-cols-3 grid-rows-4 gap-3.5">
  {#each numbers as number}
    <div
      id="{number.toString()}"
      class="bg-neutral-200 dark:bg-neutral-700 rounded text-7xl text-center active:bg-neutral-300 dark:active:bg-neutral-600 place-content-center"
      onpointerdown={() => {
        if (number === ',') {
          return;
        }

        app.input += number.toString();
      }}
    >
      {number}
    </div>
  {/each}
</div>
