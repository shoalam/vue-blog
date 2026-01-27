import "./assets/main.css";
import "vfonts/Inter.css";
import "vfonts/FiraCode.css";

import { createApp } from "vue";
import naive from "naive-ui";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(naive);
app.use(router);

app.mount("#app");
