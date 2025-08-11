<script lang='ts'>
  const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '00', ','];

  let { input = $bindable() }: { input: string } = $props();
</script>

<div class="grid grid-cols-3 grid-rows-4 gap-3.5">
  {#each numbers as number}
    <div
      id="{number.toString()}"
      class="h-[16lvh] bg-neutral-200 rounded text-7xl text-center active:bg-neutral-300 place-content-center"
      onpointerdown={() => {
        input += number.toString();
      }}
    >
      {number}
    </div>
  {/each}
</div>