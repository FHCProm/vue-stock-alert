<template>
  <div
    id="scroll-container"
    class="style-scope ytd-feed-filter-chip-bar-renderer"
    style="touch-action: pan-y"
  >
    <iron-selector
      id="chips"
      activate-event=""
      role="tablist"
      selected-attribute="selected"
      class="style-scope ytd-feed-filter-chip-bar-renderer"
      style="transform: translateX(0px)"
    >
      <yt-chip-cloud-chip-renderer
        @click="handleClick(1)"
        class="style-scope ytd-feed-filter-chip-bar-renderer iron-selected"
        aria-selected="true"
        role="tab"
        tabindex="0"
        chip-style="STYLE_HOME_FILTER"
        selected=""
        ><!--css-build:shady--><!--css-build:shady-->
        <yt-formatted-string
          id="text"
          ellipsis-truncate=""
          class="style-scope yt-chip-cloud-chip-renderer"
          ellipsis-truncate-styling=""
          title="All"
          >Fastest
        </yt-formatted-string>
      </yt-chip-cloud-chip-renderer>

      <yt-chip-cloud-chip-renderer
        @click="handleClick(2)"
        class="style-scope ytd-feed-filter-chip-bar-renderer"
        aria-selected="false"
        role="tab"
        tabindex="0"
        chip-style="STYLE_HOME_FILTER"
        ><!--css-build:shady--><!--css-build:shady-->
        <yt-formatted-string
          id="text"
          ellipsis-truncate=""
          class="style-scope yt-chip-cloud-chip-renderer"
          ellipsis-truncate-styling=""
          title="Gaming"
          >Standard
        </yt-formatted-string>
      </yt-chip-cloud-chip-renderer>
      <yt-chip-cloud-chip-renderer
        @click="handleClick(3)"
        class="style-scope ytd-feed-filter-chip-bar-renderer"
        aria-selected="false"
        role="tab"
        tabindex="0"
        chip-style="STYLE_HOME_FILTER"
        ><!--css-build:shady--><!--css-build:shady-->
        <yt-formatted-string
          id="text"
          ellipsis-truncate=""
          class="style-scope yt-chip-cloud-chip-renderer"
          ellipsis-truncate-styling=""
          title="Gaming"
          >Most Secure
        </yt-formatted-string>
      </yt-chip-cloud-chip-renderer>
    </iron-selector>
  </div>
</template>

<script setup>
import { useTradingMode } from "@/stores/TradingMode";
const tradingModeStore = useTradingMode();

function handleClick(optionNumber) {
  const tabs = document.querySelectorAll('[role="tab"]');
  tabs.forEach((tab) => tab.setAttribute("aria-selected", "false"));
  tabs.forEach((tab) => tab.removeAttribute("selected"));
  // Select the clicked option
  const selectedOption = document.querySelector(
    `[role="tab"]:nth-child(${optionNumber})`
  );
  selectedOption?.setAttribute("selected", "");
  selectedOption?.setAttribute("aria-selected", "true");
  tradingModeStore.setMode(selectedOption?.textContent);
}
console.log(tradingModeStore.mode);
</script>

<style scoped>
#scroll-container.ytd-feed-filter-chip-bar-renderer {
  position: relative;
  white-space: nowrap;
  overflow: hidden;
}
#chips.ytd-feed-filter-chip-bar-renderer {
  transition-duration: 0.15s;
  transition-timing-function: cubic-bezier(0.05, 0, 0, 1);
  will-change: transform;
  display: inline-block;
  white-space: nowrap;
}

yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer:first-of-type {
  margin-left: 5px;
}

yt-chip-cloud-chip-renderer[chip-style="STYLE_DEFAULT"][selected],
yt-chip-cloud-chip-renderer[chip-style="STYLE_HOME_FILTER"][selected] {
  background-color: rgba(255, 255, 255, 0.573);
  color: #0f0f0f;
}

yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer {
  margin: 12px;
}

yt-chip-cloud-chip-renderer[chip-style="STYLE_DEFAULT"],
yt-chip-cloud-chip-renderer[chip-style="STYLE_HOME_FILTER"],
yt-chip-cloud-chip-renderer[chip-style="STYLE_REFRESH_TO_NOVEL_CHIP"] {
  padding: 0 12px;
  transition: background-color 0.5s cubic-bezier(0.05, 0, 0, 1);
}

yt-chip-cloud-chip-renderer[chip-style="STYLE_DEFAULT"],
yt-chip-cloud-chip-renderer[chip-style="STYLE_HOME_FILTER"],
yt-chip-cloud-chip-renderer[chip-style="STYLE_REFRESH_TO_NOVEL_CHIP"] {
  background-color: rgba(255, 255, 255, 0.1);
  color: #f1f1f1;
  padding: 0 12px;
  transition: background-color 0.5s cubic-bezier(0.05, 0, 0, 1);
}

yt-chip-cloud-chip-renderer {
  height: 32px;
  min-width: 12px;
  border-radius: 8px;
  box-sizing: border-box;
  outline: none;
  overflow: hidden;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: relative;
  font-family: "Roboto", "Arial", sans-serif;
  font-size: 1rem;
  line-height: 2rem;
  font-weight: 400;

  flex-direction: row;
  align-items: center;
  display: inline-flex;
}
</style>
