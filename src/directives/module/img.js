


 

const installer=(app)=>{

    app.directive('img', {
        // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
        bind(el, binding) {
          el.setAttribute('data-src', binding.value[0])
          el.setAttribute('data-team', binding.value[1])
          el.setAttribute('data-csid', binding.value[2])
          el.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
          // 先设置透明 防止显示加载图片错误
          el.style.opacity = 0
        },
        // 当元素被插入到DOM中时
        inserted(el, binding) {
          if (IntersectionObserver) {
            img_observe(el)
          } else {
            load_img_src(el)
          }
        },
        // 当元素更新时
        update(el, binding) {
          if(binding.value[0] == binding.oldValue[0]){
            return
          }
          el.setAttribute('data-src', binding.value[0])
          el.setAttribute('data-team', binding.value[1])
          el.setAttribute('data-csid', binding.value[2])
          if (IntersectionObserver) {
            img_observe(el)
          } else {
            load_img_src(el)
          }
        },
        // 组件销毁
        unbind(el){
          if(el.is_show_io){
            el.is_show_io.disconnect();
          }
        },
      })
    
}


export default  installer