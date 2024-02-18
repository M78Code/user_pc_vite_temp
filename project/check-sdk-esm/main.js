import { createApp } from 'vue'


// import TY_JSSDK from "../../dist/client-sdk-build/TY_JSSDK.umd.js"
// import   "../../dist/client-sdk-build/style.css"


 
import App from './App.vue'


const app = createApp(App)

  //https://cn.vuejs.org/guide/reusability/plugins.html
// 通过 app.component() 和 app.directive() 注册一到多个全局组件或自定义指令。
// 通过 app.provide() 使一个资源可被注入进整个应用。
// 向 app.config.globalProperties 中添加一些全局实例属性或方法
// 

// app.config.globalProperties.TY_JSSDK = TY_JSSDK
// window.TY_JSSDK =TY_JSSDK


app.mount('#ty-app')
