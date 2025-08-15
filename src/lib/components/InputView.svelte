<script lang='ts'>
  import { get_app_context } from "$lib/app.svelte";
  import { assert } from "$lib/utilities";
  import { fade } from "svelte/transition";
  import ButtonSmall from "./ButtonSmall.svelte";

  let app = get_app_context();

  type Kind = 'weight' | 'cashback';

  const { kind }: { kind: Kind } = $props();

  function submit_weight() {
    assert(app.weighing_item !== undefined);
    app.weighing_item.weight = parseInt(app.input) / 1000;
    app.items.push(app.weighing_item);
    app.weighing_item = undefined;
  }
</script>
<div
  onclose={() => (app.sidebar_view = 'default')}
  in:fade={{ duration: 100 }}
  class="
    flex
    flex-col
    gap-2
    items-start
    justify-start
    w-full
    mx-auto
    p-4
    bg-neutral-100
    dark:bg-neutral-900
    rounded
    dark:text-white
  "
>
  <span class="flex flex-col w-full">
    <label for="input" class="font-medium">{app.sidebar_view === 'weight_input' ? 'Gewicht' : 'Cashback Betrag'}</label>
    <input
      type="text"
      name="input"
      placeholder={app.sidebar_view === 'weight_input' ? 'Gramm' : '€'}
      value={app.input}
      inputmode="none"
      class="
        placeholder:text-right
        bg-neutral-200
        dark:bg-neutral-800

        border-neutral-300
        dark:border-neutral-700
        rounded
        p-1
      "
    />
  </span>
  <span class="flex flex-row gap-2 w-full">
    <span class="grow">
      <ButtonSmall
        text={"Bestätigen"}
        disabled={app.input === ""}
        onpointerdown={() => {
          switch (app.sidebar_view) {
            case 'weight_input': {
              submit_weight();
              break;
            }
            case 'cashback_input' : {
              break;
            }

            case 'default': break;
            default: break;
          }

          app.sidebar_view = 'default';
          app.input = "";
        }}
      />
    </span>
    <ButtonSmall
      text={"Abbrechen"}
      onpointerdown={() => {
        app.sidebar_view = 'default';
        app.input = "";
      }}
    />
  </span>
</div>
