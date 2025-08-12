<script lang='ts'>
  const { text, onpointerdown, disabled }:
    { text: string, onpointerdown?: (() => void), disabled?: boolean } = $props();

</script>

<div
  class="
    h-fit
    p-2
    bg-neutral-200 dark:bg-neutral-800
    text-center
    place-content-center
    border
    border-neutral-300 dark:border-neutral-700
    rounded-md
    font-medium
    { disabled ? 'text-neutral-600 border-none'  : 'active:bg-neutral-300 dark:active:bg-neutral-700' }
  "
  {onpointerdown}
>{text}
</div>