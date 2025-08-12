<script lang='ts'>
  const { text, onpointerdown }: { text: string, onpointerdown: (() => void) } = $props();

</script>

<div
  class="
    w-full
    h-full
    bg-neutral-200
    text-center
    place-content-center
    border
    border-neutral-300
    active:bg-neutral-300
    rounded-xs
    font-medium
  "
  {onpointerdown}
>{text}
</div>