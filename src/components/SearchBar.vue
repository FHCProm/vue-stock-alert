<template>
  <div class="DocSearch-Modal">
    <div class="DocSearch-SearchBar">
      <form class="DocSearch-Form" @submit.prevent="handleSearch">
        <label
          class="DocSearch-MagnifierLabel"
          for="docsearch-input"
          id="docsearch-label"
        >
          <svg
            width="20"
            height="20"
            class="DocSearch-Search-Icon"
            viewBox="0 0 20 20"
          >
            <path
              d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
              stroke="currentColor"
              fill="none"
              fill-rule="evenodd"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </label>
        <div class="DocSearch-LoadingIndicator">
          <svg viewBox="0 0 38 38" stroke="currentColor" stroke-opacity=".5">
            <g fill="none" fill-rule="evenodd">
              <g transform="translate(1 1)" stroke-width="2">
                <circle stroke-opacity=".3" cx="18" cy="18" r="18"></circle>
                <path d="M36 18c0-9.94-8.06-18-18-18">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 18 18"
                    to="360 18 18"
                    dur="1s"
                    repeatCount="indefinite"
                  ></animateTransform>
                </path>
              </g>
            </g>
          </svg>
        </div>
        <input
          class="DocSearch-Input"
          aria-autocomplete="both"
          aria-labelledby="docsearch-label"
          id="docsearch-input"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          enterkeyhint="go"
          spellcheck="false"
          placeholder="Search stock symbol"
          maxlength="64"
          type="text"
          aria-activedescendant="docsearch-item-0"
          aria-controls="docsearch-list"
          v-model="searchQuery"
        />
        <button
          type="submit"
          title="enter the query"
          class="DocSearch-Enter"
          aria-label="enter the query"
        >
          Enter
        </button>
        <button
          type="reset"
          title="Clear the query"
          class="DocSearch-Reset"
          aria-label="Clear the query"
          @click="changeSearchResultVisibility"
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path
              d="M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z"
              stroke="currentColor"
              fill="none"
              fill-rule="evenodd"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </button>
      </form>
    </div>
    <div v-if="searchError" class="DocSearch-ErrorPopup">
      <div class="DocSearch-ErrorPopup-inner">
        <strong>API limit reached</strong>
        <span>{{ searchError }}</span>
      </div>
      <button
        type="button"
        class="DocSearch-ErrorDismiss"
        @click="searchError = ''"
      >
        Dismiss
      </button>
    </div>
    <div
      class="DocSearch-Dropdown"
      :style="{ display: searchResultVisibility }"
    >
      <div class="DocSearch-NoResults" v-if="searchResult?.length === 0">
        <div class="DocSearch-Screen-Icon">
          <svg
            width="40"
            height="40"
            viewBox="0 0 20 20"
            fill="none"
            fill-rule="evenodd"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M15.5 4.8c2 3 1.7 7-1 9.7h0l4.3 4.3-4.3-4.3a7.8 7.8 0 01-9.8 1m-2.2-2.2A7.8 7.8 0 0113.2 2.4M2 18L18 2"
            ></path>
          </svg>
        </div>
        <p class="DocSearch-Title">
          No results for "<strong>{{ searchQuery }}</strong
          >"
        </p>
      </div>
      <section class="DocSearch-Hits">
        <ul
          role="listbox"
          aria-labelledby="docsearch-label"
          id="docsearch-list"
        >
          <SearchResultList :search-result="searchResult"></SearchResultList>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import SearchResultList from "./SearchResultList.vue";
import { ref } from "vue";

import { useTradingMode } from "@/stores/TradingMode";

const searchQuery = ref("");
const searchResult = ref([]);
const searchResultVisibility = ref("none");
const searchError = ref("");
const tradingModeStore = useTradingMode();

async function handleSearch() {
  searchError.value = "";
  searchResultVisibility.value = "unset";
  searchResult.value = await validateSymbolAvailability(searchQuery);
}

function changeSearchResultVisibility() {
  searchResult.value = [];
  searchResultVisibility.value = "none";
  searchError.value = "";
}

async function validateSymbolAvailability(userInput) {
  const api_key = process.env.API_KEY;

  const api_link = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${userInput.value}&apikey=${api_key}`;

  try {
    const response = await fetch(api_link);
    if (!response.ok) {
      searchError.value = `Search request failed with status ${response.status}`;
      return [];
    }

    const options = await response.json();
    const apiMessage = options.Information || options.Note || options["Error Message"];

    if (apiMessage) {
      const isLimitError = apiMessage
        .toLowerCase()
        .includes("25 daily api limit");
      searchError.value = isLimitError
        ? "AlphaVantage daily API limit reached. Please try again later."
        : apiMessage;
      return [];
    }

    return options.bestMatches || [];
  } catch (error) {
    searchError.value =
      error?.message || "Unable to fetch search results. Please try again.";
    return [];
  }
}
</script>

<style scoped>
.DocSearch-Modal {
  background: #f7f7f7;
  border-radius: 6px;
  box-shadow: inset 1px 1px 0 0 rgba(255, 0, 0, 0.15), 0 3px 8px 0 rgba(0, 0, 0, 0.08);
  flex-direction: column;
  margin: 20px auto auto;
  padding: 10px 0;

  position: relative;
}

.DocSearch-SearchBar {
  display: flex;
  padding: 12px 12px 0;
}

.DocSearch-Form {
  align-items: center;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px rgba(255, 0, 0, 0.35);
  display: flex;
  height: 56px;
  margin: 0;
  padding: 0 12px;
  position: relative;
  width: 100%;
}

.DocSearch-MagnifierLabel {
  align-items: center;
  color: #d40000;
  display: flex;
  justify-content: center;
}

.DocSearch-LoadingIndicator {
  display: none;
}

.DocSearch-Input {
  appearance: none;
  background: transparent;
  border: 0;
  color: #000;
  flex: 1;
  font-size: 1.2em;
  height: 100%;
  outline: 0;
  padding: 0 0 0 8px;
  width: 80%;
}

.DocSearch-Reset {
  animation: 0.1s ease-in forwards f;
  appearance: none;
  background: none;
  color: #000;
  padding: 2px;
  border: none;
  right: 0;
}

.DocSearch-Reset:hover {
  color: #d40000;
}

.DocSearch-Enter {
  border: 0.5px solid #ff0000;
  color: white;
  background-color: #ff0000;
  font-size: 15px;
  margin-right: 20px;
  border-radius: 4px;
  padding: 6px 12px;
}

.DocSearch-Dropdown {
  max-height: 600px;
  min-height: 12px;

  overflow-y: overlay;
  padding: 0 12px;
}

.DocSearch-NoResults {
  font-size: 0.9em;
  margin: 0 auto;
  padding: 36px 0;
  text-align: center;
  width: 80%;
  color: #000;
}

.DocSearch-ErrorPopup {
  align-items: center;
  background: #ffe5e5;
  border: 1px solid #ff4d4d;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  margin: 12px 12px 0;
  padding: 12px 14px;
}

.DocSearch-ErrorPopup-inner {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #000;
}

.DocSearch-ErrorDismiss {
  background: transparent;
  border: 1px solid #ff4d4d;
  border-radius: 4px;
  color: #d40000;
  cursor: pointer;
  font-size: 0.9em;
  padding: 6px 10px;
}

.DocSearch-ErrorDismiss:hover,
.DocSearch-ErrorDismiss:focus {
  background: #ff4d4d;
  color: white;
  outline: none;
}

.DocSearch-Screen-Icon {
  color: #7f8497;
  padding-bottom: 12px;
}

.DocSearch-Title {
  font-size: 1.2em;
}

.DocSearch-Dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
