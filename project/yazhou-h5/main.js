import { createApp } from "vue";
import { Quasar } from "quasar";

// Import icon libraries
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

// 引入 当前 计算出的植入配置

import BUILDIN_CONFIG from "app/job/output/env/final.js";

console.error("BUILDIN_CONFIG-----------h5---", BUILDIN_CONFIG);

window.BUILDIN_CONFIG = BUILDIN_CONFIG;



// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from "./App.vue";
import router from './src/router/index'

const app = createApp(App);

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});


import { i18n } from "src/boot/i18n.js";
app.use(i18n).use(router);

app.mount("#ty-app");
