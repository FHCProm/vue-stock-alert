<template>
  <div v-if="!dataIsFullyLoaded" class="loader-wrapper">
    <div class="loader-words">
      loading...{{ tradingModeStore.progressBarLoadedSymbol }}/{{
        tradingModeStore.progressBarTotalSymbol
      }}
    </div>

    <div class="loader"></div>
  </div>
  <div v-else class="loader-wrapper">
    <div class="loader-words">loaded</div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="tick-svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </div>
</template>

<script setup>
import { useTradingMode } from "@/stores/TradingMode";
import { computed } from "vue";

const tradingModeStore = useTradingMode();

const dataIsFullyLoaded = computed(() => {
  let status = false;
  if (
    tradingModeStore.progressBarLoadedSymbol ==
    tradingModeStore.progressBarTotalSymbol
  ) {
    status = true;
  }
  return status;
});
</script>

<style scoped>
.loader-wrapper {
  display: flex;
  align-items: center;
}
.loader-words {
  padding-right: 0.5rem;
  color: aqua;
}
.loader {
  border: 3px solid #f3f3f3; /* Light grey */
  border-top: 3px solid aqua; /* Blue */
  border-radius: 50%;
  width: 15px;
  height: 15px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.tick-svg {
  width: 18px;
  height: 18px;
  color: aqua;
}
</style>
