


 

const installer=(app)=>{
     /**
   * @Description v-icon指令，用于将quasar组件中自带的图标（Material Icon）替换为自定义的图标
   * Material Design 的图标是怎么生效的?参见：https://segmentfault.com/q/1010000002811943
   */
 
     app.directive('icon', {
    inserted(el, binding) {
      // binding.value即为替换icon的映射对象
      // 目标组件类名
      const target_class = el.classList[0]
      // 待替换图标icon名称 如chevron_left、chevron_right
      const replace_keys = Object.keys(binding.value)
      // 查找目标组件下待替换图标的icon元素集合
      const icons = target_class === 'q-icon' ? [el] : document.querySelectorAll(`.${target_class} i.material-icons`)

      // 替换目标组件下的icon
      icons.forEach(item => {
        replace_keys.forEach(key => {
          if (item.innerHTML === key) {
            item.classList.replace('material-icons', binding.value[key])
          }
        })
        item.innerHTML = ''
      })
    }
  })
} 

export default  installer