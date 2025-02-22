import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";

const app = createApp(App);

app.use(Antd);

app.use(router);

app.mount("#app");
