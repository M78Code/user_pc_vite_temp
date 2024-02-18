



 

const installer=(app)=>{
    app.directive('check-img', {
        // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
        bind(el, binding) {
          el.setAttribute('data-src', binding.value.src)
          el.setAttribute('data-default', binding.value.default)
          el.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
          // 先设置透明 防止显示加载图片错误
          el.style.opacity = 0
        },
        // 当元素被插入到DOM中时
        inserted(el) {
          load_img_src_common(el)
        },
        // 当元素更新时
        update(el, binding) {
          if(binding.value.src == binding.oldValue.src){
            return
          }
          el.setAttribute('data-src', binding.value.src)
          el.setAttribute('data-default', binding.value.default)
          load_img_src_common(el)
        },
      })
} 

export default  installer