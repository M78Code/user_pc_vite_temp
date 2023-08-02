 

import { createApp } from 'vue'
import { Quasar } from 'quasar'

// Import icon libraries
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'

const myApp = createApp(App)


myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
})


// 引入 当前 计算出的植入配置 

import BUILDIN_CONFIG from "app/job/output/env/final.js"


console.log( 'BUILDIN_CONFIG--------------',BUILDIN_CONFIG );




createApp(App).mount('#ty-app')
