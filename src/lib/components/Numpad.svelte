<script lang='ts'>
  const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '00', ','];

  let { input = $bindable() }: { input: string } = $props();
</script>

<div class="grid grid-cols-3 grid-rows-4 gap-3.5">
  {#each numbers as number}
    <div
      id="{number.toString()}"
      class="h-30 bg-neutral-200 dark:bg-neutral-700 rounded text-7xl text-center active:bg-neutral-300 dark:active:bg-neutral-600 place-content-center"
      onpointerdown={() => {
        if (number === ',') {
          return;
        }
        
        input += number.toString();
      }}
    >
      {number}
    </div>
  {/each}
</div>