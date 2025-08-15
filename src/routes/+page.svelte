<script lang="ts">
  import { fade } from "svelte/transition";

  import Itemlist from "$lib/components/Itemlist.svelte";
  import Numpad from "$lib/components/Numpad.svelte";
  import RightButtons from "$lib/components/RightButtons.svelte";
  import ButtonFull from "$lib/components/ButtonFull.svelte";
  import ButtonSmall from "$lib/components/ButtonSmall.svelte";
  import { get_app_context, set_app_context } from '$lib/app.svelte';
  import { type Item, type Item_list, type Item_state } from "$lib/types";
  import { item_list, offers, scan_items, special_items } from "$lib/data";
  import { assert } from "$lib/utilities";

  let app = set_app_context();

  $effect(() => {
    offers.forEach((offer) => {
      let count = 0;
      if (offer.item[0] === "plu") {
        app.items.forEach((item) => {
          if (item.plu === offer.item[1] && !item.storno) {
            count += item.count ?? 1;
          }
        });
      } else {
        app.items.forEach((item) => {
          if (item.ean === offer.item[1]) {
            count += item.count ?? 1;
          }
        });
      }

      const is_eligible = count >= offer.count;
      if (is_eligible) {
        const final_discount = offer.discount * Math.floor(count / offer.count);

        const first_item = app.items.find((item) => {
          if (offer.item[0] === "plu") {
            return item.plu === offer.item[1] && !item.storno;
          } else {
            return item.ean === offer.item[1] && !item.storno;
          }
        });

        assert(first_item !== undefined);

        if (offer.lidl_plus) {
          first_item.lidl_plus_discount =
            final_discount / (first_item.count ?? 1);
          return;
        }

        first_item.lidl_discount = final_discount / (first_item.count ?? 1);
      }
    });
  });

  function simulate_click(element: HTMLElement) {
    element.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        cancelable: true,
      }),
    );

    element.classList.add("simulated-active");

    setTimeout(() => {
      element.dispatchEvent(
        new PointerEvent("pointerup", {
          bubbles: true,
          cancelable: true,
        }),
      );

      element.classList.remove("simulated-active");

      element.click();
    }, 100);
  }

  function keybindings(event: KeyboardEvent) {
    if (
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)
    ) {
      const element = document.getElementById(event.key);
      assert(element !== null);
      app.input += event.key;
    }

    if (event.key === "Backspace") {
      app.input = app.input.slice(0, -1);
    }

    if (event.key === "Enter" && event.shiftKey) {
      const item = item_list.find(
        (item) => item.ean !== undefined && item.ean.toString() === app.input,
      );
      if (item !== undefined) {
        const item_copy = { ...item };
        if (app.menge > 1) {
          item_copy.count = app.menge;
          app.menge = 0;
        }
        app.items.push(item_copy);
        app.input = "";
      }
    } else if (event.key === "Enter") {
      const item = item_list.find(
        (item) => item.plu !== undefined && item.plu.toString() === app.input,
      );
      if (item !== undefined) {
        const item_copy = { ...item };
        if (app.menge > 1) {
          item_copy.count = app.menge;
          app.menge = 0;
        }
        app.items.push(item_copy);
        app.input = "";
      }
    }

    if (
      event.key === "c" ||
      (event.metaKey && event.key === "Backspace") ||
      event.key === "Escape"
    ) {
      app.input = "";
    }

    if (event.key === "m" || event.key === "*") {
      apply_menge();
    }
  }

  function storno() {
    if (app.selected_item === undefined) {
      select_last_item();
      return;
    }

    app.selected_item.storno = true;
    app.selected_item.selected = false;
  }

  function allow_storno(): boolean {
    if (app.selected_item === undefined && app.active_items.length > 1) {
      return true;
    } else if (app.selected_item === undefined) {
      return false;
    }

    if (app.active_items.length === 1) {
      return false;
    }

    return true;
  }

  function gebinde() {
    if (app.selected_item === undefined) {
      apply_gebinde(app.active_items.at(-1)!); // can be asserted since allow gebinde already checked for that
      return;
    }

    apply_gebinde(app.selected_item);

    function apply_gebinde(item: Item & Item_state) {
      const count = item.count ?? 1;
      const gebinde = item.gebinde ?? 1;
      item.count = count * gebinde;
      item.selected = false;
      item.gebinde_applied = true;
    }
  }

  function allow_gebinde(): boolean {
    const last_item = app.active_items.at(-1);
    if (
      last_item !== undefined &&
      last_item.gebinde !== undefined &&
      !last_item.gebinde_applied
    ) {
      return true;
    }

    if (app.selected_item === undefined) {
      return false;
    }

    if (app.selected_item.gebinde_applied || app.selected_item.gebinde === undefined) {
      return false;
    }

    return true;
  }

  function select_last_item() {
    const last_item = app.active_items.at(-1);
    if (last_item !== undefined) {
      last_item.selected = true;
    }
  }

  function apply_menge() {
    app.menge = parseInt(app.input);

    if (Number.isNaN(app.menge)) {
      if (app.selected_item !== undefined) {
        find_and_push_item(app.selected_item);
      } else {
        const last_item = app.active_items.at(-1);
        if (last_item !== undefined) {
          find_and_push_item(last_item);
        }
      }

      return;

      function find_and_push_item(the_item: Item & Item_state) {
        const item = item_list.find((item) => item.name === the_item.name);
        assert(item !== undefined);
        app.items.push(item);
      }
    }

    app.input = "";
  }

  function allow_menge(): boolean {
    const last_item = app.active_items.at(-1);

    if (app.input === "" && last_item === undefined) {
      return false;
    }

    if (
      last_item !== undefined &&
      app.selected_item === undefined &&
      last_item.weighable
    ) {
      return false;
    }

    if (app.selected_item !== undefined && app.selected_item.weighable) {
      return false;
    }

    return true;
  }

  function discount() {
    if (!discount_allowed()) {
      return;
    }

    assert(app.selected_item !== undefined);

    app.selected_item.discount_applied = true;
  }

  function discount_allowed(): boolean {
    if (app.selected_item === undefined) {
      return false;
    }

    const condition =
      app.selected_item.discount_applied !== true &&
      app.selected_item.discount !== undefined;

    return condition;
  }

  function add_pfand(type: "Sodastream Pfand" | "Pfand") {
    const pfand = special_items.find((item) => item.name === type);
    assert(pfand !== undefined);

    const pfand_copy = { ...pfand };

    if (app.menge >= 1) {
      pfand_copy.count = app.menge;
      app.menge = 0;
    }

    app.items.push(pfand_copy);
  }
</script>

<svelte:body onkeydown={keybindings} />

<div
  class="grid grid-cols-[1fr_2fr] select-none cursor-default dark:text-white"
>
  {#if app.show_weight_input}
    <div
      onclose={() => (app.show_weight_input = false)}
      in:fade={{ duration: 100 }}
      class="
        flex
        flex-col
        gap-2
        items-start
        justify-start
        w-full
        m-auto
        p-4
        bg-neutral-100
        dark:bg-neutral-900
        rounded
        dark:text-white
      "
    >
      <span class="flex flex-col w-full">
        <label for="weight" class="font-medium">Gewicht</label>
        <input
          type="text"
          name="weight"
          placeholder="Gramm"
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
              assert(app.weighing_item !== undefined);
              app.weighing_item.weight = parseInt(app.input) / 1000;
              app.items.push(app.weighing_item);
              app.weighing_item = undefined;
              app.input = "";
              app.show_weight_input = false;
            }}
          />
        </span>
        <ButtonSmall
          text={"Abbrechen"}
          onpointerdown={() => {
            app.show_weight_input = false;
            app.input = "";
          }}
        />
      </span>
    </div>
  {:else}
    <div in:fade={{ duration: 100 }} class="flex flex-col">
      <Itemlist />
      <div
        class="h-[20%] p-2 gap-2 grid grid-cols-[auto_auto_auto] grid-rows-2 items-center"
      >
        <ButtonSmall text={"Bonrückstellung"} disabled={true} />
        <ButtonSmall text={""} />
        <ButtonSmall text={""} />
        <ButtonSmall
          text={"Sodastream"}
          onpointerdown={() => add_pfand("Sodastream Pfand")}
        />
        <ButtonSmall
          text={"Pfand"}
          disabled={false}
          onpointerdown={() => add_pfand("Pfand")}
        />
        <ButtonSmall
          text={"Rabatt"}
          onpointerdown={() => discount()}
          disabled={!discount_allowed()}
        />
      </div>
      <div class="h-1 m-2 bg-neutral-400 dark:bg-neutral-800 rounded-2xl"></div>
      <div class="flex flex-col gap-2 p-2">
        <div class="flex flex-row gap-2 justify-between">
          <span class="grow">
            <ButtonSmall
              text={"Lidl Plus"}
              disabled={app.lidl_plus}
              onpointerdown={() => (app.lidl_plus = true)}
            />
          </span>
          <ButtonSmall
            text={"Lidl Plus Storno"}
            disabled={!app.lidl_plus}
            onpointerdown={() => (app.lidl_plus = false)}
          />
        </div>
        <ButtonSmall
          text={"Waare scannen"}
          onpointerdown={() => {
            app.summe = false;
            const random_item = {...scan_items[Math.floor(Math.random() * scan_items.length)]};

            if (app.input !== '') {
              random_item.count = parseInt(app.input);
            }
            app.input = '';

            app.items.push(random_item);
          }}
        />
        <ButtonSmall text={"Rückstellungen"} disabled={true} />
      </div>
    </div>
  {/if}

  <div class="h-[100dvh] mx-10 flex flex-col">
    <div class="flex flex-row gap-2">
      <input
        type="text"
        value={app.input}
        placeholder="Manuell erfassen"
        class="w-full my-2 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs p-1.5"
      />

      <div
        class="place-content-center bg-neutral-200 dark:bg-neutral-800 active:bg-neutral-300 active:dark:bg-neutral-600 my-2 border border-neutral-300 dark:border-neutral-700 p-1.5 rounded text-2xl"
        onpointerdown={() => {
          if (app.input === "") {
            app.menge = 0;
          }
          app.input = app.input.slice(0, -1);
          if (app.selected_item !== undefined) {
            app.selected_item.selected = false;
          }
        }}
      >
        ←
      </div>
      <div
        class="place-content-center bg-neutral-200 dark:bg-neutral-800 active:bg-neutral-300 dark:active:bg-neutral-600 my-2 border border-neutral-300 dark:border-neutral-700 p-1.5 rounded text-lg"
        onpointerdown={() => {
          if (app.input === "") {
            app.menge = 0;
          }
          app.input = "";
          if (app.selected_item !== undefined) {
            app.selected_item.selected = false;
          }
        }}
      >
        C
      </div>
    </div>

    <div class="grow-2 flex flex-row gap-4 my-3">
      <ButtonFull
        text={"Storno"}
        disabled={app.show_weight_input || !allow_storno()}
        onpointerdown={storno}
      />
      <ButtonFull
        text={"Bon Abbruch"}
        disabled={app.show_weight_input ||
          (app.items.length === 0 && app.lidl_plus === false)}
        onpointerdown={() => {
          app.items = [];
          app.lidl_plus = false;
        }}
      />
      <ButtonFull
        text={"Gebinde"}
        disabled={app.show_weight_input || !allow_gebinde()}
        onpointerdown={gebinde}
      />
      <ButtonFull
        text={"Menge"}
        disabled={app.show_weight_input || !allow_menge()}
        onpointerdown={() => apply_menge()}
      />
    </div>

    <div class="grow-3 grid grid-cols-[4fr_1fr] gap-6 mb-4">
      <Numpad />
      <RightButtons />
    </div>
  </div>
</div>
