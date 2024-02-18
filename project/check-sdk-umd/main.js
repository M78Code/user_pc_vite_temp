import { createApp } from 'vue'


import "../../dist/client-sdk-build/TY_JSSDK.umd.js"
import   "../../dist/client-sdk-build/style.css"


 
import App from './App.vue'


const app = createApp(App)

  //https://cn.vuejs.org/guide/reusability/plugins.html
// 通过 app.component() 和 app.directive() 注册一到多个全局组件或自定义指令。
// 通过 app.provide() 使一个资源可被注入进整个应用。
// 向 app.config.globalProperties 中添加一些全局实例属性或方法

// app.config.globalProperties.TY_JSSDK = TY_JSSDK
// window.TY_JSSDK =TY_JSSDK

// 方式一：共用一个应用实例，按照install插件使用
app.use(TY_JSSDK)
console.log('app', app);

app.mount('#ty-app')


// 方式二：通过draw_component挂载到新的挂载点，生成新的应用实例
const app2 = TY_JSSDK.draw_component({
  dom_id:"#ty-app2" , component: TY_JSSDK.ALL_COMPONENTS_NAMES[0], props:{
    text: 'texttexttext'
  }
})
console.log('app2', app2);
