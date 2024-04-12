import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useTradingMode = defineStore("TradingMode", () => {
  const mode = ref("Standard");

  const progressBarLoadedSymbol = ref(0);
  const progressBarTotalSymbol = ref(0);
  const symbols = ref([]);

  // const doubleCount = computed(() => {
  //   return count.value * 2;
  // });
  function setMode(value) {
    mode.value = value;
  }

  return {
    mode,
    setMode,

    progressBarLoadedSymbol,
    progressBarTotalSymbol,
    symbols,
  };
});
