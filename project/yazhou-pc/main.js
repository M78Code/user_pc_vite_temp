/*
 * @Author: lowen pmtylowen@itcom888.com
 * @Date: 2023-09-12 13:25:47
 * @LastEditors: lowen pmtylowen@itcom888.com
 * @LastEditTime: 2023-09-16 15:47:59
 * @FilePath: /user-pc-vite/project/yazhou-pc/main.js
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { createApp } from "vue";
import { Quasar } from "quasar";
// Import icon libraries
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
import { main_js_common_fun } from "src/core/main-js-common-fun/index.js";
console.log("BUILDIN_CONFIG-----------pc---", BUILDIN_CONFIG);
window.BUILDIN_CONFIG = BUILDIN_CONFIG;
// Import Quasar css
import "quasar/src/css/index.sass";
import { i18n } from "src/output/index.js";
import router from './src/router/index.js'
//引入全局初始化样式
import "./src/css/app.scss"
import "./src/css/style.css"
import "app/public/yazhou-pc/image/com/com.css"
// Assumes your root component is App.vue
// and placed in same folder as main.js
//引入自定义指令
import useDirective from "src/directives/index.js"
import App from "./App.vue";
import lodash from "lodash";
import { i18n_t,i18n_tc } from "src/boot/i18n.js";
import Vue3DraggableResizable from 'vue3-draggable-resizable' //拖拽组件
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

const app = createApp(App);
app.config.globalProperties.lodash = lodash;
app.config.globalProperties.i18n_t = i18n_t;
window.lodash = lodash;
window.i18n_t = i18n_t;
app.config.globalProperties.i18n_tc = i18n_tc;
window.i18n_tc = i18n_tc;
import filters from 'src/core/filters/global_filters.js'
//vue3配置全局过滤器
app.config.globalProperties.$filters = filters;
// 使用自定义指令
useDirective(app)
console.log(app,'app');
app.use(i18n);
app.use(Vue3DraggableResizable);
app.use(router);
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});
// app文件配置
main_js_common_fun(app);
// 引入 当前 计算出的植入配置
app.mount("#ty-app");
