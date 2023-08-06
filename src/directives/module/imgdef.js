


 

const installer=(app)=>{
      // 图片懒加载指令
      app.directive('imgdef', {
    // 当元素被插入到DOM中时
    inserted(el, binding) {
      el.src = binding.value
    },
    // 当元素更新时
    update(el, binding) {
      el.src = binding.value
    }
  })
} 

export default  installer