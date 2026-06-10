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
    tradingModeStore.progressBarLoadedSymbol >=
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
  background: #120000;
  border: 1px solid #ff4d4d;
  border-radius: 10px;
  padding: 8px 10px;
}
.loader-words {
  padding-right: 0.5rem;
  color: white;
}
.loader {
  border: 3px solid #333;
  border-top: 3px solid #ff0000;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  animation: spin 1.2s linear infinite;
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
  color: #ff0000;
}
</style>
