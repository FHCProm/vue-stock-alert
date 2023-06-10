import { createApp } from "vue";
import App from "./App.vue";
import devtools from "@vue/devtools";
import { createPinia } from 'pinia'

if (process.env.NODE_ENV === "development") {
  devtools.connect(/* host, port */);
}

createApp(App).use(createPinia()).mount("#app");
