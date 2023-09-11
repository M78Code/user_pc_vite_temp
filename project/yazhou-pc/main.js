import { createApp } from "vue";
import { Quasar } from "quasar";
// Import icon libraries
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";
import BUILDIN_CONFIG from "app/job/output/env/final.js";
console.log("BUILDIN_CONFIG-----------pc---", BUILDIN_CONFIG);
window.BUILDIN_CONFIG = BUILDIN_CONFIG;
// Import Quasar css
import "quasar/src/css/index.sass";
import { LocalStorage, SessionStorage  } from "src/core/utils/index.js";
import { i18n } from "src/core/index.js";
import router from './src/router/index.js'
// Assumes your root component is App.vue
// and placed in same folder as main.js
//引入自定义指令
import useDirective from "src/directives/index.js"
import App from "./App.vue";
import lodash from "lodash";
const myApp = createApp(App);
myApp.config.globalProperties.lodash = lodash;
window.lodash = lodash;
// 使用自定义指令
useDirective(myApp)
console.log(myApp,'myApp');
myApp.use(i18n);
myApp.use(router);
myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});
// 引入 当前 计算出的植入配置
myApp.mount("#ty-app");
