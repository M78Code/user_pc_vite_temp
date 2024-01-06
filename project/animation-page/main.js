import { createApp } from "vue";
import { Quasar } from "quasar";

// Import icon libraries
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

// 引入 当前 计算出的植入配置

import BUILDIN_CONFIG from "app/job/output/env/index.js";

window.BUILDIN_CONFIG = BUILDIN_CONFIG;


// http://doc-web.sportxxxkd1.com/#/main/detail?type=doc&id=65892329ade8da4fba3089c5


import App from "./App.vue";
import router from './src/router/index'
import lodash from "lodash";
import { i18n_t,i18n_tc } from "src/boot/i18n.js";
 
const app = createApp(App);
app.config.globalProperties.lodash = lodash;
app.config.globalProperties.i18n_t = i18n_t;
window.lodash = lodash;
window.i18n_t = i18n_t;
app.config.globalProperties.i18n_tc = i18n_tc;
window.i18n_tc = i18n_tc;
import { i18n } from "src/boot/i18n.js";
app.use(i18n);
app.use(router);
app.use(router);
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});
// 引入 当前 计算出的植入配置
app.mount("#ty-app");


