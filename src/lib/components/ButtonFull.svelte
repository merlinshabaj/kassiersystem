<script lang='ts'>
  const { text, onpointerdown, disabled}:
    { text: string, onpointerdown?: (() => void), disabled?: boolean } = $props();

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
    rounded-xs
    font-medium
    { disabled ? 'text-neutral-600 border-none'  : 'active:bg-neutral-300' }
  "
  {onpointerdown}
>{text}
</div>