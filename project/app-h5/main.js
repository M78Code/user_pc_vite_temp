import { createApp } from "vue";
import { Quasar } from "quasar";

// Import icon libraries
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

import  "./src/css/style.css";
import  "./src/css/scroll.scss";
// 引入 当前 计算出的植入配置

import BUILDIN_CONFIG from "app/job/output/env/index.js";
import { main_js_common_fun } from "src/core/main-js-common-fun/index.js";


// Assumes your root component is App.vue
// and placed in same folder as main.js
//引入自定义指令
import useDirective from "src/directives/index.js"
import App from "./App.vue";
import router from './src/router/index'
import lodash from "lodash";
import { i18n_t,i18n_tc } from "src/boot/i18n.js";
const app = createApp(App);
app.config.globalProperties.lodash = lodash;
app.config.globalProperties._ = lodash;
app.config.globalProperties.i18n_t = i18n_t;
window.lodash = lodash;
window._ = lodash;
window.i18n_t = i18n_t;
app.config.globalProperties.i18n_tc = i18n_tc;
window.i18n_tc = i18n_tc;
import filters from 'src/core/filters/global_filters.js'
//vue3配置全局过滤器
app.config.globalProperties.$filters = filters;

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});

import { i18n } from "src/boot/i18n.js";
app.use(i18n).use(router);
// 使用自定义指令
useDirective(app)
// app文件配置
main_js_common_fun(app);
app.mount("#ty-app");
