/*
 * @Author: ledron
 * @Date: 2020-12-15 11:35:28
 * @Description: 全局提示弹框，挂载到vue原型对象上
 *  this.$toast('暂无赛事', 800), 全局可调用，800 是显示的时间
*/
import Vue from 'vue'
import Toast from './toast.vue'

const ToastConstructor = Vue.extend(Toast);

function showToast(text, duration = 1500) {
  let timer1_ = null
  const toastDOM = new ToastConstructor({
    el: document.createElement('div'),
    data() {
      return {
        text: text,
        show: true
      }
    }
  })
  document.body.appendChild((toastDOM.$el))

  clearTimeout(timer1_)
  timer1_ = setTimeout(() => {
    toastDOM.show = false
    clearTimeout(timer1_)
    timer1_ = null
  }, duration)
}

function toastRegistry() {
  Vue.prototype.$toast = showToast
}


export default toastRegistry

