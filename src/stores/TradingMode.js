import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useTradingMode = defineStore("TradingMode", () => {
  const mode = ref("standard");
  // const doubleCount = computed(() => {
  //   return count.value * 2;
  // });
  function setMode(value) {
    mode.value = value;
  }

  return { mode, setMode };
});
